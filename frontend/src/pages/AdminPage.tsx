import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Trash2, Edit2, ChevronLeft, Save, X, Star, CheckCircle2
} from 'lucide-react';
import type { Product, Category } from '../types/Product';
import styles from './AdminPage.module.css';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
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
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingProduct({ 
      name: '', description: '', price: 0, available: true, isMonthlySpecial: false,
      category: categories[0] 
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchData(); 
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
    <div className={styles.container}>
      
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button onClick={() => navigate('/admin')} className={styles.backButton}>
            <ChevronLeft />
          </button>
          <div>
            <h1 className={styles.title}>Menu Editor</h1>
            <p className={styles.subtitle}>Gestione Prodotti</p>
          </div>
        </div>
        <button onClick={handleOpenCreate} className={styles.newButton}>
          <Plus size={18} /> Nuovo Prodotto
        </button>
      </header>

      {/* TABELLA */}
      <div className={styles.content}>
        <div className={styles.tableContainer}>
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className={styles.tableHeader}>
                <th>Prodotto</th>
                <th>Cat</th>
                <th>Prezzo</th>
                <th>Stato</th>
                <th className="text-right">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className={`${styles.tableRow} group`}>
                  <td className={styles.tableCell}>
                    <div className="flex items-center gap-2">
                      {p.isMonthlySpecial && <Star size={16} className="text-yellow-400 fill-yellow-400" />}
                      <span className={styles.productName}>{p.name}</span>
                    </div>
                    <span className={styles.productDesc}>{p.description}</span>
                  </td>
                  <td className={styles.tableCell}><span className={styles.categoryTag}>{p.category.name}</span></td>
                  <td className={`${styles.tableCell} ${styles.priceTag}`}>€{p.price.toFixed(2)}</td>
                  <td className={styles.tableCell}>
                    <button onClick={() => toggleAvailability(p.id)} className={`${styles.statusButton} ${p.available ? styles.statusActive : styles.statusInactive}`}>
                      {p.available ? 'Attivo' : 'Off'}
                    </button>
                  </td>
                  <td className={`${styles.tableCell} text-right`}>
                    <button onClick={() => handleOpenEdit(p)} className={`${styles.actionButton} ${styles.editBtn}`}><Edit2 size={16} /></button>
                    <button onClick={() => deleteProduct(p.id)} className={`${styles.actionButton} ${styles.deleteBtn}`}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALE */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <button onClick={() => setIsModalOpen(false)} className={styles.closeButton}><X size={24} /></button>
            
            <h2 className={styles.modalTitle}>
              {editingProduct.id ? 'Modifica Prodotto' : 'Crea Prodotto'}
            </h2>

            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Nome</label>
                <input 
                  type="text" required 
                  className={styles.input}
                  value={editingProduct.name || ''}
                  onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Descrizione</label>
                <textarea 
                  className={styles.textarea}
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={styles.label}>Prezzo (€)</label>
                  <input 
                    type="number" step="0.50" required 
                    className={styles.input}
                    value={editingProduct.price || ''}
                    onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className={styles.label}>Categoria</label>
                  <select 
                    className={styles.input}
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

              <div className={styles.specialToggle} onClick={() => setEditingProduct({...editingProduct, isMonthlySpecial: !editingProduct.isMonthlySpecial})}>
                <div className={`${styles.checkbox} ${editingProduct.isMonthlySpecial ? styles.checkboxActive : styles.checkboxInactive}`}>
                  {editingProduct.isMonthlySpecial && <CheckCircle2 size={16} className="text-white" />}
                </div>
                <div className="flex-1">
                  <p className="font-black text-sm uppercase text-yellow-800">Pizza del Mese</p>
                  <p className="text-[10px] text-yellow-600">Apparirà in alto con una stella ⭐</p>
                </div>
              </div>

              <button type="submit" className={styles.saveButton}>
                <Save /> Salva Prodotto
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}