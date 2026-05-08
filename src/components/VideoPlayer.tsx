import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  Subtitles
} from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
}

interface VideoPlayerProps {
  videoUrl?: string;
  title: string;
  duration: string;
  chapters?: Chapter[];
  onClose?: () => void;
}

export default function VideoPlayer({ 
  videoUrl, 
  title, 
  duration, 
  chapters = [],
  onClose 
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Parse duration string to seconds
  useEffect(() => {
    const [mins, secs] = duration.split(':').map(Number);
    setDurationSeconds((mins || 0) * 60 + (secs || 0));
  }, [duration]);

  // Update active chapter based on current time
  useEffect(() => {
    const current = chapters.find(
      ch => currentTime >= ch.startTime && currentTime < ch.endTime
    );
    setActiveChapter(current?.id || null);
  }, [currentTime, chapters]);

  // Keyboard controls
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't handle shortcuts if user is typing in an input
    if (document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA') {
      return;
    }

    switch (e.key) {
      case ' ': // Spacebar - Play/Pause
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowLeft': // Left arrow - Seek backward 10s
        e.preventDefault();
        seek(-10);
        break;
      case 'ArrowRight': // Right arrow - Seek forward 10s
        e.preventDefault();
        seek(10);
        break;
      case 'ArrowUp': // Up arrow - Volume up
        e.preventDefault();
        adjustVolume(0.1);
        break;
      case 'ArrowDown': // Down arrow - Volume down
        e.preventDefault();
        adjustVolume(-0.1);
        break;
      case 'm': // M - Mute toggle
      case 'M':
        e.preventDefault();
        toggleMute();
        break;
      case 'f': // F - Fullscreen toggle
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'Escape': // Escape - Exit fullscreen or close
        if (isFullscreen) {
          e.preventDefault();
          toggleFullscreen();
        } else if (onClose) {
          e.preventDefault();
          onClose();
        }
        break;
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        // Number keys - Seek to percentage (0-9 = 0%-90%)
        e.preventDefault();
        seekToPercent(parseInt(e.key) * 10);
        break;
    }
  }, [isFullscreen, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seek = (seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(durationSeconds, videoRef.current.currentTime + seconds));
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const seekToPercent = (percent: number) => {
    if (videoRef.current && durationSeconds > 0) {
      const newTime = (percent / 100) * durationSeconds;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const seekToChapter = (chapter: Chapter) => {
    if (videoRef.current) {
      videoRef.current.currentTime = chapter.startTime;
      setCurrentTime(chapter.startTime);
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const adjustVolume = (delta: number) => {
    if (videoRef.current) {
      const newVolume = Math.max(0, Math.min(1, volume + delta));
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seekToPercent(percent * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full bg-black rounded-xl overflow-hidden group"
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full aspect-video"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
      />

      {/* Demo Placeholder (when no video URL) */}
      {!videoUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
          <div className="text-center p-4 sm:p-8">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 sm:w-12 sm:h-12 text-white/50" />
            </div>
            <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">{title}</h3>
            <p className="text-slate-400 text-sm mb-4">Duration: {duration}</p>
            <p className="text-slate-500 text-xs">Keyboard: Space to play, ← → to seek, ↑ ↓ for volume</p>
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-sm sm:text-base font-medium truncate pr-4">{title}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowShortcuts(!showShortcuts)}
                className="p-1.5 sm:p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                title="Keyboard Shortcuts"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 sm:p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <span className="text-lg sm:text-xl">&times;</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Popup */}
        {showShortcuts && (
          <div className="absolute top-12 sm:top-16 right-2 sm:right-4 bg-slate-800/95 backdrop-blur border border-slate-700 rounded-xl p-3 sm:p-4 z-10 max-w-xs">
            <h4 className="text-white font-semibold mb-2 text-sm">Keyboard Controls</h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Space</span>
                <span className="text-slate-400">Play/Pause</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>← →</span>
                <span className="text-slate-400">Seek ±10s</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>↑ ↓</span>
                <span className="text-slate-400">Volume</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>M</span>
                <span className="text-slate-400">Mute</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>F</span>
                <span className="text-slate-400">Fullscreen</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>0-9</span>
                <span className="text-slate-400">Seek to %</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Esc</span>
                <span className="text-slate-400">Exit/Close</span>
              </div>
            </div>
          </div>
        )}

        {/* Chapters Bar */}
        {chapters.length > 0 && (
          <div className="px-3 sm:px-4 py-2 bg-gradient-to-t from-black/90 to-black/50 overflow-x-auto">
            <div className="flex gap-1 sm:gap-2 min-w-max">
              {chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => seekToChapter(chapter)}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm whitespace-nowrap transition-all ${
                    activeChapter === chapter.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <Subtitles className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{chapter.title}</span>
                  <span className="sm:hidden">{chapter.title.slice(0, 8)}...</span>
                  <span className="text-[10px] sm:text-xs opacity-70">
                    {formatTime(chapter.startTime)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 sm:p-4">
          {/* Progress Bar */}
          <div 
            className="h-1 sm:h-1.5 bg-white/20 rounded-full mb-2 sm:mb-3 cursor-pointer group/progress"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-purple-500 rounded-full relative"
              style={{ width: `${durationSeconds > 0 ? (currentTime / durationSeconds) * 100 : 0}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            </div>
            
            {/* Chapter markers on progress bar */}
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="absolute top-0 w-0.5 sm:w-1 h-full bg-white/50 hover:bg-white transition-colors cursor-pointer"
                style={{ left: `${(chapter.startTime / durationSeconds) * 100}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  seekToChapter(chapter);
                }}
                title={chapter.title}
              />
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="p-1.5 sm:p-2 text-white hover:bg-white/10 rounded-lg transition-all"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>

              {/* Skip buttons */}
              <button
                onClick={() => seek(-10)}
                className="hidden sm:flex p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                title="Rewind 10s (←)"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={() => seek(10)}
                className="hidden sm:flex p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                title="Forward 10s (→)"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              {/* Time display */}
              <span className="text-white text-xs sm:text-sm tabular-nums ml-1 sm:ml-2">
                {formatTime(currentTime)} / {formatTime(durationSeconds)}
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {/* Volume */}
              <div className="flex items-center gap-1 sm:gap-2 group/volume">
                <button
                  onClick={toggleMute}
                  className="p-1.5 sm:p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
                <div className="hidden sm:block w-16 sm:w-20 h-1 bg-white/20 rounded-full cursor-pointer overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full"
                    style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = (e.clientX - rect.left) / rect.width;
                      adjustVolume(percent - volume);
                    }}
                  />
                </div>
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 sm:p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Navigation Overlay (shows briefly on chapter change) */}
      {activeChapter && chapters.find(c => c.id === activeChapter) && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur px-4 py-2 rounded-lg text-white text-sm opacity-0 animate-pulse pointer-events-none">
          <Subtitles className="w-4 h-4 inline mr-2" />
          {chapters.find(c => c.id === activeChapter)?.title}
        </div>
      )}
    </div>
  );
}
