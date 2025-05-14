import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { PianoKey } from "./ui/piano-key";
import { audioEngine } from "@/lib/audio";

const NOTES = [
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4',
  'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5'
];

export function PianoGrid() {
  const [playingNotes, setPlayingNotes] = useState<Set<string>>(new Set());

  const handleNotePlay = useCallback((note: string) => {
    audioEngine.playNote(note);
    setPlayingNotes(prev => new Set(prev).add(note));
    setTimeout(() => {
      setPlayingNotes(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
    }, 200);
  }, []);

  // Keyboard support
  useEffect(() => {
    const keyMap: { [key: string]: string } = {
      'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4',
      'd': 'E4', 'f': 'F4', 't': 'F#4', 'g': 'G4',
      'y': 'G#4', 'h': 'A4', 'u': 'A#4', 'j': 'B4',
      'k': 'C5'
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const note = keyMap[e.key.toLowerCase()];
      if (note) {
        handleNotePlay(note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNotePlay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 p-4 max-w-4xl mx-auto"
    >
      {NOTES.map((note) => (
        <PianoKey
          key={note}
          note={note}
          isSharp={note.includes('#')}
          isPlaying={playingNotes.has(note)}
          onPlay={handleNotePlay}
        />
      ))}
    </motion.div>
  );
}
