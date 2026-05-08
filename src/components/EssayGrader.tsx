import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, RotateCcw, BookOpen } from 'lucide-react';

interface Essay {
  id: string;
  question: string;
  modelAnswer: string;
  keyPoints: string[];
  maxScore: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface SubmittedEssay {
  essayId: string;
  userAnswer: string;
  score: number;
  feedback: string;
  coveredPoints: string[];
  missedPoints: string[];
  submittedAt: Date;
}

const ESSAY_QUESTIONS: Essay[] = [
  {
    id: '1',
    question: 'Explain the difference between machine learning and deep learning.',
    modelAnswer: 'Machine learning is a subset of AI that allows computers to learn from data without explicit programming. Deep learning is a subset of machine learning using artificial neural networks with multiple layers. Deep learning excels with large data and complex patterns, while machine learning is more interpretable and requires less data.',
    keyPoints: ['ML definition', 'DL definition', 'Neural networks', 'Data requirements', 'Use cases', 'Advantages/disadvantages'],
    maxScore: 100,
    topic: 'Machine Learning',
    difficulty: 'medium'
  },
  {
    id: '2',
    question: 'Compare object-oriented programming with functional programming.',
    modelAnswer: 'OOP focuses on objects, classes, encapsulation, inheritance. FP emphasizes immutability, pure functions, declarative style. OOP better for large-scale applications; FP excels in data transformation.',
    keyPoints: ['OOP principles', 'FP principles', 'State management', 'Use cases', 'Code examples'],
    maxScore: 100,
    topic: 'Programming Paradigms',
    difficulty: 'hard'
  },
  {
    id: '3',
    question: 'Describe the importance of data structures in computer science.',
    modelAnswer: 'Data structures organize, manage, and store data efficiently. They impact algorithm performance, memory usage, and readability. Different structures suit different problems and improve time complexity.',
    keyPoints: ['Definition', 'Efficiency impact', 'Memory management', 'Common types', 'Performance analysis'],
    maxScore: 100,
    topic: 'Data Structures',
    difficulty: 'medium'
  }
];

const EssayGrader = () => {
  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(ESSAY_QUESTIONS[0]);
  const [userAnswer, setUserAnswer] = useState('');
  const [submitted, setSubmitted] = useState<SubmittedEssay | null>(null);
  const [submissionHistory, setSubmissionHistory] = useState<SubmittedEssay[]>([]);

  const calculateScore = (answer: string, essay: Essay): { score: number; feedback: string; covered: string[]; missed: string[] } => {
    let score = 50; // Base score
    const answerLower = answer.toLowerCase();
    const covered: string[] = [];
    const missed: string[] = [];

    essay.keyPoints.forEach(point => {
      const pointLower = point.toLowerCase();
      if (answerLower.includes(pointLower)) {
        score += Math.round(essay.maxScore / essay.keyPoints.length / 2);
        covered.push(point);
      } else {
        missed.push(point);
      }
    });

    const wordCount = answer.split(/\s+/).length;
    if (wordCount < 50) {
      score = Math.max(0, score - 20);
    }

    const feedback = covered.length === essay.keyPoints.length
      ? 'Excellent! You covered all key points.'
      : `Good effort! You covered ${covered.length}/${essay.keyPoints.length} key points.`;

    return {
      score: Math.min(essay.maxScore, score),
      feedback,
      covered,
      missed
    };
  };

  const handleSubmit = () => {
    if (!selectedEssay || userAnswer.trim().length < 20) return;

    const { score, feedback, covered, missed } = calculateScore(userAnswer, selectedEssay);
    const submission: SubmittedEssay = {
      essayId: selectedEssay.id,
      userAnswer,
      score,
      feedback,
      coveredPoints: covered,
      missedPoints: missed,
      submittedAt: new Date()
    };

    setSubmitted(submission);
    setSubmissionHistory([submission, ...submissionHistory]);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
        <button
          onClick={() => {
            setSubmitted(null);
            setUserAnswer('');
          }}
          className="mb-6 flex items-center gap-2 text-indigo-400 hover:text-indigo-300"
        >
          ← Back
        </button>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Score Card */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl p-6 sm:p-8 text-white">
            <div className="text-center">
              <div className="text-5xl sm:text-6xl font-bold mb-2">{submitted.score}</div>
              <div className="text-lg sm:text-xl opacity-90">{selectedEssay?.maxScore || 100} points</div>
              <div className="mt-4 text-sm sm:text-base opacity-80">{submitted.feedback}</div>
            </div>
          </div>

          {/* Covered Points */}
          {submitted.coveredPoints.length > 0 && (
            <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6">
              <h3 className="flex items-center gap-2 text-green-400 font-semibold mb-3 text-sm sm:text-base">
                <CheckCircle className="w-5 h-5" /> Key Points Covered
              </h3>
              <ul className="space-y-2">
                {submitted.coveredPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missed Points */}
          {submitted.missedPoints.length > 0 && (
            <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6">
              <h3 className="flex items-center gap-2 text-amber-400 font-semibold mb-3 text-sm sm:text-base">
                <AlertCircle className="w-5 h-5" /> Points to Improve
              </h3>
              <ul className="space-y-2">
                {submitted.missedPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                    <span className="text-amber-400 mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Model Answer */}
          <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6">
            <h3 className="flex items-center gap-2 text-blue-400 font-semibold mb-3 text-sm sm:text-base">
              <BookOpen className="w-5 h-5" /> Model Answer
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{selectedEssay?.modelAnswer}</p>
          </div>

          {/* Actions */}
          <button
            onClick={() => {
              setSubmitted(null);
              setUserAnswer('');
            }}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Try Another Question
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">✍️ Essay Grader</h1>
          <p className="text-sm sm:text-base text-slate-400">AI-powered essay evaluation with detailed feedback</p>
        </div>

        {/* Question Selection */}
        <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6">
          <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-3">Select Question</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ESSAY_QUESTIONS.map(essay => (
              <button
                key={essay.id}
                onClick={() => {
                  setSelectedEssay(essay);
                  setUserAnswer('');
                }}
                className={`p-3 sm:p-4 rounded-lg text-left transition-all text-xs sm:text-sm ${
                  selectedEssay?.id === essay.id
                    ? 'bg-indigo-500 text-white border-2 border-indigo-400'
                    : 'bg-slate-700/50 text-slate-300 border-2 border-slate-600 hover:border-indigo-400'
                }`}
              >
                <div className="font-semibold truncate">{essay.topic}</div>
                <div className="text-xs opacity-75">Difficulty: {essay.difficulty}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Question */}
        {selectedEssay && (
          <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-white mb-3">{selectedEssay.question}</h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full">
                {selectedEssay.topic}
              </span>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full capitalize">
                {selectedEssay.difficulty}
              </span>
            </div>
          </div>
        )}

        {/* Answer Input */}
        {selectedEssay && (
          <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6">
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-3">Your Answer</label>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Write your detailed answer here (minimum 20 characters)..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-xs sm:text-sm"
              rows={6}
            />
            <div className="mt-2 text-xs text-slate-400">
              {userAnswer.length} characters
            </div>
          </div>
        )}

        {/* Submit Button */}
        {selectedEssay && (
          <button
            onClick={handleSubmit}
            disabled={userAnswer.trim().length < 20}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Submit Essay
          </button>
        )}

        {/* Submission History */}
        {submissionHistory.length > 0 && (
          <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Recent Submissions</h3>
            <div className="space-y-3">
              {submissionHistory.slice(0, 3).map((submission, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-slate-300 truncate">
                      {ESSAY_QUESTIONS.find(e => e.id === submission.essayId)?.topic}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-bold text-indigo-400">{submission.score}</span>
                    <span className="text-xs text-slate-400">{submission.coveredPoints.length}/{ESSAY_QUESTIONS.find(e => e.id === submission.essayId)?.keyPoints.length}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EssayGrader;
