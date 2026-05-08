import { 
  MessageSquare, 
  Video, 
  Podcast, 
  Code, 
  TrendingUp, 
  Clock, 
  Sparkles,
  ArrowRight,
  Play,
  Zap,
  Brain,
  ClipboardList,
} from 'lucide-react';

type Section = 'dashboard' | 'chat' | 'videos' | 'podcasts' | 'academy' | 'library' | 'flashcards' | 'quizzes' | 'pricing' | 'billing' | 'games';

interface DashboardProps {
  onNavigate: (section: Section) => void;
  userName?: string;
}

const quickActions = [
  { 
    id: 'chat', 
    title: 'Start Learning', 
    subtitle: 'Chat with AI Tutor',
    icon: MessageSquare,
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-500/10',
    description: 'Ask questions, get explanations on any topic'
  },
  { 
    id: 'videos', 
    title: 'Generate Video', 
    subtitle: 'AI Tutorial Creator',
    icon: Video,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/10',
    description: 'Transform materials into engaging video lessons'
  },
  { 
    id: 'podcasts', 
    title: 'Create Podcast', 
    subtitle: 'Audio Learning',
    icon: Podcast,
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-500/10',
    description: 'Listen to AI-generated audio explanations'
  },

];

const studyTools = [
  {
    id: 'flashcards',
    title: 'Flashcards',
    subtitle: 'Study & Memorize',
    icon: Brain,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    description: 'Create decks, flip cards, track mastery',
    stats: '3 decks • 13 cards'
  },
  {
    id: 'quizzes',
    title: 'Quiz Studio',
    subtitle: 'Test Your Knowledge',
    icon: ClipboardList,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    description: 'Objective MCQ or Theory-based assessments',
    stats: 'Objective & Theory modes'
  },
];

const recentActivity = [
  { 
    type: 'video',
    title: 'Introduction to Machine Learning',
    duration: '8:32',
    date: '2 hours ago',
    progress: 100
  },
  { 
    type: 'chat',
    title: 'Understanding Neural Networks',
    messages: 24,
    date: 'Yesterday',
    progress: 60
  },
  { 
    type: 'podcast',
    title: 'Python Best Practices',
    duration: '15:00',
    date: '3 days ago',
    progress: 100
  },
  { 
    type: 'quiz',
    title: 'JavaScript Fundamentals Quiz',
    score: '85%',
    date: '4 days ago',
    progress: 100
  },
  { 
    type: 'flashcard',
    title: 'Machine Learning Basics Deck',
    cards: 6,
    date: '5 days ago',
    progress: 50
  },
];

const learningStreak = {
  current: 7,
  longest: 14,
  thisWeek: [
    { day: 'Mon', completed: true },
    { day: 'Tue', completed: true },
    { day: 'Wed', completed: true },
    { day: 'Thu', completed: true },
    { day: 'Fri', completed: true },
    { day: 'Sat', completed: true },
    { day: 'Sun', completed: false },
  ]
};

export default function Dashboard({ onNavigate, userName = 'Learner' }: DashboardProps) {
  return (
    <div className="space-y-4 sm:space-y-5 max-w-screen-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
            Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{userName.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-sm text-slate-400">Ready to continue your learning journey?</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl flex-shrink-0">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-amber-400 font-semibold text-sm">{learningStreak.current} Day Streak!</span>
        </div>
      </div>

      {/* Upgrade Banner */}
      <button
        onClick={() => onNavigate('pricing')}
        className="w-full group relative overflow-hidden bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 border border-indigo-500/30 rounded-xl p-3.5 text-left hover:from-indigo-600/30 hover:via-purple-600/30 hover:to-pink-600/30 transition-all duration-300"
      >
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Unlock Unlimited Learning</h3>
              <p className="text-xs text-slate-400">Upgrade to Pro for unlimited AI features</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold rounded-lg flex-shrink-0">
            View Plans
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </button>

      {/* Stats Row */}
      <div data-tour="dashboard-stats" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        {[
          { label: 'Courses', value: '12', sub: '+3 this month', color: 'indigo', Icon: TrendingUp },
          { label: 'Videos', value: '28', sub: '8h content', color: 'purple', Icon: Video },
          { label: 'Podcasts', value: '15', sub: '5h audio', color: 'pink', Icon: Podcast },
          { label: 'Flashcards', value: '156', sub: '78% mastered', color: 'amber', Icon: Brain },
          { label: 'Quizzes', value: '24', sub: '82% avg score', color: 'emerald', Icon: ClipboardList },
        ].map(({ label, value, sub, color, Icon }) => (
          <div key={label} className={`bg-gradient-to-br from-${color}-500/10 to-${color}-600/5 border border-${color}-500/20 rounded-xl p-3`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-${color}-400 text-[11px] font-medium`}>{label}</span>
              <Icon className={`w-3.5 h-3.5 text-${color}-400`} />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3 sm:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onNavigate(action.id as Section)}
                className="group relative overflow-hidden bg-[#1E293B] border border-slate-700/50 rounded-xl p-4 text-left hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className={`w-9 h-9 ${action.bgColor} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4 text-slate-300" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{action.title}</h3>
                <p className="text-xs text-slate-400 mb-2">{action.subtitle}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">{action.description}</p>
                <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Study Tools - Flashcards & Quizzes */}
      <div>
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3 sm:mb-4">Study Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {studyTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onNavigate(tool.id as Section)}
                className="group relative overflow-hidden bg-[#1E293B] border border-slate-700/50 rounded-xl p-3.5 text-left hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 ${tool.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4 text-slate-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">{tool.title}</h3>
                      <p className="text-xs text-slate-400">{tool.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">{tool.description}</p>
                <p className="text-[10px] text-indigo-400 mt-1">{tool.stats}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-[#1E293B] border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-xl font-semibold text-white">Recent Activity</h2>
            <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">View All</button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  item.type === 'video' ? 'bg-purple-500/20' : 
                  item.type === 'podcast' ? 'bg-pink-500/20' : 
                  item.type === 'quiz' ? 'bg-emerald-500/20' :
                  item.type === 'flashcard' ? 'bg-amber-500/20' :
                  'bg-indigo-500/20'
                }`}>
                  {item.type === 'video' && <Video className="w-5 h-5 text-purple-400" />}
                  {item.type === 'podcast' && <Podcast className="w-5 h-5 text-pink-400" />}
                  {item.type === 'chat' && <MessageSquare className="w-5 h-5 text-indigo-400" />}
                  {item.type === 'quiz' && <ClipboardList className="w-5 h-5 text-emerald-400" />}
                  {item.type === 'flashcard' && <Brain className="w-5 h-5 text-amber-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white group-hover:text-indigo-300 transition-colors text-sm truncate">{item.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-400">{item.date}</span>
                    {item.duration && (
                      <span className="text-xs text-slate-500">• {item.duration}</span>
                    )}
                    {item.messages && (
                      <span className="text-xs text-slate-500">• {item.messages} messages</span>
                    )}
                    {item.score && (
                      <span className="text-xs text-slate-500">• Score: {item.score}</span>
                    )}
                    {item.cards && (
                      <span className="text-xs text-slate-500">• {item.cards} cards</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.progress === 100 ? (
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                      Done
                    </span>
                  ) : (
                    <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                  <button className="p-1.5 bg-slate-700/50 rounded-lg text-slate-400 hover:text-white hover:bg-slate-600/50 transition-all">
                    <Play className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Streak */}
        <div className="bg-[#1E293B] border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-xl font-semibold text-white">Weekly Goal</h2>
            <span className="text-sm text-slate-400">7/7 days</span>
          </div>
          
          {/* Progress Circle */}
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="12"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${6 * 35.2} 352`}
                  className="transition-all duration-500"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">85%</span>
                <span className="text-xs text-slate-400">Complete</span>
              </div>
            </div>
          </div>

          {/* Weekly Days */}
          <div className="flex justify-between">
            {learningStreak.thisWeek.map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  day.completed 
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white' 
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {day.completed ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </div>
                <span className={`text-xs ${day.completed ? 'text-slate-300' : 'text-slate-500'}`}>
                  {day.day}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-300">Keep it up!</span>
            </div>
            <p className="text-xs text-slate-400">
              You're on a {learningStreak.current} day streak. Your longest streak is {learningStreak.longest} days!
            </p>
          </div>
        </div>
      </div>

      {/* Featured Courses */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-xl font-semibold text-white">Continue Learning</h2>
          <button 
            onClick={() => onNavigate('academy')}
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
          >
            Browse All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {[
            { name: 'JavaScript', progress: 72, lessons: 24, color: 'from-yellow-400 to-amber-500' },
            { name: 'Python', progress: 45, lessons: 18, color: 'from-blue-400 to-cyan-500' },
            { name: 'React', progress: 88, lessons: 32, color: 'from-cyan-400 to-sky-500' },
            { name: 'Machine Learning', progress: 30, lessons: 40, color: 'from-purple-400 to-pink-500' },
          ].map((course, index) => (
            <div key={index} className="group bg-[#1E293B] border border-slate-700/50 rounded-xl p-3.5 hover:border-slate-600/50 transition-all cursor-pointer">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${course.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Code className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-0.5 truncate">{course.name}</h3>
              <p className="text-xs text-slate-400 mb-2">{course.lessons} lessons</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${course.color} rounded-full transition-all`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-300">{course.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
