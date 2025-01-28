import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  isComplete?: boolean;
}

export function ProgressBar({ progress, isComplete }: ProgressBarProps) {
  return (
    <div className="relative h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
      {/* Background Progress */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress / 100 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={`absolute inset-0 origin-left ${
          isComplete
            ? 'bg-green-500 dark:bg-green-400'
            : 'bg-blue-500 dark:bg-blue-400'
        }`}
      />

      {/* Loading animation */}
      {!isComplete && progress > 0 && progress < 100 && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      )}

      {/* Completion animation */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-green-500/20"
        />
      )}
    </div>
  );
}