import { useState, useRef } from 'react';
import { Mic, Square, Play, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface VoiceNoteProps {
  onVoiceNote: (audioUrl: string, duration: number) => void;
}

export function VoiceNote({ onVoiceNote }: VoiceNoteProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = window.setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleSave = () => {
    if (audioUrl) {
      onVoiceNote(audioUrl, duration);
      setAudioUrl(null);
      setDuration(0);
    }
  };

  const handleDelete = () => {
    setAudioUrl(null);
    setDuration(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-3">
      {!audioUrl && !isRecording && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={startRecording}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-400/30 rounded-full transition-colors"
        >
          <Mic className="size-4" />
          <span className="text-sm">Record voice note</span>
        </motion.button>
      )}

      {isRecording && (
        <div className="flex items-center gap-3 p-3 bg-purple-900/30 border border-purple-400/30 rounded-2xl">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="size-3 bg-red-500 rounded-full"
          />
          <span className="text-purple-200 text-sm flex-1">{formatTime(duration)}</span>
          <button
            onClick={stopRecording}
            className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
          >
            <Square className="size-4 text-white" />
          </button>
        </div>
      )}

      {audioUrl && (
        <div className="flex items-center gap-3 p-3 bg-purple-900/30 border border-purple-400/30 rounded-2xl">
          <audio controls src={audioUrl} className="flex-1 h-8">
            <track kind="captions" />
          </audio>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-full transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-full transition-colors"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
