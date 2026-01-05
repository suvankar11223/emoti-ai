import { useEffect, useState } from 'react';
import { Flame, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface StreakTrackerProps {
  lastEntryDate: string | null;
}

export function StreakTracker({ lastEntryDate }: StreakTrackerProps) {
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const savedStreak = localStorage.getItem('her_streak');
    const savedLastDate = localStorage.getItem('her_last_entry_date');

    if (savedStreak && savedLastDate) {
      const lastDate = new Date(savedLastDate);
      const today = new Date();
      const diffDays = Math.floor(
        (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0) {
        setStreak(parseInt(savedStreak));
      } else if (diffDays === 1) {
        setStreak(parseInt(savedStreak));
      } else {
        setStreak(0);
        localStorage.setItem('her_streak', '0');
      }
    }
  }, []);

  useEffect(() => {
    if (lastEntryDate) {
      const savedLastDate = localStorage.getItem('her_last_entry_date');
      const today = new Date().toDateString();

      if (savedLastDate !== today) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('her_streak', newStreak.toString());
        localStorage.setItem('her_last_entry_date', today);

        if (newStreak > 1) {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
        }
      }
    }
  }, [lastEntryDate]);

  if (streak === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm"
    >
      <motion.div
        animate={
          showCelebration
            ? { rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }
            : {}
        }
        transition={{ duration: 0.5 }}
      >
        <Flame className="size-5 text-orange-400" />
      </motion.div>
      <span className="text-sm text-white/70">
        {streak} day{streak !== 1 ? 's' : ''}
      </span>

      {showCelebration && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="ml-1"
        >
          <span className="text-sm">✨</span>
        </motion.div>
      )}
    </motion.div>
  );
}