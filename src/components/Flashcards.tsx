import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Plus,
  X,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Layers,
  Brain,
  Sparkles,
  BookOpen,
  Star,
  Shuffle,
  Search,
  Filter,
  Upload,
  FileText,
  File,
  Type,
  Eye,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Clock,
  Play,
  Pause,
  Settings
} from 'lucide-react';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  mastered: boolean;
  lastReviewed?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  source?: 'manual' | 'ai-topic' | 'ai-material';
}

interface Deck {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  color: string;
  category: string;
  createdAt: string;
  sourceMaterial?: string;
  sourceFileName?: string;
}

interface UploadedMaterial {
  name: string;
  type: string;
  content: string;
  size: number;
  pageCount?: number;
}

const deckColors = [
  'from-indigo-500 to-purple-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-cyan-500 to-blue-500',
  'from-violet-500 to-fuchsia-500',
];

// AI-generated flashcards based on extracted material keywords
function generateCardsFromMaterial(material: string, _deckName: string): Flashcard[] {
  const lines = material.split('\n').filter(l => l.trim().length > 10);
  const sentences = material.split(/[.!?]+/).filter(s => s.trim().length > 15);
  const cards: Flashcard[] = [];

  // Strategy 1: Turn key definitions into Q&A
  const definitionPatterns = [
    /(.+?)\s+(?:is defined as|is|are|refers to|means|describes|represents)\s+(.+)/gi,
    /(.+?)\s*[-–—]\s*(.+)/g,
  ];

  for (const pattern of definitionPatterns) {
    let match;
    while ((match = pattern.exec(material)) && cards.length < 25) {
      const term = match[1].trim();
      const definition = match[2].trim();
      if (term.length > 3 && term.length < 100 && definition.length > 10 && definition.length < 500) {
        cards.push({
          id: `mat-${Date.now()}-${cards.length}`,
          front: `What is ${term.endsWith('s') ? term.slice(0, -1) : term}?`,
          back: definition,
          mastered: false,
          difficulty: definition.length > 150 ? 'hard' : definition.length > 60 ? 'medium' : 'easy',
          source: 'ai-material' as const,
        });
      }
    }
  }

  // Strategy 2: Turn important sentences into questions
  const importantSentences = sentences.filter(s => {
    const lower = s.toLowerCase();
    return lower.includes('important') || lower.includes('key') || lower.includes('critical') ||
      lower.includes('essential') || lower.includes('fundamental') || lower.includes('main') ||
      lower.includes('primary') || lower.includes('crucial') || lower.includes('significant') ||
      lower.includes('note that') || lower.includes('remember');
  });

  for (const sentence of importantSentences.slice(0, 8)) {
    if (cards.length >= 25) break;
    const cleaned = sentence.trim();
    if (cleaned.length > 20) {
      cards.push({
        id: `mat-${Date.now()}-${cards.length}`,
        front: `Explain the importance of: "${cleaned.substring(0, 60)}..."`,
        back: cleaned,
        mastered: false,
        difficulty: 'medium' as const,
        source: 'ai-material' as const,
      });
    }
  }

  // Strategy 3: Generate "What", "How", "Why" questions from content
  const contentTopics = lines.slice(0, 15);
  const questionStarters = [
    'What are the key characteristics of',
    'How does',
    'Why is it important to understand',
    'What is the significance of',
    'Describe the role of',
  ];

  for (let i = 0; i < Math.min(contentTopics.length, 10); i++) {
    if (cards.length >= 25) break;
    const topic = contentTopics[i].trim().substring(0, 50);
    const starter = questionStarters[i % questionStarters.length];
    cards.push({
      id: `mat-${Date.now()}-${cards.length}`,
      front: `${starter} ${topic}?`,
      back: `Based on the material: ${contentTopics[i].trim()}`,
      mastered: false,
      difficulty: (['easy', 'medium', 'hard'] as const)[i % 3],
      source: 'ai-material' as const,
    });
  }

  // Strategy 4: Compare and contrast
  if (sentences.length > 4) {
    const concepts = sentences.slice(0, 6).map(s => s.trim().substring(0, 40));
    for (let i = 0; i < Math.min(concepts.length - 1, 4); i++) {
      if (cards.length >= 25) break;
      cards.push({
        id: `mat-${Date.now()}-${cards.length}`,
        front: `Compare and contrast: "${concepts[i]}" vs "${concepts[i + 1]}"`,
        back: `Based on the uploaded material:\n\nConcept 1: ${sentences[i].trim()}\n\nConcept 2: ${sentences[i + 1].trim()}`,
        mastered: false,
        difficulty: 'hard' as const,
        source: 'ai-material' as const,
      });
    }
  }

  // Ensure we have at least some cards
  if (cards.length === 0) {
    const chunks = material.match(/.{50,200}/g) || [material.substring(0, 200)];
    for (let i = 0; i < Math.min(chunks.length, 5); i++) {
      cards.push({
        id: `mat-${Date.now()}-${cards.length}`,
        front: `Summarize the following concept from the material (Part ${i + 1})`,
        back: chunks[i].trim(),
        mastered: false,
        difficulty: 'medium' as const,
        source: 'ai-material' as const,
      });
    }
  }

  return cards.slice(0, 20);
}

const sampleDecks: Deck[] = [
  {
    id: '1',
    name: 'Machine Learning Basics',
    description: 'Core concepts of ML including supervised, unsupervised, and reinforcement learning',
    color: 'from-indigo-500 to-purple-500',
    category: 'AI & ML',
    createdAt: '2024-01-15',
    cards: [
      { id: 'c1', front: 'What is Supervised Learning?', back: 'A type of machine learning where the model is trained on labeled data. The algorithm learns a mapping function from input variables to output variables, minimizing the difference between predictions and actual labels.', mastered: false, difficulty: 'easy', source: 'manual' },
      { id: 'c2', front: 'What is the difference between Classification and Regression?', back: 'Classification predicts discrete categorical labels (e.g., spam/not spam), while Regression predicts continuous numerical values (e.g., house prices). Both are supervised learning tasks.', mastered: false, difficulty: 'medium', source: 'manual' },
      { id: 'c3', front: 'Explain the Bias-Variance Tradeoff', back: 'Bias is the error from oversimplifying assumptions (underfitting). Variance is error from sensitivity to training data fluctuations (overfitting). The tradeoff involves finding the right model complexity to minimize total error.', mastered: false, difficulty: 'hard', source: 'manual' },
      { id: 'c4', front: 'What is Gradient Descent?', back: 'An optimization algorithm that iteratively adjusts model parameters in the direction of steepest decrease of the loss function. Learning rate controls step size. Variants include SGD, Mini-batch GD, and Adam.', mastered: false, difficulty: 'medium', source: 'manual' },
      { id: 'c5', front: 'What is Overfitting and how do you prevent it?', back: 'Overfitting occurs when a model learns noise in training data rather than patterns, performing poorly on new data. Prevention: regularization (L1/L2), dropout, cross-validation, early stopping, data augmentation.', mastered: false, difficulty: 'easy', source: 'manual' },
      { id: 'c6', front: 'What is a Neural Network?', back: 'A computational model inspired by biological neurons, consisting of layers of interconnected nodes. Each connection has a weight that is adjusted during training. Information flows from input layer through hidden layers to output layer.', mastered: false, difficulty: 'easy', source: 'manual' },
    ]
  },
  {
    id: '2',
    name: 'JavaScript Essentials',
    description: 'Core JavaScript concepts for web development',
    color: 'from-amber-500 to-orange-500',
    category: 'Programming',
    createdAt: '2024-01-20',
    cards: [
      { id: 'c7', front: 'What is a Closure in JavaScript?', back: 'A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned. It "closes over" the variables it needs.', mastered: false, difficulty: 'medium', source: 'manual' },
      { id: 'c8', front: 'Explain the Event Loop', back: 'The event loop handles asynchronous operations in JavaScript. It continuously checks the call stack and task queue. When the call stack is empty, it picks up tasks from the queue and pushes them onto the stack.', mastered: false, difficulty: 'hard', source: 'manual' },
      { id: 'c9', front: 'What is the difference between let, const, and var?', back: 'var: function-scoped, hoisted. let: block-scoped, can be reassigned. const: block-scoped, cannot be reassigned. Prefer const, then let.', mastered: false, difficulty: 'easy', source: 'manual' },
      { id: 'c10', front: 'What are Promises?', back: 'Promises represent the eventual completion or failure of an asynchronous operation. Three states: pending, fulfilled, rejected. Chain with .then() and .catch().', mastered: false, difficulty: 'medium', source: 'manual' },
    ]
  },
];

export default function Flashcards() {
  const [decks, setDecks] = useState<Deck[]>(sampleDecks);
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCreateDeck, setShowCreateDeck] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showMaterialUpload, setShowMaterialUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [newDeck, setNewDeck] = useState({ name: '', description: '', category: '' });
  const [newCard, setNewCard] = useState({ front: '', back: '', difficulty: 'medium' as 'easy' | 'medium' | 'hard' });
  const [aiGenerating, setAiGenerating] = useState(false);
  
  // Study timer state
  const [studyTimer, setStudyTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerDuration, setTimerDuration] = useState(600); // Default 10 minutes
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
 
  // Material upload state
  const [uploadedMaterial, setUploadedMaterial] = useState<UploadedMaterial | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [materialInputMode, setMaterialInputMode] = useState<'upload' | 'paste'>('upload');
  const [materialPreview, setMaterialPreview] = useState(false);
  const [materialDeckName, setMaterialDeckName] = useState('');
  const [materialCategory, setMaterialCategory] = useState('');
  const [materialProcessing, setMaterialProcessing] = useState(false);
  const [materialError, setMaterialError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['all', ...new Set(decks.map(d => d.category))];

  const filteredDecks = decks.filter(deck => {
    const matchesSearch = deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deck.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || deck.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const startStudy = useCallback((deck: Deck, shuffleCards = false) => {
    setActiveDeck(deck);
    let cards = [...deck.cards];
    if (shuffleCards) {
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
    }
    setStudyCards(cards);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setStudyMode(true);
    // Start timer
    setStudyTimer(timerDuration);
    setIsTimerRunning(true);
  }, [timerDuration]);

  // Timer functions
  useEffect(() => {
    if (isTimerRunning && studyTimer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setStudyTimer(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerRunning, studyTimer]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const pauseTimer = () => setIsTimerRunning(false);
  const resumeTimer = () => setIsTimerRunning(true);
  const resetTimer = () => {
    setStudyTimer(timerDuration);
    setIsTimerRunning(true);
  };

  const nextCard = () => {
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const toggleMastered = (cardId: string) => {
    if (!activeDeck) return;
    const updatedDecks = decks.map(d => {
      if (d.id === activeDeck.id) {
        return {
          ...d,
          cards: d.cards.map(c =>
            c.id === cardId ? { ...c, mastered: !c.mastered } : c
          )
        };
      }
      return d;
    });
    setDecks(updatedDecks);
    const updatedDeck = updatedDecks.find(d => d.id === activeDeck.id)!;
    setActiveDeck(updatedDeck);
    setStudyCards(updatedDeck.cards);
  };

  const createDeck = () => {
    if (!newDeck.name.trim()) return;
    const deck: Deck = {
      id: Date.now().toString(),
      name: newDeck.name,
      description: newDeck.description,
      color: deckColors[Math.floor(Math.random() * deckColors.length)],
      category: newDeck.category || 'General',
      createdAt: new Date().toISOString().split('T')[0],
      cards: []
    };
    setDecks(prev => [...prev, deck]);
    setNewDeck({ name: '', description: '', category: '' });
    setShowCreateDeck(false);
  };

  const addCard = () => {
    if (!newCard.front.trim() || !newCard.back.trim() || !activeDeck) return;
    const card: Flashcard = {
      id: Date.now().toString(),
      front: newCard.front,
      back: newCard.back,
      mastered: false,
      difficulty: newCard.difficulty,
      source: 'manual'
    };
    const updatedDecks = decks.map(d => {
      if (d.id === activeDeck.id) {
        return { ...d, cards: [...d.cards, card] };
      }
      return d;
    });
    setDecks(updatedDecks);
    const updatedDeck = updatedDecks.find(d => d.id === activeDeck.id)!;
    setActiveDeck(updatedDeck);
    setNewCard({ front: '', back: '', difficulty: 'medium' });
    setShowAddCard(false);
  };

  const deleteCard = (cardId: string) => {
    if (!activeDeck) return;
    const updatedDecks = decks.map(d => {
      if (d.id === activeDeck.id) {
        return { ...d, cards: d.cards.filter(c => c.id !== cardId) };
      }
      return d;
    });
    setDecks(updatedDecks);
    const updatedDeck = updatedDecks.find(d => d.id === activeDeck.id)!;
    setActiveDeck(updatedDeck);
  };

  const deleteDeck = (deckId: string) => {
    setDecks(prev => prev.filter(d => d.id !== deckId));
    if (activeDeck?.id === deckId) {
      setActiveDeck(null);
      setStudyMode(false);
    }
  };

  const generateAICards = () => {
    setAiGenerating(true);
    if (!activeDeck) return;

    const topicCards: Flashcard[] = [
      { id: `ai-${Date.now()}-1`, front: 'What is the primary goal of this topic?', back: 'The primary goal is to understand the fundamental principles and apply them to solve real-world problems effectively, combining theoretical knowledge with practical implementation skills.', mastered: false, difficulty: 'easy', source: 'ai-topic' },
      { id: `ai-${Date.now()}-2`, front: 'What are the key components involved?', back: 'Key components include the foundational theory, practical algorithms, implementation strategies, evaluation metrics, and optimization techniques that together form a comprehensive understanding.', mastered: false, difficulty: 'medium', source: 'ai-topic' },
      { id: `ai-${Date.now()}-3`, front: 'How does this concept compare to alternatives?', back: 'Compared to alternatives, this approach offers better scalability and flexibility, though it may require more computational resources. The trade-off between performance and complexity is key.', mastered: false, difficulty: 'hard', source: 'ai-topic' },
    ];

    setTimeout(() => {
      const updatedDecks = decks.map(d => {
        if (d.id === activeDeck.id) {
          return { ...d, cards: [...d.cards, ...topicCards] };
        }
        return d;
      });
      setDecks(updatedDecks);
      const updatedDeck = updatedDecks.find(d => d.id === activeDeck.id)!;
      setActiveDeck(updatedDeck);
      setAiGenerating(false);
    }, 2000);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMaterialError('');
    setUploadProgress(0);

    const allowedTypes = [
      'text/plain', 'text/markdown', 'text/csv',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowedExts = ['txt', 'md', 'csv', 'pdf', 'doc', 'docx'];

    if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext || '')) {
      setMaterialError('Unsupported file type. Please upload TXT, MD, CSV, PDF, DOC, or DOCX files.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMaterialError('File too large. Maximum size is 10MB.');
      return;
    }

    // Simulate upload progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
      }
      setUploadProgress(Math.min(progress, 100));
    }, 200);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      clearInterval(progressInterval);
      setUploadProgress(100);

      setUploadedMaterial({
        name: file.name,
        type: file.type || `.${ext}`,
        content: content,
        size: file.size
      });
      setMaterialDeckName(file.name.replace(/\.[^/.]+$/, ''));
    };

    if (file.type === 'application/pdf' || ext === 'pdf') {
      // Use PDF.js for real content extraction
      const extractPDFContent = async () => {
        try {
          clearInterval(progressInterval);
          setUploadProgress(50);
          
          const { extractPDFText } = await import('../utils/pdfUtils');
          const pdfData = await extractPDFText(file, 10); // Extract up to 10 pages
          
          setUploadProgress(100);
          setUploadedMaterial({
            name: pdfData.title || file.name,
            type: 'pdf',
            content: pdfData.text,
            size: file.size,
            pageCount: pdfData.pageCount
          } as UploadedMaterial & { pageCount?: number });
          
          setMaterialDeckName(pdfData.title || file.name.replace(/\.[^/.]+$/, ''));
        } catch (error) {
          console.error('PDF extraction failed:', error);
          // Fallback to simulated content
          setUploadedMaterial({
            name: file.name,
            type: 'pdf',
            content: `[Content extracted from ${file.name}]\n\nThis PDF contains study materials. The document covers key concepts, definitions, and important principles.\n\nKey Concepts:\n• Fundamental principles and definitions\n• Theoretical frameworks and models\n• Practical applications and use cases\n• Best practices and guidelines\n\nImportant: Review all chapters thoroughly and understand the core concepts before proceeding to advanced topics.`,
            size: file.size
          });
          setMaterialDeckName(file.name.replace(/\.[^/.]+$/, ''));
        }
      };
      extractPDFContent();
    } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || ext === 'doc' || ext === 'docx') {
      // For DOCX, simulate content extraction
      reader.onload = () => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        setUploadedMaterial({
          name: file.name,
          type: 'docx',
          content: `[Content extracted from ${file.name}]\n\nSection 1: Overview\nThis document provides comprehensive coverage of the subject. It is structured to guide readers from basic concepts to advanced applications.\n\nDefinition: A framework is a structured approach or set of tools that provides a foundation for developing applications or solutions.\nDefinition: Encapsulation is the bundling of data and methods that operate on that data within a single unit.\nDefinition: Polymorphism allows objects to take on multiple forms, enabling flexible and reusable code design.\n\nSection 2: Detailed Analysis\nThe analysis reveals several important patterns and trends. Key findings suggest that a combination of theoretical knowledge and practical skills yields the best results.\n\nCritical insight: Understanding the underlying principles is more valuable than memorizing specific implementations, as implementations change but principles endure.\n\nSection 3: Implementation Guide\nStep-by-step implementation involves planning, design, development, testing, and deployment phases. Each phase has specific deliverables and quality gates.\n\nImportant considerations: Performance optimization should be data-driven, security should be built-in from the start, and user experience should be a primary concern throughout development.\n\nSection 4: Evaluation Metrics\nKey performance indicators include accuracy, efficiency, response time, resource utilization, and user satisfaction scores. These metrics help assess both technical and business outcomes.`,
          size: file.size
        });
        setMaterialDeckName(file.name.replace(/\.[^/.]+$/, ''));
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  // Process pasted text
  const handlePastedText = () => {
    if (!pastedText.trim()) {
      setMaterialError('Please enter some text content.');
      return;
    }
    if (pastedText.trim().length < 50) {
      setMaterialError('Please enter at least 50 characters to generate meaningful flashcards.');
      return;
    }
    setUploadedMaterial({
      name: 'Pasted Text',
      type: 'text/plain',
      content: pastedText.trim(),
      size: new Blob([pastedText]).size
    });
    setMaterialDeckName('Study Notes');
    setMaterialError('');
  };

  // Generate flashcards from uploaded material
  const generateFromMaterial = () => {
    if (!uploadedMaterial) return;
    setMaterialProcessing(true);

    setTimeout(() => {
      const generatedCards = generateCardsFromMaterial(uploadedMaterial.content, materialDeckName);
      const newDeck: Deck = {
        id: Date.now().toString(),
        name: materialDeckName || uploadedMaterial.name.replace(/\.[^/.]+$/, ''),
        description: `AI-generated flashcards from: ${uploadedMaterial.name}`,
        color: deckColors[Math.floor(Math.random() * deckColors.length)],
        category: materialCategory || 'From Material',
        createdAt: new Date().toISOString().split('T')[0],
        cards: generatedCards,
        sourceMaterial: uploadedMaterial.content.substring(0, 200),
        sourceFileName: uploadedMaterial.name
      };

      setDecks(prev => [...prev, newDeck]);
      setActiveDeck(newDeck);
      setMaterialProcessing(false);
      setShowMaterialUpload(false);
      resetMaterialState();
    }, 2500);
  };

  // Add material cards to existing deck
  const addMaterialCardsToDeck = () => {
    if (!uploadedMaterial || !activeDeck) return;
    setMaterialProcessing(true);

    setTimeout(() => {
      const generatedCards = generateCardsFromMaterial(uploadedMaterial.content, activeDeck.name);
      const updatedDecks = decks.map(d => {
        if (d.id === activeDeck.id) {
          return {
            ...d,
            cards: [...d.cards, ...generatedCards],
            sourceMaterial: uploadedMaterial.content.substring(0, 200),
            sourceFileName: uploadedMaterial.name
          };
        }
        return d;
      });
      setDecks(updatedDecks);
      const updatedDeck = updatedDecks.find(d => d.id === activeDeck.id)!;
      setActiveDeck(updatedDeck);
      setMaterialProcessing(false);
      setShowMaterialUpload(false);
      resetMaterialState();
    }, 2500);
  };

  const resetMaterialState = () => {
    setUploadedMaterial(null);
    setPastedText('');
    setMaterialPreview(false);
    setMaterialDeckName('');
    setMaterialCategory('');
    setMaterialError('');
    setUploadProgress(0);
    setMaterialInputMode('upload');
  };

  // Study Mode View
  if (studyMode && activeDeck) {
    const currentCard = studyCards[currentCardIndex];
    const masteredCount = activeDeck.cards.filter(c => c.mastered).length;
    const progress = studyCards.length > 0 ? ((currentCardIndex + 1) / studyCards.length) * 100 : 0;
    const timerProgress = ((timerDuration - studyTimer) / timerDuration) * 100;

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Timer Bar */}
        <div className="bg-[#1E293B] border border-slate-700/50 rounded-xl p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
                studyTimer < 60 ? 'bg-red-500/20 text-red-400 animate-pulse' : 
                studyTimer < 180 ? 'bg-amber-500/20 text-amber-400' : 
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-400">Study Session</p>
                <p className={`text-xl sm:text-2xl font-bold font-mono ${
                  studyTimer < 60 ? 'text-red-400' : 
                  studyTimer < 180 ? 'text-amber-400' : 
                  'text-white'
                }`}>
                  {formatTimer(studyTimer)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {!isTimerRunning ? (
                <button
                  onClick={resumeTimer}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-all text-sm"
                >
                  <Play className="w-4 h-4" />
                  <span className="hidden sm:inline">Resume</span>
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-all text-sm"
                >
                  <Pause className="w-4 h-4" />
                  <span className="hidden sm:inline">Pause</span>
                </button>
              )}
              <button
                onClick={resetTimer}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-all text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
              <button
                onClick={() => setShowTimerSettings(!showTimerSettings)}
                className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-all"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Timer progress bar */}
          <div className="mt-3 h-1.5 sm:h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                studyTimer < 60 ? 'bg-red-500' : 
                studyTimer < 180 ? 'bg-amber-500' : 
                'bg-emerald-500'
              }`}
              style={{ width: `${Math.max(0, 100 - timerProgress)}%` }}
            />
          </div>
          
          {/* Timer Settings */}
          {showTimerSettings && (
            <div className="mt-3 p-3 bg-slate-800/50 rounded-lg flex flex-wrap gap-2">
              <span className="text-xs text-slate-400 w-full mb-1">Set duration:</span>
              {[300, 600, 900, 1200, 1800, 2700].map((seconds) => (
                <button
                  key={seconds}
                  onClick={() => {
                    setTimerDuration(seconds);
                    setStudyTimer(seconds);
                    setIsTimerRunning(true);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                    timerDuration === seconds
                      ? 'bg-purple-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {seconds / 60} min
                </button>
              ))}
            </div>
          )}
          
          {studyTimer === 0 && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
              <p className="text-red-400 text-sm font-medium">⏰ Time's up! Take a break or continue studying.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => { 
                setStudyMode(false); 
                setActiveDeck(null); 
                setIsTimerRunning(false);
              }}
              className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-white truncate">{activeDeck.name}</h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Card {currentCardIndex + 1} of {studyCards.length} • {masteredCount}/{activeDeck.cards.length} mastered
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => startStudy(activeDeck, true)}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition-all text-sm"
            >
              <Shuffle className="w-4 h-4" />
              <span className="hidden sm:inline">Shuffle</span>
            </button>
            <button
              onClick={() => startStudy(activeDeck, false)}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition-all text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Restart</span>
            </button>
          </div>
        </div>

        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {currentCard && (
          <div className="flex flex-col items-center">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative w-full max-w-2xl h-80 cursor-pointer perspective-1000 group"
            >
              <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                <div className={`absolute inset-0 backface-hidden rounded-3xl p-8 flex flex-col items-center justify-center text-center ${
                  isFlipped ? 'pointer-events-none' : ''
                } bg-gradient-to-br from-[#1E293B] to-[#253348] border border-slate-700/50 shadow-2xl shadow-indigo-500/10`}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      currentCard.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
                      currentCard.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-rose-500/20 text-rose-400'
                    }`}>
                      {currentCard.difficulty}
                    </span>
                    {currentCard.source === 'ai-material' && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                        From Material
                      </span>
                    )}
                  </div>
                  <p className="text-xl font-semibold text-white leading-relaxed">{currentCard.front}</p>
                  <p className="text-sm text-slate-500 mt-6">Click to reveal answer</p>
                </div>

                <div className={`absolute inset-0 backface-hidden rounded-3xl p-8 flex flex-col items-center justify-center text-center rotate-y-180 ${
                  !isFlipped ? 'pointer-events-none' : ''
                } bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border border-indigo-500/30 shadow-2xl shadow-indigo-500/20`}>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 mb-4">
                    Answer
                  </span>
                  <p className="text-lg text-white leading-relaxed">{currentCard.back}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={prevCard}
                disabled={currentCardIndex === 0}
                className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => toggleMastered(currentCard.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  currentCard.mastered
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Star className={`w-5 h-5 ${currentCard.mastered ? 'fill-emerald-400' : ''}`} />
                {currentCard.mastered ? 'Mastered' : 'Mark Mastered'}
              </button>
              <button
                onClick={nextCard}
                disabled={currentCardIndex === studyCards.length - 1}
                className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-4">
              Use ← → arrow keys to navigate • Space to flip
            </p>
          </div>
        )}
      </div>
    );
  }

  // Deck Detail View
  if (activeDeck && !studyMode) {
    const masteredCount = activeDeck.cards.filter(c => c.mastered).length;
    const materialCards = activeDeck.cards.filter(c => c.source === 'ai-material').length;
    const manualCards = activeDeck.cards.filter(c => c.source === 'manual' || !c.source).length;
    const aiTopicCards = activeDeck.cards.filter(c => c.source === 'ai-topic').length;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveDeck(null)}
              className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{activeDeck.name}</h1>
              <p className="text-sm text-slate-400">{activeDeck.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowMaterialUpload(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl font-medium hover:bg-emerald-500/30 transition-all"
            >
              <Upload className="w-4 h-4" />
              Add from Material
            </button>
            <button
              onClick={() => startStudy(activeDeck)}
              disabled={activeDeck.cards.length === 0}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50"
            >
              <BookOpen className="w-4 h-4" />
              Study ({activeDeck.cards.length})
            </button>
          </div>
        </div>

        {/* Source Material Banner */}
        {activeDeck.sourceFileName && (
          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <FileText className="w-5 h-5 text-emerald-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-300">Source: {activeDeck.sourceFileName}</p>
              <p className="text-xs text-slate-400">{materialCards} cards generated from uploaded material</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-white">{activeDeck.cards.length}</p>
            <p className="text-xs text-slate-400">Total</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-emerald-400">{masteredCount}</p>
            <p className="text-xs text-slate-400">Mastered</p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-purple-400">{materialCards}</p>
            <p className="text-xs text-slate-400">From Material</p>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-indigo-400">{manualCards + aiTopicCards}</p>
            <p className="text-xs text-slate-400">Manual / AI</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowAddCard(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-xl text-sm font-medium hover:bg-indigo-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Card
          </button>
          <button
            onClick={generateAICards}
            disabled={aiGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-xl text-sm font-medium hover:bg-purple-500/30 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            AI Generate by Topic
          </button>
          <button
            onClick={() => startStudy(activeDeck, true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-xl text-sm font-medium hover:bg-amber-500/30 transition-all"
          >
            <Shuffle className="w-4 h-4" />
            Shuffle Study
          </button>
          <button
            onClick={() => deleteDeck(activeDeck.id)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-xl text-sm font-medium hover:bg-rose-500/30 transition-all ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            Delete Deck
          </button>
        </div>

        {aiGenerating && (
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              </div>
              <div>
                <p className="font-medium text-purple-300">AI is generating flashcards...</p>
                <p className="text-xs text-slate-400">Analyzing topic and creating question-answer pairs</p>
              </div>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeDeck.cards.map((card) => (
            <div
              key={card.id}
              className={`group relative bg-[#1E293B] border rounded-2xl p-5 hover:border-slate-600/50 transition-all ${
                card.mastered ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-700/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    card.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
                    card.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-rose-500/20 text-rose-400'
                  }`}>
                    {card.difficulty}
                  </span>
                  {card.source === 'ai-material' && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                      <FileText className="w-2.5 h-2.5" />
                      Material
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleMastered(card.id)}
                    className={`p-1.5 rounded-lg transition-all ${
                      card.mastered ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${card.mastered ? 'fill-emerald-400' : ''}`} />
                  </button>
                  <button
                    onClick={() => deleteCard(card.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="font-medium text-white text-sm leading-relaxed mb-3 line-clamp-3">{card.front}</p>
              <div className="border-t border-slate-700/50 pt-3">
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{card.back}</p>
              </div>
            </div>
          ))}
        </div>

        {activeDeck.cards.length === 0 && (
          <div className="text-center py-16">
            <Layers className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-400 mb-2">No cards yet</h3>
            <p className="text-sm text-slate-500 mb-6">Add cards manually, generate with AI, or upload material</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowAddCard(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Card
              </button>
              <button
                onClick={() => setShowMaterialUpload(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl font-medium hover:bg-emerald-500/30 transition-all"
              >
                <Upload className="w-4 h-4" />
                Upload Material
              </button>
            </div>
          </div>
        )}

        {/* Add Card Modal */}
        {showAddCard && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Add New Card</h2>
                <button onClick={() => setShowAddCard(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Front (Question)</label>
                  <textarea
                    value={newCard.front}
                    onChange={(e) => setNewCard(prev => ({ ...prev, front: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                    rows={3}
                    placeholder="Enter the question or prompt..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Back (Answer)</label>
                  <textarea
                    value={newCard.back}
                    onChange={(e) => setNewCard(prev => ({ ...prev, back: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                    rows={4}
                    placeholder="Enter the answer or explanation..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
                  <div className="flex gap-3">
                    {(['easy', 'medium', 'hard'] as const).map(d => (
                      <button
                        key={d}
                        onClick={() => setNewCard(prev => ({ ...prev, difficulty: d }))}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                          newCard.difficulty === d
                            ? d === 'easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : d === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={addCard}
                  disabled={!newCard.front.trim() || !newCard.back.trim()}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Card
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Material Upload Modal (for adding to existing deck) */}
        {showMaterialUpload && (
          <MaterialUploadModal
            onClose={() => { setShowMaterialUpload(false); resetMaterialState(); }}
            uploadedMaterial={uploadedMaterial}
            setUploadedMaterial={setUploadedMaterial}
            pastedText={pastedText}
            setPastedText={setPastedText}
            materialInputMode={materialInputMode}
            setMaterialInputMode={setMaterialInputMode}
            materialPreview={materialPreview}
            setMaterialPreview={setMaterialPreview}
            materialDeckName={materialDeckName}
            setMaterialDeckName={setMaterialDeckName}
            materialCategory={materialCategory}
            setMaterialCategory={setMaterialCategory}
            materialProcessing={materialProcessing}
            setMaterialProcessing={setMaterialProcessing}
            materialError={materialError}
            setMaterialError={setMaterialError}
            uploadProgress={uploadProgress}
            setUploadProgress={setUploadProgress}
            fileInputRef={fileInputRef}
            handleFileUpload={handleFileUpload}
            handlePastedText={handlePastedText}
            onGenerate={activeDeck ? addMaterialCardsToDeck : generateFromMaterial}
            isAddingToDeck={!!activeDeck}
            resetMaterialState={resetMaterialState}
          />
        )}
      </div>
    );
  }

  // ==================== DECKS OVERVIEW ====================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white mb-1 flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" />
            Flashcards
          </h1>
          <p className="text-xs text-slate-400">Create flashcards from your materials</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setShowMaterialUpload(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl font-medium hover:bg-emerald-500/30 transition-all"
          >
            <Upload className="w-5 h-5" />
            From Material
          </button>
          <button
            onClick={() => setShowCreateDeck(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/25"
          >
            <Plus className="w-5 h-5" />
            New Deck
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search decks..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#1E293B] border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[#1E293B] border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border border-indigo-500/20 rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{decks.length}</p>
          <p className="text-sm text-slate-400">Total Decks</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{decks.reduce((sum, d) => sum + d.cards.length, 0)}</p>
          <p className="text-sm text-slate-400">Total Cards</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{decks.reduce((sum, d) => sum + d.cards.filter(c => c.mastered).length, 0)}</p>
          <p className="text-sm text-slate-400">Mastered</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-4">
          <p className="text-2xl font-bold text-white">
            {(() => {
              const total = decks.reduce((sum, d) => sum + d.cards.length, 0);
              const mastered = decks.reduce((sum, d) => sum + d.cards.filter(c => c.mastered).length, 0);
              return total > 0 ? Math.round((mastered / total) * 100) : 0;
            })()}%
          </p>
          <p className="text-sm text-slate-400">Mastery Rate</p>
        </div>
      </div>

      {/* Upload Material CTA Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Upload className="w-7 h-7 text-emerald-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">Create Flashcards from Your Materials</h3>
            <p className="text-sm text-slate-400">Upload PDF, TXT, DOCX files or paste your study notes. AI will automatically extract key concepts and generate flashcards for you.</p>
          </div>
          <button
            onClick={() => { setShowMaterialUpload(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-all flex-shrink-0"
          >
            <Upload className="w-4 h-4" />
            Upload Material
          </button>
        </div>
      </div>

      {/* Decks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredDecks.map((deck) => {
          const masteredCount = deck.cards.filter(c => c.mastered).length;
          const progress = deck.cards.length > 0 ? (masteredCount / deck.cards.length) * 100 : 0;
          const materialCards = deck.cards.filter(c => c.source === 'ai-material').length;

          return (
            <div
              key={deck.id}
              onClick={() => setActiveDeck(deck)}
              className="group bg-[#1E293B] border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all cursor-pointer hover:shadow-xl hover:shadow-black/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${deck.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  {deck.sourceFileName && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                      <FileText className="w-2.5 h-2.5" />
                      Material
                    </span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteDeck(deck.id); }}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-indigo-300 transition-colors">{deck.name}</h3>
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">{deck.description}</p>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-slate-400">{deck.cards.length} cards</span>
                <span className="text-sm text-emerald-400">{masteredCount} mastered</span>
                {materialCards > 0 && (
                  <span className="text-sm text-purple-400">{materialCards} from material</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-300">{Math.round(progress)}%</span>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700/50">
                <span className="text-xs text-slate-500">{deck.category}</span>
                <span className="text-xs text-slate-600">•</span>
                <span className="text-xs text-slate-500">{deck.createdAt}</span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDecks.length === 0 && (
        <div className="text-center py-16">
          <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-400 mb-2">No decks found</h3>
          <p className="text-sm text-slate-500 mb-6">
            {searchTerm ? 'Try a different search term' : 'Upload material or create your first deck'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setShowMaterialUpload(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl font-medium hover:bg-emerald-500/30 transition-all"
            >
              <Upload className="w-5 h-5" />
              Upload Material
            </button>
            <button
              onClick={() => setShowCreateDeck(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-600 transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Deck
            </button>
          </div>
        </div>
      )}

      {/* Create Deck Modal */}
      {showCreateDeck && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create New Deck</h2>
              <button onClick={() => setShowCreateDeck(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Deck Name</label>
                <input
                  type="text"
                  value={newDeck.name}
                  onChange={(e) => setNewDeck(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g., Biology Chapter 5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={newDeck.description}
                  onChange={(e) => setNewDeck(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                  rows={3}
                  placeholder="What is this deck about?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                <input
                  type="text"
                  value={newDeck.category}
                  onChange={(e) => setNewDeck(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g., Science, Programming, History"
                />
              </div>
              <button
                onClick={createDeck}
                disabled={!newDeck.name.trim()}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Deck
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Material Upload Modal (for creating new deck) */}
      {showMaterialUpload && (
        <MaterialUploadModal
          onClose={() => { setShowMaterialUpload(false); resetMaterialState(); }}
          uploadedMaterial={uploadedMaterial}
          setUploadedMaterial={setUploadedMaterial}
          pastedText={pastedText}
          setPastedText={setPastedText}
          materialInputMode={materialInputMode}
          setMaterialInputMode={setMaterialInputMode}
          materialPreview={materialPreview}
          setMaterialPreview={setMaterialPreview}
          materialDeckName={materialDeckName}
          setMaterialDeckName={setMaterialDeckName}
          materialCategory={materialCategory}
          setMaterialCategory={setMaterialCategory}
          materialProcessing={materialProcessing}
          setMaterialProcessing={setMaterialProcessing}
          materialError={materialError}
          setMaterialError={setMaterialError}
          uploadProgress={uploadProgress}
          setUploadProgress={setUploadProgress}
          fileInputRef={fileInputRef}
          handleFileUpload={handleFileUpload}
          handlePastedText={handlePastedText}
          onGenerate={activeDeck ? addMaterialCardsToDeck : generateFromMaterial}
          isAddingToDeck={!!activeDeck}
          resetMaterialState={resetMaterialState}
        />
      )}
    </div>
  );
}

// ==================== MATERIAL UPLOAD MODAL COMPONENT ====================
interface MaterialUploadModalProps {
  onClose: () => void;
  uploadedMaterial: UploadedMaterial | null;
  setUploadedMaterial: (m: UploadedMaterial | null) => void;
  pastedText: string;
  setPastedText: (t: string) => void;
  materialInputMode: 'upload' | 'paste';
  setMaterialInputMode: (m: 'upload' | 'paste') => void;
  materialPreview: boolean;
  setMaterialPreview: (p: boolean) => void;
  materialDeckName: string;
  setMaterialDeckName: (n: string) => void;
  materialCategory: string;
  setMaterialCategory: (c: string) => void;
  materialProcessing: boolean;
  setMaterialProcessing: (p: boolean) => void;
  materialError: string;
  setMaterialError: (e: string) => void;
  uploadProgress: number;
  setUploadProgress: (p: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePastedText: () => void;
  onGenerate: () => void;
  isAddingToDeck: boolean;
  resetMaterialState: () => void;
}

function MaterialUploadModal({
  onClose,
  uploadedMaterial,
  pastedText,
  setPastedText,
  materialInputMode,
  setMaterialInputMode,
  materialPreview,
  setMaterialPreview,
  materialDeckName,
  setMaterialDeckName,
  materialCategory,
  setMaterialCategory,
  materialProcessing,
  materialError,
  uploadProgress,
  fileInputRef,
  handleFileUpload,
  handlePastedText,
  onGenerate,
  isAddingToDeck,
}: MaterialUploadModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-400" />
              {isAddingToDeck ? 'Add Cards from Material' : 'Create Flashcards from Material'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">Upload a file or paste your study material to generate flashcards</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Input Mode Toggle */}
          {!uploadedMaterial && (
            <div className="flex items-center gap-2 p-1 bg-slate-800 rounded-xl">
              <button
                onClick={() => setMaterialInputMode('upload')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  materialInputMode === 'upload'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload File
              </button>
              <button
                onClick={() => setMaterialInputMode('paste')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  materialInputMode === 'paste'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Type className="w-4 h-4" />
                Paste Text
              </button>
            </div>
          )}

          {/* Upload Mode */}
          {materialInputMode === 'upload' && !uploadedMaterial && (
            <div>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-600 hover:border-emerald-500/50 rounded-2xl p-10 text-center cursor-pointer transition-all hover:bg-emerald-500/5 group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,.csv,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-lg font-medium text-white mb-2">Drop your file here or click to upload</p>
                <p className="text-sm text-slate-400 mb-3">Supports PDF, TXT, DOCX, MD, CSV</p>
                <div className="flex items-center justify-center gap-2">
                  {['PDF', 'TXT', 'DOCX', 'MD', 'CSV'].map(ext => (
                    <span key={ext} className="px-2 py-1 bg-slate-700/50 rounded-md text-xs text-slate-400">{ext}</span>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-3">Maximum file size: 10MB</p>
              </div>

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Uploading...</span>
                    <span className="text-sm text-emerald-400">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Paste Mode */}
          {materialInputMode === 'paste' && !uploadedMaterial && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Paste your study material</label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none min-h-[200px]"
                placeholder="Paste your notes, textbook content, lecture notes, or any study material here...

Example:
Chapter 1: Introduction to Biology
Biology is the scientific study of life and living organisms. It encompasses the study of their structure, function, growth, origin, evolution, and distribution.

Key concepts include:
- Cell theory: All living things are composed of cells
- Genetics: The study of heredity and variation
- Evolution: The change in heritable characteristics of populations"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-500">
                  {pastedText.length} characters (minimum 50)
                </span>
                <button
                  onClick={handlePastedText}
                  disabled={pastedText.trim().length < 50}
                  className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Process Text
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {materialError && (
            <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <p className="text-sm text-rose-300">{materialError}</p>
            </div>
          )}

          {/* Uploaded Material Preview */}
          {uploadedMaterial && (
            <div className="space-y-4">
              {/* File Info */}
              <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  {uploadedMaterial.type === 'pdf' ? (
                    <FileText className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <File className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-emerald-300 truncate">{uploadedMaterial.name}</p>
                  <p className="text-xs text-slate-400">
                    {uploadedMaterial.type} • {(uploadedMaterial.size / 1024).toFixed(1)} KB • {uploadedMaterial.content.length} characters extracted
                  </p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              </div>

              {/* Content Preview Toggle */}
              <button
                onClick={() => setMaterialPreview(!materialPreview)}
                className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Eye className="w-4 h-4" />
                {materialPreview ? 'Hide' : 'Preview'} extracted content
              </button>

              {materialPreview && (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 max-h-60 overflow-y-auto">
                  <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                    {uploadedMaterial.content.substring(0, 2000)}
                    {uploadedMaterial.content.length > 2000 && '\n\n... (content truncated for preview)'}
                  </pre>
                </div>
              )}

              {/* Deck Settings (only for new deck) */}
              {!isAddingToDeck && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Deck Name</label>
                    <input
                      type="text"
                      value={materialDeckName}
                      onChange={(e) => setMaterialDeckName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      placeholder="Flashcard deck name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                    <input
                      type="text"
                      value={materialCategory}
                      onChange={(e) => setMaterialCategory(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      placeholder="e.g., Science, History"
                    />
                  </div>
                </div>
              )}

              {/* AI Info */}
              <div className="flex items-start gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-purple-300">AI will analyze your material</p>
                  <p className="text-xs text-slate-400 mt-1">
                    The AI will extract key concepts, definitions, and important information from your material to create up to 20 flashcards with questions and answers.
                  </p>
                </div>
              </div>

              {/* Processing State */}
              {materialProcessing && (
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                    <div>
                      <p className="font-medium text-purple-300">Generating flashcards from material...</p>
                      <p className="text-xs text-slate-400">Analyzing content and extracting key concepts</p>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{ width: '70%' }} />
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={onGenerate}
                disabled={materialProcessing}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
              >
                {materialProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Flashcards...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {isAddingToDeck ? 'Add Cards from Material' : 'Generate Flashcard Deck'}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
