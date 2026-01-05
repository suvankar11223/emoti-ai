import { useEffect, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';

interface Entry {
  id: string;
  date: string;
  content: string;
  mood: string;
}

interface MemoryResurfaceProps {
  entries: Entry[];
}

export function MemoryResurface({ entries }: MemoryResurfaceProps) {
  const [memory, setMemory] = useState<Entry | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

    const pastMemories = entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      const daysDiff = Math.abs(
        Math.floor((entryDate.getTime() - oneYearAgo.getTime()) / (1000 * 60 * 60 * 24))
      );
      return daysDiff <= 7; // Within a week of a year ago
    });

    if (pastMemories.length > 0) {
      const randomMemory = pastMemories[Math.floor(Math.random() * pastMemories.length)];
      setMemory(randomMemory);
      setIsVisible(true);
    }
  }, [entries]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const yearsDiff = now.getFullYear() - date.getFullYear();
    
    if (yearsDiff === 1) {
      return 'A year ago today';
    } else if (yearsDiff > 1) {
      return `${yearsDiff} years ago`;
    }
    return 'Some time ago';
  };

  if (!memory || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
      >
        <Card className="bg-gradient-to-br from-purple-900/90 to-purple-800/90 backdrop-blur-lg border-purple-400/30 p-6 relative">
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-3 right-3 text-purple-300 hover:text-purple-100 transition-colors"
          >
            <X className="size-5" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="size-5 text-purple-300" />
            <span className="text-sm text-purple-300">{formatDate(memory.date)}</span>
          </div>

          <p className="text-purple-100 leading-relaxed line-clamp-4">
            {memory.content}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-purple-400">You felt {memory.mood}</span>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
