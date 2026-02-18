import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Plus, Pizza, Search, Info, Star } from 'lucide-react';
import type { Product, Category } from '../types/Product';

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutte');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const { addToCart } = useCart();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // Ordine specifico delle categorie richiesto
  const categoryOrder = ["Le Pizze", "Le Focacce", "Le Farinate", "Le Bevande"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`${API_URL}/api/products`),
          fetch(`${API_URL}/api/categories`)
        ]);
        
        if (prodRes.ok && catRes.ok) {
          const prodData = await prodRes.json();
          const catData = await catRes.json();
          setProducts(prodData);
          setCategories(catData);
        }
      } catch (error) {
        console.error("Errore caricamento menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  // Filtro base per ricerca e categoria selezionata
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Tutte' || product.category.name === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Separiamo le Pizze del Mese dalle altre
  const specialProducts = filteredProducts.filter(p => p.isMonthlySpecial);
  const regularProducts = filteredProducts.filter(p => !p.isMonthlySpecial);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    // L'apertura automatica del carrello è stata rimossa per permettere selezioni multiple
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
    </div>
  );

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="bg-rose-600 text-white p-6 pb-12 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
          <Pizza size={200} />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
            Pizzeria Da Pakino
          </h1>
          <p className="text-rose-100 text-sm font-medium max-w-md mb-6">
            Le migliori pizze, focacce e farinate direttamente a casa tua. 🍕
          </p>

          {/* Barra di Ricerca */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Cerca nel menu..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 placeholder-gray-400 shadow-lg border-none outline-none focus:ring-2 focus:ring-rose-300 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6">
        {/* Navigazione Categorie */}
        <div className="flex gap-2 overflow-x-auto pb-4 pt-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('Tutte')}
            className={`whitespace-nowrap px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all ${
              selectedCategory === 'Tutte' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border'
            }`}
          >
            TUTTE
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`whitespace-nowrap px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all ${
                selectedCategory === cat.name ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border'
              }`}
            >
              {cat.name.toUpperCase()}
            </button>
          ))}
        </div>

        {/* 1. SEZIONE: PIZZA DEL MESE (Sempre visibile in alto se presente) */}
        {specialProducts.length > 0 && (selectedCategory === 'Tutte' || selectedCategory === 'Le Pizze') && (
          <div className="mb-10 mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Star className="text-yellow-400 fill-yellow-400" />
              <h2 className="text-xl font-black uppercase italic text-gray-900 tracking-tighter">
                La Speciale del Mese
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {specialProducts.map((product) => (
                <div key={product.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-[2.5rem] border-2 border-yellow-200 shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-black px-4 py-2 rounded-bl-2xl uppercase tracking-widest">
                    Consigliata ⭐
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2 italic">{product.name}</h3>
                  <p className="text-gray-600 text-sm font-medium mb-6">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-black text-rose-600">€{product.price.toFixed(2)}</span>
                    <button onClick={() => handleAddToCart(product)} className="bg-gray-900 text-white p-4 rounded-2xl hover:bg-rose-600 transition-all shadow-xl active:scale-95">
                      <Plus size={24} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. SEZIONI PER CATEGORIA (Nell'ordine richiesto) */}
        {categoryOrder.map((catName) => {
          const productsInCategory = regularProducts.filter(p => p.category.name === catName);
          if (productsInCategory.length === 0) return null;
          if (selectedCategory !== 'Tutte' && selectedCategory !== catName) return null;

          return (
            <div key={catName} className="mb-12">
              <h2 className="text-2xl font-black uppercase italic text-gray-800 mb-6 border-b-4 border-rose-600 w-fit pr-4">
                {catName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsInCategory.map((product) => (
                  <div key={product.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between group">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-black text-gray-900 leading-tight uppercase italic">{product.name}</h3>
                        <span className="text-lg font-black text-rose-600">€{product.price.toFixed(2)}</span>
                      </div>
                      <p className="text-gray-500 text-xs font-medium leading-relaxed mb-4">{product.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded-lg">
                        <Info size={12} /> {product.category.name}
                      </div>
                      <button onClick={() => handleAddToCart(product)} className="bg-gray-900 hover:bg-rose-600 text-white p-3 rounded-xl shadow-lg transition-all transform active:scale-90">
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Pizza size={48} className="mx-auto mb-4 opacity-50" />
            <p className="font-bold text-sm uppercase tracking-widest">Nessun prodotto trovato</p>
          </div>
        )}
      </div>
    </div>
  );
}