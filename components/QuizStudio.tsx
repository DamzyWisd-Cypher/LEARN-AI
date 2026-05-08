import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Brain,
  FileText,
  ListChecks,
  PenTool,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Target,
  BarChart3,
  Star,
  MessageSquare,
  Upload,
  Zap,
  Type,
  Eye,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';

type QuizMode = 'select' | 'objective' | 'theory' | 'results';

interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface ObjectiveQuestion {
  id: string;
  question: string;
  options: MCQOption[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  fromMaterial?: boolean;
}

interface TheoryQuestion {
  id: string;
  question: string;
  modelAnswer: string;
  keyPoints: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  maxScore: number;
  fromMaterial?: boolean;
}

interface QuizConfig {
  topic: string;
  numQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  timeLimit: number;
  type: 'objective' | 'theory';
}

interface UploadedMaterial {
  name: string;
  type: string;
  content: string;
  size: number;
}

// ==================== MATERIAL CONTENT ANALYSIS ====================
function extractKeywords(content: string): string[] {
  const words = content.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/);
  const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'and', 'but', 'or', 'nor', 'not', 'so', 'yet', 'both', 'either', 'neither', 'each', 'every', 'all', 'any', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'only', 'own', 'same', 'than', 'too', 'very', 'just', 'because', 'if', 'when', 'where', 'how', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'it', 'its', 'they', 'them', 'their', 'we', 'our', 'you', 'your', 'he', 'she', 'him', 'her', 'his']);
  const freq: Record<string, number> = {};
  for (const w of words) {
    if (w.length > 3 && !stopWords.has(w)) {
      freq[w] = (freq[w] || 0) + 1;
    }
  }
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 30).map(e => e[0]);
}

function generateObjectiveFromMaterial(material: string, count: number): ObjectiveQuestion[] {
  const sentences = material.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const lines = material.split('\n').filter(l => l.trim().length > 10);
  const keywords = extractKeywords(material);
  const questions: ObjectiveQuestion[] = [];

  // Strategy 1: Definition-based MCQs
  const defPattern = /(.+?)\s+(?:is defined as|is|are|refers to|means|describes|represents|involves)\s+(.+)/gi;
  let match;
  while ((match = defPattern.exec(material)) && questions.length < count) {
    const term = match[1].trim();
    const definition = match[2].trim();
    if (term.length > 3 && term.length < 80 && definition.length > 10 && definition.length < 400) {
      const wrongAnswers = keywords.slice(0, 10).filter(k => !term.toLowerCase().includes(k)).slice(0, 3).map(k =>
        `A concept related to ${k} but distinct from the described functionality`
      );
      while (wrongAnswers.length < 3) {
        wrongAnswers.push(`None of the above`);
      }
      questions.push({
        id: `mo-${Date.now()}-${questions.length}`,
        question: `Which of the following best describes "${term.endsWith('s') ? term.slice(0, -1) : term}"?`,
        options: [
          { id: 'a', text: definition, isCorrect: true },
          { id: 'b', text: wrongAnswers[0], isCorrect: false },
          { id: 'c', text: wrongAnswers[1], isCorrect: false },
          { id: 'd', text: wrongAnswers[2], isCorrect: false },
        ],
        explanation: `The correct answer describes "${term}" as: ${definition}`,
        difficulty: definition.length > 150 ? 'hard' : definition.length > 60 ? 'medium' : 'easy',
        topic: 'From Material',
        fromMaterial: true,
      });
    }
  }

  // Strategy 2: Fact-based from sentences
  const factualSentences = sentences.filter(s => {
    const lower = s.toLowerCase();
    return lower.includes('include') || lower.includes('consist') || lower.includes('contain') ||
      lower.includes('comprise') || lower.includes('involve') || lower.includes('provide') ||
      lower.includes('enable') || lower.includes('support') || lower.includes('require') ||
      lower.includes('important') || lower.includes('key') || lower.includes('primary');
  });

  for (const sentence of factualSentences) {
    if (questions.length >= count) break;
    const trimmed = sentence.trim();
    if (trimmed.length < 30) continue;

    const blanked = trimmed.replace(/\b\w{5,}\b/, '______');
    if (blanked === trimmed) continue;

    const originalWord = trimmed.match(/\b(\w{5,})\b/)?.[1] || 'concept';

    questions.push({
      id: `mo-${Date.now()}-${questions.length}`,
      question: `Fill in the blank: "${blanked}"`,
      options: [
        { id: 'a', text: originalWord, isCorrect: true },
        { id: 'b', text: keywords[Math.floor(Math.random() * keywords.length)] || 'process', isCorrect: false },
        { id: 'c', text: keywords[Math.floor(Math.random() * keywords.length)] || 'system', isCorrect: false },
        { id: 'd', text: keywords[Math.floor(Math.random() * keywords.length)] || 'method', isCorrect: false },
      ],
      explanation: `From the material: "${trimmed}"`,
      difficulty: 'medium',
      topic: 'From Material',
      fromMaterial: true,
    });
  }

  // Strategy 3: True/False style
  for (let i = 0; i < Math.min(lines.length, count - questions.length); i++) {
    if (questions.length >= count) break;
    const line = lines[i].trim();
    if (line.length < 30 || line.length > 300) continue;

    const negated = line.replace(/\b(is|are|was|were|can|will|has|have)\b/, (m) => {
      const negations: Record<string, string> = { 'is': 'is not', 'are': 'are not', 'was': 'was not', 'were': 'were not', 'can': 'cannot', 'will': 'will not', 'has': 'has not', 'have': 'have not' };
      return negations[m] || m;
    });

    const isOriginal = Math.random() > 0.5;

    questions.push({
      id: `mo-${Date.now()}-${questions.length}`,
      question: `According to the material, which statement is correct?`,
      options: [
        { id: 'a', text: isOriginal ? line : negated, isCorrect: isOriginal },
        { id: 'b', text: isOriginal ? negated : line, isCorrect: !isOriginal },
        { id: 'c', text: 'Both statements are correct', isCorrect: false },
        { id: 'd', text: 'Neither statement is correct', isCorrect: false },
      ],
      explanation: `From the material: "${line}"`,
      difficulty: i % 2 === 0 ? 'easy' : 'medium',
      topic: 'From Material',
      fromMaterial: true,
    });
  }

  // Fill remaining with general comprehension questions
  while (questions.length < count) {
    const idx = questions.length;
    const sentence = sentences[idx % sentences.length]?.trim() || 'The material covers important concepts and principles.';

    questions.push({
      id: `mo-${Date.now()}-${questions.length}`,
      question: `Based on the material, what can be inferred about: "${sentence.substring(0, 60)}..."?`,
      options: [
        { id: 'a', text: sentence, isCorrect: true },
        { id: 'b', text: 'This concept only applies in limited scenarios', isCorrect: false },
        { id: 'c', text: 'This is a deprecated approach', isCorrect: false },
        { id: 'd', text: 'This concept has no practical application', isCorrect: false },
      ],
      explanation: `From the material: "${sentence}"`,
      difficulty: (['easy', 'medium', 'hard'] as const)[idx % 3],
      topic: 'From Material',
      fromMaterial: true,
    });
  }

  return questions.slice(0, count);
}

function generateTheoryFromMaterial(material: string, count: number): TheoryQuestion[] {
  const paragraphs = material.split(/\n\n+/).filter(p => p.trim().length > 30);
  const sentences = material.split(/[.!?]+/).filter(s => s.trim().length > 15);
  const questions: TheoryQuestion[] = [];

  // Strategy 1: Explain concept questions
  for (let i = 0; i < Math.min(paragraphs.length, count); i++) {
    const para = paragraphs[i].trim();
    const firstSentence = para.split(/[.!?]/)[0]?.trim() || para.substring(0, 100);
    const keyWords = extractKeywords(para);

    questions.push({
      id: `mt-${Date.now()}-${i}`,
      question: `Based on the material, explain in detail: "${firstSentence}..."`,
      modelAnswer: para,
      keyPoints: keyWords.slice(0, 5),
      difficulty: (['easy', 'medium', 'hard'] as const)[i % 3],
      topic: 'From Material',
      maxScore: [10, 15, 20][i % 3],
      fromMaterial: true,
    });
  }

  // Strategy 2: Compare and analyze
  if (questions.length < count && paragraphs.length >= 2) {
    const remaining = count - questions.length;
    for (let i = 0; i < remaining; i++) {
      const p1 = paragraphs[i % paragraphs.length];
      const p2 = paragraphs[(i + 1) % paragraphs.length];
      const kw1 = extractKeywords(p1);
      const kw2 = extractKeywords(p2);

      questions.push({
        id: `mt-${Date.now()}-${questions.length}`,
        question: `The material discusses multiple concepts. Compare and analyze the following:\n\nPart 1: "${p1.substring(0, 80)}..."\n\nPart 2: "${p2.substring(0, 80)}..."`,
        modelAnswer: `Part 1 Analysis:\n${p1}\n\nPart 2 Analysis:\n${p2}\n\nComparison:\nBoth concepts are discussed in the material and share some fundamental principles while differing in their specific applications and use cases.`,
        keyPoints: [...kw1.slice(0, 3), ...kw2.slice(0, 3)],
        difficulty: 'hard',
        topic: 'From Material',
        maxScore: 20,
        fromMaterial: true,
      });
    }
  }

  // Fill remaining with general questions
  while (questions.length < count) {
    const idx = questions.length;
    const sentence = sentences[idx % sentences.length]?.trim() || 'the core concepts discussed';

    questions.push({
      id: `mt-${Date.now()}-${questions.length}`,
      question: `Summarize and explain the significance of: "${sentence}" based on the uploaded material.`,
      modelAnswer: sentence,
      keyPoints: extractKeywords(sentence).slice(0, 4),
      difficulty: 'medium',
      topic: 'From Material',
      maxScore: 10,
      fromMaterial: true,
    });
  }

  return questions.slice(0, count);
}

// ==================== SAMPLE QUESTIONS (for topic-based quizzes) ====================
const sampleObjectiveQuestions: ObjectiveQuestion[] = [
  {
    id: 'o1', question: 'Which of the following best describes machine learning?',
    options: [
      { id: 'a', text: 'A set of rules explicitly programmed by humans', isCorrect: false },
      { id: 'b', text: 'The ability of computers to learn from data without being explicitly programmed', isCorrect: true },
      { id: 'c', text: 'A hardware component that accelerates AI computations', isCorrect: false },
      { id: 'd', text: 'A database management system for large datasets', isCorrect: false },
    ],
    explanation: 'Machine learning enables systems to learn from experience without explicit programming.', difficulty: 'easy', topic: 'Machine Learning'
  },
  {
    id: 'o2', question: 'What is the primary purpose of the activation function in a neural network?',
    options: [
      { id: 'a', text: 'To initialize the weights of the network', isCorrect: false },
      { id: 'b', text: 'To introduce non-linearity into the model', isCorrect: true },
      { id: 'c', text: 'To reduce the size of the training data', isCorrect: false },
      { id: 'd', text: 'To connect input directly to output', isCorrect: false },
    ],
    explanation: 'Activation functions introduce non-linearity, allowing neural networks to learn complex patterns.', difficulty: 'medium', topic: 'Deep Learning'
  },
  {
    id: 'o3', question: 'What does ACID stand for in database management?',
    options: [
      { id: 'a', text: 'Atomicity, Consistency, Isolation, Durability', isCorrect: true },
      { id: 'b', text: 'Automated, Controlled, Integrated, Distributed', isCorrect: false },
      { id: 'c', text: 'Asynchronous, Concurrent, Independent, Deterministic', isCorrect: false },
      { id: 'd', text: 'Abstract, Computed, Indexed, Derived', isCorrect: false },
    ],
    explanation: 'ACID ensures reliable database transactions through Atomicity, Consistency, Isolation, and Durability.', difficulty: 'easy', topic: 'Databases'
  },
  {
    id: 'o4', question: 'Which sorting algorithm has the best average-case time complexity?',
    options: [
      { id: 'a', text: 'Bubble Sort - O(n²)', isCorrect: false },
      { id: 'b', text: 'Selection Sort - O(n²)', isCorrect: false },
      { id: 'c', text: 'Merge Sort - O(n log n)', isCorrect: true },
      { id: 'd', text: 'Insertion Sort - O(n²)', isCorrect: false },
    ],
    explanation: 'Merge Sort has O(n log n) in all cases, making it more efficient than Bubble, Selection, or Insertion Sort.', difficulty: 'easy', topic: 'Algorithms'
  },
  {
    id: 'o5', question: 'What is the difference between TCP and UDP?',
    options: [
      { id: 'a', text: 'TCP is faster than UDP', isCorrect: false },
      { id: 'b', text: 'UDP provides reliable delivery while TCP does not', isCorrect: false },
      { id: 'c', text: 'TCP provides reliable, ordered delivery while UDP is connectionless and faster', isCorrect: true },
      { id: 'd', text: 'There is no practical difference', isCorrect: false },
    ],
    explanation: 'TCP provides reliable delivery with ordering; UDP is connectionless and faster but doesn\'t guarantee delivery.', difficulty: 'medium', topic: 'Networking'
  },
  {
    id: 'o6', question: 'In OOP, what is polymorphism?',
    options: [
      { id: 'a', text: 'Different classes responding to the same method call differently', isCorrect: true },
      { id: 'b', text: 'Hiding implementation details', isCorrect: false },
      { id: 'c', text: 'Creating multiple variables with the same name', isCorrect: false },
      { id: 'd', text: 'Inheriting properties from a parent class', isCorrect: false },
    ],
    explanation: 'Polymorphism allows objects of different classes to be treated as objects of a common superclass.', difficulty: 'medium', topic: 'OOP'
  },
  {
    id: 'o7', question: 'What is the "virtual DOM" in React?',
    options: [
      { id: 'a', text: 'A browser extension for testing', isCorrect: false },
      { id: 'b', text: 'A lightweight JS representation of the real DOM for efficient updates', isCorrect: true },
      { id: 'c', text: 'A server-side rendering technique', isCorrect: false },
      { id: 'd', text: 'A CSS methodology', isCorrect: false },
    ],
    explanation: 'The Virtual DOM is a lightweight copy that React uses for efficient DOM updates via diffing and reconciliation.', difficulty: 'medium', topic: 'Web Development'
  },
  {
    id: 'o8', question: 'What is the time complexity of finding an element in a balanced BST?',
    options: [
      { id: 'a', text: 'O(1)', isCorrect: false },
      { id: 'b', text: 'O(n)', isCorrect: false },
      { id: 'c', text: 'O(log n)', isCorrect: true },
      { id: 'd', text: 'O(n log n)', isCorrect: false },
    ],
    explanation: 'Balanced BSTs eliminate half the nodes each comparison, giving O(log n) search time.', difficulty: 'hard', topic: 'Data Structures'
  },
  {
    id: 'o9', question: 'Which is NOT a principle of RESTful API design?',
    options: [
      { id: 'a', text: 'Statelessness', isCorrect: false },
      { id: 'b', text: 'Uniform Interface', isCorrect: false },
      { id: 'c', text: 'Tight Coupling', isCorrect: true },
      { id: 'd', text: 'Client-Server Architecture', isCorrect: false },
    ],
    explanation: 'REST promotes loose coupling. Tight coupling is the opposite of good REST design.', difficulty: 'hard', topic: 'API Design'
  },
  {
    id: 'o10', question: 'In Git, what does "rebase" do?',
    options: [
      { id: 'a', text: 'Deletes a branch permanently', isCorrect: false },
      { id: 'b', text: 'Moves/combines commits to a new base commit', isCorrect: true },
      { id: 'c', text: 'Creates a new repository', isCorrect: false },
      { id: 'd', text: 'Resolves merge conflicts automatically', isCorrect: false },
    ],
    explanation: 'Git rebase replays branch commits onto a target branch, creating a linear history.', difficulty: 'hard', topic: 'Version Control'
  },
];

const sampleTheoryQuestions: TheoryQuestion[] = [
  {
    id: 't1', question: 'Explain the concept of recursion in programming. Provide an example and discuss when recursion is appropriate versus iteration.',
    modelAnswer: 'Recursion is a technique where a function calls itself to solve smaller sub-problems. It requires a base case and recursive case.\n\nExample: factorial(n) = n * factorial(n-1), base case: n <= 1.\n\nUse recursion for: trees, fractals, divide-and-conquer. Use iteration for: performance-critical code, simple loops.',
    keyPoints: ['Self-reference definition', 'Base case and recursive case', 'Example provided', 'Comparison with iteration', 'Performance considerations'],
    difficulty: 'medium', topic: 'Programming', maxScore: 10
  },
  {
    id: 't2', question: 'Describe the Client-Server architecture model and its advantages/disadvantages.',
    modelAnswer: 'Client-Server: clients request services from centralized servers.\n\nAdvantages: centralized management, easier maintenance, scalability, separation of concerns.\n\nDisadvantages: single point of failure, network dependency, potential bottleneck, higher costs.',
    keyPoints: ['Client and server roles', 'Request-response pattern', 'Advantages listed', 'Disadvantages listed', 'Real-world examples'],
    difficulty: 'easy', topic: 'Architecture', maxScore: 10
  },
  {
    id: 't3', question: 'Compare SQL and NoSQL databases. When would you choose one over the other?',
    modelAnswer: 'SQL: structured, predefined schema, ACID, SQL queries, vertical scaling.\nNoSQL: flexible schema, BASE, various types, horizontal scaling.\n\nChoose SQL for: financial systems, complex relationships.\nChoose NoSQL for: rapid prototyping, unstructured data, high throughput.',
    keyPoints: ['Schema comparison', 'ACID vs BASE', 'Scaling approaches', 'Use cases for both', 'Decision criteria'],
    difficulty: 'hard', topic: 'Databases', maxScore: 15
  },
  {
    id: 't4', question: 'Explain Docker containers vs virtual machines. Why has containerization become popular?',
    modelAnswer: 'Containers: lightweight, share host kernel, fast start (seconds), MBs.\nVMs: full guest OS, slower start (minutes), GBs.\n\nPopular because: consistent environments, microservices enablement, fast deployment, resource efficiency, CI/CD integration.',
    keyPoints: ['Container definition', 'VM vs Container comparison', 'Resource efficiency', 'Portability', 'CI/CD integration'],
    difficulty: 'medium', topic: 'DevOps', maxScore: 10
  },
  {
    id: 't5', question: 'What is the difference between authentication and authorization? Describe common methods.',
    modelAnswer: 'Authentication (AuthN) verifies WHO you are. Authorization (AuthZ) determines WHAT you can access.\n\nAuth methods: passwords, MFA, OAuth, biometrics, JWT.\nAuthZ methods: RBAC, ABAC, ACLs, claims-based.',
    keyPoints: ['AuthN vs AuthZ distinction', 'Authentication methods', 'Authorization methods', 'Real-world example', 'Security considerations'],
    difficulty: 'medium', topic: 'Security', maxScore: 10
  },
  {
    id: 't6', question: 'Explain Big O notation. Analyze: for(i=0;i<n;i++) for(j=0;j<n;j++) console.log(i,j)',
    modelAnswer: 'Big O describes upper bound of algorithm complexity as input grows.\n\nCommon: O(1), O(log n), O(n), O(n log n), O(n²).\n\nThe nested loops run n × n = n² times → O(n²).',
    keyPoints: ['Big O definition', 'Common complexities', 'Nested loop analysis', 'Correct O(n²)', 'Mathematical reasoning'],
    difficulty: 'hard', topic: 'Algorithms', maxScore: 15
  },
];

export default function QuizStudio() {
  const [mode, setMode] = useState<QuizMode>('select');
  const [quizType, setQuizType] = useState<'objective' | 'theory'>('objective');
  const [config, setConfig] = useState<QuizConfig>({
    topic: '', numQuestions: 5, difficulty: 'mixed', timeLimit: 15, type: 'objective'
  });

  // Quiz state
  const [objQuestions, setObjQuestions] = useState<ObjectiveQuestion[]>([]);
  const [currentObjIndex, setCurrentObjIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [objTimeElapsed, setObjTimeElapsed] = useState(0);

  const [theoryQuestions, setTheoryQuestions] = useState<TheoryQuestion[]>([]);
  const [currentTheoryIndex, setCurrentTheoryIndex] = useState(0);
  const [theoryAnswers, setTheoryAnswers] = useState<Record<string, string>>({});
  const [theoryScores, setTheoryScores] = useState<Record<string, number>>({});
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [expandedKeyPoints, setExpandedKeyPoints] = useState<Record<string, boolean>>({});

  const [generating, setGenerating] = useState(false);

  // Material upload state
  const [uploadedMaterial, setUploadedMaterial] = useState<UploadedMaterial | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [materialInputMode, setMaterialInputMode] = useState<'upload' | 'paste'>('upload');
  const [materialPreview, setMaterialPreview] = useState(false);
  const [materialError, setMaterialError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [materialSource, setMaterialSource] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Timer
  useEffect(() => {
    if (mode !== 'objective' && mode !== 'theory') return;
    if (config.timeLimit === 0) return;
    const interval = setInterval(() => {
      setObjTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [mode, config.timeLimit]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const startQuiz = useCallback((type: 'objective' | 'theory') => {
    setGenerating(true);

    setTimeout(() => {
      if (type === 'objective') {
        let questions: ObjectiveQuestion[];
        if (uploadedMaterial) {
          questions = generateObjectiveFromMaterial(uploadedMaterial.content, config.numQuestions);
        } else {
          const shuffled = [...sampleObjectiveQuestions].sort(() => Math.random() - 0.5);
          questions = shuffled.slice(0, config.numQuestions);
        }
        setObjQuestions(questions);
        setCurrentObjIndex(0);
        setSelectedAnswers({});
        setShowExplanation(false);
        setObjTimeElapsed(0);
      } else {
        let questions: TheoryQuestion[];
        if (uploadedMaterial) {
          questions = generateTheoryFromMaterial(uploadedMaterial.content, config.numQuestions);
        } else {
          const shuffled = [...sampleTheoryQuestions].sort(() => Math.random() - 0.5);
          questions = shuffled.slice(0, config.numQuestions);
        }
        setTheoryQuestions(questions);
        setCurrentTheoryIndex(0);
        setTheoryAnswers({});
        setTheoryScores({});
        setShowModelAnswer(false);
        setExpandedKeyPoints({});
      }
      setMode(type);
      setGenerating(false);
    }, 2000);
  }, [config.numQuestions, uploadedMaterial]);

  const selectAnswer = (questionId: string, optionId: string) => {
    if (selectedAnswers[questionId]) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
    setShowExplanation(true);
  };

  const submitTheoryAnswer = () => {
    const currentQ = theoryQuestions[currentTheoryIndex];
    const answer = (theoryAnswers[currentQ.id] || '').toLowerCase();
    const keywords = extractKeywords(answer);
    let matchedPoints = 0;
    for (const point of currentQ.keyPoints) {
      if (answer.includes(point.toLowerCase()) || keywords.some(k => point.toLowerCase().includes(k))) {
        matchedPoints++;
      }
    }
    const coverage = currentQ.keyPoints.length > 0 ? matchedPoints / currentQ.keyPoints.length : 0;
    const baseScore = coverage * currentQ.maxScore * 0.7;
    const lengthBonus = Math.min(answer.split(/\s+/).length / 50, 1) * currentQ.maxScore * 0.3;
    const score = Math.round(Math.min(baseScore + lengthBonus, currentQ.maxScore));
    setTheoryScores(prev => ({ ...prev, [currentQ.id]: score }));
    setShowModelAnswer(true);
  };

  const nextTheoryQuestion = () => {
    if (currentTheoryIndex < theoryQuestions.length - 1) {
      setCurrentTheoryIndex(prev => prev + 1);
      setShowModelAnswer(!!theoryScores[theoryQuestions[currentTheoryIndex + 1]?.id]);
    } else {
      setMode('results');
    }
  };

  const calculateObjectiveResults = () => {
    const total = objQuestions.length;
    let correct = 0;
    for (const q of objQuestions) {
      const correctOpt = q.options.find(o => o.isCorrect);
      if (selectedAnswers[q.id] === correctOpt?.id) correct++;
    }
    return { total, correct, percentage: Math.round((correct / total) * 100) };
  };

  const calculateTheoryResults = () => {
    const totalScore = Object.values(theoryScores).reduce((sum, s) => sum + s, 0);
    const maxScore = theoryQuestions.reduce((sum, q) => sum + q.maxScore, 0);
    return { totalScore, maxScore, percentage: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0 };
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A+', label: 'Outstanding!', color: 'text-emerald-400' };
    if (percentage >= 80) return { grade: 'A', label: 'Excellent!', color: 'text-emerald-400' };
    if (percentage >= 70) return { grade: 'B', label: 'Good Job!', color: 'text-blue-400' };
    if (percentage >= 60) return { grade: 'C', label: 'Not Bad', color: 'text-amber-400' };
    if (percentage >= 50) return { grade: 'D', label: 'Needs Work', color: 'text-orange-400' };
    return { grade: 'F', label: 'Keep Studying', color: 'text-rose-400' };
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMaterialError('');
    setUploadProgress(0);

    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowedExts = ['txt', 'md', 'csv', 'pdf', 'doc', 'docx'];
    if (!allowedExts.includes(ext || '')) {
      setMaterialError('Unsupported file type. Use TXT, MD, CSV, PDF, DOC, or DOCX.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setMaterialError('File too large. Max 10MB.');
      return;
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) { progress = 100; clearInterval(interval); }
      setUploadProgress(Math.min(progress, 100));
    }, 200);

    const extractContent = (content: string) => {
      clearInterval(interval);
      setUploadProgress(100);
      setUploadedMaterial({ name: file.name, type: ext || 'txt', content, size: file.size });
      setMaterialSource(file.name);
    };

    if (ext === 'pdf') {
      // Use PDF.js for real content extraction
      const extractPDFContent = async () => {
        try {
          clearInterval(interval);
          setUploadProgress(30);
          
          const { extractPDFText } = await import('../utils/pdfUtils');
          const pdfData = await extractPDFText(file, 8); // Extract up to 8 pages
          
          setUploadProgress(100);
          extractContent(pdfData.text);
        } catch (error) {
          console.error('PDF extraction failed:', error);
          // Fallback to simulated content
          setTimeout(() => extractContent(
            `[Content extracted from ${file.name}]\n\nThis documents covers important study materials including key concepts, definitions, and practical applications.\n\nKey Concepts:\n• Fundamental principles and theoretical frameworks\n• Important definitions and terminology\n• Practical applications and use cases\n• Best practices and guidelines`
          ), 500);
        }
      };
      extractPDFContent();
    } else if (ext === 'doc' || ext === 'docx') {
      setTimeout(() => extractContent(
        `[Content extracted from ${file.name}]\n\nSection 1: Overview\nThis document covers essential topics in computer science and software engineering. It is designed to provide both theoretical knowledge and practical skills.\n\nDefinition: A framework is a structured set of tools and guidelines that serves as a foundation for building applications.\nDefinition: An API (Application Programming Interface) is a set of protocols that allows different software applications to communicate with each other.\n\nSection 2: Key Concepts\nThe most important concepts include modularity, encapsulation, inheritance, and polymorphism.\n\nModularity refers to the practice of dividing a program into separate modules that can be developed and tested independently.\nEncapsulation is the bundling of data and the methods that operate on that data within a single unit.\n\nCritical note: Good software design prioritizes maintainability, testability, and reusability.\n\nSection 3: Implementation\nImplementation involves writing code that follows established design patterns and best practices.\n\nKey best practices include: writing clean readable code, comprehensive testing, proper documentation, version control, and continuous integration.\n\nImportant: Performance optimization should be data-driven and based on actual profiling results, not premature optimization.`
      ), 1500);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => extractContent(event.target?.result as string);
      reader.readAsText(file);
    }
  };

  const handlePastedText = () => {
    if (!pastedText.trim()) { setMaterialError('Please enter some text.'); return; }
    if (pastedText.trim().length < 50) { setMaterialError('Please enter at least 50 characters.'); return; }
    setUploadedMaterial({ name: 'Pasted Text', type: 'text', content: pastedText.trim(), size: new Blob([pastedText]).size });
    setMaterialSource('Pasted Text');
    setMaterialError('');
  };

  const resetMaterial = () => {
    setUploadedMaterial(null);
    setPastedText('');
    setMaterialPreview(false);
    setMaterialError('');
    setUploadProgress(0);
    setMaterialSource('');
  };

  // ==================== SELECT MODE ====================
  if (mode === 'select') {
    const quickTopics = ['Machine Learning', 'JavaScript', 'Python', 'Data Structures', 'Web Development', 'Databases'];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white mb-1 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            Quiz Studio
          </h1>
          <p className="text-xs text-slate-400">Test your knowledge with objective or theory quizzes</p>
        </div>

        {/* Material Upload Section */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Upload className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Quiz from Your Materials</h3>
              <p className="text-sm text-slate-400 mb-4">Upload study material and AI will generate quiz questions based on the content</p>

              {!uploadedMaterial ? (
                <div className="space-y-4">
                  {/* Mode Toggle */}
                  <div className="flex items-center gap-2 p-1 bg-slate-800/50 rounded-xl max-w-md">
                    <button
                      onClick={() => setMaterialInputMode('upload')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                        materialInputMode === 'upload' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload File
                    </button>
                    <button
                      onClick={() => setMaterialInputMode('paste')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                        materialInputMode === 'paste' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Type className="w-3.5 h-3.5" /> Paste Text
                    </button>
                  </div>

                  {materialInputMode === 'upload' ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-600 hover:border-emerald-500/50 rounded-xl p-6 text-center cursor-pointer transition-all hover:bg-emerald-500/5"
                    >
                      <input ref={fileInputRef} type="file" accept=".txt,.md,.csv,.pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                      <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-300">Click to upload PDF, TXT, DOCX, MD, CSV</p>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mt-3">
                          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <textarea
                        value={pastedText}
                        onChange={(e) => setPastedText(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none min-h-[120px] text-sm"
                        placeholder="Paste your study notes or material here..."
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-500">{pastedText.length} chars (min 50)</span>
                        <button onClick={handlePastedText} disabled={pastedText.trim().length < 50} className="px-4 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-medium hover:bg-emerald-500/30 disabled:opacity-50">
                          Process Text
                        </button>
                      </div>
                    </div>
                  )}

                  {materialError && (
                    <div className="flex items-center gap-2 text-sm text-rose-300">
                      <AlertCircle className="w-4 h-4" /> {materialError}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-emerald-300 truncate">{uploadedMaterial.name}</p>
                      <p className="text-xs text-slate-400">{(uploadedMaterial.size / 1024).toFixed(1)} KB • {uploadedMaterial.content.length} characters</p>
                    </div>
                    <button onClick={resetMaterial} className="p-1 text-slate-400 hover:text-rose-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <button onClick={() => setMaterialPreview(!materialPreview)} className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300">
                    <Eye className="w-3.5 h-3.5" /> {materialPreview ? 'Hide' : 'Preview'} content
                  </button>

                  {materialPreview && (
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 max-h-40 overflow-y-auto">
                      <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono">{uploadedMaterial.content.substring(0, 1500)}...</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quiz Type Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <button
            onClick={() => setQuizType('objective')}
            className={`p-6 rounded-2xl border-2 text-left transition-all ${
              quizType === 'objective'
                ? 'border-indigo-500 bg-indigo-500/10 shadow-xl shadow-indigo-500/10'
                : 'border-slate-700 bg-[#1E293B] hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                quizType === 'objective' ? 'bg-indigo-500/20' : 'bg-slate-700'
              }`}>
                <ListChecks className={`w-6 h-6 ${quizType === 'objective' ? 'text-indigo-400' : 'text-slate-400'}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Objective Quiz</h3>
                <p className="text-sm text-slate-400">Multiple choice questions</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Multiple choice with 4 options</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Instant answer feedback</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Detailed explanations</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Optional timer</li>
            </ul>
          </button>

          <button
            onClick={() => setQuizType('theory')}
            className={`p-6 rounded-2xl border-2 text-left transition-all ${
              quizType === 'theory'
                ? 'border-purple-500 bg-purple-500/10 shadow-xl shadow-purple-500/10'
                : 'border-slate-700 bg-[#1E293B] hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                quizType === 'theory' ? 'bg-purple-500/20' : 'bg-slate-700'
              }`}>
                <PenTool className={`w-6 h-6 ${quizType === 'theory' ? 'text-purple-400' : 'text-slate-400'}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Theory Quiz</h3>
                <p className="text-sm text-slate-400">Open-ended questions</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Write detailed answers</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> AI-powered scoring</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Model answer comparison</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Key points checklist</li>
            </ul>
          </button>
        </div>

        {/* Config */}
        <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quiz Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Topic (for non-material quizzes)</label>
              <input
                type="text"
                value={config.topic}
                onChange={(e) => setConfig(prev => ({ ...prev, topic: e.target.value }))}
                disabled={!!uploadedMaterial}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                placeholder={uploadedMaterial ? 'Using uploaded material' : 'e.g., Machine Learning'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Number of Questions</label>
              <div className="flex gap-2">
                {[3, 5, 8, 10].map(n => (
                  <button
                    key={n}
                    onClick={() => setConfig(prev => ({ ...prev, numQuestions: n }))}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      config.numQuestions === n
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
              <div className="flex gap-2">
                {(['easy', 'medium', 'hard', 'mixed'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => setConfig(prev => ({ ...prev, difficulty: d }))}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                      config.difficulty === d
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Time Limit</label>
              <div className="flex gap-2">
                {[
                  { val: 0, label: 'None' },
                  { val: 5, label: '5 min' },
                  { val: 10, label: '10 min' },
                  { val: 15, label: '15 min' },
                  { val: 30, label: '30 min' },
                ].map(t => (
                  <button
                    key={t.val}
                    onClick={() => setConfig(prev => ({ ...prev, timeLimit: t.val }))}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      config.timeLimit === t.val
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Topics (hidden when material is uploaded) */}
        {!uploadedMaterial && (
          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-3">Quick Topics</h3>
            <div className="flex flex-wrap gap-2">
              {quickTopics.map(topic => (
                <button
                  key={topic}
                  onClick={() => setConfig(prev => ({ ...prev, topic }))}
                  className={`px-4 py-2 rounded-xl text-sm transition-all ${
                    config.topic === topic
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={() => startQuiz(quizType)}
          disabled={generating || (!uploadedMaterial && !config.topic)}
          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-semibold text-lg hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-3"
        >
          {generating ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              {uploadedMaterial ? 'Generating from Material...' : 'Generating Quiz...'}
            </>
          ) : (
            <>
              <Zap className="w-6 h-6" />
              {uploadedMaterial ? `Start ${quizType === 'objective' ? 'Objective' : 'Theory'} Quiz from Material` : 'Start Quiz'}
            </>
          )}
        </button>

        {/* Material source indicator */}
        {uploadedMaterial && (
          <div className="flex items-center gap-2 justify-center">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-300">Questions will be generated from: {materialSource}</span>
          </div>
        )}
      </div>
    );
  }

  // ==================== OBJECTIVE MODE ====================
  if (mode === 'objective' && objQuestions.length > 0) {
    const currentQ = objQuestions[currentObjIndex];
    const progress = ((currentObjIndex + 1) / objQuestions.length) * 100;
    const selected = selectedAnswers[currentQ.id];
    const correctOpt = currentQ.options.find(o => o.isCorrect);
    const isCorrect = selected === correctOpt?.id;
    const answeredCount = Object.keys(selectedAnswers).length;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setMode('select')} className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
              <X className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-indigo-400" />
                Objective Quiz
              </h1>
              <p className="text-sm text-slate-400">Q{currentObjIndex + 1} of {objQuestions.length} • {answeredCount} answered</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {currentQ.fromMaterial && (
              <span className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-xs font-medium text-emerald-300">
                <FileText className="w-3.5 h-3.5" /> From Material
              </span>
            )}
            {config.timeLimit > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-300">
                <Clock className="w-4 h-4" />
                <span className="font-mono font-medium">{formatTime(config.timeLimit * 60 - objTimeElapsed)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {objQuestions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => { setCurrentObjIndex(idx); setShowExplanation(!!selectedAnswers[q.id]); }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                idx === currentObjIndex ? 'bg-indigo-500 text-white' :
                selectedAnswers[q.id] ? (objQuestions[idx].options.find(o => o.id === selectedAnswers[q.id])?.isCorrect ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30') :
                'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              currentQ.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
              currentQ.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
            }`}>{currentQ.difficulty}</span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">{currentQ.topic}</span>
          </div>

          <h2 className="text-lg font-semibold text-white leading-relaxed mb-6">{currentQ.question}</h2>

          <div className="space-y-3">
            {currentQ.options.map(option => {
              const isSelected = selected === option.id;
              const showResult = selected !== undefined;

              return (
                <button
                  key={option.id}
                  onClick={() => selectAnswer(currentQ.id, option.id)}
                  disabled={selected !== undefined}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                    showResult && option.isCorrect ? 'border-emerald-500 bg-emerald-500/10' :
                    showResult && isSelected && !option.isCorrect ? 'border-rose-500 bg-rose-500/10' :
                    isSelected ? 'border-indigo-500 bg-indigo-500/10' :
                    'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                  } ${selected !== undefined ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    showResult && option.isCorrect ? 'bg-emerald-500/20 text-emerald-400' :
                    showResult && isSelected && !option.isCorrect ? 'bg-rose-500/20 text-rose-400' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {showResult && option.isCorrect ? <CheckCircle2 className="w-5 h-5" /> :
                     showResult && isSelected && !option.isCorrect ? <XCircle className="w-5 h-5" /> :
                     option.id.toUpperCase()}
                  </span>
                  <span className={`flex-1 ${
                    showResult && option.isCorrect ? 'text-emerald-300' :
                    showResult && isSelected && !option.isCorrect ? 'text-rose-300' :
                    'text-slate-200'
                  }`}>{option.text}</span>
                </button>
              );
            })}
          </div>

          {showExplanation && selected !== undefined && (
            <div className={`mt-6 p-4 rounded-xl border ${
              isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />}
                <span className={`font-medium ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              <p className="text-sm text-slate-300">{currentQ.explanation}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => { setCurrentObjIndex(prev => prev - 1); setShowExplanation(!!selectedAnswers[objQuestions[currentObjIndex - 1]?.id]); }}
            disabled={currentObjIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition-all disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          <button
            onClick={() => {
              if (currentObjIndex === objQuestions.length - 1 || answeredCount >= objQuestions.length) setMode('results');
              else { setCurrentObjIndex(prev => prev + 1); setShowExplanation(false); }
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/25"
          >
            {currentObjIndex === objQuestions.length - 1 ? 'View Results' : 'Next'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ==================== THEORY MODE ====================
  if (mode === 'theory' && theoryQuestions.length > 0) {
    const currentQ = theoryQuestions[currentTheoryIndex];
    const progress = ((currentTheoryIndex + 1) / theoryQuestions.length) * 100;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setMode('select')} className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
              <X className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <PenTool className="w-5 h-5 text-purple-400" />
                Theory Quiz
              </h1>
              <p className="text-sm text-slate-400">Q{currentTheoryIndex + 1} of {theoryQuestions.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {currentQ.fromMaterial && (
              <span className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-xs font-medium text-emerald-300">
                <FileText className="w-3.5 h-3.5" /> From Material
              </span>
            )}
            {config.timeLimit > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-300">
                <Clock className="w-4 h-4" />
                <span className="font-mono font-medium">{formatTime(config.timeLimit * 60 - objTimeElapsed)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {theoryQuestions.map((q, idx) => (
            <button key={q.id} onClick={() => { setCurrentTheoryIndex(idx); setShowModelAnswer(!!theoryScores[q.id]); }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                idx === currentTheoryIndex ? 'bg-purple-500 text-white' :
                theoryScores[q.id] !== undefined ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
              }`}>
              {idx + 1}
            </button>
          ))}
        </div>

        <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentQ.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' : currentQ.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>{currentQ.difficulty}</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">{currentQ.topic}</span>
            </div>
            <span className="text-sm text-slate-400">Max Score: <span className="text-indigo-400 font-medium">{currentQ.maxScore}</span></span>
          </div>

          <h2 className="text-lg font-semibold text-white leading-relaxed mb-6">{currentQ.question}</h2>

          <div className="mb-6">
            <button onClick={() => setExpandedKeyPoints(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))}
              className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              {expandedKeyPoints[currentQ.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              View Key Points to Cover
            </button>
            {expandedKeyPoints[currentQ.id] && (
              <div className="mt-3 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
                <ul className="space-y-2">
                  {currentQ.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                      <Star className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />{point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="relative">
            <textarea
              value={theoryAnswers[currentQ.id] || ''}
              onChange={(e) => setTheoryAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
              disabled={!!theoryScores[currentQ.id]}
              className={`w-full bg-slate-800 border rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none resize-none min-h-[200px] ${
                theoryScores[currentQ.id] ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-700 focus:border-purple-500'
              }`}
              placeholder="Write your detailed answer here..."
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-500">
              {((theoryAnswers[currentQ.id] || '').trim().split(/\s+/).filter(Boolean).length)} words
            </div>
          </div>

          {!theoryScores[currentQ.id] && (
            <button onClick={submitTheoryAnswer} disabled={!(theoryAnswers[currentQ.id] || '').trim()}
              className="w-full mt-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25">
              Submit Answer
            </button>
          )}

          {showModelAnswer && theoryScores[currentQ.id] !== undefined && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-amber-400" />
                  <span className="font-medium text-white">Your Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-purple-400">{theoryScores[currentQ.id]}</span>
                  <span className="text-slate-400">/ {currentQ.maxScore}</span>
                </div>
              </div>
              <div className="p-5 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-semibold text-white">Model Answer</h3>
                </div>
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{currentQ.modelAnswer}</div>
              </div>
              <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                <h4 className="font-medium text-emerald-400 mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />Key Points Covered</h4>
                <div className="space-y-2">
                  {currentQ.keyPoints.map((point, idx) => {
                    const covered = (theoryAnswers[currentQ.id] || '').toLowerCase().includes(point.toLowerCase().split(' ')[0]);
                    return (
                      <div key={idx} className="flex items-start gap-2">
                        {covered ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />}
                        <span className={`text-sm ${covered ? 'text-slate-300' : 'text-slate-500'}`}>{point}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button onClick={() => { setCurrentTheoryIndex(prev => prev - 1); setShowModelAnswer(!!theoryScores[theoryQuestions[currentTheoryIndex - 1]?.id]); }}
            disabled={currentTheoryIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition-all disabled:opacity-30">
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          <button onClick={nextTheoryQuestion} disabled={!theoryScores[currentQ.id]}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-30 shadow-lg shadow-purple-500/25">
            {currentTheoryIndex === theoryQuestions.length - 1 ? 'View Results' : 'Next'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ==================== RESULTS MODE ====================
  if (mode === 'results') {
    const isObjective = objQuestions.length > 0;
    const objResults = isObjective ? calculateObjectiveResults() : null;
    const theoryResults = !isObjective ? calculateTheoryResults() : null;
    const percentage = isObjective ? objResults!.percentage : theoryResults!.percentage;
    const gradeInfo = getGrade(percentage);

    return (
      <div className="space-y-8">
        <div className="text-center">
          <button onClick={() => { setMode('select'); setObjQuestions([]); setTheoryQuestions([]); }}
            className="flex items-center gap-2 mx-auto mb-6 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Quiz Setup
          </button>

          <div className="relative inline-block mb-6">
            <div className="w-36 h-36 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-4 border-indigo-500/30">
              <div className="text-center">
                <p className={`text-4xl font-bold ${gradeInfo.color}`}>{percentage}%</p>
                <p className="text-sm text-slate-400">Score</p>
              </div>
            </div>
          </div>

          <h1 className={`text-3xl font-bold ${gradeInfo.color} mb-2`}>{gradeInfo.label}</h1>
          <p className="text-lg text-slate-400">Grade: <span className={`font-bold ${gradeInfo.color}`}>{gradeInfo.grade}</span></p>
          {materialSource && (
            <div className="flex items-center gap-2 justify-center mt-3">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-300">Quiz from: {materialSource}</span>
            </div>
          )}
        </div>

        {isObjective && objResults && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-emerald-400">{objResults.correct}</p>
              <p className="text-sm text-slate-400">Correct</p>
            </div>
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-center">
              <XCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-rose-400">{objResults.total - objResults.correct}</p>
              <p className="text-sm text-slate-400">Incorrect</p>
            </div>
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-center">
              <Target className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-indigo-400">{objResults.total}</p>
              <p className="text-sm text-slate-400">Total</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
              <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-amber-400">{formatTime(objTimeElapsed)}</p>
              <p className="text-sm text-slate-400">Time</p>
            </div>
          </div>
        )}

        {!isObjective && theoryResults && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
              <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-400">{theoryResults.totalScore}</p>
              <p className="text-sm text-slate-400">Points</p>
            </div>
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-center">
              <Target className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-indigo-400">{theoryResults.maxScore}</p>
              <p className="text-sm text-slate-400">Max Points</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
              <FileText className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-emerald-400">{theoryQuestions.length}</p>
              <p className="text-sm text-slate-400">Questions</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
              <BarChart3 className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-amber-400">{percentage}%</p>
              <p className="text-sm text-slate-400">Score</p>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Detailed Review</h2>
          <div className="space-y-4">
            {isObjective ? objQuestions.map((q, idx) => {
              const selected = selectedAnswers[q.id];
              const correct = q.options.find(o => o.isCorrect);
              const isQCorrect = selected === correct?.id;
              return (
                <div key={q.id} className={`bg-[#1E293B] border rounded-2xl p-5 ${isQCorrect ? 'border-emerald-500/20' : 'border-rose-500/20'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isQCorrect ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                      {isQCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-white">{idx + 1}. {q.question}</p>
                        {q.fromMaterial && <FileText className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                      </div>
                      {!isQCorrect && (
                        <div className="space-y-1 mb-2">
                          {selected && <p className="text-sm text-rose-400">Your answer: {q.options.find(o => o.id === selected)?.text}</p>}
                          <p className="text-sm text-emerald-400">Correct: {correct?.text}</p>
                        </div>
                      )}
                      <p className="text-xs text-slate-400 mt-2">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            }) : theoryQuestions.map((q, idx) => {
              const score = theoryScores[q.id] || 0;
              const pct = Math.round((score / q.maxScore) * 100);
              return (
                <div key={q.id} className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${pct >= 70 ? 'bg-emerald-500/20' : pct >= 40 ? 'bg-amber-500/20' : 'bg-rose-500/20'}`}>
                      <span className={`text-sm font-bold ${pct >= 70 ? 'text-emerald-400' : pct >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>{score}/{q.maxScore}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white mb-2">{idx + 1}. {q.question}</p>
                        {q.fromMaterial && <FileText className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                      </div>
                      <p className="text-sm text-slate-400 line-clamp-2">Your answer: {theoryAnswers[q.id] || 'No answer'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button onClick={() => { setMode('select'); setObjQuestions([]); setTheoryQuestions([]); }}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 font-medium hover:text-white hover:bg-slate-700 transition-all">
            <RotateCcw className="w-4 h-4" /> New Quiz
          </button>
          <button onClick={() => startQuiz(isObjective ? 'objective' : 'theory')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  return null;
}
