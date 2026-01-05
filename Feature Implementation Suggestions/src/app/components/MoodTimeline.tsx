import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, X } from 'lucide-react';
import { motion } from 'motion/react';

interface Entry {
  id: string;
  date: string;
  content: string;
  mood: string;
}

interface MoodTimelineProps {
  entries: Entry[];
  onClose: () => void;
}

const moodToValue: { [key: string]: number } = {
  peaceful: 5,
  happy: 5,
  joyful: 5,
  grateful: 4,
  hopeful: 4,
  content: 4,
  neutral: 3,
  calm: 3,
  uncertain: 2,
  sad: 2,
  anxious: 1,
  overwhelmed: 1,
  angry: 1,
};

export function MoodTimeline({ entries, onClose }: MoodTimelineProps) {
  const moodData = entries
    .slice(-30)
    .map((entry) => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: moodToValue[entry.mood.toLowerCase()] || 3,
      moodName: entry.mood,
    }))
    .reverse();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-purple-900/95 backdrop-blur-sm border border-purple-400/30 p-3 rounded-lg">
          <p className="text-purple-100 text-sm">{payload[0].payload.moodName}</p>
          <p className="text-purple-300 text-xs">{payload[0].payload.date}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-purple-950 to-purple-900 rounded-2xl p-6 w-full max-w-3xl border border-purple-400/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="size-6 text-purple-300" />
            <div>
              <h2 className="text-xl text-purple-100">Your Emotional Journey</h2>
              <p className="text-sm text-purple-400">Last 30 entries</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-purple-100 transition-colors"
          >
            <X className="size-6" />
          </button>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#a855f7" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                stroke="#c084fc" 
                tick={{ fill: '#c084fc', fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 6]}
                ticks={[1, 2, 3, 4, 5]}
                stroke="#c084fc"
                tick={{ fill: '#c084fc', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#a855f7"
                strokeWidth={3}
                dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#c084fc' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs text-purple-400">
          <span>Difficult</span>
          <span>Neutral</span>
          <span>Peaceful</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
