import React, { useEffect, useRef, useState } from 'react';
import { Dialog } from '@headlessui/react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  QrCode,
  ChefHat,
  BarChart3,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DemoVideoModal = ({ isOpen, onClose }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');

  // Single comprehensive webapp walkthrough video
  const demoVideoSrc = 'https://res.cloudinary.com/dtecxhy4m/video/upload/v1789804472/preview/Preview_Video.mp4';

  const coreFeatures = [
    { icon: QrCode, label: 'Table QR Ordering' },
    { icon: ChefHat, label: 'Live Kitchen Display (KDS)' },
    { icon: CreditCard, label: 'Instant UPI Payments' },
    { icon: BarChart3, label: 'Real-time Analytics' },
  ];

  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {
          // Autoplay policy fallback
          setIsMuted(true);
          if (videoRef.current) videoRef.current.muted = true;
          videoRef.current?.play();
        });
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [isOpen]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setProgress((cur / dur) * 100);
    setCurrentTime(formatTime(cur));
    setDuration(formatTime(dur));
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const newProgress = parseFloat(e.target.value);
    const dur = videoRef.current.duration || 1;
    videoRef.current.currentTime = (newProgress / 100) * dur;
    setProgress(newProgress);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Immersive backdrop with animated blur */}
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl transition-opacity animate-in fade-in duration-300" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        <Dialog.Panel className="relative w-full max-w-5xl rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-700/60 shadow-[0_25px_70px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col my-auto transition-all">
          
          {/* Subtle glow accent */}
          <div className="absolute top-0 left-1/4 -z-10 h-32 w-1/2 bg-blue-500/10 blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <Dialog.Title className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
                  Restroly Interactive Demo
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/25">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                    Full Platform Overview
                  </span>
                </Dialog.Title>
                <p className="text-xs text-slate-400">
                  A quick tour of how Restroly handles QR orders, live kitchen sync, and restaurant management
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Video Player Container */}
          <div className="relative aspect-video w-full bg-black overflow-hidden group">
            <video
              ref={videoRef}
              src={demoVideoSrc}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onClick={togglePlay}
              className="h-full w-full object-cover cursor-pointer"
            />

            {/* Center Play/Pause Overlay Indicator when paused */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs cursor-pointer"
              >
                <div className="h-20 w-20 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center shadow-2xl transition transform hover:scale-105">
                  <Play className="h-9 w-9 fill-white ml-1" />
                </div>
              </div>
            )}

            {/* Elegant Player Controls Bar (Appears on Hover or Paused) */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 sm:p-5 opacity-90 group-hover:opacity-100 transition-opacity">
              {/* Progress Slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-700/60 rounded-lg appearance-none cursor-pointer accent-blue-500 mb-3"
              />

              <div className="flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-white" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleRestart}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition"
                    title="Replay from start"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="h-5 w-5 text-slate-400" /> : <Volume2 className="h-5 w-5" />}
                  </button>

                  <span className="text-slate-300 font-mono text-xs">
                    {currentTime} / {duration}
                  </span>
                </div>

                <span className="text-slate-400 font-medium hidden sm:inline-block">
                  Restroly v1.0 • All-in-One Restaurant Suite
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Feature Pills */}
          <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 mr-1">Covered in Demo:</span>
              {coreFeatures.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-200 border border-slate-700/60 shadow-xs"
                >
                  <Icon className="h-3.5 w-3.5 text-blue-400" />
                  {label}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Ready for Immediate Deployment</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm font-bold text-white">
                Like what you see? Experience it live.
              </p>
              <p className="text-xs text-slate-400">
                Setup your restaurant menu and tables in less than 5 minutes.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-700 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition"
              >
                Close
              </button>

              <Link
                to="/admin"
                onClick={onClose}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all hover:scale-102"
              >
                Try Free Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DemoVideoModal;

