import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Plus, Search, Star, Flame, Sparkles } from 'lucide-react';
import type { Product, Category } from '../types/Product';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MenuPage.module.css';

// Placeholder Immagini
const PLACEHOLDERS: Record<string, string> = {
  'Le Pizze': 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800&auto=format&fit=crop',
  'Le Focacce': 'https://images.unsplash.com/photo-1627461985459-51600559ff3d?q=80&w=800&auto=format&fit=crop',
  'Le Farinate': 'https://images.unsplash.com/photo-1532499016263-f2c3e89de9cd?q=80&w=800&auto=format&fit=crop',
  'Le Bevande': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop',
  'default': 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?q=80&w=800&auto=format&fit=crop'
};

// Ordine esatto richiesto
const CATEGORY_ORDER = ["Le Pizze", "Le Focacce", "Le Farinate", "Le Bevande"];

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutte');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const { addToCart } = useCart();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`${API_URL}/api/products`),
          fetch(`${API_URL}/api/categories`)
        ]);
        if (prodRes.ok && catRes.ok) {
          setProducts(await prodRes.json());
          setCategories(await catRes.json());
        }
      } catch (error) {
        console.error("Errore menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL]);

  // Filtra prodotti per testo di ricerca
  const searchFilteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper per ottenere prodotti di una categoria (escluse le speciali se siamo in "Tutte")
  const getProductsForCategory = (catName: string) => {
    return searchFilteredProducts.filter(p => p.category.name === catName && !p.isMonthlySpecial);
  };

  // Helper per le speciali (Pizza del mese)
  const specialProducts = searchFilteredProducts.filter(p => p.isMonthlySpecial);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-cream space-y-4">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="text-brand-red">
        <Sparkles size={48} />
      </motion.div>
      <p className="font-heading font-bold text-brand-dark/50 animate-pulse">Stiamo scaldando il forno...</p>
    </div>
  );

  return (
    <div className={styles.container}>
      
      {/* === HERO MENU === */}
      <div className={styles.hero}>
        <div className={styles.heroIconBg}><Flame size={300} /></div>
        <div className={styles.heroContent}>
          <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={styles.heroTitle}>
            Il Nostro <span className="text-brand-red">Menu</span>
          </motion.h1>
          <p className={styles.heroSubtitle}>Scegli tra le nostre creazioni artigianali.</p>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={20} />
            <input 
              type="text" 
              placeholder="Cerca la tua pizza preferita..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
        </div>
      </div>

      {/* === CATEGORIE STICKY === */}
      <div className={styles.stickyNav}>
        <div className={styles.navScrollContainer}>
          <div className={styles.navFlex}>
            <CategoryButton label="TUTTE" isActive={selectedCategory === 'Tutte'} onClick={() => setSelectedCategory('Tutte')} />
            {categories.map((cat) => (
              <CategoryButton key={cat.id} label={cat.name} isActive={selectedCategory === cat.name} onClick={() => setSelectedCategory(cat.name)} />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        
        {/* 1. SEZIONE PIZZA DEL MESE (Visibile in 'Tutte' o 'Le Pizze') */}
        {(selectedCategory === 'Tutte' || selectedCategory === 'Le Pizze') && specialProducts.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.specialContainer}>
            <div className={styles.specialHeader}>
              <Star className="text-brand-gold fill-brand-gold animate-spin-slow" />
              <h2 className="text-2xl font-heading font-black text-brand-dark">La Speciale del Mese</h2>
            </div>
            <div className={styles.specialGrid}>
              {specialProducts.map((product) => (
                <SpecialCard key={product.id} product={product} onAdd={() => addToCart(product)} />
              ))}
            </div>
          </motion.div>
        )}

        {/* 2. CICLO CATEGORIE ORDINATE */}
        {CATEGORY_ORDER.map((catName) => {
          // Se siamo in una categoria specifica, saltiamo le altre
          if (selectedCategory !== 'Tutte' && selectedCategory !== catName) return null;

          const categoryProducts = getProductsForCategory(catName);
          if (categoryProducts.length === 0) return null;

          return (
            <motion.div 
              key={catName}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              {/* Titolo Sezione (solo se siamo in 'Tutte', altrimenti è ridondante ma bello lo stesso) */}
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{catName}</h2>
                <span className={styles.sectionCount}>{categoryProducts.length}</span>
              </div>

              <div className={styles.productGrid}>
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAdd={() => addToCart(product)} />
                ))}
              </div>
            </motion.div>
          );
        })}

        {/* Messaggio se non c'è nulla */}
        {searchFilteredProducts.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <p className="font-heading text-xl">Nessun prodotto trovato 😢</p>
          </div>
        )}

      </div>
    </div>
  );
}

// --- SOTTO-COMPONENTI ---

function CategoryButton({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`${styles.catBtn} ${isActive ? styles.catBtnActive : styles.catBtnInactive}`}>
      {isActive && <motion.div layoutId="activeCategory" className={styles.activeIndicator} transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
      <span className="relative z-10 uppercase tracking-wider">{label}</span>
    </button>
  );
}

function ProductCard({ product, onAdd }: { product: Product, onAdd: () => void }) {
  const imageSrc = product.imageUrl || PLACEHOLDERS[product.category.name] || PLACEHOLDERS['default'];

  return (
    <div className={`${styles.productCard} group`}>
      <div className={styles.imageContainer}>
        <img src={imageSrc} alt={product.name} className={styles.productImage} />
        <div className={styles.imageOverlay} />
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{product.name}</h3>
          <span className={styles.cardPrice}>€{product.price.toFixed(2)}</span>
        </div>
        <p className={styles.cardDesc}>{product.description}</p>

        <div className={styles.cardFooter}>
          <span className={styles.catTag}>{product.category.name}</span>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onAdd} className={`${styles.addButton} group/btn`}>
            <Plus size={20} className={styles.addIcon} />
            <motion.div className={styles.btnShine} initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.4 }} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function SpecialCard({ product, onAdd }: { product: Product, onAdd: () => void }) {
  const imageSrc = product.imageUrl || "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className={`${styles.specialCard} group`}>
      <div className={styles.specialTag}>Consigliata dallo Chef</div>
      <div className={styles.specialImageContainer}>
        <img src={imageSrc} alt={product.name} className={styles.specialImage} />
      </div>
      <div className={styles.specialContent}>
        <h3 className={styles.specialTitle}>{product.name}</h3>
        <p className={styles.specialDesc}>{product.description}</p>
        <div className={styles.specialFooter}>
          <span className={styles.specialPrice}>€{product.price.toFixed(2)}</span>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95}} onClick={onAdd} className={styles.specialAddBtn}>
            <Plus size={18} /> Aggiungi
          </motion.button>
        </div>
      </div>
    </div>
  );
}