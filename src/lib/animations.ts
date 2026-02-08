import { Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Artisan-themed easing function
const artisanEase = [0.25, 0.46, 0.45, 0.94] as const;

// Artisan-themed animation variants
export const artisanAnimations = {
  // Container animations
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },

  // Item animations
  item: {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: artisanEase,
      },
    },
  },

  // Staggered grid animations
  gridItem: {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: (index: number) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: artisanEase,
      },
    }),
  },

  // Section transitions
  section: {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: artisanEase,
      },
    },
  },

  // Scale in animations
  scaleIn: {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: artisanEase,
      },
    },
  },

  // Slide up animations
  slideUp: {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: artisanEase,
      },
    },
  },

  // Fade in animations
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: artisanEase,
      },
    },
  },

  // Hover animations
  hover: {
    scale: 1.02,
    y: -2,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },

  // Button animations
  buttonHover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },

  // Modal animations
  modal: {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: artisanEase,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 10,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  },

  // Skeleton pulse
  skeleton: {
    pulse: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },

  // Navigation animations
  navItem: {
    hidden: { x: -20, opacity: 0 },
    visible: (index: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.4,
        ease: artisanEase,
      },
    }),
  },

  // Hero text animations
  heroText: {
    hidden: { y: 30, opacity: 0 },
    visible: (index: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: index * 0.2,
        duration: 0.8,
        ease: artisanEase,
      },
    }),
  },

  // Parallax animations
  parallax: {
    initial: { y: 0 },
    animate: { y: -50 },
    transition: {
      duration: 0.5,
      ease: "linear",
    },
  },
};

// Custom hook for scroll-triggered animations
export const useScrollAnimation = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return { ref, inView };
};

// Reduced motion variants for accessibility
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};