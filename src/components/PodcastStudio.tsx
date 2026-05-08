import { useState, useRef, useEffect } from 'react';
import { 
  Podcast, 
  Upload, 
  Play, 
  Pause, 
  Mic,
  Sparkles,
  Download,
  RefreshCw,
  FileText,
  Wand2,
  Loader2,
  ChevronDown,
  Volume2,
  Share2,
  Check,
  Users,
  Clock,
  TrendingUp
} from 'lucide-react';

interface GeneratedPodcast {
  id: string;
  title: string;
  duration: string;
  voice: string;
  status: 'generating' | 'ready';
  progress: number;
  createdAt: Date;
  topic: string;
}

const voiceOptions = [
  { id: 'sarah', name: 'Sarah', style: 'Warm & Friendly', gender: 'female' },
  { id: 'michael', name: 'Michael', style: 'Professional', gender: 'male' },
  { id: 'emma', name: 'Emma', style: 'Energetic', gender: 'female' },
  { id: 'james', name: 'James', style: 'Authoritative', gender: 'male' },
  { id: 'sofia', name: 'Sofia', style: 'Casual', gender: 'female' },
];

const podcastHistory: GeneratedPodcast[] = [
  {
    id: '1',
    title: 'Understanding JavaScript Closures',
    duration: '12:34',
    voice: 'sarah',
    status: 'ready',
    progress: 100,
    createdAt: new Date(Date.now() - 86400000),
    topic: 'JavaScript'
  },
  {
    id: '2',
    title: 'Python List Comprehensions Explained',
    duration: '8:45',
    voice: 'michael',
    status: 'ready',
    progress: 100,
    createdAt: new Date(Date.now() - 172800000),
    topic: 'Python'
  },
  {
    id: '3',
    title: 'Introduction to Docker Containers',
    duration: '15:20',
    voice: 'emma',
    status: 'ready',
    progress: 100,
    createdAt: new Date(Date.now() - 604800000),
    topic: 'DevOps'
  },
];

const topicSuggestions = [
  'Explain TypeScript Generics',
  'REST API Best Practices',
  'Database Indexing Explained',
  'Git Branching Strategies',
  'CSS Grid vs Flexbox',
];

export default function PodcastStudio() {
  const [content, setContent] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('sarah');
  const [podcastStyle, setPodcastStyle] = useState<'educational' | 'conversational' | 'storytelling'>('educational');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedPodcasts, setGeneratedPodcasts] = useState<GeneratedPodcast[]>(podcastHistory);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [showVoiceDropdown, setShowVoiceDropdown] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPlaying && waveformRef.current) {
      const bars = waveformRef.current.querySelectorAll('.wave-bar');
      bars.forEach((bar) => {
        const height = Math.random() * 30 + 10;
        (bar as HTMLElement).style.height = `${height}px`;
      });
    }
  }, [isPlaying]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setContent(event.target?.result as string || '');
      };
      reader.readAsText(file);
    }
  };

  const generatePodcast = async () => {
    if (!content.trim() && !uploadedFile) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    const stages = [
      { progress: 15, message: 'Analyzing content...' },
      { progress: 35, message: 'Writing script...' },
      { progress: 55, message: 'Generating speech...' },
      { progress: 75, message: 'Adding background music...' },
      { progress: 90, message: 'Mixing audio...' },
      { progress: 100, message: 'Finalizing...' },
    ];

    for (const stage of stages) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setGenerationProgress(stage.progress);
    }

    const selectedVoiceObj = voiceOptions.find(v => v.id === selectedVoice);
    const newPodcast: GeneratedPodcast = {
      id: Date.now().toString(),
      title: content.slice(0, 45) + (content.length > 45 ? '...' : ''),
      duration: `${Math.floor(Math.random() * 10) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      voice: selectedVoice,
      status: 'ready',
      progress: 100,
      createdAt: new Date(),
      topic: selectedVoiceObj?.name || 'AI Voice'
    };

    setGeneratedPodcasts((prev) => [newPodcast, ...prev]);
    setIsGenerating(false);
    setGenerationProgress(0);
    setContent('');
    setUploadedFile(null);
  };

  const getWaveformBars = () => {
    return Array.from({ length: 40 }, (_, i) => (
                    <div
                      key={`bar-${i}`}
                      className="wave-bar w-1 bg-gradient-to-t from-pink-500 to-purple-500 rounded-full transition-all duration-150"
                      style={{ height: `${Math.random() * 30 + 10}px` }}
                    />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
            <Podcast className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Podcast Studio</h1>
            <p className="text-sm text-slate-400">Transform your materials into engaging audio content</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/5 border border-pink-500/20 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
            <Mic className="w-6 h-6 text-pink-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{generatedPodcasts.length}</p>
            <p className="text-sm text-slate-400">Podcasts Created</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Clock className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {Math.floor(generatedPodcasts.reduce((acc, p) => {
                const [min, sec] = p.duration.split(':').map(Number);
                return acc + min + sec / 60;
              }, 0))}h {Math.round(generatedPodcasts.reduce((acc, p) => {
                const secs = parseInt(p.duration.split(':')[1] || '0');
                return acc + secs;
              }, 0) % 60)}m
            </p>
            <p className="text-sm text-slate-400">Total Listening Time</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Users className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">1.2K</p>
            <p className="text-sm text-slate-400">Total Listens</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Input Section */}
          <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-pink-400" />
              Content Input
            </h2>

            {/* File Upload */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center hover:border-pink-500/50 hover:bg-pink-500/5 transition-all cursor-pointer mb-4"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
              {uploadedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <Check className="w-6 h-6 text-emerald-400" />
                  <span className="text-white font-medium">{uploadedFile.name}</span>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-300">Drop a file or click to upload</p>
                  <p className="text-xs text-slate-500 mt-1">PDF, TXT, MD supported</p>
                </>
              )}
            </div>

            {/* Text Input */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your content here, notes, or describe what you want to learn about..."
              rows={5}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 resize-none transition-all mb-4"
            />

            {/* Voice Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Voice Selection</label>
              <div className="relative">
                <button
                  onClick={() => setShowVoiceDropdown(!showVoiceDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white hover:bg-slate-700 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                      <Mic className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{voiceOptions.find(v => v.id === selectedVoice)?.name}</p>
                      <p className="text-xs text-slate-400">{voiceOptions.find(v => v.id === selectedVoice)?.style}</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showVoiceDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showVoiceDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden z-10">
                    {voiceOptions.map((voice) => (
                      <button
                        key={voice.id}
                        onClick={() => {
                          setSelectedVoice(voice.id);
                          setShowVoiceDropdown(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-all ${
                          selectedVoice === voice.id ? 'bg-pink-500/10' : ''
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          voice.gender === 'female' ? 'bg-gradient-to-br from-pink-500 to-rose-600' : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                        }`}>
                          <Mic className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-white">{voice.name}</p>
                          <p className="text-xs text-slate-400">{voice.style}</p>
                        </div>
                        {selectedVoice === voice.id && (
                          <Check className="w-5 h-5 text-pink-400 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Podcast Style */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Podcast Style</label>
              <div className="flex gap-2">
                {([
                  { id: 'educational', label: 'Educational', icon: TrendingUp },
                  { id: 'conversational', label: 'Conversational', icon: Users },
                  { id: 'storytelling', label: 'Storytelling', icon: Sparkles },
                ] as const).map((style) => {
                  const Icon = style.icon;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setPodcastStyle(style.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                        podcastStyle === style.id
                          ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {style.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generatePodcast}
              disabled={(!content.trim() && !uploadedFile) || isGenerating}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-pink-500/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating... {generationProgress}%
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Podcast
                </>
              )}
            </button>
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <div className="bg-[#1E293B] border border-pink-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
                <span className="text-white font-medium">Creating your podcast...</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
              <div ref={waveformRef} className="flex items-end justify-center gap-1 h-16">
                {getWaveformBars()}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Topic Suggestions */}
          <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Popular Topics</h3>
            <div className="space-y-2">
              {topicSuggestions.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => setContent(topic)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Podcast Features</h3>
            <div className="space-y-3">
              {[
                { icon: Mic, text: 'Natural voice synthesis', color: 'text-pink-400' },
                { icon: Volume2, text: 'Background music', color: 'text-purple-400' },
                { icon: Clock, text: 'Variable playback', color: 'text-emerald-400' },
                { icon: Share2, text: 'Easy sharing', color: 'text-cyan-400' },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${feature.color}`} />
                    <span className="text-sm text-slate-300">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Podcast Library */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Your Podcasts</h2>
        <div className="space-y-3">
          {generatedPodcasts.map((podcast) => (
            <div
              key={podcast.id}
              className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-4 hover:border-slate-600/50 transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Play Button */}
                <button
                  onClick={() => {
                    setCurrentPlaying(currentPlaying === podcast.id ? null : podcast.id);
                    setIsPlaying(currentPlaying !== podcast.id);
                  }}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform"
                >
                  {currentPlaying === podcast.id && isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-1" />
                  )}
                </button>

                {/* Waveform */}
                <div className="flex-1">
                  <div className="flex items-end gap-0.5 h-12">
                    {Array.from({ length: 30 }, (_, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all ${
                          currentPlaying === podcast.id && isPlaying
                            ? 'bg-gradient-to-t from-pink-500 to-purple-500'
                            : 'bg-slate-600'
                        }`}
                        style={{ 
                          height: currentPlaying === podcast.id && isPlaying
                            ? `${Math.random() * 40 + 10}px`
                            : `${Math.random() * 20 + 5}px`
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div className="text-right px-4">
                  <p className="text-white font-medium line-clamp-1">{podcast.title}</p>
                  <p className="text-sm text-slate-400">{podcast.topic} • {podcast.voice}</p>
                </div>

                {/* Duration */}
                <div className="text-right">
                  <p className="text-white font-medium">{podcast.duration}</p>
                  <p className="text-xs text-slate-500">{podcast.createdAt.toLocaleDateString()}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
