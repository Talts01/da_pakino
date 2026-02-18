import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Trash2, Edit2, LogOut, Pizza, 
  CheckCircle2, XCircle, ChevronLeft, Save, X, Star
} from 'lucide-react';
import type { Product, Category } from '../types/Product';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // STATI PER IL MODALE DI CREAZIONE/MODIFICA
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API_URL}/api/products?includeAll=true`),
        fetch(`${API_URL}/api/categories`)
      ]);
      setProducts(await prodRes.json());
      setCategories(await catRes.json());
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  // APRE IL MODALE PER CREARE
  const handleOpenCreate = () => {
    setEditingProduct({ 
      name: '', description: '', price: 0, available: true, isMonthlySpecial: false,
      category: categories[0] // Default category
    });
    setIsModalOpen(true);
  };

  // APRE IL MODALE PER MODIFICARE
  const handleOpenEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsModalOpen(true);
  };

  // SALVATAGGIO (CREA O AGGIORNA)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingProduct.id ? 'POST' : 'POST'; // Backend usa save() per entrambi, ma REST vorrebbe PUT. Usiamo POST come da controller attuale.
    
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchData(); // Ricarica tutto
        alert("Prodotto salvato!");
      } else {
        alert("Errore salvataggio");
      }
    } catch (err) {
      alert("Errore connessione");
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Eliminare definitivamente?")) return;
    await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const toggleAvailability = async (id: number) => {
    await fetch(`${API_URL}/api/products/${id}/toggle-availability`, { method: 'PATCH' });
    fetchData();
  };

  if (loading) return <div className="p-10 text-center">Caricamento...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* HEADER */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin')} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft />
          </button>
          <div>
            <h1 className="font-black uppercase text-xl">Menu Editor</h1>
            <p className="text-xs text-gray-400 font-bold uppercase">Gestione Prodotti</p>
          </div>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase flex items-center gap-2 shadow-lg shadow-rose-200"
        >
          <Plus size={18} /> Nuovo Prodotto
        </button>
      </header>

      {/* TABELLA */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-6 text-xs text-gray-400 uppercase">Prodotto</th>
                <th className="p-6 text-xs text-gray-400 uppercase">Cat</th>
                <th className="p-6 text-xs text-gray-400 uppercase">Prezzo</th>
                <th className="p-6 text-xs text-gray-400 uppercase">Stato</th>
                <th className="p-6 text-xs text-gray-400 uppercase text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 group">
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      {p.isMonthlySpecial && <Star size={16} className="text-yellow-400 fill-yellow-400" />}
                      <span className="font-bold text-gray-900">{p.name}</span>
                    </div>
                    <span className="text-xs text-gray-400 line-clamp-1">{p.description}</span>
                  </td>
                  <td className="p-6"><span className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold uppercase">{p.category.name}</span></td>
                  <td className="p-6 font-black text-rose-600">€{p.price.toFixed(2)}</td>
                  <td className="p-6">
                    <button onClick={() => toggleAvailability(p.id)} className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full uppercase ${p.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.available ? 'Attivo' : 'Off'}
                    </button>
                  </td>
                  <td className="p-6 text-right flex justify-end gap-2">
                    <button onClick={() => handleOpenEdit(p)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Edit2 size={16} /></button>
                    <button onClick={() => deleteProduct(p.id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALE DI CREAZIONE / MODIFICA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
            
            <h2 className="text-2xl font-black uppercase italic mb-6">
              {editingProduct.id ? 'Modifica Prodotto' : 'Crea Prodotto'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Nome</label>
                <input 
                  type="text" required 
                  className="w-full p-3 rounded-xl bg-gray-50 font-bold border-none focus:ring-2 focus:ring-rose-500"
                  value={editingProduct.name || ''}
                  onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Descrizione</label>
                <textarea 
                  className="w-full p-3 rounded-xl bg-gray-50 text-sm border-none focus:ring-2 focus:ring-rose-500"
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Prezzo (€)</label>
                  <input 
                    type="number" step="0.50" required 
                    className="w-full p-3 rounded-xl bg-gray-50 font-bold border-none focus:ring-2 focus:ring-rose-500"
                    value={editingProduct.price || ''}
                    onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Categoria</label>
                  <select 
                    className="w-full p-3 rounded-xl bg-gray-50 font-bold border-none focus:ring-2 focus:ring-rose-500"
                    value={editingProduct.category?.id}
                    onChange={e => {
                      const cat = categories.find(c => c.id === parseInt(e.target.value));
                      setEditingProduct({...editingProduct, category: cat});
                    }}
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* TOGGLE PIZZA DEL MESE */}
              <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200 cursor-pointer" onClick={() => setEditingProduct({...editingProduct, isMonthlySpecial: !editingProduct.isMonthlySpecial})}>
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${editingProduct.isMonthlySpecial ? 'bg-yellow-400 border-yellow-400' : 'border-gray-300 bg-white'}`}>
                  {editingProduct.isMonthlySpecial && <CheckCircle2 size={16} className="text-white" />}
                </div>
                <div className="flex-1">
                  <p className="font-black text-sm uppercase text-yellow-800">Pizza del Mese</p>
                  <p className="text-[10px] text-yellow-600">Apparirà in alto con una stella ⭐</p>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-gray-900 text-white font-black rounded-xl uppercase hover:bg-rose-600 transition-colors flex justify-center gap-2">
                <Save /> Salva Prodotto
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}