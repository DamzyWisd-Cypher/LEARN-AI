import { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Upload, 
  Play, 
  Pause, 
  Clock, 
  Settings, 
  Sparkles,
  Check,
  X,
  Download,
  RefreshCw,
  FileText,
  Wand2,
  Loader2,
  Film,
  Volume2,
  Subtitles,
  Languages,
  Edit3,
  Plus,
  Trash2,
  Save,
  ChevronDown,
  Mic,
  Video as VideoIcon,
  Clapperboard
} from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  startTime: number; // in seconds
  endTime: number;
}

interface GeneratedVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  status: 'generating' | 'ready';
  progress: number;
  createdAt: Date;
  topic: string;
  chapters: Chapter[];
  language: string;
}

interface GenerationStage {
  name: string;
  message: string;
  progressStart: number;
  progressEnd: number;
  duration: number; // estimated duration in ms
}

const videoHistory: GeneratedVideo[] = [
  {
    id: '1',
    title: 'Introduction to React Hooks',
    duration: '5:32',
    thumbnail: 'react',
    status: 'ready',
    progress: 100,
    createdAt: new Date(Date.now() - 86400000),
    topic: 'React Development',
    chapters: [
      { id: 'c1', title: 'Introduction', startTime: 0, endTime: 60 },
      { id: 'c2', title: 'useState Hook', startTime: 60, endTime: 180 },
      { id: 'c3', title: 'useEffect Hook', startTime: 180, endTime: 280 },
      { id: 'c4', title: 'Custom Hooks', startTime: 280, endTime: 332 },
    ],
    language: 'en'
  },
  {
    id: '2',
    title: 'Understanding Python Decorators',
    duration: '8:15',
    thumbnail: 'python',
    status: 'ready',
    progress: 100,
    createdAt: new Date(Date.now() - 172800000),
    topic: 'Python Programming',
    chapters: [
      { id: 'c1', title: 'What are Decorators?', startTime: 0, endTime: 90 },
      { id: 'c2', title: 'Function Basics', startTime: 90, endTime: 200 },
      { id: 'c3', title: 'Creating Decorators', startTime: 200, endTime: 350 },
      { id: 'c4', title: 'Real-world Examples', startTime: 350, endTime: 495 },
    ],
    language: 'en'
  },
  {
    id: '3',
    title: 'Machine Learning Basics Explained',
    duration: '12:45',
    thumbnail: 'ml',
    status: 'ready',
    progress: 100,
    createdAt: new Date(Date.now() - 604800000),
    topic: 'Artificial Intelligence',
    chapters: [
      { id: 'c1', title: 'Introduction to ML', startTime: 0, endTime: 120 },
      { id: 'c2', title: 'Supervised Learning', startTime: 120, endTime: 300 },
      { id: 'c3', title: 'Unsupervised Learning', startTime: 300, endTime: 480 },
      { id: 'c4', title: 'Neural Networks', startTime: 480, endTime: 600 },
      { id: 'c5', title: 'Applications', startTime: 600, endTime: 765 },
    ],
    language: 'en'
  },
];

const topicSuggestions = [
  'JavaScript Fundamentals',
  'Data Structures & Algorithms',
  'Cloud Computing Basics',
  'Database Design',
  'API Development',
];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

interface DurationPreset {
  value: string;
  label: string;
  category: 'short' | 'medium' | 'long' | 'extended';
  description: string;
}

const durationPresets: DurationPreset[] = [
  { value: '1', label: '1 min', category: 'short', description: 'Quick overview' },
  { value: '2', label: '2 min', category: 'short', description: 'Brief summary' },
  { value: '3', label: '3 min', category: 'short', description: 'Concise explanation' },
  { value: '5', label: '5 min', category: 'medium', description: 'Standard lesson' },
  { value: '7', label: '7 min', category: 'medium', description: 'Detailed overview' },
  { value: '10', label: '10 min', category: 'medium', description: 'In-depth tutorial' },
  { value: '15', label: '15 min', category: 'long', description: 'Comprehensive guide' },
  { value: '20', label: '20 min', category: 'long', description: 'Deep dive' },
  { value: '30', label: '30 min', category: 'long', description: 'Full lecture' },
  { value: '45', label: '45 min', category: 'extended', description: 'Masterclass' },
  { value: '60', label: '60 min', category: 'extended', description: 'Complete course' },
];

const durationCategories = {
  short: { label: 'Short', icon: '⚡', color: 'from-green-500 to-emerald-500' },
  medium: { label: 'Medium', icon: '📚', color: 'from-blue-500 to-indigo-500' },
  long: { label: 'Long', icon: '🎓', color: 'from-purple-500 to-pink-500' },
  extended: { label: 'Extended', icon: '🏆', color: 'from-orange-500 to-red-500' },
};

function getGenerationStages(videoMinutes: number): GenerationStage[] {
  const multiplier = Math.max(0.5, videoMinutes / 5);
  return [
    { name: 'analyzing', message: 'Analyzing content structure...', progressStart: 0, progressEnd: 12, duration: 1200 * multiplier },
    { name: 'scripting', message: `Generating tutor script for ${videoMinutes}min video...`, progressStart: 12, progressEnd: 30, duration: 2000 * multiplier },
    { name: 'chapters', message: 'Creating chapter markers...', progressStart: 30, progressEnd: 40, duration: 1000 * multiplier },
    { name: 'voice', message: `Synthesizing tutor voice (${videoMinutes}min audio)...`, progressStart: 40, progressEnd: 60, duration: 3000 * multiplier },
    { name: 'visuals', message: 'Generating AI visuals and animations...', progressStart: 60, progressEnd: 80, duration: 2500 * multiplier },
    { name: 'rendering', message: `Rendering ${videoMinutes}min video (this may take a moment)...`, progressStart: 80, progressEnd: 96, duration: 4000 * multiplier },
    { name: 'finalizing', message: 'Finalizing and saving...', progressStart: 96, progressEnd: 100, duration: 600 },
  ];
}

function getEstimatedGenerationTime(minutes: number): string {
  const baseSeconds = 15 + (minutes * 2.5);
  if (baseSeconds < 60) return `~${Math.round(baseSeconds)} seconds`;
  const mins = Math.floor(baseSeconds / 60);
  const secs = Math.round(baseSeconds % 60);
  return secs > 0 ? `~${mins}m ${secs}s` : `~${mins} minutes`;
}

export default function VideoGenerator() {
  const [content, setContent] = useState('');
  const [videoLength, setVideoLength] = useState('5');
  const [customDuration, setCustomDuration] = useState('');
  const [useCustomDuration, setUseCustomDuration] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [complexity, setComplexity] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [voiceStyle, setVoiceStyle] = useState<'friendly' | 'professional' | 'energetic'>('friendly');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<string>('');
  const [stageMessage, setStageMessage] = useState<string>('');
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>(videoHistory);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showChapterEditor, setShowChapterEditor] = useState(false);
  const [pendingChapters, setPendingChapters] = useState<Chapter[]>([]);
  const [pendingVideoData, setPendingVideoData] = useState<Partial<GeneratedVideo> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  // Close language dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    
    if (ext === 'pdf') {
      const extractPDFContent = async () => {
        try {
          const { extractPDFText } = await import('../utils/pdfUtils');
          const pdfData = await extractPDFText(file, 5);
          setContent(pdfData.text);
          setUploadedFile(file);
        } catch (error) {
          console.error('PDF extraction failed:', error);
          setContent(`Content from ${file.name}:\n\nThis PDF covers important study materials that will be turned into an engaging video lesson.`);
          setUploadedFile(file);
        }
      };
      extractPDFContent();
    } else {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setContent(event.target?.result as string || '');
      };
      reader.readAsText(file);
    }
  };

  const generateVideo = async () => {
    if (!content.trim() && !uploadedFile) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentStage('');

    // Get dynamic generation stages based on selected duration
    const actualMinutes = useCustomDuration ? parseInt(customDuration) || 5 : parseInt(videoLength);
    const stages = getGenerationStages(actualMinutes);

    // Simulate granular generation stages
    for (const stage of stages) {
      setCurrentStage(stage.name);
      setStageMessage(stage.message);
      
      // Animate progress within this stage
      const steps = 10;
      const stepDuration = stage.duration / steps;
      const progressStep = (stage.progressEnd - stage.progressStart) / steps;
      
      for (let i = 0; i < steps; i++) {
        await new Promise((resolve) => setTimeout(resolve, stepDuration));
        setGenerationProgress(stage.progressStart + (progressStep * (i + 1)));
      }
    }

    // Generate initial chapters scaled to duration
    const durationSeconds = actualMinutes * 60;
    const numChapters = Math.max(3, Math.min(15, Math.floor(durationSeconds / 120)));
    const chapterDuration = durationSeconds / numChapters;
    
    const initialChapters: Chapter[] = Array.from({ length: numChapters }, (_, i) => ({
      id: `chapter-${Date.now()}-${i}`,
      title: `Chapter ${i + 1}`,
      startTime: Math.round(i * chapterDuration),
      endTime: Math.round((i + 1) * chapterDuration),
    }));

    const durationDisplay = actualMinutes >= 60 
      ? `${Math.floor(actualMinutes / 60)}h ${actualMinutes % 60 > 0 ? `${actualMinutes % 60}m` : '00m'}`
      : `${actualMinutes}:00`;

    const newVideoData: Partial<GeneratedVideo> = {
      id: Date.now().toString(),
      title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
      duration: durationDisplay,
      thumbnail: 'new',
      topic: complexity.charAt(0).toUpperCase() + complexity.slice(1),
      language: selectedLanguage,
    };

    setPendingChapters(initialChapters);
    setPendingVideoData(newVideoData);
    setIsGenerating(false);
    setShowChapterEditor(true);
  };

  const handleSaveChapters = () => {
    if (!pendingVideoData) return;

    const newVideo: GeneratedVideo = {
      ...pendingVideoData as GeneratedVideo,
      status: 'ready',
      progress: 100,
      createdAt: new Date(),
      chapters: pendingChapters,
    };

    setGeneratedVideos((prev) => [newVideo, ...prev]);
    setShowChapterEditor(false);
    setPendingChapters([]);
    setPendingVideoData(null);
    setContent('');
    setUploadedFile(null);
  };

  const handleAddChapter = () => {
    const lastChapter = pendingChapters[pendingChapters.length - 1];
    const newStartTime = lastChapter ? lastChapter.endTime : 0;
    const newChapter: Chapter = {
      id: `chapter-${Date.now()}`,
      title: `New Chapter`,
      startTime: newStartTime,
      endTime: newStartTime + 60,
    };
    setPendingChapters([...pendingChapters, newChapter]);
  };

  const handleDeleteChapter = (id: string) => {
    setPendingChapters(pendingChapters.filter(c => c.id !== id));
  };

  const handleUpdateChapter = (id: string, updates: Partial<Chapter>) => {
    setPendingChapters(pendingChapters.map(c => 
      c.id === id ? { ...c, ...updates } : c
    ));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getThumbnailGradient = (type: string) => {
    switch (type) {
      case 'react': return 'from-cyan-500 to-blue-600';
      case 'python': return 'from-yellow-500 to-emerald-600';
      case 'ml': return 'from-purple-500 to-pink-600';
      default: return 'from-indigo-500 to-purple-600';
    }
  };

  const getStageIcon = (stageName: string) => {
    switch (stageName) {
      case 'analyzing': return <FileText className="w-4 h-4" />;
      case 'scripting': return <Edit3 className="w-4 h-4" />;
      case 'chapters': return <Subtitles className="w-4 h-4" />;
      case 'voice': return <Mic className="w-4 h-4" />;
      case 'visuals': return <VideoIcon className="w-4 h-4" />;
      case 'rendering': return <Clapperboard className="w-4 h-4" />;
      case 'finalizing': return <Check className="w-4 h-4" />;
      default: return <Loader2 className="w-4 h-4 animate-spin" />;
    }
  };

  const selectedLanguageObj = languages.find(l => l.code === selectedLanguage);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
          <Video className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-white">AI Video Generator</h1>
          <p className="text-xs text-slate-400">Transform materials into engaging video lessons</p>
        </div>
      </div>

      {/* Chapter Editor Modal */}
      {showChapterEditor && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 sm:p-6 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-purple-400" />
                  Edit Chapter Markers
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Customize chapters before finalizing your video
                </p>
              </div>
              <button
                onClick={() => setShowChapterEditor(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <div className="space-y-3">
                {pendingChapters.map((chapter, index) => (
                  <div key={chapter.id} className="bg-slate-800/50 rounded-xl p-3 sm:p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-medium text-slate-400">Chapter {index + 1}</span>
                      <button
                        onClick={() => handleDeleteChapter(chapter.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <label className="block text-xs text-slate-500 mb-1">Title</label>
                        <input
                          type="text"
                          value={chapter.title}
                          onChange={(e) => handleUpdateChapter(chapter.id, { title: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Start Time</label>
                        <input
                          type="text"
                          value={formatTime(chapter.startTime)}
                          onChange={(e) => {
                            const [mins, secs] = e.target.value.split(':').map(Number);
                            if (!isNaN(mins) && !isNaN(secs)) {
                              handleUpdateChapter(chapter.id, { startTime: mins * 60 + secs });
                            }
                          }}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">End Time</label>
                        <input
                          type="text"
                          value={formatTime(chapter.endTime)}
                          onChange={(e) => {
                            const [mins, secs] = e.target.value.split(':').map(Number);
                            if (!isNaN(mins) && !isNaN(secs)) {
                              handleUpdateChapter(chapter.id, { endTime: mins * 60 + secs });
                            }
                          }}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddChapter}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-600 rounded-xl text-slate-400 hover:text-purple-400 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Chapter
              </button>
            </div>

            <div className="p-4 sm:p-6 border-t border-slate-700 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => setShowChapterEditor(false)}
                className="w-full sm:w-auto px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChapters}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium rounded-lg hover:opacity-90 transition-all"
              >
                <Save className="w-4 h-4" />
                Save & Generate Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Generator Panel */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Input Section */}
          <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                Content Input
              </h2>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 p-2 rounded-lg transition-all ${
                  showSettings ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm">Settings</span>
              </button>
            </div>

            {/* File Upload */}
            <div
              data-tour="video-upload"
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-600 rounded-xl p-4 sm:p-8 text-center hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer mb-4"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
              {uploadedFile ? (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Check className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
                  <div className="text-center sm:text-left">
                    <p className="text-white font-medium text-sm">{uploadedFile.name}</p>
                    <p className="text-xs sm:text-sm text-slate-400">Ready to generate video</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                      setContent('');
                    }}
                    className="p-1 text-slate-400 hover:text-red-400"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500 mx-auto mb-2 sm:mb-3" />
                  <p className="text-slate-300 text-sm mb-1">Drop your files here or click to upload</p>
                  <p className="text-xs text-slate-500">Supports PDF, TXT, MD files</p>
                </>
              )}
            </div>

            {/* Text Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Or paste your content directly
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your study material, notes, or topic here. The AI will create an engaging video explanation..."
                rows={5}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none transition-all"
              />
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="mb-4 p-3 sm:p-4 bg-slate-800/50 rounded-xl space-y-4">
                {/* Language Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    Tutor Language
                  </label>
                  <div className="relative" ref={languageDropdownRef}>
                    <button
                      onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                      className="w-full flex items-center justify-between px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm hover:bg-slate-600 transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{selectedLanguageObj?.flag}</span>
                        <span>{selectedLanguageObj?.name}</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showLanguageDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setSelectedLanguage(lang.code);
                              setShowLanguageDropdown(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm hover:bg-slate-600 transition-all ${
                              selectedLanguage === lang.code ? 'bg-purple-500/20 text-purple-300' : 'text-white'
                            }`}
                          >
                            <span className="text-lg">{lang.flag}</span>
                            <span>{lang.name}</span>
                            {selectedLanguage === lang.code && <Check className="w-4 h-4 ml-auto" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    The AI tutor will explain in {selectedLanguageObj?.name} with accurate translations
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-300">Video Duration</label>
                    <button
                      onClick={() => setShowDurationPicker(!showDurationPicker)}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                    >
                      {showDurationPicker ? 'Show Less' : 'All Options'}
                      <ChevronDown className={`w-3 h-3 transition-transform ${showDurationPicker ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Selected duration display */}
                  <div className="mb-3 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-lg font-semibold text-white">
                            {useCustomDuration 
                              ? `${customDuration || '0'} min` 
                              : `${videoLength} min`}
                          </p>
                          <p className="text-xs text-slate-400">
                            {useCustomDuration
                              ? 'Custom duration'
                              : durationPresets.find(p => p.value === videoLength)?.description || 'Standard lesson'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Est. generation time</p>
                        <p className="text-sm font-medium text-amber-400">
                          {getEstimatedGenerationTime(useCustomDuration ? parseInt(customDuration) || 5 : parseInt(videoLength))}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick presets - always visible */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {['1', '3', '5', '10', '15', '30'].map((len) => {
                      const preset = durationPresets.find(p => p.value === len)!;
                      const isSelected = !useCustomDuration && videoLength === len;
                      return (
                        <button
                          key={len}
                          onClick={() => { setVideoLength(len); setUseCustomDuration(false); }}
                          className={`flex flex-col items-center px-3 py-2 rounded-lg text-xs transition-all min-w-[60px] ${
                            isSelected
                              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25 scale-105'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:scale-105'
                          }`}
                        >
                          <span className="font-bold text-sm">{len}m</span>
                          <span className="opacity-70 text-[10px]">{preset.description}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Expanded duration picker */}
                  {showDurationPicker && (
                    <div className="space-y-4 mb-3 animate-in">
                      {(Object.entries(durationCategories) as [string, typeof durationCategories[keyof typeof durationCategories]][]).map(([catKey, catInfo]) => {
                        const presets = durationPresets.filter(p => p.category === catKey);
                        return (
                          <div key={catKey}>
                            <p className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1">
                              <span>{catInfo.icon}</span>
                              {catInfo.label}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {presets.map((preset) => {
                                const isSelected = !useCustomDuration && videoLength === preset.value;
                                return (
                                  <button
                                    key={preset.value}
                                    onClick={() => { setVideoLength(preset.value); setUseCustomDuration(false); }}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                                      isSelected
                                        ? 'bg-purple-500 text-white shadow-md'
                                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600'
                                    }`}
                                  >
                                    <Clock className="w-3 h-3" />
                                    <span className="font-medium">{preset.label}</span>
                                    <span className="opacity-50 hidden sm:inline">{preset.description}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}

                      {/* Custom duration input */}
                      <div className="pt-2 border-t border-slate-700">
                        <p className="text-xs font-medium text-slate-400 mb-2">Custom Duration</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="number"
                              min="1"
                              max="120"
                              value={customDuration}
                              onChange={(e) => {
                                setCustomDuration(e.target.value);
                                if (e.target.value) setUseCustomDuration(true);
                              }}
                              onFocus={() => setUseCustomDuration(true)}
                              placeholder="Enter minutes"
                              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <span className="text-sm text-slate-400 whitespace-nowrap">min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const val = parseInt(customDuration);
                                if (val >= 1 && val <= 120) {
                                  setUseCustomDuration(true);
                                }
                              }}
                              disabled={!customDuration || parseInt(customDuration) < 1 || parseInt(customDuration) > 120}
                              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                useCustomDuration && customDuration
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-slate-700 text-slate-400 disabled:opacity-50'
                              }`}
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                        {customDuration && (parseInt(customDuration) < 1 || parseInt(customDuration) > 120) && (
                          <p className="text-xs text-red-400 mt-1">Duration must be between 1 and 120 minutes</p>
                        )}
                        {useCustomDuration && customDuration && parseInt(customDuration) >= 1 && parseInt(customDuration) <= 120 && (
                          <div className="mt-2 p-2 rounded bg-amber-500/10 border border-amber-500/20">
                            <p className="text-xs text-amber-400">
                              ⏱️ Estimated generation time: {getEstimatedGenerationTime(parseInt(customDuration))}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Quick info for free users */}
                  <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-slate-700/30">
                    <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-slate-400">
                      Free users: up to 10 min • Pro: up to 60 min • Premium: up to 120 min
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Complexity Level</label>
                  <div className="flex flex-wrap gap-2">
                    {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setComplexity(level)}
                        className={`px-3 sm:px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                          complexity === level
                            ? 'bg-purple-500 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Voice Style</label>
                  <div className="flex flex-wrap gap-2">
                    {(['friendly', 'professional', 'energetic'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => setVoiceStyle(style)}
                        className={`px-3 sm:px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                          voiceStyle === style
                            ? 'bg-purple-500 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generateVideo}
              disabled={(!content.trim() && !uploadedFile) || isGenerating}
              className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  Generating... {generationProgress}%
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  Generate Video
                </>
              )}
            </button>
          </div>

          {/* Granular Generation Progress */}
          {isGenerating && (
            <div className="bg-[#1E293B] border border-purple-500/30 rounded-2xl p-4 sm:p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2 text-sm sm:text-base">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 animate-pulse" />
                {stageMessage}
              </h3>
              <div className="space-y-3">
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {getGenerationStages(useCustomDuration ? parseInt(customDuration) || 5 : parseInt(videoLength)).map((stage: GenerationStage) => (
                    <div
                      key={stage.name}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg text-center transition-all ${
                        currentStage === stage.name
                          ? 'bg-purple-500/30 text-purple-300 ring-1 ring-purple-500/50'
                          : generationProgress >= stage.progressEnd
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      <div className={currentStage === stage.name ? 'animate-pulse' : ''}>
                        {generationProgress >= stage.progressEnd ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          getStageIcon(stage.name)
                        )}
                      </div>
                      <span className="text-[10px] sm:text-xs capitalize">{stage.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Topic Suggestions */}
          <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-4 sm:p-5">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Popular Topics</h3>
            <div className="space-y-1 sm:space-y-2">
              {topicSuggestions.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => setContent(topic)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-4 sm:p-5">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Video Features</h3>
            <div className="space-y-2 sm:space-y-3">
              {[
                { icon: Languages, text: 'Multi-language support', color: 'text-blue-400' },
                { icon: Film, text: 'AI-generated visuals', color: 'text-cyan-400' },
                { icon: Volume2, text: 'Natural voiceover', color: 'text-emerald-400' },
                { icon: Subtitles, text: 'Chapter markers', color: 'text-amber-400' },
                { icon: Download, text: 'HD download', color: 'text-purple-400' },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-2 sm:gap-3">
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${feature.color}`} />
                    <span className="text-xs sm:text-sm text-slate-300">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Video History */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Your Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {generatedVideos.map((video) => (
            <div
              key={video.id}
              className="group bg-[#1E293B] border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/50 transition-all"
            >
              {/* Thumbnail */}
              <div className={`relative h-32 sm:h-40 bg-gradient-to-br ${getThumbnailGradient(video.thumbnail)} flex items-center justify-center`}>
                <button
                  onClick={() => setCurrentPlaying(currentPlaying === video.id ? null : video.id)}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform"
                >
                  {currentPlaying === video.id ? (
                    <Pause className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  ) : (
                    <Play className="w-5 h-5 sm:w-8 sm:h-8 text-white ml-0.5 sm:ml-1" />
                  )}
                </button>
                <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 px-2 py-0.5 sm:py-1 bg-black/50 backdrop-blur rounded text-xs text-white">
                  {video.duration}
                </div>
                {/* Language badge */}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 px-2 py-0.5 bg-black/50 backdrop-blur rounded text-[10px] sm:text-xs text-white flex items-center gap-1">
                  <Languages className="w-3 h-3" />
                  {languages.find(l => l.code === video.language)?.flag}
                </div>
              </div>

              {/* Info */}
              <div className="p-3 sm:p-4">
                <h3 className="font-medium text-white text-sm mb-1 group-hover:text-purple-300 transition-colors line-clamp-1">
                  {video.title}
                </h3>
                <p className="text-xs text-slate-400 mb-2 sm:mb-3">{video.topic}</p>
                
                {/* Chapters preview */}
                {video.chapters && video.chapters.length > 0 && (
                  <div className="mb-2 sm:mb-3 space-y-1">
                    <p className="text-[10px] sm:text-xs text-slate-500">{video.chapters.length} chapters</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs text-slate-500">
                    {video.createdAt.toLocaleDateString()}
                  </span>
                  <div className="flex gap-1">
                    <button className="p-1.5 sm:p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                      <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button className="p-1.5 sm:p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
