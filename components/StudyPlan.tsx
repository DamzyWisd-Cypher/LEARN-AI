import { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
  Flame,
  Trophy,
  Award,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Brain,
  Star,
  Zap
} from 'lucide-react';

interface StudyTask {
  id: string;
  title: string;
  type: 'flashcard' | 'quiz' | 'video' | 'reading' | 'review';
  duration: number; // minutes
  completed: boolean;
  scheduledDate: string;
  priority: 'high' | 'medium' | 'low';
  topic?: string;
}

interface StudyGoal {
  dailyMinutes: number;
  weeklyStreak: number;
  totalStudyTime: number;
  completedTasks: number;
  masteryLevel: number;
}

const StudyPlan = ({ decks }: { decks: any[] }) => {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [goal, setGoal] = useState<StudyGoal>({
    dailyMinutes: 30,
    weeklyStreak: 0,
    totalStudyTime: 0,
    completedTasks: 0,
    masteryLevel: 0,
  });
  const [isTracking, setIsTracking] = useState(false);
  const [trackingTime, setTrackingTime] = useState(0);

  // Timer for study sessions
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        setTrackingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  // Generate study plan based on spaced repetition
  useEffect(() => {
    generateStudyPlan();
  }, [decks]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateStudyPlan = () => {
    const today = new Date();
    const newTasks: StudyTask[] = [];
    const topics = ['Machine Learning', 'JavaScript', 'Data Structures', 'Algorithms', 'Web Development'];

    // Generate tasks for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      // 2-3 tasks per day
      const tasksPerDay = 2 + (i % 2);
      for (let j = 0; j < tasksPerDay; j++) {
        const taskTypes: StudyTask['type'][] = ['flashcard', 'quiz', 'video', 'review'];
        newTasks.push({
          id: `task-${dateStr}-${i}-${j}`,
          title: `Study: ${topics[(i + j) % topics.length]}`,
          type: taskTypes[(i + j) % taskTypes.length],
          duration: 15 + (j * 10),
          completed: i < 2, // Mark first 2 days as completed
          scheduledDate: dateStr,
          priority: i === 0 ? 'high' : i < 4 ? 'medium' : 'low',
          topic: topics[(i + j) % topics.length],
        });
      }
    }
    setTasks(newTasks);
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    if (tasks.find(t => t.id === taskId)?.completed === false) {
      setGoal(prev => ({
        ...prev,
        completedTasks: prev.completedTasks + 1,
        totalStudyTime: prev.totalStudyTime + 15,
      }));
    }
  };

  const startTracking = () => {
    setIsTracking(true);
    setTrackingTime(0);
  };

  const stopTracking = () => {
    setIsTracking(false);
    setGoal(prev => ({
      ...prev,
      totalStudyTime: prev.totalStudyTime + Math.floor(trackingTime / 60),
    }));
    setTrackingTime(0);
  };

  const getTasksForDate = (date: string) => {
    return tasks.filter(t => t.scheduledDate === date);
  };

  const getTodayProgress = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = getTasksForDate(today);
    const completed = todayTasks.filter(t => t.completed).length;
    return todayTasks.length > 0 ? (completed / todayTasks.length) * 100 : 0;
  };

  const getMilestones = () => [
    { title: 'First Session', icon: <Play className="w-5 h-5" />, achieved: goal.completedTasks >= 1 },
    { title: '5 Tasks Done', icon: <CheckCircle2 className="w-5 h-5" />, achieved: goal.completedTasks >= 5 },
    { title: '1 Hour Studied', icon: <Clock className="w-5 h-5" />, achieved: goal.totalStudyTime >= 60 },
    { title: 'Halfway There', icon: <TrendingUp className="w-5 h-5" />, achieved: goal.completedTasks >= 10 },
    { title: 'Master Learner', icon: <Award className="w-5 h-5" />, achieved: goal.completedTasks >= 20 },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  const getTypeIcon = (type: StudyTask['type']) => {
    switch (type) {
      case 'flashcard': return <Brain className="w-4 h-4" />;
      case 'quiz': return <Target className="w-4 h-4" />;
      case 'video': return <Play className="w-4 h-4" />;
      case 'reading': return <BookOpen className="w-4 h-4" />;
      case 'review': return <RotateCcw className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Personalized Study Plan</h2>
          <p className="text-slate-400 text-sm sm:text-base">AI-ordered topics based on your learning progress</p>
        </div>
        <div className="flex items-center gap-3">
          {!isTracking ? (
            <button
              onClick={startTracking}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Start Session</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="px-4 sm:px-6 py-2 sm:py-3 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                <span className="text-white font-mono text-sm sm:text-base">{formatTime(trackingTime)}</span>
              </div>
              <button
                onClick={stopTracking}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-xl font-semibold transition-all flex items-center gap-2"
              >
                <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Stop</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
            <span className="text-xs sm:text-sm text-slate-400">Daily Goal</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">{goal.dailyMinutes} min</div>
          <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
              style={{ width: `${Math.min(getTodayProgress(), 100)}%` }}
            />
          </div>
          <div className="mt-1 text-xs text-slate-400">{Math.round(getTodayProgress())}% complete</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
            <span className="text-xs sm:text-sm text-slate-400">Streak</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">{goal.weeklyStreak} days</div>
          <div className="mt-2 flex items-center gap-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                  i < goal.weeklyStreak ? 'bg-orange-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            <span className="text-xs sm:text-sm text-slate-400">Completed</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">{goal.completedTasks}</div>
          <div className="mt-2 text-xs text-slate-400">tasks done</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            <span className="text-xs sm:text-sm text-slate-400">Total Time</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">{Math.floor(goal.totalStudyTime / 60)}h</div>
          <div className="mt-2 text-xs text-slate-400">{goal.totalStudyTime % 60}m remaining</div>
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
          Achievements
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {getMilestones().map((milestone, _idx) => (
            <div
              key={_idx}
              className={`flex flex-col items-center text-center p-3 sm:p-4 rounded-xl transition-all ${
                milestone.achieved
                  ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                  : 'bg-slate-700/50 border border-slate-600 opacity-50'
              }`}
            >
              <div className={`p-2 sm:p-3 rounded-full mb-2 ${
                milestone.achieved ? 'bg-yellow-500/20' : 'bg-slate-600/50'
              }`}>
                {milestone.icon}
              </div>
              <div className="text-xs sm:text-sm font-medium text-white">{milestone.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
          This Week's Schedule
        </h3>

        <div className="space-y-3">
          {tasks.slice(0, 5).map((task) => {
            const date = new Date(task.scheduledDate);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = date.getDate();
            const isToday = task.scheduledDate === new Date().toISOString().split('T')[0];

            return (
              <div
                key={task.id}
                className={`bg-slate-700/50 rounded-xl p-3 sm:p-4 border transition-all ${
                  isToday ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`mt-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-slate-500 hover:border-indigo-400'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`font-semibold ${task.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
                          {task.title}
                        </h4>
                        {isToday && (
                          <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded-full">Today</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <div className="flex items-center gap-1 text-sm text-slate-400">
                          {getTypeIcon(task.type)}
                          <span className="capitalize">{task.type}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-slate-400">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          {task.duration} min
                        </div>
                        <span className={`px-2 py-0.5 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-white">{dayName}</div>
                    <div className="text-xs text-slate-400">{dayNum}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button className="p-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 hover:border-indigo-500/60 rounded-xl transition-all text-center group">
          <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-sm sm:text-base font-semibold text-white">Quick Review</div>
          <div className="text-xs text-slate-400">5 min session</div>
        </button>
        <button className="p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 hover:border-emerald-500/60 rounded-xl transition-all text-center group">
          <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-sm sm:text-base font-semibold text-white">Flashcards</div>
          <div className="text-xs text-slate-400">Due: 12 cards</div>
        </button>
        <button className="p-4 bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-500/30 hover:border-rose-500/60 rounded-xl transition-all text-center group">
          <Target className="w-6 h-6 sm:w-8 sm:h-8 text-rose-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-sm sm:text-base font-semibold text-white">Practice Quiz</div>
          <div className="text-xs text-slate-400">10 questions</div>
        </button>
        <button className="p-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 hover:border-amber-500/60 rounded-xl transition-all text-center group">
          <Star className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-sm sm:text-base font-semibold text-white">Set Goal</div>
          <div className="text-xs text-slate-400">Adjust daily</div>
        </button>
      </div>
    </div>
  );
};

export default StudyPlan;
