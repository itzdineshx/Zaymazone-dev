import { motion } from "framer-motion";

interface CreativeLoaderProps {
  message?: string;
}

export const CreativeLoader = ({ message = "Loading beautiful crafts..." }: CreativeLoaderProps) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Animated craft elements */}
        <div className="relative w-32 h-32 mx-auto">
          <motion.div
            className="absolute inset-0 border-4 border-primary/20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 border-4 border-secondary/30 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-6 bg-gradient-primary rounded-full"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-8 bg-background rounded-full flex items-center justify-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-4 h-4 bg-primary rounded-full" />
          </motion.div>
        </div>

        {/* Loading text */}
        <motion.p
          className="text-muted-foreground text-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.p>

        {/* Craft-inspired decorative elements */}
        <div className="flex justify-center space-x-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};