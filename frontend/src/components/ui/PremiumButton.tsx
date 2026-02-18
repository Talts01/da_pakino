import { motion, type HTMLMotionProps } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface PremiumButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
  className?: string;
}

// Definizione delle varianti di stile
const variantsStyle = {
  primary: "bg-brand-red text-white hover:bg-brand-redDark shadow-lg shadow-brand-red/20",
  secondary: "bg-brand-dark text-white hover:bg-black",
  outline: "border-2 border-brand-red text-brand-red hover:bg-brand-red/5"
};

export default function PremiumButton({ 
  variant = 'primary', 
  children, 
  className,
  ...props 
}: PremiumButtonProps) {
  return (
    <motion.button
      // Animazioni Framer Motion
      whileHover={{ scale: 1.02, y: -2 }} // Leggero sollevamento al passaggio del mouse
      whileTap={{ scale: 0.95 }}          // Effetto "pressione" realistico al click
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      
      className={twMerge(
        "relative font-heading font-bold uppercase tracking-wider py-4 px-8 rounded-2xl transition-colors flex items-center justify-center gap-3 overflow-hidden isolate",
        variantsStyle[variant],
        className
      )}
      {...props}
    >
      {/* Un leggero bagliore che passa sopra il bottone in hover */}
      <motion.div
        className="absolute inset-0 -z-10 bg-white/20 translate-x-[-100%] skew-x-12"
        variants={{
          hover: { translateX: "100%" }
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      {children}
    </motion.button>
  );
}