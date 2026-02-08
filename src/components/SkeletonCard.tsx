import { motion } from "framer-motion";

export const SkeletonCard = () => {
  return (
    <motion.div
      className="bg-card rounded-2xl overflow-hidden shadow-soft"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image skeleton */}
      <div className="aspect-square bg-muted animate-pulse relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content skeleton */}
      <div className="p-5 space-y-3">
        {/* Title skeleton */}
        <div className="h-5 bg-muted rounded animate-pulse relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.1,
            }}
          />
        </div>

        {/* Price skeleton */}
        <div className="h-6 bg-muted rounded w-20 animate-pulse relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />
        </div>

        {/* Button skeleton */}
        <div className="h-10 bg-muted rounded-lg animate-pulse relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export const SkeletonGrid = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.1,
          }}
        >
          <SkeletonCard />
        </motion.div>
      ))}
    </div>
  );
};