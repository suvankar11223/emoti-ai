import { useState } from 'react';
import { Heart, Sparkles, Mic } from 'lucide-react';
import { motion } from 'motion/react';
import { Textarea } from './ui/textarea';
import { VoiceNote } from './VoiceNote';
import { StreakTracker } from './StreakTracker';

interface JournalEntryProps {
  onSubmit: (content: string, mood: string, voiceNote?: { url: string; duration: number }) => void;
  onShowMoodTimeline: () => void;
  lastEntryDate: string | null;
}

const moods = [
  { emoji: '💕', label: 'In Love', color: 'from-pink-400 to-rose-400' },
  { emoji: '🥰', label: 'Adoring', color: 'from-rose-400 to-pink-500' },
  { emoji: '😌', label: 'Peaceful', color: 'from-blue-400 to-cyan-400' },
  { emoji: '💔', label: 'Missing', color: 'from-blue-600 to-purple-600' },
  { emoji: '✨', label: 'Grateful', color: 'from-amber-400 to-yellow-400' },
  { emoji: '🌙', label: 'Dreamy', color: 'from-indigo-400 to-purple-400' },
];

export function JournalEntry({ onSubmit, onShowMoodTimeline, lastEntryDate }: JournalEntryProps) {
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [voiceNote, setVoiceNote] = useState<{ url: string; duration: number } | undefined>();
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);

  const handleSubmit = () => {
    if (content.trim() && selectedMood) {
      onSubmit(content, selectedMood, voiceNote);
      setContent('');
      setSelectedMood(null);
      setVoiceNote(undefined);
      setShowVoiceRecorder(false);
    }
  };

  const handleVoiceNote = (url: string, duration: number) => {
    setVoiceNote({ url, duration });
    setShowVoiceRecorder(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="inline-block mb-4"
        >
          <div className="size-16 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
            <Heart className="size-8 text-pink-300" />
          </div>
        </motion.div>
        <h2 className="text-3xl text-white/90 mb-2">How's your heart today?</h2>
        <p className="text-sm text-white/40">Write about love, longing, or whatever feels true</p>
      </motion.div>

      {/* Streak Tracker - Floating */}
      <div className="flex justify-center mb-8">
        <StreakTracker lastEntryDate={lastEntryDate} />
      </div>

      {/* Mood selector - Clean minimal design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <p className="text-xs text-white/40 mb-4 text-center uppercase tracking-wider">Select your feeling</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {moods.map((mood) => (
            <motion.button
              key={mood.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMood(mood.label)}
              className={`group relative p-4 rounded-2xl border transition-all ${
                selectedMood === mood.label
                  ? 'border-white/30 bg-white/10 shadow-lg shadow-white/5'
                  : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="text-3xl mb-2">{mood.emoji}</div>
              <div className="text-xs text-white/60 group-hover:text-white/80 transition-colors">{mood.label}</div>
              {selectedMood === mood.label && (
                <motion.div
                  layoutId="selected-mood"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/10"
                  transition={{ type: 'spring', duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Text area - Minimal clean design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Dear love, today I felt..."
          className="min-h-56 bg-white/5 border-white/10 text-white/90 placeholder:text-white/30 resize-none rounded-3xl focus:border-white/20 focus:bg-white/10 transition-all backdrop-blur-sm text-base leading-relaxed p-6"
        />
      </motion.div>

      {/* Voice note section - Minimal */}
      {!showVoiceRecorder && !voiceNote && (
        <button
          onClick={() => setShowVoiceRecorder(true)}
          className="mb-6 flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors mx-auto"
        >
          <Mic className="size-4" />
          Add voice note
        </button>
      )}

      {showVoiceRecorder && (
        <div className="mb-6">
          <VoiceNote onVoiceNote={handleVoiceNote} />
        </div>
      )}

      {voiceNote && (
        <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Mic className="size-4" />
            <span>Voice note attached ({Math.floor(voiceNote.duration / 60)}:{(voiceNote.duration % 60).toString().padStart(2, '0')})</span>
          </div>
        </div>
      )}

      {/* Submit button - Clean modern */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={!content.trim() || !selectedMood}
        className="w-full py-4 bg-gradient-to-r from-pink-500/90 to-purple-500/90 hover:from-pink-500 hover:to-purple-500 disabled:from-white/5 disabled:to-white/5 disabled:cursor-not-allowed text-white disabled:text-white/30 rounded-full transition-all flex items-center justify-center gap-2 backdrop-blur-sm shadow-lg shadow-pink-500/20 disabled:shadow-none"
      >
        <Sparkles className="size-5" />
        <span className="tracking-wide">Save Memory</span>
      </motion.button>
    </div>
  );
}