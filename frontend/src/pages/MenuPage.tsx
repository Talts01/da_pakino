import { useEffect, useState, useMemo } from 'react'; // <--- AGGIUNTO useMemo
import { Pizza, ShoppingCart } from 'lucide-react';
import type { Product } from '../types/Product';
import { useCart } from '../context/CartContext';
import { CartSidebar } from '../components/CartSidebar';
import { API_URL } from '../config';

function MenuPage() {
  const { addToCart, cartCount, setIsCartOpen } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // STATO PER IL FILTRO
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutte');

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error('Errore nella connessione al server');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("ERRORE DETTAGLIATO:", err);
        setError(`Errore: ${err.message}`);
        setLoading(false);
      });
  }, []);

  // 1. ESTRAIAMO LE CATEGORIE UNICHE DAI PRODOTTI (Logica Automatica)
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category.name));
    return ['Tutte', ...Array.from(cats)];
  }, [products]);

  // 2. FILTRIAMO I PRODOTTI DA MOSTRARE
  const filteredProducts = selectedCategory === 'Tutte' 
    ? products 
    : products.filter(p => p.category.name === selectedCategory);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl font-bold text-red-600">Caricamento pizze in corso... 🍕</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">{error}</div>;

  return (
        
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER */}
      <header className="bg-red-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Pizza /> Da Pakino
          </h1>
          <button 
            className="bg-white text-red-600 px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-gray-100 relative transition-transform active:scale-95"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart size={20} />
            <span className="hidden sm:inline">Carrello</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-800 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-red-600 animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="container mx-auto p-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center sm:text-left">Il Nostro Menu</h2>
        
        {/* BARRA DEI FILTRI (NUOVO COMPONENTE) */}
        <div className="flex gap-2 overflow-x-auto pb-6 mb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-red-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
          <div className="relative h-[300px] w-full overflow-hidden bg-red-700">
            <img src="/logo_pakino.webp" alt="Da Pakino" className="w-full h-full object-contain p-4" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
              <p className="italic text-lg">"...sempre profumate con basilico fresco e olio extra vergine d'oliva."</p>
            </div>
          </div>
        {/* GRIGLIA PRODOTTI FILTRATI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 flex flex-col">
              
              {/* Immagine */}
              <div className="h-48 overflow-hidden bg-gray-200 relative group">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                    <Pizza size={48} />
                  </div>
                )}
                {!product.available && (
                   <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-lg">ESAURITO</div>
                )}
              </div>
              
              {/* Contenuto */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">{product.name}</h3>
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                  {product.description}
                </p>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <span className="text-2xl font-bold text-gray-900">€{product.price.toFixed(2)}</span>
                  <button 
                    disabled={!product.available}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      product.available 
                        ? "bg-red-600 text-white hover:bg-red-700 active:bg-red-800" 
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={() => addToCart(product)}
                  >
                    {product.available ? "Aggiungi" : "Non disp."}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <CartSidebar />
    </div>
  );
}

export default MenuPage;