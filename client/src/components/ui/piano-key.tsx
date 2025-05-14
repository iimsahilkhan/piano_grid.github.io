import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type PianoKeyProps = {
  note: string;
  isSharp?: boolean;
  isPlaying?: boolean;
  onPlay: (note: string) => void;
} & Omit<HTMLMotionProps<"button">, "onPlay">;

export function PianoKey({ 
  note, 
  isSharp = false, 
  isPlaying = false,
  onPlay,
  className,
  ...props 
}: PianoKeyProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn(
        "relative rounded-md p-4 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isSharp 
          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
          : "bg-background text-foreground hover:bg-muted",
        isPlaying && "ring-2 ring-ring ring-offset-2",
        className
      )}
      onClick={() => onPlay(note)}
      {...props}
    >
      {note}
    </motion.button>
  );
}