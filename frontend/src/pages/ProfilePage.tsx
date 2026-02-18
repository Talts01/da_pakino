import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { History, Pizza, RefreshCw, UserCircle, Save, Settings2, ReceiptText, ChevronRight } from 'lucide-react';
import type { Order } from '../types/Order';
import type { Product } from '../types/Product';

export default function ProfilePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuProducts, setMenuProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [formData, setFormData] = useState({ 
    ...user,
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: user?.address || '',
    phone: user?.phone || ''
  });

  const { addToCart, setIsCartOpen } = useCart();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, menuRes] = await Promise.all([
          fetch(`${API_URL}/api/orders/user/${user?.id}`),
          fetch(`${API_URL}/api/products`)
        ]);
        if (ordersRes.ok) setOrders(await ordersRes.json());
        if (menuRes.ok) setMenuProducts(await menuRes.json());
      } catch (error) {
        console.error("Errore caricamento:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user?.id, API_URL]);

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/update-profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const updatedUser = await res.json();
        // 1. Aggiorna il localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        // 2. Aggiorna lo stato locale della pagina
        setUser(updatedUser);
        
        // 3. !!! IMPORTANTE: Scatena un evento per avvisare il carrello e la navbar
        window.dispatchEvent(new Event('storage')); 
        
        alert("Profilo aggiornato! ✨");
      } else {
        alert("Errore durante il salvataggio.");
      }
    } catch (err) {
      alert("Errore di connessione.");
    } finally {
      setIsUpdating(false);
    }
  };

  const historyOrders = orders
    .filter(order => ['COMPLETATO', 'CONSEGNATO', 'RIFIUTATO'].includes(order.status))
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

  const handleReorder = (orderDetails: string) => {
    const lines = orderDetails.split('\n');
    let addedCount = 0;
    lines.forEach(line => {
      const match = line.match(/^\d+x\s+(.*?)(?:\s+\(Extra:|$)/);
      if (match) {
        const productName = match[1].trim();
        const product = menuProducts.find(p => p.name.toLowerCase() === productName.toLowerCase());
        if (product && product.available) {
          addToCart(product);
          addedCount++;
        }
      }
    });
    if (addedCount > 0) setIsCartOpen(true);
  };

  if (loading) return <div className="p-20 text-center animate-pulse font-black text-gray-400">Caricamento... 🍕</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-rose-600 px-6 py-12 rounded-b-[3rem] shadow-xl text-white mb-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="bg-white/20 p-4 rounded-full backdrop-blur-md border border-white/30">
            <UserCircle size={60} />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">Profilo Personale</h1>
            <p className="text-rose-100 text-xs font-bold uppercase tracking-widest mt-1 opacity-80">Gestisci i tuoi dati e i tuoi gusti 🍕🔥</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* MODIFICA ACCOUNT */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-rose-100 p-2 rounded-lg text-rose-600"><Settings2 size={20} /></div>
              <h2 className="text-sm font-black uppercase text-gray-900 tracking-widest">Dati Consegna ⚙️</h2>
            </div>
            
            <form onSubmit={handleUpdateUser} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Nome sul Citofono / Cognome 🏷️</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold focus:bg-white focus:border-rose-500 transition-all outline-none"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Indirizzo 🏠</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold focus:bg-white focus:border-rose-500 transition-all outline-none"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Telefono 📞</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold focus:bg-white focus:border-rose-500 transition-all outline-none"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                disabled={isUpdating}
                className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-rose-600 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
              >
                {isUpdating ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                Salva Nuovi Dati
              </button>
            </form>
          </div>
        </div>

        {/* STORICO ORDINI */}
        <div className="lg:col-span-8">
          <div className="flex items-center gap-2 mb-8 px-2">
            <History className="text-rose-600" size={24} />
            <h2 className="text-2xl font-black uppercase italic text-gray-900">Le tue serate Pizza 😋</h2>
          </div>

          <div className="space-y-10">
            {historyOrders.map(order => (
              <div key={order.id} className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-rose-50 p-4 rounded-2xl text-rose-600">
                        <ReceiptText size={24} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Scontrino Digitale #{order.id}
                        </span>
                        <div className="text-sm font-black text-gray-900">{new Date(order.orderDate).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-rose-600 italic">€{order.totalAmount.toFixed(2)}</div>
                      <span className="text-[9px] font-black uppercase text-green-600 bg-green-50 px-2 py-1 rounded-md mt-2 inline-block border border-green-100">Successo ✨</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50/70 rounded-[2rem] p-6 border-2 border-dashed border-gray-200 mb-6 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">
                      Tagliando Consegna
                    </div>
                    <div className="space-y-4">
                      {order.orderDetails.split('\n').map((line, idx) => {
                        // FILTRO: Togliamo le righe tecniche, compreso "Orario Richiesto"
                        if (line.includes('---') || 
                            line.includes('Cliente:') || 
                            line.includes('Indirizzo:') || 
                            line.includes('Tel:') || 
                            line.includes('Orario Richiesto:')) return null;
                        
                        if (line.trim() === '') return null;
                        
                        const isTotal = line.includes('TOTALE:');
                        return (
                          <div key={idx} className={`flex justify-between items-center ${isTotal ? 'pt-4 border-t-2 border-gray-200 mt-2' : ''}`}>
                            <span className={`${isTotal ? 'font-black text-gray-900 text-sm' : 'font-bold text-gray-600 text-xs'} uppercase flex items-center gap-3`}>
                              {!isTotal && <div className="w-1.5 h-1.5 bg-rose-400 rounded-full" />}
                              {line.split('€')[0].replace(/^\d+x\s+/, (m) => `${m.trim()} x `)}
                            </span>
                            {line.includes('€') && (
                              <span className={`${isTotal ? 'text-lg text-rose-600' : 'text-gray-900'} font-black italic`}>€{line.split('€')[1]}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleReorder(order.orderDetails)}
                    className="w-full py-5 rounded-2xl bg-gray-900 text-white font-black text-xs uppercase flex items-center justify-center gap-3 hover:bg-rose-600 transition-all active:scale-95 group/btn"
                  >
                    <RefreshCw size={16} className="group-hover/btn:rotate-180 transition-transform duration-700" />
                    Ordina di nuovo 
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}