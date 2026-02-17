import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Plus, Info, Truck, CheckCircle2 } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  available: boolean;
}

// Opzioni Extra basate sul menu ufficiale
const EXTRA_OPTIONS = [
  { id: 'extra', name: 'Extra', price: 1.0 },
  { id: 'premium', name: 'Bufala/Crudo/Porcini', price: 2.0 },
  { id: 'stracciatella', name: 'Stracciatella', price: 4.0 }
];

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, setIsCartOpen, cart } = useCart();
  const [activeCategory, setActiveCategory] = useState('Tutti');
  
  // Stato per gestire gli extra selezionati per ogni prodotto
  const [selectedExtras, setSelectedExtras] = useState<{[key: number]: any[]}>({});

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore fetch:", err);
        setLoading(false);
      });
  }, [API_URL]);

  const toggleExtra = (productId: number, extra: any) => {
    const currentExtras = selectedExtras[productId] || [];
    const isSelected = currentExtras.find(e => e.id === extra.id);
    
    if (isSelected) {
      setSelectedExtras({
        ...selectedExtras,
        [productId]: currentExtras.filter(e => e.id !== extra.id)
      });
    } else {
      setSelectedExtras({
        ...selectedExtras,
        [productId]: [...currentExtras, extra]
      });
    }
  };

  const categories = ['Tutti', ...Array.from(new Set(products.map((p) => p.category.name)))];

  const filteredProducts = activeCategory === 'Tutti'
    ? products
    : products.filter((p) => p.category.name === activeCategory);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-rose-600 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      {/* --- HERO SECTION CON CARICATURA --- */}
      <div className="relative h-80 sm:h-[500px] w-full bg-rose-700 overflow-hidden">
        <img 
          src="/logo-pakino.webp" 
          alt="Da Pakino Logo" 
          className="absolute inset-0 w-full h-full object-contain p-6 z-10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-20" />
        
        <div className="absolute bottom-10 left-0 right-0 text-center px-4 z-30">
          <h1 className="text-5xl sm:text-7xl font-black text-white mb-3 tracking-tighter drop-shadow-2xl italic">
            DA PAKINO
          </h1>
          <p className="text-white/95 italic text-sm sm:text-xl max-w-2xl mx-auto font-medium drop-shadow-lg">
            "...sempre profumate con basilico fresco e servite con un filo d'olio extra vergine d'oliva italiano a crudo."
          </p>
        </div>
      </div>

      {/* --- FILTRO CATEGORIE --- */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar py-4 flex space-x-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all transform active:scale-95 ${
                activeCategory === cat
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-200 scale-105'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* --- LISTA PRODOTTI --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const productExtras = selectedExtras[product.id] || [];
            const extrasPrice = productExtras.reduce((sum, e) => sum + e.price, 0);

            return (
              <div 
                key={product.id} 
                className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="p-8 flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-black text-gray-900 leading-tight">{product.name}</h3>
                    <div className="text-xl font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-xl">
                      €{(product.price + extrasPrice).toFixed(2)}
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 italic">
                    {product.description}
                  </p>
                  
                  {/* SELEZIONE EXTRA */}
                  {product.category.name === "Le Pizze" && (
                    <div className="space-y-3 mb-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Personalizza la tua pizza:</p>
                      <div className="flex flex-wrap gap-2">
                        {EXTRA_OPTIONS.map((extra) => {
                          const isAdded = productExtras.find(e => e.id === extra.id);
                          return (
                            <button
                              key={extra.id}
                              onClick={() => toggleExtra(product.id, extra)}
                              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all ${
                                isAdded 
                                  ? 'bg-green-600 border-green-600 text-white' 
                                  : 'bg-white border-gray-200 text-gray-500 hover:border-rose-300'
                              }`}
                            >
                              {isAdded ? <CheckCircle2 size={12} /> : <Plus size={12} />}
                              <span>{extra.name} (+€{extra.price.toFixed(0)})</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                    <Info size={12} className="mr-1" />
                    {product.category.name}
                  </div>
                </div>
                
                <div className="p-6 pt-0">
                  <button
                    onClick={() => {
                      const itemToAdd = {
                        ...product,
                        price: product.price + extrasPrice,
                        selectedExtras: productExtras
                      };
                      addToCart(itemToAdd);
                      setSelectedExtras({ ...selectedExtras, [product.id]: [] });
                    }}
                    className="w-full bg-gray-900 hover:bg-rose-600 text-white font-black py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-95"
                  >
                    <Plus size={20} />
                    <span>AGGIUNGI AL CARRELLO</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- SEZIONE CONSEGNE --- */}
        <div className="mt-20 mb-10 bg-white rounded-[3rem] p-10 border-2 border-dashed border-gray-200">
          <div className="flex flex-col items-center text-center">
            <div className="bg-rose-100 p-4 rounded-3xl text-rose-600 mb-6">
              <Truck size={40} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-8">Servizio a Domicilio</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              <div className="p-6 rounded-[2rem] bg-gray-50">
                <p className="font-black text-rose-600 text-xl mb-1">Vinovo</p>
                <p className="text-gray-500 font-bold">€2.00</p>
              </div>
              <div className="p-6 rounded-[2rem] bg-gray-50">
                <p className="font-black text-rose-600 text-xl mb-1">Dintorni</p>
                <p className="text-gray-500 font-bold text-xs">Candiolo, La Loggia, Piobesi</p>
                <p className="text-gray-500 font-bold">€3.00</p>
              </div>
              <div className="p-6 rounded-[2rem] bg-gray-50">
                <p className="font-black text-rose-600 text-xl mb-1">Altri Comuni</p>
                <p className="text-gray-500 font-bold">da €3.50</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mt-10 uppercase font-bold tracking-widest">
              NB: Extra €1 | Bufala, Crudo, Porcini €2 | Stracciatella €4
            </p>
          </div>
        </div>
      </main>

      {/* --- TASTO CARRELLO FLOTTANTE --- */}
      {cart.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 bg-green-500 text-white p-6 rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all z-50 flex items-center group"
        >
          <ShoppingCart size={32} />
          <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs font-black w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        </button>
      )}
    </div>
  );
}