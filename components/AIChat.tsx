import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Upload, 
  FileText, 
  Sparkles, 
  Copy, 
  RotateCcw, 
  X,
  GraduationCap,
  Lightbulb,
  Bookmark,
  Zap,
  MessageSquare,
  ArrowRight,
  Search,
  Code2,
  Atom,
  BookOpen,
  Compass,
  Sigma
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
}

const suggestedQuestions = [
  "Explain quantum computing in simple terms",
  "What are the key concepts of machine learning?",
  "How does blockchain technology work?",
  "Help me understand neural networks",
  "Explain recursion with examples",
];

const quickPrompts = [
  { icon: Lightbulb, text: "Explain this concept", color: "text-amber-400" },
  { icon: Bookmark, text: "Create a summary", color: "text-blue-400" },
  { icon: GraduationCap, text: "Quiz me on this", color: "text-emerald-400" },
  { icon: Sparkles, text: "Generate examples", color: "text-purple-400" },
];

const modelInfo = {
  gemini: {
    name: 'Gemini 1.5 Pro',
    description: "Google's flagship reasoning model. Excels at complex, multi-step problem solving, math, coding, and in-depth conceptual explanations with analogies.",
    icon: Zap,
    color: 'from-blue-500 via-purple-600 to-violet-600',
    borderColor: 'border-purple-500/30',
    shadowColor: 'shadow-purple-500/20',
    badgeText: '1.5 Pro',
    badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    intro: `Hello! I'm **Gemini**, your advanced AI learning companion. ✨
I'm powered by Google's most capable model and specialize in breaking down complex topics with clarity, precision, and depth.

**What I can help you with:**
• Deep conceptual explanations with real-world analogies
• Step-by-step problem solving
• Creating custom quizzes and practice problems
• Analyzing your uploaded study materials
• Generating structured learning paths

**Try asking me anything** — from quantum physics to advanced algorithms.`
  },
  gpt: {
    name: 'GPT-4o',
    description: "OpenAI's state-of-the-art model. Outstanding for general intelligence, writing, text synthesis, and structured brainstorming.",
    icon: Sparkles,
    color: 'from-emerald-400 to-teal-500',
    borderColor: 'border-emerald-500/30',
    shadowColor: 'shadow-emerald-500/20',
    badgeText: 'GPT-4o',
    badgeBg: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    intro: `Hello! I'm **GPT-4o**, your multi-modal AI study assistant. 🚀
I'm powered by OpenAI's flagship model and excel at general reasoning, creative problem solving, and generating well-structured study guides.

**What I can help you with:**
• Writing and debugging code in any language
• Synthesizing complex text into simple summaries
• Explaining multiple viewpoints on historical or philosophical topics
• Helping you brainstorm project ideas and essay outlines

**Ask me anything to get started!**`
  },
  claude: {
    name: 'Claude 3.5 Sonnet',
    description: "Anthropic's highest-intelligence model. Excels at academic writing, long-form text analysis, coding, and highly nuanced explanations.",
    icon: GraduationCap,
    color: 'from-orange-500 to-amber-600',
    borderColor: 'border-amber-500/30',
    shadowColor: 'shadow-amber-500/20',
    badgeText: '3.5 Sonnet',
    badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    intro: `Hello! I'm **Claude 3.5 Sonnet**, your analytical and articulate AI tutor. 🧠
I specialize in deep text analysis, understanding complex documents, and breaking down complicated concepts into nuanced, highly literate, step-by-step explanations.

**What I can help you with:**
• Critiquing and helping you write academic essays
• Explaining complex scientific and philosophical texts
• Reviewing research papers and extracting key methodologies
• Teaching you advanced logical and critical thinking skills

**Paste some text or upload a paper to begin!**`
  },
  llama: {
    name: 'Llama 3',
    description: "Meta's highly capable open model. Great for quick explanations, coding help, rapid fact-checking, and general conversational tutoring.",
    icon: MessageSquare,
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-indigo-500/30',
    shadowColor: 'shadow-indigo-500/20',
    badgeText: '70B Open',
    badgeBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    intro: `Hello! I'm **Llama 3**, your fast and conversational AI study buddy. 🦙
I'm Meta's high-performance open model. I provide rapid, concise explanations and focus on helping you build solid foundations.

**What I can help you with:**
• Quick recall and definition checks
• Rapid-fire study questions
• Explaining concepts in short, direct ways
• Providing alternative perspectives and examples

**What are we studying today? Let me know!**`
  },
  mistral: {
    name: 'Mistral Large',
    description: "Mistral AI's flagship model. Highly efficient at text summarization, rapid information extraction, and clean code generation.",
    icon: FileText,
    color: 'from-rose-500 to-red-600',
    borderColor: 'border-rose-500/30',
    shadowColor: 'shadow-rose-500/20',
    badgeText: 'Large V2',
    badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    intro: `Hello! I'm **Mistral Large**, your fast and efficient European AI study companion. 🌊
I excel at quick explanations, concise summaries, and efficient code generation. I am highly optimized to help you learn quickly without unnecessary fluff.

**What I can help you with:**
• Quick summaries of long text
• Code generation and optimization
• Rapid review before exams
• Explaining technical or scientific concepts efficiently

**Let's get straight to learning! What do you need to know?**`
  },
  perplexity: {
    name: 'Perplexity Sonar',
    description: 'Research-first AI with web-grounded answers, citations, and up-to-date context. Best for current events, source-backed summaries, and fact checks.',
    icon: Search,
    color: 'from-cyan-500 to-teal-600',
    borderColor: 'border-cyan-500/30',
    shadowColor: 'shadow-cyan-500/20',
    badgeText: 'Sonar',
    badgeBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    intro: `Hello! I'm **Perplexity Sonar**, your research-focused AI tutor. 🔎
I specialize in source-aware explanations, current information, and evidence-backed study support.

**What I can help you with:**
• Research summaries with citation-style structure
• Fact-checking and comparing sources
• Current science, technology, and industry trends
• Turning web-like research into study notes

**Ask me a research question or upload a document to begin.**`
  },
  deepseek: {
    name: 'DeepSeek R1',
    description: 'Reasoning-heavy model for math, coding, algorithms, and step-by-step logic. Best when you want transparent problem-solving paths.',
    icon: Sigma,
    color: 'from-red-500 to-rose-600',
    borderColor: 'border-red-500/30',
    shadowColor: 'shadow-red-500/20',
    badgeText: 'R1',
    badgeBg: 'bg-red-500/20 text-red-400 border-red-500/30',
    intro: `Hello! I'm **DeepSeek R1**, your reasoning-focused AI tutor. 🧮
I specialize in step-by-step thinking for math, code, engineering, algorithms, and exam-style logic problems.

**What I can help you with:**
• Solving problems with detailed reasoning
• Debugging code and explaining algorithms
• Breaking down mathematical proofs
• Creating technical practice drills

**Send me a hard problem and I’ll reason through it clearly.**`
  },
  copilot: {
    name: 'Copilot Tutor',
    description: 'Developer-focused assistant for coding lessons, debugging, project planning, and programming language practice.',
    icon: Code2,
    color: 'from-sky-500 to-blue-600',
    borderColor: 'border-sky-500/30',
    shadowColor: 'shadow-sky-500/20',
    badgeText: 'Code',
    badgeBg: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    intro: `Hello! I'm **Copilot Tutor**, your programming-focused AI mentor. 💻
I specialize in coding, debugging, project architecture, and helping you learn programming languages through practice.

**What I can help you with:**
• Explain code line-by-line
• Debug errors and refactor projects
• Generate coding exercises
• Compare frameworks and architecture choices

**Paste code or choose a language to start.**`
  },
  socratic: {
    name: 'Socratic Tutor',
    description: 'Guided learning model that teaches by asking questions instead of giving answers immediately. Great for deep understanding.',
    icon: Lightbulb,
    color: 'from-amber-500 to-yellow-500',
    borderColor: 'border-amber-500/30',
    shadowColor: 'shadow-amber-500/20',
    badgeText: 'Socratic',
    badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    intro: `Hello! I'm **Socratic Tutor**, your guided discovery learning partner. 💡
Rather than just giving answers, I help you reason toward them through targeted questions and hints.

**What I can help you with:**
• Learn by guided questioning
• Prepare for oral exams and interviews
• Build confidence through hints before answers
• Identify gaps in your understanding

**Tell me what topic you want to reason through.**`
  },
  examcoach: {
    name: 'Exam Coach',
    description: 'Assessment-focused AI for practice exams, timed drills, memory checks, and answer feedback.',
    icon: GraduationCap,
    color: 'from-emerald-500 to-green-600',
    borderColor: 'border-emerald-500/30',
    shadowColor: 'shadow-emerald-500/20',
    badgeText: 'Exam',
    badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    intro: `Hello! I'm **Exam Coach**, your assessment-focused AI tutor. 📝
I help you practice under exam-like conditions, identify weak areas, and improve recall.

**What I can help you with:**
• Timed practice questions
• Multiple choice and theory drills
• Weakness analysis and revision plans
• Instant feedback on your answers

**Say 'quiz me' or upload your notes to start.**`
  },
  labmentor: {
    name: 'Lab Mentor',
    description: 'Science and engineering tutor for experiments, lab reports, formulas, diagrams, and technical reasoning.',
    icon: Atom,
    color: 'from-violet-500 to-fuchsia-600',
    borderColor: 'border-violet-500/30',
    shadowColor: 'shadow-violet-500/20',
    badgeText: 'STEM',
    badgeBg: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    intro: `Hello! I'm **Lab Mentor**, your science and engineering AI tutor. ⚛️
I specialize in experiments, lab reports, formulas, diagrams, and technical concepts.

**What I can help you with:**
• Explain lab procedures and results
• Help write lab reports
• Derive formulas step-by-step
• Interpret diagrams and scientific concepts

**Ask me about your experiment, equation, or diagram.**`
  },
  studyplanner: {
    name: 'Study Planner AI',
    description: 'Planning-focused assistant for schedules, revision systems, spaced repetition plans, and study workflows.',
    icon: Compass,
    color: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-500/30',
    shadowColor: 'shadow-purple-500/20',
    badgeText: 'Planner',
    badgeBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    intro: `Hello! I'm **Study Planner AI**, your personalized revision strategist. 🧭
I help you turn goals, deadlines, and uploaded materials into an organized study system.

**What I can help you with:**
• Build study schedules
• Plan spaced repetition sessions
• Break large syllabi into weekly goals
• Create exam countdown plans

**Tell me your subject and deadline to begin.**`
  },
  readingcoach: {
    name: 'Reading Coach',
    description: 'Great for textbooks, PDFs, articles, literature, and long document comprehension. Simplifies dense reading material.',
    icon: BookOpen,
    color: 'from-pink-500 to-rose-600',
    borderColor: 'border-pink-500/30',
    shadowColor: 'shadow-pink-500/20',
    badgeText: 'Reading',
    badgeBg: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    intro: `Hello! I'm **Reading Coach**, your document comprehension tutor. 📚
I help you understand textbooks, PDFs, research articles, and dense reading materials.

**What I can help you with:**
• Summarize chapters and articles
• Explain difficult passages
• Extract themes, arguments, and key evidence
• Build notes from long readings

**Upload a reading or paste a passage to begin.**`
  }
};

type ModelKey = keyof typeof modelInfo;

export default function AIChat() {
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelKey>('gemini');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startChat = (model: ModelKey) => {
    setSelectedModel(model);
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: modelInfo[model].intro,
        timestamp: new Date(),
      }
    ]);
    setChatStarted(true);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateGeminiResponse = (userMessage: string, model: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const isGemini = model === 'gemini';
    
    if (lowerMessage.includes('quantum') || lowerMessage.includes('qubit')) {
      return isGemini 
        ? `**Quantum Computing Explained** 🧪

**Core Concept:** Quantum computers leverage quantum mechanical phenomena to perform calculations exponentially faster than classical computers for certain problems.

### Key Principles:

**1. Superposition**
- Classical bit = 0 OR 1
- **Qubit** = 0 AND 1 simultaneously (until measured)

**2. Entanglement**
- Two or more qubits become correlated
- Measuring one instantly determines the state of the other, regardless of distance

**3. Interference**
- Quantum states can interfere with each other (constructive or destructive)

### Real-World Applications:
• **Cryptography** — Breaking RSA encryption (Shor's Algorithm)
• **Drug Discovery** — Simulating molecular interactions
• **Optimization** — Solving complex logistics problems
• **Machine Learning** — Training certain quantum ML models

**Fun Analogy:** Classical computers are like looking for a specific book in a library by checking one shelf at a time. Quantum computers check *all shelves simultaneously*.

Would you like me to explain **Shor's Algorithm**, **Quantum Error Correction**, or show you a simple quantum circuit?`
        : `Quantum computing uses qubits that can exist in multiple states simultaneously, enabling parallel computation. Key concepts include superposition, entanglement, and quantum gates.`;
      return `Great question! Let me break down **quantum computing** for you:

🔮 **What is Quantum Computing?**

Imagine you have a maze. A regular computer tries one path at a time. A quantum computer tries *all paths simultaneously*!

**Key Concepts:**

1. **Qubits (Quantum Bits)**
   - Regular computers use 0 or 1 (like a light switch)
   - Quantum computers can be 0, 1, or *both at the same time* (superposition)

2. **Superposition**
   - It's like a spinning coin - neither heads nor tails until you look
   - This lets quantum computers process many possibilities at once

3. **Entanglement**
   - Two qubits can be "connected" so that changing one instantly affects the other
   - Einstein called this "spooky action at a distance"

**Real-World Example:**

Think of it like organizing a library:
- **Classical computer**: One person reading books one by one
- **Quantum computer**: Millions of people reading all books simultaneously

Would you like me to dive deeper into any specific aspect, or would you prefer a simpler analogy?`;
    }
    
    if (lowerMessage.includes('machine learning') || lowerMessage.includes('ml')) {
      return `Welcome to the world of **Machine Learning**! 🤖

Machine Learning is essentially teaching computers to learn from examples, much like how you learned to recognize cats or dogs.

**The Three Types of Learning:**

1. **Supervised Learning** 📝
   - Learning with labeled examples
   - Like a teacher showing you pictures labeled "cat" or "dog"
   - Used for: Email spam detection, image recognition

2. **Unsupervised Learning** 🔍
   - Finding patterns without labels
   - Like discovering that cats and dogs are different without being told
   - Used for: Customer segmentation, anomaly detection

3. **Reinforcement Learning** 🎮
   - Learning through trial and error
   - Like learning to play a game by trying different moves
   - Used for: Game AI, robotics

**A Simple Example:**

\`\`\`python
# This is how you might train a model to recognize cats
import numpy as np

# Training data: [weight, height, has_tail]
cats = np.array([
  [4, 9, 1],   # small cat
  [5, 10, 1],  # medium cat
  [6, 11, 1],  # large cat
])

# Simple rule learning
def predict(weight, height, has_tail):
  if has_tail == 1:
    return "CAT! 🐱"
  return "Not a cat"

print(predict(5, 10, 1))  # Output: CAT! 🐱
\`\`\`

Would you like me to show you more code examples, or explain a specific ML algorithm?`;
    }

    if (lowerMessage.includes('blockchain')) {
      return `Let's unlock the mystery of **Blockchain**! 🔗

Think of a blockchain as a **digital notebook** that gets copied and distributed to millions of computers. Once something is written, it can't be erased or changed.

**How It Works (Simple Analogy):**

Imagine a **Google Doc** that:
- Everyone can view
- No one can delete or edit old entries
- New entries are added continuously
- Every change is timestamped and linked to the previous one

**Key Components:**

1. **Blocks**
   - Each block contains: Data + Hash (fingerprint) + Previous hash
   - Like a page in a ledger

2. **Chain**
   - Blocks are linked together
   - Change one block, and ALL following blocks become invalid

3. **Decentralization**
   - No single authority controls it
   - Thousands of computers verify everything

**Why It's Revolutionary:**

| Traditional | Blockchain |
|-------------|------------|
| One company controls data | Everyone controls data |
| Can be hacked | Extremely secure |
| Slow verification | Fast, transparent |
| Can be altered | Immutable |

**Real Applications:**
- 💰 Cryptocurrencies (Bitcoin, Ethereum)
- 📋 Smart contracts
- 🏥 Medical records
- 🗳️ Voting systems

Do you want me to explain smart contracts or dive into how cryptocurrency mining works?`;
    }

    if (lowerMessage.includes('neural network')) {
      return `Let's explore **Neural Networks** - the AI that powers everything from ChatGPT to self-driving cars! 🧠

**What Is a Neural Network?**

A neural network is a computer system inspired by the human brain. Just as your brain has neurons connected by synapses, AI has "nodes" connected by "weights."

**Structure of a Neural Network:**

\`\`\`
Input Layer → Hidden Layers → Output Layer
   (Data)      (Processing)     (Answer)
    🧠            🧠🧠           🧠
    🧠          🧠   🧠         🧠
    🧠           🧠🧠
    🧠
\`\`\`

**How It Learns:**

1. **Forward Propagation**
   - Data enters the input layer
   - Gets processed through hidden layers
   - Produces an output

2. **Calculate Error**
   - Compare prediction to actual answer
   - "How wrong were we?"

3. **Back Propagation**
   - Adjust the connections (weights)
   - Try again
   - Repeat millions of times!

**Real-World Analogy:**

Learning to throw a basketball:
- 🎯 **Input**: Eye sees the hoop
- 🧠 **Hidden**: Brain calculates angle, force
- 💪 **Output**: Arm moves
- 🔄 **Feedback**: Missed left? Adjust next time
- Eventually: Muscle memory = accurate shots!

**Types of Neural Networks:**

- **Feedforward**: Information flows one direction (simple)
- **Convolutional (CNN)**: Great for images 🎨
- **Recurrent (RNN)**: Great for sequences, text, speech 💬
- **Transformers**: The architecture behind modern AI ⚡

Would you like me to explain CNNs for image recognition or how Transformers changed everything?`;
    }

    return `That's a great topic to explore! Let me give you a comprehensive overview:

**Key Points to Understand:**

1. 📚 **Foundation First**
   - Start with the basics before diving deep
   - Build mental models of core concepts

2. 🔄 **Active Learning**
   - Don't just read - interact!
   - Try explaining it to someone else
   - Create your own examples

3. � Mistakes Are Learning
   - Every "error" is actually feedback
   - Analyze what went wrong
   - Adjust and try again

**How I Can Help:**

I can break this down further with:
- 📖 **Detailed explanations** with examples
- 💻 **Code implementations** where applicable
- 🧪 **Practice problems** to test your understanding
- 📝 **Summaries** for quick review

What specific aspect would you like me to focus on? Feel free to upload any study materials you have, and I'll help you understand them better!`;
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    // Simulate network delay (Gemini is fast but thoughtful)
    await new Promise((resolve) => setTimeout(resolve, 900));

    const response = generateGeminiResponse(currentInput, selectedModel);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      sources: selectedModel === 'gemini' ? ['gemini-1.5-pro', 'google-research'] : undefined,
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiMessage]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).filter(
      (file) => ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)
    );
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const startNewChat = () => {
    setMessages([]);
    setUploadedFiles([]);
    setChatStarted(false);
  };

  if (!chatStarted) {
    const models = Object.entries(modelInfo) as [ModelKey, typeof modelInfo[keyof typeof modelInfo]][];

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-4xl mx-auto w-full animate-fadeIn">
        <div className="text-center max-w-xl mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/20 mx-auto mb-4 animate-float">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
            Choose Your AI Tutor
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Select a specialized AI model to guide your learning journey. You can switch models or start a new chat at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 w-full">
          {models.map(([key, model]) => {
            const Icon = model.icon;
            return (
              <button
                key={key}
                onClick={() => startChat(key)}
                className={`flex flex-col text-left p-4 sm:p-5 bg-[#1E293B] border-2 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg ${model.borderColor} hover:border-indigo-400 hover:${model.shadowColor} ${key === 'gemini' ? 'sm:col-span-2 xl:col-span-1 border-indigo-500/50 bg-indigo-500/5' : 'border-slate-700/50'}`}
              >
                <div className="flex items-start justify-between mb-3 w-full">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${model.color} flex items-center justify-center shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{model.name}</h3>
                      <div className={`px-2 py-0.5 mt-1 text-[10px] font-mono rounded border ${model.badgeBg} w-fit`}>
                        {model.badgeText}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
                
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed flex-1">
                  {model.description}
                </p>
                
                <div className="mt-4 pt-3 border-t border-slate-700/50 w-full flex items-center justify-between text-[10px] sm:text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Available
                  </span>
                  <span>Click to select & start chat →</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-screen-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${modelInfo[selectedModel].color} flex items-center justify-center shadow-lg ${modelInfo[selectedModel].shadowColor} flex-shrink-0`}>
            {React.createElement(modelInfo[selectedModel].icon, { className: "w-5 h-5 sm:w-7 sm:h-7 text-white" })}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                {modelInfo[selectedModel].name} Tutor
              </h1>
              <div className={`px-2 py-0.5 text-[10px] font-mono rounded border ${modelInfo[selectedModel].badgeBg} hidden sm:block`}>
                {modelInfo[selectedModel].badgeText}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5 truncate">
              <span className="text-emerald-400">●</span>
              <span className="hidden sm:inline">Powered by {modelInfo[selectedModel].name}</span>
              <span className="sm:hidden">{modelInfo[selectedModel].badgeText}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Model Selector */}
          <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl p-1 overflow-x-auto max-w-[50vw] sm:max-w-none hide-scrollbar">
            {(Object.keys(modelInfo) as ModelKey[]).map((key) => {
              const ActiveIcon = modelInfo[key].icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedModel(key)}
                  className={`px-2 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 whitespace-nowrap ${
                    selectedModel === key
                      ? `bg-gradient-to-r ${modelInfo[key].color} text-white shadow-md`
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <ActiveIcon className="w-3 h-3" />
                  <span>{modelInfo[key].badgeText}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={startNewChat}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition-all text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col bg-[#1E293B] border border-slate-700/50 rounded-xl sm:rounded-2xl overflow-hidden min-h-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-md ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                    : 'bg-gradient-to-br from-blue-500 via-purple-600 to-violet-600'
                }`}
              >
                {message.role === 'user' ? (
                  <span className="text-white font-semibold text-sm">You</span>
                ) : (
                  <Zap className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Message Content */}
              <div
                className={`flex-1 min-w-0 ${message.role === 'user' ? 'text-right' : ''}`}
              >
                <div
                  className={`inline-block p-3 rounded-xl text-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                      : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  <div className="prose prose-invert prose-sm max-w-none">
                    {message.content.split('\n').map((line, i) => {
                      if (line.startsWith('```')) {
                        return (
                          <pre key={i} className="bg-slate-900 p-3 rounded-lg overflow-x-auto my-2">
                            <code className="text-emerald-400">{line.replace('```', '')}</code>
                          </pre>
                        );
                      }
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={i} className="font-bold my-1">{line.replace(/\*\*/g, '')}</p>;
                      }
                      if (line.startsWith('•')) {
                        return <p key={i} className="ml-3 my-1">{line}</p>;
                      }
                      if (line.match(/^\d\./)) {
                        return <p key={i} className="ml-3 my-1">{line}</p>;
                      }
                      if (line.trim() === '') {
                        return <br key={i} />;
                      }
                      return <p key={i} className="my-1">{line}</p>;
                    })}
                  </div>
                </div>
                <div className={`flex items-center gap-2 mt-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-xs text-slate-500">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => copyMessage(message.content)}
                      className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="bg-slate-800 px-5 py-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="text-xs text-purple-400 font-medium">Gemini is thinking</div>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Suggested Questions (when chat is empty) */}
          {messages.length === 1 && (
            <div className="mt-8">
              <p className="text-sm text-slate-400 mb-4 text-center">Try asking about:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(question)}
                    className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 hover:border-slate-600/50 transition-all"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg"
                >
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm text-indigo-300">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-0.5 text-indigo-400 hover:text-indigo-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 sm:p-4 border-t border-slate-700/50">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            {quickPrompts.map((prompt, index) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={index}
                  onClick={() => setInputValue(prompt.text.toLowerCase() + ': ')}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-[10px] sm:text-xs ${prompt.color} hover:bg-slate-700/50 transition-all`}
                >
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">{prompt.text}</span>
                </button>
              );
            })}
          </div>

          <div data-tour="chat-input" className="flex items-end gap-2 sm:gap-3">
            {/* Upload Button */}
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.txt,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              >
                <Upload className="w-5 h-5" />
              </button>
            </div>

            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me anything about your study materials..."
                rows={1}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-none transition-all"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="p-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
