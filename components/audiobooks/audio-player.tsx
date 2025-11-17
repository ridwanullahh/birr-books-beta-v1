'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Clock, List, Download } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { BRAND_COLORS } from '@/lib/constants';

interface Chapter {
  id: string;
  title: string;
  duration: number;
  fileUrl: string;
}

interface AudioPlayerProps {
  chapters: Chapter[];
  bookTitle: string;
  narrator?: string;
  bookCover?: string;
}

export function AudioPlayer({
  chapters = [],
  bookTitle,
  narrator,
  bookCover
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showChapters, setShowChapters] = useState(false);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);

  const chapter = chapters[currentChapter];

  useEffect(() => {
    if (audioRef.current && chapter) {
      audioRef.current.src = chapter.fileUrl;
    }
  }, [currentChapter, chapter]);

  useEffect(() => {
    if (sleepTimer === 0) {
      setIsPlaying(false);
      return;
    }

    if (sleepTimer && sleepTimer > 0) {
      const timer = setInterval(() => {
        setSleepTimer(t => (t ? t - 1 : null));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [sleepTimer]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime + seconds);
    }
  };

  const nextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
      setIsPlaying(true);
    }
  };

  const previousChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={nextChapter}
        onVolumeChange={() => audioRef.current && setVolume(audioRef.current.volume)}
        onPlaybackRateChange={() => audioRef.current && setPlaybackRate(audioRef.current.playbackRate)}
      />

      {/* Player Container */}
      <div
        className="rounded-lg overflow-hidden shadow-elevation-4"
        style={{ backgroundColor: BRAND_COLORS.DARK }}
      >
        {/* Album Art */}
        <div className="aspect-square bg-gray-800 flex items-center justify-center overflow-hidden relative">
          {bookCover ? (
            <img
              src={bookCover || "/placeholder.svg"}
              alt={bookTitle}
              className="w-full h-full object-cover"
              width={400}
              height={400}
            />
          ) : (
            <div className="text-white text-center">
              <div className="text-6xl mb-4">♪</div>
              <p>{bookTitle}</p>
            </div>
          )}

          {/* Sleep Timer Badge */}
          {sleepTimer && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {Math.ceil(sleepTimer / 60)}m
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 text-white">
          <h3 className="font-semibold text-lg mb-1">{bookTitle}</h3>
          {narrator && <p className="text-sm opacity-75">Narrator: {narrator}</p>}
          <p className="text-sm opacity-75 mt-1">{chapter?.title}</p>
        </div>

        {/* Progress Bar */}
        <div className="px-4 py-2">
          <Slider
            value={[currentTime]}
            onValueChange={([value]) => {
              if (audioRef.current) audioRef.current.currentTime = value;
            }}
            min={0}
            max={duration || 100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-300 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="px-4 py-4 space-y-4">
          {/* Main Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={previousChapter}
              disabled={currentChapter === 0}
              className="p-2 hover:bg-white/10 rounded-full transition disabled:opacity-50"
            >
              <SkipBack className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={() => skip(-10)}
              className="p-2 hover:bg-white/10 rounded-full transition"
            >
              <span className="text-white text-sm font-semibold">-10s</span>
            </button>

            <button
              onClick={togglePlayPause}
              className="p-4 rounded-full transition"
              style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1" />
              )}
            </button>

            <button
              onClick={() => skip(10)}
              className="p-2 hover:bg-white/10 rounded-full transition"
            >
              <span className="text-white text-sm font-semibold">+10s</span>
            </button>

            <button
              onClick={nextChapter}
              disabled={currentChapter === chapters.length - 1}
              className="p-2 hover:bg-white/10 rounded-full transition disabled:opacity-50"
            >
              <SkipForward className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Secondary Controls */}
          <div className="grid grid-cols-3 gap-2">
            {/* Playback Speed */}
            <button className="p-2 hover:bg-white/10 rounded text-sm text-white transition">
              <select
                value={playbackRate}
                onChange={(e) => {
                  const rate = parseFloat(e.target.value);
                  setPlaybackRate(rate);
                  if (audioRef.current) audioRef.current.playbackRate = rate;
                }}
                className="bg-transparent text-white w-full"
              >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>
            </button>

            {/* Volume */}
            <button className="p-2 hover:bg-white/10 rounded flex items-center gap-2 text-white transition">
              <Volume2 className="w-4 h-4" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  if (audioRef.current) audioRef.current.volume = val;
                }}
                className="w-full"
              />
            </button>

            {/* Sleep Timer */}
            <button
              onClick={() => setSleepTimer(sleepTimer ? null : 30 * 60)}
              className="p-2 hover:bg-white/10 rounded text-white transition flex items-center justify-center gap-1"
            >
              <Clock className="w-4 h-4" />
              <span className="text-xs">{sleepTimer ? 'Off' : 'Timer'}</span>
            </button>
          </div>

          {/* Chapters List */}
          <button
            onClick={() => setShowChapters(!showChapters)}
            className="w-full p-2 hover:bg-white/10 rounded text-white transition flex items-center justify-center gap-2"
          >
            <List className="w-4 h-4" />
            Chapters
          </button>
        </div>

        {/* Chapters Dropdown */}
        {showChapters && (
          <div className="border-t border-white/10 p-4 max-h-48 overflow-y-auto">
            {chapters.map((ch, index) => (
              <button
                key={ch.id}
                onClick={() => {
                  setCurrentChapter(index);
                  setIsPlaying(true);
                  setShowChapters(false);
                }}
                className={`w-full text-left p-2 rounded mb-1 transition ${
                  index === currentChapter
                    ? 'bg-green text-white'
                    : 'hover:bg-white/10 text-gray-300'
                }`}
                style={{
                  backgroundColor: index === currentChapter ? BRAND_COLORS.PRIMARY_GREEN : 'transparent'
                }}
              >
                <p className="font-semibold text-sm">{ch.title}</p>
                <p className="text-xs opacity-75">{formatTime(ch.duration * 60)}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
