import { useState } from 'react';
import type { Product, Category } from '../types/Product';
import { Trash2, Plus, LogOut } from 'lucide-react';
import { API_URL } from '../config';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Dati per il form
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Stato del nuovo prodotto
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    categoryId: '',
    available: true
  });

  // 1. LOGIN SEMPLIFICATO
  const handleLogin = () => {
    if (password === 'pizza123') { // 🔒 Password fissa per MVP
      setIsAuthenticated(true);
      loadData();
    } else {
      alert('Password errata!');
    }
  };

  // 2. CARICAMENTO DATI (Prodotti e Categorie)
  const loadData = async () => {
    try {
      // Carichiamo Prodotti E Categorie dal server
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API_URL}/api/products`),
        fetch(`${API_URL}/api/categories`)
      ]);

      const prodData = await prodRes.json();
      const catData = await catRes.json();

      setProducts(prodData);
      setCategories(catData); // Ora sono quelle vere del DB!
    } catch (error) {
      console.error("Errore caricamento dati:", error);
    }
  };

  // 3. SALVATAGGIO NUOVO PRODOTTO
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.categoryId) {
        alert("Seleziona una categoria!");
        return;
    }

    const payload = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        imageUrl: newProduct.imageUrl,
        available: newProduct.available,
        category: { id: parseInt(newProduct.categoryId) } // Il backend vuole un oggetto Category con ID
    };

    try {
        const response = await fetch('http://localhost:8080/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('Prodotto aggiunto!');
            loadData(); // Ricarica la lista
            setNewProduct({ ...newProduct, name: '', description: '', price: '' }); // Resetta form
        } else {
            alert('Errore nel salvataggio');
        }
    } catch (error) {
        console.error(error);
        alert('Errore di connessione');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-96">
          <h1 className="text-2xl font-bold mb-4 text-center">Admin Login 🔒</h1>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin} className="w-full bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700">
            Entra
          </button>
        </div>
      </div>
    );
  }
  const handleDelete = async (id: number) => {
    if (!confirm("Sei sicuro di voler eliminare questa pizza?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id)); // Rimuovi dalla lista a schermo
        alert("Pizza eliminata! 🗑️");
      } else {
        alert("Errore durante l'eliminazione");
      }
    } catch (error) {
      console.error(error);
      alert("Errore di connessione");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Pannello Gestione</h1>
            <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 text-red-600 font-bold">
                <LogOut size={20} /> Esci
            </button>
        </div>

        {/* MODULO AGGIUNTA PIZZA */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Plus className="text-green-600"/> Aggiungi Prodotto</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                    placeholder="Nome Pizza (es: Capricciosa)" 
                    className="p-2 border rounded"
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    required
                />
                <input 
                    placeholder="Prezzo (es: 8.50)" 
                    type="number" step="0.50"
                    className="p-2 border rounded"
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    required
                />
                <select 
                    className="p-2 border rounded"
                    value={newProduct.categoryId}
                    onChange={e => setNewProduct({...newProduct, categoryId: e.target.value})}
                    required
                >
                    <option value="">Seleziona Categoria</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input 
                    placeholder="URL Immagine (opzionale)" 
                    className="p-2 border rounded"
                    value={newProduct.imageUrl}
                    onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})}
                />
                <textarea 
                    placeholder="Descrizione ingredienti..." 
                    className="p-2 border rounded col-span-1 md:col-span-2"
                    value={newProduct.description}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                />
                <button type="submit" className="col-span-1 md:col-span-2 bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">
                    Salva Prodotto
                </button>
            </form>
        </div>

        {/* LISTA PRODOTTI ESISTENTI */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
                    <tr>
                        <th className="p-4">Prodotto</th>
                        <th className="p-4">Prezzo</th>
                        <th className="p-4">Categoria</th>
                        <th className="p-4 text-center">Azioni</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {products.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50">
                            <td className="p-4 font-medium">{p.name}</td>
                            <td className="p-4">€{p.price.toFixed(2)}</td>
                            <td className="p-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{p.category.name}</span></td>
                            <button 
                                onClick={() => handleDelete(p.id)} 
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                                title="Elimina"
                                >
                                <Trash2 size={20} />
                                </button>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}