import { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AnimatedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ id, label, value, onChange, required, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
      setIsFocused(false);
      setHasValue(!!value);
    };

    return (
      <motion.div
        className={cn("relative", className)}
        initial={false}
        animate={{
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <Label
          htmlFor={id}
          className={cn(
            "absolute left-3 transition-all duration-200 pointer-events-none",
            (isFocused || hasValue)
              ? "top-1 text-xs text-primary font-medium"
              : "top-1/2 -translate-y-1/2 text-muted-foreground"
          )}
        >
          {label} {required && "*"}
        </Label>
        <motion.div
          animate={{
            boxShadow: isFocused ? "0 0 0 2px hsl(var(--primary) / 0.2)" : "none",
          }}
          transition={{ duration: 0.2 }}
          className={`border transition-colors duration-200 ${
            isFocused ? "border-primary" : "border-border"
          }`}
        >
          <Input
            ref={ref}
            id={id}
            value={value}
            onChange={(e) => {
              onChange(e);
              setHasValue(!!e.target.value);
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              "pt-6 pb-2 transition-all duration-200",
              isFocused && "ring-0"
            )}
            {...props}
          />
        </motion.div>
      </motion.div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";