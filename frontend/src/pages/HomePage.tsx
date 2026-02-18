import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion'; // AGGIUNTO 'Variants'
import PremiumButton from '../components/ui/PremiumButton';
import { Pizza, ArrowRight, Star } from 'lucide-react';
import { useRef } from 'react';

const HERO_IMAGE = "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop";
const FEATURE_1 = "https://images.unsplash.com/photo-1593560708920-639847577d3f?q=80&w=1000&auto=format&fit=crop";
const FEATURE_2 = "https://images.unsplash.com/photo-1579751626657-72bc17010498?q=80&w=1000&auto=format&fit=crop";

export default function HomePage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // CORREZIONE QUI: Aggiungiamo il tipo : Variants per far felice TypeScript
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  // CORREZIONE QUI: Aggiungiamo il tipo : Variants
  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div ref={containerRef} className="relative -mt-24 font-sans">
      
      {/* HERO SECTION */}
      <div className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: yBg, opacity: opacityHero }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/50 to-brand-dark/30 z-10" />
          <img src={HERO_IMAGE} alt="Pizza Hero" className="w-full h-full object-cover scale-110" />
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative z-20 text-center text-brand-cream px-4 max-w-4xl"
        >
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <div className="bg-brand-red/20 p-4 rounded-full backdrop-blur-sm border border-brand-red/30 animate-float-slow">
              <Pizza size={50} className="text-brand-red animate-spin-slow" />
            </div>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-heading font-black mb-6 leading-tight">
            L'Autentica Pizza <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-red">Italiana a Casa Tua</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl opacity-90 mb-10 font-body max-w-2xl mx-auto leading-relaxed">
            Impasto a lunga lievitazione, ingredienti freschissimi e la passione di Pakino in ogni morso.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 justify-center">
            <PremiumButton onClick={() => navigate('/menu')} className="text-lg px-10 py-6">
              Ordina Ora <ArrowRight />
            </PremiumButton>
            <PremiumButton variant="outline" onClick={() => navigate('/profile')} className="text-lg px-10 py-6 bg-brand-dark/10 backdrop-blur-sm border-brand-cream/30 text-brand-cream hover:bg-brand-cream hover:text-brand-dark">
              Il Tuo Profilo
            </PremiumButton>
          </motion.div>
        </motion.div>

        {/* SCROLL INDICATOR */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-10 z-20 text-brand-cream/60 flex flex-col items-center gap-2"
        >
          <span className="text-xs font-bold uppercase tracking-widest">Scorri per scoprire</span>
          <div className="w-6 h-10 border-2 border-brand-cream/40 rounded-full flex justify-center p-1">
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-brand-cream rounded-full" 
            />
          </div>
        </motion.div>
      </div>

      {/* FEATURE SECTION */}
      <section className="py-24 px-6 relative z-10 bg-brand-cream">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-brand-gold/20 rounded-[3rem] transform rotate-3 scale-105" />
              <img src={FEATURE_1} alt="Ingredienti Freschi" className="rounded-[3rem] shadow-premium relative z-10 transform -rotate-2 hover:rotate-0 transition-transform duration-500" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
               <div className="flex items-center gap-2 text-brand-gold font-bold uppercase tracking-widest">
                <Star className="fill-brand-gold" size={18} /> Qualità Premium
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-black text-brand-dark">
                Non è solo Pizza, <br/> è un'Esperienza.
              </h2>
              <p className="text-lg text-brand-dark/70 leading-relaxed">
                Usiamo solo pomodori San Marzano D.O.P., mozzarella fior di latte fresca di giornata e un mix segreto di farine per un impasto leggero e digeribile che riposa per 48 ore.
              </p>
              <PremiumButton variant="secondary" onClick={() => navigate('/menu')}>
                Scopri le Nostre Pizze
              </PremiumButton>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
           <img src={FEATURE_2} alt="Forno" className="w-full h-full object-cover blur-sm brightness-50" />
           <div className="absolute inset-0 bg-brand-red/80 mix-blend-multiply" />
        </div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="relative z-10 text-center text-white px-4 max-w-2xl"
        >
          <h2 className="text-4xl font-heading font-black mb-6">Hai fame? Non aspettare.</h2>
          <p className="text-xl mb-8 text-brand-cream/90">La tua pizza preferita è a pochi click di distanza. Consegna rapida e calda, garantito.</p>
          <PremiumButton onClick={() => navigate('/menu')} className="mx-auto text-lg py-5 px-12 shadow-xl shadow-brand-dark/20">
            VAI AL MENU COMPLETO
          </PremiumButton>
        </motion.div>
      </section>

    </div>
  );
}