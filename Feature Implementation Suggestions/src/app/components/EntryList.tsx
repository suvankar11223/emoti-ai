import { motion } from 'motion/react';
import { Calendar, Mic, Heart } from 'lucide-react';

interface Entry {
  id: string;
  date: string;
  content: string;
  mood: string;
  voiceNote?: {
    url: string;
    duration: number;
  };
}

interface EntryListProps {
  entries: Entry[];
}

const moodEmojis: { [key: string]: string } = {
  'In Love': '💕',
  Adoring: '🥰',
  Peaceful: '😌',
  Missing: '💔',
  Grateful: '✨',
  Dreamy: '🌙',
  // Legacy moods
  Happy: '😊',
  Sad: '😢',
  Anxious: '😰',
  Angry: '😡',
};

export function EntryList({ entries }: EntryListProps) {
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedEntries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl mx-auto py-20 text-center"
      >
        <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
          <Heart className="size-10 text-white/20" />
        </div>
        <h3 className="text-xl text-white/60 mb-2">No memories yet</h3>
        <p className="text-sm text-white/40">Start writing to capture your heart's journey</p>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto pb-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs uppercase tracking-wider text-white/40 mb-8 text-center"
      >
        Your Love Letters
      </motion.h2>
      <div className="space-y-6">
        {sortedEntries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{moodEmojis[entry.mood] || '💜'}</span>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">{entry.mood}</p>
                  <p className="text-xs text-white/30 mt-0.5">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <Calendar className="size-4 text-white/20 group-hover:text-white/40 transition-colors" />
            </div>

            {/* Content */}
            <p className="text-white/80 leading-relaxed text-base mb-4">{entry.content}</p>

            {/* Voice note indicator */}
            {entry.voiceNote && (
              <div className="flex items-center gap-2 text-sm text-white/40 mb-4">
                <Mic className="size-4" />
                <span>
                  Voice note (
                  {Math.floor(entry.voiceNote.duration / 60)}:
                  {(entry.voiceNote.duration % 60).toString().padStart(2, '0')})
                </span>
              </div>
            )}

            {/* Subtle divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

            {/* Her's response */}
            <div className="flex items-start gap-3">
              <div className="size-6 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 border border-pink-500/30">
                <Heart className="size-3 text-pink-300" />
              </div>
              <p className="text-sm text-white/50 leading-relaxed italic pt-0.5">
                I'm holding space for you. Thank you for trusting me with your heart. 💕
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}