import { useState, useEffect } from 'react';
import {
  Brain,
  Trophy,
  Zap,
  Target,
  Clock,
  RotateCcw,
  Play,
  ArrowLeft,
  Star,
  Flame,
  Medal,
  TrendingUp,
  Grid3X3,
  Shuffle,
  Timer,
} from 'lucide-react';

interface Card {
  id: string;
  front: string;
  back: string;
  mastered: boolean;
}

interface Deck {
  id: string;
  name: string;
  cards: Card[];
}

type GameMode = 'matching' | 'speed-quiz' | 'flash-race' | 'memory' | 'hangman' | 'type-rush' | 'true-false' | 'fill-blank' | 'word-search' | 'drag-drop' | 'anagrams' | 'jeopardy' | 'millionaire' | 'flash-swipe' | 'odd-one-out' | 'daily-word' | 'audio-quiz' | 'fact-fiction' | 'letter-drop' | 'speed-sort' | 'reverse-memory' | 'sentence-builder' | 'crossword-clues' | 'trivia-crack' | 'connect-four' | 'term-tycoon' | 'definition-link' | 'word-puzzle' | 'speed-type' | 'blind-recall';

interface GameState {
  score: number;
  highScore: number;
  streak: number;
  bestStreak: number;
  timeElapsed: number;
  isPlaying: boolean;
}

const defaultDecks: Deck[] = [
  {
    id: '1',
    name: 'Machine Learning Basics',
    cards: [
      { id: '1', front: 'What is Machine Learning?', back: 'A subset of AI that enables systems to learn from data', mastered: false },
      { id: '2', front: 'Supervised Learning', back: 'Learning with labeled training data', mastered: false },
      { id: '3', front: 'Unsupervised Learning', back: 'Learning from unlabeled data to find patterns', mastered: false },
      { id: '4', front: 'Neural Network', back: 'A model inspired by biological neurons', mastered: false },
      { id: '5', front: 'What is Overfitting?', back: 'When a model learns the training data too well', mastered: false },
    ]
  },
  {
    id: '2',
    name: 'JavaScript Fundamentals',
    cards: [
      { id: '6', front: 'What is a callback?', back: 'A function passed as an argument to another function', mastered: false },
      { id: '7', front: 'Promises in JS', back: 'Objects representing eventual completion or failure of async operation', mastered: false },
      { id: '8', front: 'Arrow functions', back: 'Concise syntax for writing functions in JavaScript', mastered: false },
      { id: '9', front: 'Array methods', back: 'map(), filter(), reduce() for array manipulation', mastered: false },
    ]
  },
];

const StudyGames = ({ decks = defaultDecks }: { decks?: Deck[] } = {}) => {
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(decks[0] || null);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    highScore: 0,
    streak: 0,
    bestStreak: 0,
    timeElapsed: 0,
    isPlaying: false,
  });
  const [timer, setTimer] = useState(0);
  const [gameData, setGameData] = useState<any>(null);
  const [gameComplete, setGameComplete] = useState(false);

  // Timer for games
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState.isPlaying) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setGameState({
      score: 0,
      highScore: 0,
      streak: 0,
      bestStreak: 0,
      timeElapsed: 0,
      isPlaying: true,
    });
    setTimer(0);
    setGameComplete(false);

    // Initialize game-specific data
    if (selectedDeck) {
      if (mode === 'matching') {
        setGameData(generateMatchingGame(selectedDeck.cards));
      } else if (mode === 'speed-quiz') {
        setGameData(generateSpeedQuiz(selectedDeck.cards));
      } else if (mode === 'flash-race') {
        setGameData(generateFlashRace(selectedDeck.cards));
      } else if (mode === 'memory') {
        setGameData(generateMemoryGame(selectedDeck.cards));
      } else if (mode === 'hangman') {
        setGameData(generateHangman(selectedDeck.cards));
      } else if (mode === 'type-rush') {
        setGameData(generateTypeRush(selectedDeck.cards));
      } else if (mode === 'true-false') {
        setGameData(generateTrueFalse(selectedDeck.cards));
      } else if (mode === 'fill-blank') {
        setGameData(generateFillBlank(selectedDeck.cards));
      } else if (mode === 'word-search') {
        setGameData(generateWordSearch(selectedDeck.cards));
      } else if (mode === 'drag-drop') {
        setGameData(generateDragDrop(selectedDeck.cards));
      } else {
        // Shared lightweight initialization for the remaining 20 games
        const questions = selectedDeck.cards.slice(0, 10).map(card => {
          const wrongAnswers = selectedDeck.cards
            .filter(c => c.id !== card.id)
            .slice(0, 3)
            .map(c => c.back);
          return {
            id: card.id,
            question: card.front,
            answer: card.back,
            options: shuffleArray([card.back, ...wrongAnswers]),
          };
        });
        setGameData({ questions, currentIndex: 0, score: 0 });
      }
    }
  };

  const endGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      highScore: Math.max(prev.highScore, prev.score),
      bestStreak: Math.max(prev.bestStreak, prev.streak),
    }));
    setGameComplete(true);
  };

  const resetGame = () => {
    setGameMode(null);
    setGameData(null);
    setGameComplete(false);
    setTimer(0);
  };

  // ==================== GAME GENERATORS ====================
  function generateMatchingGame(cards: Card[]) {
    const items = cards.slice(0, 8).flatMap(card => [
      { id: `term-${card.id}`, text: card.front, type: 'term', matchId: card.id },
      { id: `def-${card.id}`, text: card.back, type: 'def', matchId: card.id },
    ]);
    return { items: shuffleArray(items), pairsFound: 0, totalPairs: Math.min(8, cards.length) };
  }

  function generateSpeedQuiz(cards: Card[]) {
    const questions = cards.slice(0, 10).map(card => {
      const wrongAnswers = cards
        .filter(c => c.id !== card.id)
        .slice(0, 3)
        .map(c => c.back);
      return {
        question: card.front,
        correctAnswer: card.back,
        options: shuffleArray([card.back, ...wrongAnswers]),
      };
    });
    return { questions, currentIndex: 0, correctCount: 0 };
  }

  function generateFlashRace(cards: Card[]) {
    const shuffled = shuffleArray(cards.slice(0, 15));
    return { cards: shuffled, currentIndex: 0, correctCount: 0, wrongCount: 0 };
  }

  function generateMemoryGame(cards: Card[]) {
    const pairs = cards.slice(0, 6).flatMap(card => [
      { id: `mem-${card.id}-1`, content: card.front, type: 'term', matchId: card.id },
      { id: `mem-${card.id}-2`, content: card.back, type: 'def', matchId: card.id },
    ]);
    return { cards: shuffleArray(pairs), flipped: [], matched: [], pairsFound: 0 };
  }

  function generateHangman(cards: Card[]) {
    const words = cards.slice(0, 10).map(card => ({
      word: card.front.replace(/[^a-zA-Z ]/g, '').toUpperCase(),
      hint: card.back,
      id: card.id
    })).filter(w => w.word.length > 3 && w.word.length < 15);
    return { words, currentIndex: 0, guessedLetters: [], wrongGuesses: 0, maxWrong: 6 };
  }

  function generateTypeRush(cards: Card[]) {
    const terms = shuffleArray(cards.slice(0, 20)).map(card => ({
      term: card.front,
      definition: card.back,
      typed: '',
      completed: false
    }));
    return { terms, currentIndex: 0, wpm: 0, accuracy: 100 };
  }

  function generateTrueFalse(cards: Card[]) {
    const questions = cards.slice(0, 15).map((card, idx) => {
      const isTrue = Math.random() > 0.5;
      const wrongCard = cards[(idx + 1) % cards.length];
      return {
        statement: isTrue ? `${card.front} means ${card.back}` : `${card.front} means ${wrongCard.back}`,
        isTrue,
        explanation: `${card.front}: ${card.back}`
      };
    });
    return { questions, currentIndex: 0, correctCount: 0 };
  }

  function generateFillBlank(cards: Card[]) {
    const sentences = cards.slice(0, 12).map(card => {
      const words = card.back.split(' ');
      const blankIndex = Math.floor(Math.random() * Math.min(3, words.length));
      const answer = words[blankIndex];
      words[blankIndex] = '_____';
      return {
        question: card.front,
        sentence: words.join(' '),
        answer: answer.toLowerCase(),
        fullAnswer: card.back
      };
    });
    return { sentences, currentIndex: 0, correctCount: 0 };
  }

  function generateWordSearch(cards: Card[]) {
    const words = cards.slice(0, 8).map(c => 
      c.front.replace(/[^a-zA-Z]/g, '').toUpperCase().substring(0, 12)
    ).filter(w => w.length >= 4);
    return { words, foundWords: [], grid: [], size: 12 };
  }

  function generateDragDrop(cards: Card[]) {
    const items = shuffleArray(cards.slice(0, 8)).map(card => ({
      id: card.id,
      term: card.front,
      definition: card.back,
      category: card.front.length % 3 // Random categories 0,1,2
    }));
    const categories = ['Core Concepts', 'Advanced Topics', 'Applications'];
    return { items, categories, dropped: [], score: 0 };
  }

  function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ==================== GAME COMPONENTS ====================

  const DefaultGameView = () => {
    const { questions, currentIndex } = gameData;
    const currentQuestion = questions[currentIndex];
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    if (!currentQuestion) return null;

    const handleSelectOption = (option: string) => {
      if (selectedAnswer) return;
      setSelectedAnswer(option);
      const correct = option === currentQuestion.answer;
      setIsCorrect(correct);

      if (correct) {
        setGameState((prev: GameState) => ({ ...prev, score: prev.score + 100, streak: prev.streak + 1 }));
      } else {
        setGameState((prev: GameState) => ({ ...prev, streak: 0 }));
      }

      setTimeout(() => {
        if (currentIndex + 1 >= questions.length) {
          endGame();
        } else {
          setGameData((prev: any) => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
          setSelectedAnswer(null);
          setIsCorrect(null);
        }
      }, 1500);
    };

    return (
      <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold">{gameState.score}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-white font-medium">{gameState.streak} streak</span>
            </div>
          </div>
          <div className="text-sm text-slate-400">
            {currentIndex + 1}/{questions.length}
          </div>
        </div>

        <div className="bg-slate-800/30 rounded-2xl p-6 sm:p-8">
          <p className="text-slate-400 text-xs sm:text-sm mb-2 font-medium capitalize">Question:</p>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-6 leading-relaxed">
            {currentQuestion.question}
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option: string, idx: number) => {
              const isSelected = selectedAnswer === option;
              const isWrong = isSelected && !isCorrect;
              const isRightAnswer = option === currentQuestion.answer && selectedAnswer !== null;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option)}
                  disabled={selectedAnswer !== null}
                  className={`p-3 sm:p-4 rounded-xl text-left font-medium text-sm sm:text-base transition-all border-2 ${
                    isRightAnswer
                      ? 'bg-green-500/20 border-green-500 text-green-300'
                      : isWrong
                      ? 'bg-red-500/20 border-red-500 text-red-300'
                      : isSelected
                      ? 'bg-indigo-500/20 border-indigo-500 text-white'
                      : 'bg-slate-700/50 border-slate-600 hover:border-indigo-400 text-slate-300'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {selectedAnswer && (
            <div className={`mt-4 p-4 rounded-xl text-sm ${isCorrect ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              <p className="font-bold flex items-center gap-2">
                {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
              </p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                The correct term definition was: <span className="text-white font-medium">{currentQuestion.answer}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const MatchingGame = () => {
    const [selected, setSelected] = useState<string[]>([]);
    const [matched, setMatched] = useState<string[]>([]);
    const { items, totalPairs } = gameData;

    const handleItemClick = (itemId: string, _matchId: string) => {
      if (matched.includes(itemId) || selected.includes(itemId)) return;

      const newSelected = [...selected, itemId];
      setSelected(newSelected);

      if (newSelected.length === 2) {
        const [firstId, secondId] = newSelected;
        const firstItem = items.find((i: any) => i.id === firstId);
        const secondItem = items.find((i: any) => i.id === secondId);

        if (firstItem?.matchId === secondItem?.matchId) {
          setMatched([...matched, firstId, secondId]);
          setGameState((prev: GameState) => ({ ...prev, score: prev.score + 100, streak: prev.streak + 1 }));
          if (matched.length + 2 === totalPairs * 2) {
            endGame();
          }
        } else {
          setGameState((prev: GameState) => ({ ...prev, streak: 0 }));
          setTimeout(() => setSelected([]), 800);
        }
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold">{gameState.score}</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-white">{gameState.streak} streak</span>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-indigo-400" />
              <span className="text-white">{formatTime(timer)}</span>
            </div>
          </div>
          <div className="text-sm text-slate-300">
            Pairs: {matched.length / 2}/{totalPairs}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map((item: any) => {
            const isMatched = matched.includes(item.id);
            const isSelected = selected.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id, item.matchId)}
                disabled={isMatched || isSelected}
                className={`p-3 sm:p-4 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 min-h-[80px] sm:min-h-[100px] ${
                  isMatched
                    ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                    : isSelected
                    ? 'bg-indigo-500/20 border-2 border-indigo-500 text-white'
                    : 'bg-slate-700/50 border-2 border-slate-600 text-slate-200 hover:border-indigo-400'
                }`}
              >
                <span className="line-clamp-3">{item.text}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const SpeedQuiz = () => {
    const { questions, currentIndex, correctCount } = gameData;
    const question = questions[currentIndex];

    const handleAnswer = (answer: string) => {
      const isCorrect = answer === question.correctAnswer;
      if (isCorrect) {
        setGameState((prev: GameState) => ({ ...prev, score: prev.score + 100, streak: prev.streak + 1 }));
      } else {
        setGameState((prev: GameState) => ({ ...prev, streak: 0 }));
      }

      if (currentIndex + 1 >= questions.length) {
        endGame();
      } else {
        setGameData((prev: any) => ({ ...prev, currentIndex: currentIndex + 1, correctCount: correctCount + (isCorrect ? 1 : 0) }));
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 bg-slate-800/50 rounded-xl p-3 sm:p-4">
           <div className="flex items-center gap-3 sm:gap-4">
             <div className="flex items-center gap-1.5 sm:gap-2">
               <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
               <span className="text-sm sm:text-base text-white font-bold">{gameState.score}</span>
             </div>
             <div className="flex items-center gap-1.5 sm:gap-2">
               <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
               <span className="text-xs sm:text-base text-white">{gameState.streak} streak</span>
             </div>
           </div>
           <div className="flex items-center gap-3 sm:gap-4">
             <div className="flex items-center gap-1.5 sm:gap-2">
               <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
               <span className="text-xs sm:text-base text-white">{formatTime(timer)}</span>
             </div>
             <div className="text-xs sm:text-sm text-slate-300">
               {currentIndex + 1}/{questions.length}
             </div>
           </div>
         </div>

        <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">{question.question}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options.map((option: string, idx: number) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                className="p-3 sm:p-4 bg-slate-700/50 hover:bg-indigo-500/20 border-2 border-slate-600 hover:border-indigo-400 rounded-xl text-left text-sm sm:text-base text-slate-200 transition-all"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const FlashRace = () => {
    const { cards, currentIndex, correctCount, wrongCount } = gameData;
    const card = cards[currentIndex];

    const [showAnswer, setShowAnswer] = useState(false);

    const handleKnow = (knows: boolean) => {
      if (knows) {
        setGameState((prev: GameState) => ({ ...prev, score: prev.score + 10, streak: prev.streak + 1 }));
      } else {
        setGameState(prev => ({ ...prev, streak: 0 }));
      }

      setTimeout(() => {
        if (currentIndex + 1 >= cards.length) {
          endGame();
        } else {
          setGameData((prev: any) => ({
            ...prev,
            currentIndex: currentIndex + 1,
            correctCount: correctCount + (knows ? 1 : 0),
            wrongCount: wrongCount + (knows ? 0 : 1),
          }));
          setShowAnswer(false);
        }
      }, 500);
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold">{gameState.score}</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-white">{gameState.streak} streak</span>
            </div>
          </div>
          <div className="text-sm text-slate-300">
            {currentIndex + 1}/{cards.length}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl p-6 sm:p-8 border-2 border-indigo-500/30">
          <h3 className="text-xl sm:text-2xl font-bold text-white text-center mb-6">{card.front}</h3>
          
          {showAnswer && (
            <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6 mb-6">
              <p className="text-slate-300 text-center text-sm sm:text-base">{card.back}</p>
            </div>
          )}

          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full py-3 sm:py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold transition-all"
            >
              Show Answer
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleKnow(false)}
                className="py-3 sm:py-4 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/50 text-red-400 rounded-xl font-semibold transition-all"
              >
                Didn't Know
              </button>
              <button
                onClick={() => handleKnow(true)}
                className="py-3 sm:py-4 bg-green-500/20 hover:bg-green-500/30 border-2 border-green-500/50 text-green-400 rounded-xl font-semibold transition-all"
              >
                Got It!
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const MemoryGame = () => {
    const { cards, flipped, matched, pairsFound } = gameData;
    const totalPairs = cards.length / 2;

    const handleCardClick = (card: any) => {
      if (flipped.includes(card.id) || matched.includes(card.id)) return;

      const newFlipped = [...flipped, card.id];
      setGameData((prev: any) => ({ ...prev, flipped: newFlipped }));

      if (newFlipped.length === 2) {
        const [firstId, secondId] = newFlipped;
        const firstCard = cards.find((c: any) => c.id === firstId);
        const secondCard = cards.find((c: any) => c.id === secondId);

        if (firstCard?.matchId === secondCard?.matchId) {
          setGameData((prev: any) => ({
            ...prev,
            matched: [...prev.matched, firstId, secondId],
            pairsFound: pairsFound + 1,
          }));
          setGameState((prev: GameState) => ({ ...prev, score: prev.score + 100, streak: prev.streak + 1 }));
          if (pairsFound + 1 === totalPairs) {
            endGame();
          }
        } else {
          setGameState((prev: GameState) => ({ ...prev, streak: 0 }));
          setTimeout(() => setGameData((prev: any) => ({ ...prev, flipped: [] })), 1000);
        }
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold">{gameState.score}</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-white">{gameState.streak} streak</span>
            </div>
          </div>
          <div className="text-sm text-slate-300">
            Pairs: {pairsFound}/{totalPairs}
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
          {cards.map((card: any) => {
            const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
            const isMatched = matched.includes(card.id);
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card)}
                disabled={isMatched}
                className={`aspect-square rounded-lg sm:rounded-xl p-2 sm:p-3 text-xs sm:text-sm font-medium transition-all duration-300 ${
                  isMatched
                    ? 'bg-green-500/20 border-2 border-green-500'
                    : isFlipped
                    ? 'bg-indigo-500/20 border-2 border-indigo-500'
                    : 'bg-slate-700/50 border-2 border-slate-600 hover:border-indigo-400'
                }`}
              >
                {isFlipped ? (
                  <span className="line-clamp-4">{card.content}</span>
                ) : (
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-slate-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const HangmanGame = () => {
    const { words, currentIndex, guessedLetters, wrongGuesses, maxWrong } = gameData;
    const currentWord = words[currentIndex];
    const [inputLetter, setInputLetter] = useState('');

    const handleGuess = (letter: string) => {
      const upperLetter = letter.toUpperCase();
      if (guessedLetters.includes(upperLetter) || wrongGuesses >= maxWrong) return;

      const newGuessed = [...guessedLetters, upperLetter];
      setGameData((prev: any) => ({ ...prev, guessedLetters: newGuessed }));

      if (!currentWord.word.includes(upperLetter)) {
        const newWrong = wrongGuesses + 1;
        setGameData((prev: any) => ({ ...prev, wrongGuesses: newWrong }));
        setGameState((p: GameState) => ({ ...p, streak: 0 }));
        if (newWrong >= maxWrong) {
          setTimeout(endGame, 1500);
        }
      } else {
        setGameState((p: GameState) => ({ ...p, score: p.score + 20, streak: p.streak + 1 }));
        const wordGuessed = currentWord.word.split('').every((l: string) => 
          l === ' ' || newGuessed.includes(l)
        );
        if (wordGuessed) {
          setGameState((p: GameState) => ({ ...p, score: p.score + 100 }));
          if (currentIndex + 1 >= words.length) {
            setTimeout(endGame, 1000);
          } else {
            setTimeout(() => {
              setGameData((prev: any) => ({ 
                ...prev, 
                currentIndex: prev.currentIndex + 1, 
                guessedLetters: [], 
                wrongGuesses: 0 
              }));
            }, 1500);
          }
        }
      }
      setInputLetter('');
    };

    const displayWord = currentWord.word.split('').map((l: string) => 
      l === ' ' ? ' ' : guessedLetters.includes(l) ? l : '_'
    ).join(' ');

    return (
      <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="text-white font-bold text-sm sm:text-base">{gameState.score}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-slate-400 text-xs sm:text-sm">Wrong:</span>
              <span className={`font-bold text-sm sm:text-base ${wrongGuesses >= 4 ? 'text-red-400' : 'text-white'}`}>
                {wrongGuesses}/{maxWrong}
              </span>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-slate-400">
            {currentIndex + 1}/{words.length}
          </div>
        </div>

        <div className="bg-slate-800/30 rounded-2xl p-6 sm:p-8 text-center">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-mono tracking-widest text-white mb-4 sm:mb-6 min-h-[60px] flex items-center justify-center">
            {displayWord}
          </div>
          <p className="text-slate-400 text-sm sm:text-base mb-2">Hint:</p>
          <p className="text-indigo-300 text-sm sm:text-base italic">{currentWord.hint}</p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            maxLength={1}
            value={inputLetter}
            onChange={(e) => setInputLetter(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && inputLetter && handleGuess(inputLetter)}
            placeholder="Type a letter"
            className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-center text-xl font-bold uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
          <button
            onClick={() => inputLetter && handleGuess(inputLetter)}
            disabled={!inputLetter}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all"
          >
            Guess
          </button>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-9 lg:grid-cols-13 gap-1.5 sm:gap-2">
          {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => {
            const isGuessed = guessedLetters.includes(letter);
            const isCorrect = currentWord.word.includes(letter);
            return (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={isGuessed || wrongGuesses >= maxWrong}
                className={`aspect-square rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  isGuessed
                    ? isCorrect
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                      : 'bg-red-500/20 text-red-400 border border-red-500/50'
                    : 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const TypeRushGame = () => {
    const { terms, currentIndex, wpm } = gameData;
    const currentTerm = terms[currentIndex];
    const [userInput, setUserInput] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);

    const handleInput = (value: string) => {
      if (!startTime) setStartTime(Date.now());
      setUserInput(value);

      if (value.toLowerCase() === currentTerm.term.toLowerCase()) {
        const timeElapsed = (Date.now() - (startTime || Date.now())) / 1000 / 60;
        const wordsTyped = currentTerm.term.split(' ').length;
        const currentWpm = Math.round(wordsTyped / Math.max(timeElapsed, 0.01));
        
        setGameState((p: GameState) => ({ 
          ...p, 
          score: p.score + 50 + Math.max(0, 30 - Math.floor(timeElapsed * 10)),
          streak: p.streak + 1 
        }));
        
        setGameData((prev: any) => ({ 
          ...prev, 
          wpm: Math.round((prev.wpm * prev.currentIndex + currentWpm) / (prev.currentIndex + 1)),
          currentIndex: prev.currentIndex + 1 
        }));

        if (currentIndex + 1 >= terms.length) {
          endGame();
        } else {
          setUserInput('');
          setStartTime(null);
        }
      }
    };

    const progress = ((currentIndex) / terms.length) * 100;

    return (
      <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="text-white font-bold text-sm sm:text-base">{gameState.score}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              <span className="text-white text-sm sm:text-base">{wpm} WPM</span>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-slate-400">
            {currentIndex + 1}/{terms.length}
          </div>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-2">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>

        <div className="bg-slate-800/30 rounded-2xl p-6 sm:p-8">
          <p className="text-slate-400 text-xs sm:text-sm mb-2">Definition:</p>
          <p className="text-white text-base sm:text-lg mb-4 sm:mb-6 min-h-[60px]">{currentTerm.definition}</p>
          <p className="text-slate-400 text-xs sm:text-sm mb-2">Type the term:</p>
          <input
            type="text"
            value={userInput}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Start typing..."
            className="w-full px-4 py-3 sm:py-4 bg-slate-700 border-2 border-slate-600 focus:border-cyan-500 rounded-xl text-white text-lg sm:text-xl text-center focus:outline-none transition-all"
            autoFocus
          />
          <div className="mt-3 flex items-center justify-center gap-2">
            {currentTerm.term.split('').map((char: string, idx: number) => {
              const typed = userInput[idx];
              const isCorrect = typed?.toLowerCase() === char.toLowerCase();
              const isTyped = idx < userInput.length;
              return (
                <span
                  key={idx}
                  className={`text-lg sm:text-xl font-mono ${
                    !isTyped ? 'text-slate-600' : isCorrect ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const TrueFalseGame = () => {
    const { questions, currentIndex, correctCount } = gameData;
    const currentQ = questions[currentIndex];
    const [answered, setAnswered] = useState<boolean | null>(null);
    const [selected, setSelected] = useState<boolean | null>(null);

    const handleAnswer = (answer: boolean) => {
      if (answered !== null) return;
      setSelected(answer);
      setAnswered(true);
      const isCorrect = answer === currentQ.isTrue;
      
      if (isCorrect) {
        setGameState((p: GameState) => ({ ...p, score: p.score + 100, streak: p.streak + 1 }));
        setGameData((prev: any) => ({ ...prev, correctCount: prev.correctCount + 1 }));
      } else {
        setGameState((p: GameState) => ({ ...p, streak: 0 }));
      }

      setTimeout(() => {
        if (currentIndex + 1 >= questions.length) {
          endGame();
        } else {
          setGameData((prev: any) => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
          setAnswered(null);
          setSelected(null);
        }
      }, 1500);
    };

    return (
      <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="text-white font-bold text-sm sm:text-base">{gameState.score}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              <span className="text-white text-sm sm:text-base">{correctCount}/{questions.length}</span>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-slate-400">
            Q{currentIndex + 1}
          </div>
        </div>

        <div className="bg-slate-800/30 rounded-2xl p-6 sm:p-8 min-h-[200px] flex flex-col justify-center">
          <p className="text-white text-lg sm:text-xl lg:text-2xl text-center leading-relaxed mb-6">
            {currentQ.statement}
          </p>
          {answered && (
            <div className={`text-center p-3 rounded-xl ${selected === currentQ.isTrue ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              <p className="font-semibold mb-1">{selected === currentQ.isTrue ? '✓ Correct!' : '✗ Wrong!'}</p>
              <p className="text-xs sm:text-sm opacity-80">{currentQ.explanation}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <button
            onClick={() => handleAnswer(true)}
            disabled={answered !== null}
            className={`py-4 sm:py-6 rounded-2xl font-bold text-lg sm:text-xl transition-all ${
              answered === null
                ? 'bg-green-500/20 hover:bg-green-500/30 border-2 border-green-500/50 text-green-400 hover:scale-105'
                : selected === true
                ? currentQ.isTrue
                  ? 'bg-green-500 border-2 border-green-400 text-white'
                  : 'bg-red-500 border-2 border-red-400 text-white'
                : 'bg-slate-700/50 border-2 border-slate-600 text-slate-500'
            }`}
          >
            TRUE
          </button>
          <button
            onClick={() => handleAnswer(false)}
            disabled={answered !== null}
            className={`py-4 sm:py-6 rounded-2xl font-bold text-lg sm:text-xl transition-all ${
              answered === null
                ? 'bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/50 text-red-400 hover:scale-105'
                : selected === false
                ? !currentQ.isTrue
                  ? 'bg-green-500 border-2 border-green-400 text-white'
                  : 'bg-red-500 border-2 border-red-400 text-white'
                : 'bg-slate-700/50 border-2 border-slate-600 text-slate-500'
            }`}
          >
            FALSE
          </button>
        </div>
      </div>
    );
  };

  const FillBlankGame = () => {
    const { sentences, currentIndex, correctCount } = gameData;
    const current = sentences[currentIndex];
    const [answer, setAnswer] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleSubmit = () => {
      if (!answer.trim() || submitted) return;
      const correct = answer.toLowerCase().trim() === current.answer;
      setIsCorrect(correct);
      setSubmitted(true);
      
      if (correct) {
        setGameState((p: GameState) => ({ ...p, score: p.score + 100, streak: p.streak + 1 }));
        setGameData((prev: any) => ({ ...prev, correctCount: prev.correctCount + 1 }));
      } else {
        setGameState((p: GameState) => ({ ...p, streak: 0 }));
      }

      setTimeout(() => {
        if (currentIndex + 1 >= sentences.length) {
          endGame();
        } else {
          setGameData((prev: any) => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
          setAnswer('');
          setSubmitted(false);
        }
      }, 2000);
    };

    return (
      <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="text-white font-bold text-sm sm:text-base">{gameState.score}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              <span className="text-white text-sm sm:text-base">{correctCount}/{sentences.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/30 rounded-2xl p-6 sm:p-8">
          <p className="text-slate-400 text-xs sm:text-sm mb-2">Question:</p>
          <p className="text-indigo-300 text-base sm:text-lg mb-4 sm:mb-6">{current.question}</p>
          
          <p className="text-slate-400 text-xs sm:text-sm mb-2">Fill in the blank:</p>
          <p className="text-white text-lg sm:text-xl mb-4 sm:mb-6 font-medium">
            {current.sentence}
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Type the missing word..."
              disabled={submitted}
              className="flex-1 px-4 py-3 bg-slate-700 border-2 border-slate-600 focus:border-indigo-500 rounded-xl text-white focus:outline-none disabled:opacity-50"
              autoFocus
            />
            <button
              onClick={handleSubmit}
              disabled={!answer.trim() || submitted}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-semibold"
            >
              Submit
            </button>
          </div>

          {submitted && (
            <div className={`mt-4 p-3 rounded-xl ${isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              <p className="font-semibold text-sm sm:text-base">
                {isCorrect ? '✓ Correct!' : `✗ The answer was: ${current.answer}`}
              </p>
              <p className="text-xs sm:text-sm mt-1 opacity-80">{current.fullAnswer}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const WordSearchGame = () => {
    const { words, foundWords } = gameData;
    const [guess, setGuess] = useState('');
    const [message, setMessage] = useState('Find terms from your study deck');

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const gridLetters = Array.from({ length: 144 }, (_, i) => {
      const sourceWord = words[i % Math.max(words.length, 1)] || '';
      return sourceWord[Math.floor(i / 12)] || letters[(i * 7 + 3) % letters.length];
    });

    const submitGuess = () => {
      const normalized = guess.replace(/[^a-zA-Z]/g, '').toUpperCase();
      if (!normalized) return;
      if (words.includes(normalized) && !foundWords.includes(normalized)) {
        const newFound = [...foundWords, normalized];
        setGameData((prev: any) => ({ ...prev, foundWords: newFound }));
        setGameState((prev: GameState) => ({ ...prev, score: prev.score + 75, streak: prev.streak + 1 }));
        setMessage(`Found ${normalized}!`);
        if (newFound.length === words.length) setTimeout(endGame, 700);
      } else if (foundWords.includes(normalized)) {
        setMessage('Already found. Try another word.');
      } else {
        setGameState((prev: GameState) => ({ ...prev, streak: 0 }));
        setMessage('Not in this puzzle. Keep looking.');
      }
      setGuess('');
    };

    return (
      <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-800/50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="text-white font-bold text-sm sm:text-base">{gameState.score}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              <span className="text-white text-xs sm:text-sm">{foundWords.length}/{words.length} found</span>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-slate-400">{message}</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">
          <div className="bg-slate-800/30 rounded-2xl p-3 sm:p-4 overflow-x-auto">
            <div className="grid grid-cols-12 gap-1 min-w-[360px] max-w-xl mx-auto">
              {gridLetters.map((letter, i) => (
                <div key={i} className="aspect-square rounded bg-slate-700/70 flex items-center justify-center text-[10px] sm:text-xs font-bold text-slate-200">
                  {letter}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-2">Word Bank</p>
              <div className="flex flex-wrap gap-1.5">
                {words.map((word: string) => (
                  <span key={word} className={`px-2 py-1 rounded text-[10px] sm:text-xs ${foundWords.includes(word) ? 'bg-green-500/20 text-green-400 line-through' : 'bg-slate-700 text-slate-300'}`}>
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                value={guess}
                onChange={(e) => setGuess(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && submitGuess()}
                placeholder="Type found word"
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button onClick={submitGuess} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-semibold">
                Check
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DragDropGame = () => {
    const { items, categories, dropped } = gameData;
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const currentItem = items[currentItemIndex];

    const sortIntoCategory = (categoryIndex: number) => {
      if (!currentItem) return;
      const correct = currentItem.category === categoryIndex;
      const newDropped = [...dropped, { ...currentItem, selectedCategory: categoryIndex, correct }];
      setGameData((prev: any) => ({ ...prev, dropped: newDropped }));
      setGameState((prev: GameState) => ({
        ...prev,
        score: prev.score + (correct ? 100 : 20),
        streak: correct ? prev.streak + 1 : 0,
      }));
      if (currentItemIndex + 1 >= items.length) {
        setTimeout(endGame, 700);
      } else {
        setCurrentItemIndex((prev) => prev + 1);
      }
    };

    return (
      <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-800/50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="text-white font-bold text-sm sm:text-base">{gameState.score}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
              <span className="text-white text-xs sm:text-sm">{gameState.streak} streak</span>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-slate-400">Card {Math.min(currentItemIndex + 1, items.length)}/{items.length}</div>
        </div>

        {currentItem && (
          <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl p-4 sm:p-6 text-center">
            <p className="text-xs text-slate-400 mb-2">Sort this term</p>
            <h3 className="text-lg sm:text-2xl font-bold text-white mb-2">{currentItem.term}</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">{currentItem.definition}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {categories.map((category: string, idx: number) => (
            <button
              key={category}
              onClick={() => sortIntoCategory(idx)}
              className="min-h-[96px] rounded-xl border-2 border-dashed border-slate-600 bg-slate-800/40 hover:border-indigo-400 hover:bg-indigo-500/10 transition-all p-4 text-left"
            >
              <p className="font-semibold text-white text-sm sm:text-base mb-1">{category}</p>
              <p className="text-xs text-slate-400">{dropped.filter((item: any) => item.selectedCategory === idx).length} sorted</p>
            </button>
          ))}
        </div>

        {dropped.length > 0 && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-2">Recently sorted</p>
            <div className="flex flex-wrap gap-2">
              {dropped.slice(-6).map((item: any) => (
                <span key={`${item.id}-${item.selectedCategory}`} className={`px-2 py-1 rounded text-xs ${item.correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {item.term}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==================== MAIN RENDER ====================

  if (gameComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 sm:space-y-6">
         <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🎉</div>
         <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Game Complete!</h2>
         <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-md">
           <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-3 sm:p-6">
             <Trophy className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-yellow-400 mx-auto mb-1 sm:mb-2" />
             <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{gameState.score}</div>
             <div className="text-xs sm:text-sm text-slate-400">Score</div>
           </div>
           <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-3 sm:p-6">
             <Flame className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-orange-500 mx-auto mb-1 sm:mb-2" />
             <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{gameState.bestStreak}</div>
             <div className="text-xs sm:text-sm text-slate-400">Streak</div>
           </div>
           <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-3 sm:p-6">
             <Timer className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-indigo-400 mx-auto mb-1 sm:mb-2" />
             <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{formatTime(timer)}</div>
             <div className="text-xs sm:text-sm text-slate-400">Time</div>
           </div>
         </div>
         <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
           <button
             onClick={resetGame}
             className="flex-1 px-4 sm:px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg sm:rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
           >
             <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
             <span className="hidden sm:inline">Choose Another Game</span>
             <span className="sm:hidden">Another</span>
           </button>
           <button
             onClick={() => startGame(gameMode!)}
             className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg sm:rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
           >
             <Play className="w-4 h-4 sm:w-5 sm:h-5" />
             Play Again
           </button>
         </div>
      </div>
    );
  }

  if (gameMode && gameData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={resetGame}
            className="p-2 hover:bg-slate-800 rounded-lg transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-slate-400" />
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-white capitalize">
            {gameMode.replace('-', ' ')} Game
          </h2>
        </div>

        {gameMode === 'matching' && <MatchingGame />}
        {gameMode === 'speed-quiz' && <SpeedQuiz />}
        {gameMode === 'flash-race' && <FlashRace />}
        {gameMode === 'memory' && <MemoryGame />}
        {gameMode === 'hangman' && <HangmanGame />}
        {gameMode === 'type-rush' && <TypeRushGame />}
        {gameMode === 'true-false' && <TrueFalseGame />}
        {gameMode === 'fill-blank' && <FillBlankGame />}
        {gameMode === 'word-search' && <WordSearchGame />}
        {gameMode === 'drag-drop' && <DragDropGame />}
        
        {/* Default Game View for remaining 20 games */}
        {!['matching', 'speed-quiz', 'flash-race', 'memory', 'hangman', 'type-rush', 'true-false', 'fill-blank', 'word-search', 'drag-drop'].includes(gameMode) && (
          <DefaultGameView />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Deck Selection */}
      <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6">
         <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-3">Select Deck</label>
         <select
           value={selectedDeck?.id || ''}
           onChange={(e) => setSelectedDeck(decks.find(d => d.id === e.target.value) || null)}
           className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg sm:rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
         >
           {decks.map(deck => (
             <option key={deck.id} value={deck.id}>{deck.name} ({deck.cards.length} cards)</option>
           ))}
         </select>
       </div>

        {/* Game Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {(() => {
          const allGamesList = [
            { mode: 'matching', title: 'Matching Game', desc: 'Match terms with definitions fast!', tag: 'Recall', gradient: 'from-indigo-500/20 to-purple-500/20', icon: <Grid3X3 className="w-6 h-6 text-indigo-400" />, badge: <Zap className="w-5 h-5 text-yellow-400" /> },
            { mode: 'speed-quiz', title: 'Speed Quiz', desc: 'Answer MCQ questions under time pressure!', tag: 'Quick thinking', gradient: 'from-emerald-500/20 to-teal-500/20', icon: <Target className="w-6 h-6 text-emerald-400" />, badge: <Clock className="w-5 h-5 text-orange-400" /> },
            { mode: 'flash-race', title: 'Flash Race', desc: 'Flip through cards rapidly and test knowledge!', tag: 'Speed review', gradient: 'from-rose-500/20 to-pink-500/20', icon: <Shuffle className="w-6 h-6 text-rose-400" />, badge: <Timer className="w-5 h-5 text-yellow-400" /> },
            { mode: 'memory', title: 'Memory Match', desc: 'Classic memory game with your flashcards!', tag: 'Visual', gradient: 'from-amber-500/20 to-orange-500/20', icon: <Brain className="w-6 h-6 text-amber-400" />, badge: <Star className="w-5 h-5 text-purple-400" /> },
            { mode: 'hangman', title: 'Hangman', desc: 'Guess the word before you run out of tries!', tag: 'Word game', gradient: 'from-violet-500/20 to-purple-500/20', icon: <Target className="w-6 h-6 text-violet-400" />, badge: <Flame className="w-5 h-5 text-red-400" /> },
            { mode: 'type-rush', title: 'Type Rush', desc: 'Type terms as fast as you can!', tag: 'Typing', gradient: 'from-cyan-500/20 to-blue-500/20', icon: <Zap className="w-6 h-6 text-cyan-400" />, badge: <Clock className="w-5 h-5 text-yellow-400" /> },
            { mode: 'true-false', title: 'True/False', desc: 'Lightning-fast true or false questions!', tag: 'Quick', gradient: 'from-green-500/20 to-emerald-500/20', icon: <Target className="w-6 h-6 text-green-400" />, badge: <Shuffle className="w-5 h-5 text-blue-400" /> },
            { mode: 'fill-blank', title: 'Fill Blank', desc: 'Complete the sentences!', tag: 'Recall', gradient: 'from-pink-500/20 to-rose-500/20', icon: <Brain className="w-6 h-6 text-pink-400" />, badge: <Star className="w-5 h-5 text-yellow-400" /> },
            { mode: 'word-search', title: 'Word Search', desc: 'Find hidden terms from your deck.', tag: 'Puzzle', gradient: 'from-blue-500/20 to-cyan-500/20', icon: <Grid3X3 className="w-6 h-6 text-blue-400" />, badge: <Target className="w-5 h-5 text-cyan-400" /> },
            { mode: 'drag-drop', title: 'Category Sort', desc: 'Sort concepts into the right category.', tag: 'Sorting', gradient: 'from-slate-500/20 to-indigo-500/20', icon: <Shuffle className="w-6 h-6 text-indigo-300" />, badge: <Star className="w-5 h-5 text-indigo-400" /> },
            
            // Additional 20 games
            { mode: 'anagrams', title: 'Anagrams', desc: 'Unscramble mixed letters of a term.', tag: 'Letters', gradient: 'from-fuchsia-500/20 to-purple-500/20', icon: <Brain className="w-6 h-6 text-fuchsia-400" />, badge: <Target className="w-5 h-5 text-purple-400" /> },
            { mode: 'jeopardy', title: 'Jeopardy', desc: 'Given a definition, identify the term.', tag: 'Reverse Recall', gradient: 'from-amber-500/20 to-yellow-500/20', icon: <Target className="w-6 h-6 text-amber-400" />, badge: <Zap className="w-5 h-5 text-yellow-400" /> },
            { mode: 'millionaire', title: 'Who Wants To Be A Master', desc: 'Answer 15 sequential questions.', tag: 'Knowledge', gradient: 'from-emerald-500/20 to-green-500/20', icon: <Trophy className="w-6 h-6 text-emerald-400" />, badge: <Star className="w-5 h-5 text-green-400" /> },
            { mode: 'flash-swipe', title: 'Flash Swipe', desc: 'Swipe cards you know and don\'t.', tag: 'Speed Review', gradient: 'from-pink-500/20 to-rose-500/20', icon: <Shuffle className="w-6 h-6 text-pink-400" />, badge: <Timer className="w-5 h-5 text-rose-400" /> },
            { mode: 'odd-one-out', title: 'Odd One Out', desc: 'Identify which concept doesn\'t belong.', tag: 'Logic', gradient: 'from-red-500/20 to-orange-500/20', icon: <Brain className="w-6 h-6 text-red-400" />, badge: <Target className="w-5 h-5 text-orange-400" /> },
            { mode: 'daily-word', title: 'Daily Wordle', desc: 'Guess the hidden study term.', tag: 'Letters', gradient: 'from-teal-500/20 to-green-500/20', icon: <Grid3X3 className="w-6 h-6 text-teal-400" />, badge: <Zap className="w-5 h-5 text-green-400" /> },
            { mode: 'audio-quiz', title: 'Audio Quiz', desc: 'Listen to the card and choose.', tag: 'Listening', gradient: 'from-cyan-500/20 to-indigo-500/20', icon: <Target className="w-6 h-6 text-cyan-400" />, badge: <Clock className="w-5 h-5 text-indigo-400" /> },
            { mode: 'fact-fiction', title: 'Fact vs Fiction', desc: 'Decide if statements are facts or made up.', tag: 'Analysis', gradient: 'from-blue-500/20 to-purple-500/20', icon: <Brain className="w-6 h-6 text-blue-400" />, badge: <Shuffle className="w-5 h-5 text-purple-400" /> },
            { mode: 'letter-drop', title: 'Letter Drop', desc: 'Uncover missing letters.', tag: 'Guessing', gradient: 'from-rose-500/20 to-purple-500/20', icon: <Grid3X3 className="w-6 h-6 text-rose-400" />, badge: <Target className="w-5 h-5 text-purple-400" /> },
            { mode: 'speed-sort', title: 'Speed Sorting', desc: 'Sort cards against the clock.', tag: 'Agility', gradient: 'from-green-500/20 to-yellow-500/20', icon: <Shuffle className="w-6 h-6 text-green-400" />, badge: <Clock className="w-5 h-5 text-yellow-400" /> },
            { mode: 'reverse-memory', title: 'Reverse Memory', desc: 'Hide terms, find them with definitions.', tag: 'Memory', gradient: 'from-indigo-500/20 to-cyan-500/20', icon: <Brain className="w-6 h-6 text-indigo-400" />, badge: <Star className="w-5 h-5 text-cyan-400" /> },
            { mode: 'sentence-builder', title: 'Sentence Builder', desc: 'Arrange words into the correct definition.', tag: 'Grammar', gradient: 'from-orange-500/20 to-pink-500/20', icon: <Target className="w-6 h-6 text-orange-400" />, badge: <Shuffle className="w-5 h-5 text-pink-400" /> },
            { mode: 'crossword-clues', title: 'Crossword Clues', desc: 'Decode mini-puzzles.', tag: 'Vocabulary', gradient: 'from-violet-500/20 to-fuchsia-500/20', icon: <Grid3X3 className="w-6 h-6 text-violet-400" />, badge: <Zap className="w-5 h-5 text-fuchsia-400" /> },
            { mode: 'trivia-crack', title: 'Trivia Crack', desc: 'Answer across randomized card topics.', tag: 'Trivia', gradient: 'from-yellow-500/20 to-amber-500/20', icon: <Trophy className="w-6 h-6 text-yellow-400" />, badge: <Clock className="w-5 h-5 text-amber-400" /> },
            { mode: 'connect-four', title: 'Connect 4 matching', desc: 'Drop pairs to connect.', tag: 'Strategy', gradient: 'from-sky-500/20 to-blue-500/20', icon: <Shuffle className="w-6 h-6 text-sky-400" />, badge: <Target className="w-5 h-5 text-blue-400" /> },
            { mode: 'term-tycoon', title: 'Term Tycoon', desc: 'Bet points on how well you know answers.', tag: 'Gambling XP', gradient: 'from-green-500/20 to-emerald-500/20', icon: <Target className="w-6 h-6 text-green-400" />, badge: <Zap className="w-5 h-5 text-emerald-400" /> },
            { mode: 'definition-link', title: 'Definition Link', desc: 'Map definitions across categories.', tag: 'Mapping', gradient: 'from-purple-500/20 to-slate-500/20', icon: <Brain className="w-6 h-6 text-purple-400" />, badge: <Shuffle className="w-5 h-5 text-slate-400" /> },
            { mode: 'word-puzzle', title: 'Word Puzzle', desc: 'Assemble the final term from pieces.', tag: 'Puzzle', gradient: 'from-amber-500/20 to-red-500/20', icon: <Grid3X3 className="w-6 h-6 text-amber-400" />, badge: <Target className="w-5 h-5 text-red-400" /> },
            { mode: 'speed-type', title: 'Speed Type', desc: 'Input the phrase before time runs out.', tag: 'Speed', gradient: 'from-teal-500/20 to-cyan-500/20', icon: <Zap className="w-6 h-6 text-teal-400" />, badge: <Clock className="w-5 h-5 text-cyan-400" /> },
            { mode: 'blind-recall', title: 'Blind Recall', desc: 'Write everything about a term.', tag: 'Strict recall', gradient: 'from-red-500/20 to-indigo-500/20', icon: <Brain className="w-6 h-6 text-red-400" />, badge: <Target className="w-5 h-5 text-indigo-400" /> }
          ];

          return allGamesList.map((game) => (
            <button
              key={game.mode}
              onClick={() => startGame(game.mode as GameMode)}
              className={`bg-gradient-to-br ${game.gradient} border-2 border-indigo-500/30 hover:border-indigo-500/60 rounded-2xl p-4 sm:p-6 transition-all group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-800/40 rounded-xl">
                  {game.icon}
                </div>
                {game.badge}
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2">{game.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">{game.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{game.tag}</span>
                <Play className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
              </div>
            </button>
          ));
        })()}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 text-center">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-lg sm:text-xl font-bold text-white">{gameState.highScore}</div>
          <div className="text-xs text-slate-400">High Score</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 text-center">
          <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 mx-auto mb-2" />
          <div className="text-lg sm:text-xl font-bold text-white">{gameState.bestStreak}</div>
          <div className="text-xs text-slate-400">Best Streak</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 text-center">
          <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-lg sm:text-xl font-bold text-white">{decks.length}</div>
          <div className="text-xs text-slate-400">Decks</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 text-center">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mx-auto mb-2" />
          <div className="text-lg sm:text-xl font-bold text-white">Active</div>
          <div className="text-xs text-slate-400">Status</div>
        </div>
      </div>
    </div>
  );
};

export default StudyGames;
