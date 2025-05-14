import { motion } from "framer-motion";
import { PianoGrid } from "@/components/piano-grid";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Interactive Piano</h1>
        <p className="text-muted-foreground">
          Click, tap, or use your keyboard (A-K) to play notes
        </p>
      </motion.div>

      <PianoGrid />
    </div>
  );
}
