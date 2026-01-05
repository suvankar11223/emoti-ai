import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { JournalEntry } from './components/JournalEntry';
import { EntryList } from './components/EntryList';
import { MoodTimeline } from './components/MoodTimeline';
import { MemoryResurface } from './components/MemoryResurface';
import { StarField } from './components/StarField';

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

export default function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showMoodTimeline, setShowMoodTimeline] = useState(false);
  const [lastEntryDate, setLastEntryDate] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'write' | 'memories'>('write');

  useEffect(() => {
    const savedEntries = localStorage.getItem('her_entries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  const handleNewEntry = (
    content: string,
    mood: string,
    voiceNote?: { url: string; duration: number }
  ) => {
    const newEntry: Entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content,
      mood,
      voiceNote,
    };

    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    localStorage.setItem('her_entries', JSON.stringify(updatedEntries));
    setLastEntryDate(new Date().toISOString());
  };

  return (
    <div className="relative size-full bg-gradient-to-br from-[#1a0b2e] via-[#160b28] to-black overflow-y-auto">
      {/* Star Field */}
      <StarField />

      {/* Minimal Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-40 border-b border-white/5"
      >
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-xl text-white/90 tracking-wide">Her</h1>
              <p className="text-xs text-white/30 mt-0.5">for lovers</p>
            </motion.div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('write')}
                className={`px-4 py-2 text-sm rounded-full transition-all ${
                  activeView === 'write'
                    ? 'bg-white/10 text-white/90'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                Write
              </button>
              <button
                onClick={() => setActiveView('memories')}
                className={`px-4 py-2 text-sm rounded-full transition-all ${
                  activeView === 'memories'
                    ? 'bg-white/10 text-white/90'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                Memories
              </button>
              <button
                onClick={() => setShowMoodTimeline(true)}
                className="ml-2 px-4 py-2 text-sm text-white/40 hover:text-white/60 rounded-full transition-all"
              >
                Insights
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="relative z-10 py-12">
        {activeView === 'write' ? (
          <JournalEntry
            onSubmit={handleNewEntry}
            onShowMoodTimeline={() => setShowMoodTimeline(true)}
            lastEntryDate={lastEntryDate}
          />
        ) : (
          <div className="max-w-4xl mx-auto px-6">
            <EntryList entries={entries} />
          </div>
        )}
      </main>

      {/* Mood Timeline Modal */}
      {showMoodTimeline && entries.length > 0 && (
        <MoodTimeline entries={entries} onClose={() => setShowMoodTimeline(false)} />
      )}

      {/* Memory Resurface */}
      <MemoryResurface entries={entries} />
    </div>
  );
}