import { useState, useEffect } from 'react';
import { Pizza, Clock, Package, Bike, CheckCircle2, Calendar, ChefHat, MapPin, Timer, Receipt, RefreshCw, ArrowRight, Phone, UserIcon } from 'lucide-react';
import type { Order } from '../types/Order';
import { motion, AnimatePresence } from 'framer-motion';
import PremiumButton from '../components/ui/PremiumButton';
import { useNavigate } from 'react-router-dom';
import styles from './OrdersPage.module.css';

// Stati e loro progresso percentuale
const STATUS_PROGRESS: Record<string, number> = {
  'INVIATO': 15,
  'IN_PREPARAZIONE': 50,
  'IN_CONSEGNA': 85,
  'CONSEGNATO': 100,
  'COMPLETATO': 100
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/api/orders/user/${user?.id}`);
        if (response.ok) {
          const data: Order[] = await response.json();
          setOrders(data.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
        }
      } catch (error) {
        console.error("Errore recupero ordini:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
    const interval = setInterval(fetchOrders, 3000); // Polling ogni 10s
    return () => clearInterval(interval);
  }, [user?.id, API_URL]);

  const activeOrders = orders.filter(o => ['INVIATO', 'IN_PREPARAZIONE', 'IN_CONSEGNA'].includes(o.status));
  const historyOrders = orders.filter(o => !['INVIATO', 'IN_PREPARAZIONE', 'IN_CONSEGNA'].includes(o.status));

  // Prendiamo l'ordine attivo più recente come principale
  const mainActiveOrder = activeOrders.length > 0 ? activeOrders[0] : null;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream text-brand-dark">
      <RefreshCw className="animate-spin" size={32} />
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.headerSection}>
        <h1 className={styles.headerTitle}>Il Tuo Percorso del Gusto</h1>
        <p className={styles.headerSubtitle}>Segui i tuoi ordini in tempo reale. </p>
      </div>

      

      {/* Contenuto Tabs */}
      <AnimatePresence mode="wait">
        {activeTab === 'active' ? (
          <motion.div 
            key="active"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className="max-w-3xl mx-auto"
          >
            {mainActiveOrder ? (
              <ActiveOrderTracker order={mainActiveOrder} />
            ) : (
              <EmptyState message="Nessun ordine in preparazione al momento." />
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="history"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className={styles.historyGrid}
          >
            {historyOrders.length > 0 ? (
              historyOrders.map(order => <ReceiptCard key={order.id} order={order} />)
            ) : (
              <EmptyState message="Non hai ancora effettuato ordini." />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- COMPONENTI UI ---

// Componente per l'ordine attivo (Tracker)
// Componente per l'ordine attivo (Tracker)
// Componente per l'ordine attivo (Tracker)
function ActiveOrderTracker({ order }: { order: Order }) {
  const progress = STATUS_PROGRESS[order.status] || 0;
  const statusLabel = order.status.replace('_', ' ');

  const lines = order.orderDetails.split('\n');

  // 1. Estraiamo i Prodotti (escludendo le righe tecniche)
  const productLines = lines.filter(line => 
      !line.includes('---') && 
      !line.includes('Cliente:') && 
      !line.includes('Indirizzo:') && 
      !line.includes('Tel:') && 
      !line.includes('Orario') && 
      !line.includes('TOTALE:') && 
      line.trim() !== ''
    );

  // 2. Estraiamo i Dati Utente
  const clientName = lines.find(l => l.startsWith('Cliente:'))?.replace('Cliente:', '').trim() || '-';
  const address = lines.find(l => l.startsWith('Indirizzo:'))?.replace('Indirizzo:', '').trim() || '-';
  const phone = lines.find(l => l.startsWith('Tel:'))?.replace('Tel:', '').trim() || '-';

  return (
    <div className={styles.activeTrackerCard}>
      <Pizza size={200} className={styles.trackerBgIcon} />
      
      <div className={styles.trackerHeader}>
        <div>
          <h2 className={styles.orderStatusBig}>{statusLabel}</h2>
        </div>
        <div className={styles.deliveryTimeBox}>
          <p className={styles.deliveryLabel}>Orario Previsto</p>
          <p className={styles.deliveryTimeValue}>{order.deliveryTime}</p>
        </div>
      </div>

      {/* Barra di Progresso */}
      <div className={styles.progressBarContainer}>
        <div className={styles.progressTrack}>
          <motion.div 
            className={styles.progressFill}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <div className={styles.progressGlow} />
          </motion.div>
        </div>
        <div className={styles.progressIcons}>
          <StepIcon icon={<Clock />} label="Ricevuto" active={progress >= 15} />
          <StepIcon icon={<ChefHat />} label="In Forno" active={progress >= 50} />
          <StepIcon icon={<Bike />} label="In Consegna" active={progress >= 85} />
          <StepIcon icon={<MapPin />} label="Arrivo" active={progress === 100} />
        </div>
      </div>

      {/* Box Scuro: Dettagli Ordine + Dati Utente */}
      <div className={styles.activeDetails}>
        
        {/* SEZIONE 1: LISTA PIZZE */}
        <div className="mb-6">
          <h3 className="font-heading font-bold mb-3 uppercase text-sm tracking-wider flex items-center gap-2 text-brand-gold">
            <Receipt size={14} /> Cosa hai ordinato
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {productLines.map((line, idx) => {
              const qtyMatch = line.match(/^(\d+)x/);
              const qty = qtyMatch ? qtyMatch[1] : '1';
              const name = line.replace(/^\d+x\s+/, '').split('€')[0].trim();
              
              return (
                <div key={idx} className="flex items-start gap-3 text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                  <span className="bg-brand-cream text-brand-dark font-black px-2 py-0.5 rounded text-xs shrink-0">
                    {qty}x
                  </span>
                  <span className="font-medium text-white/90 leading-tight">
                    {name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Separatore */}
        <div className="h-px bg-white/10 w-full mb-6" />

        {/* SEZIONE 2: DATI UTENTE (Riepilogo Veloce) */}
        <div>
           <h3 className="font-heading font-bold mb-3 uppercase text-sm tracking-wider flex items-center gap-2 text-brand-gold">
            <MapPin size={14} /> Dati di Consegna
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            
            {/* Nome */}
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
              <div className="bg-white/10 p-2 rounded-full"><UserIcon size={14} className="text-white" /></div> {/* Nota: assicurati di importare User as UserIcon se va in conflitto */}
              <div>
                <p className="text-[10px] uppercase font-bold opacity-50">Cliente</p>
                <p className="font-bold text-white">{clientName}</p>
              </div>
            </div>

            {/* Indirizzo */}
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
              <div className="bg-white/10 p-2 rounded-full"><MapPin size={14} className="text-white" /></div>
              <div>
                <p className="text-[10px] uppercase font-bold opacity-50">Indirizzo</p>
                <p className="font-bold text-white line-clamp-1" title={address}>{address}</p>
              </div>
            </div>

            {/* Telefono */}
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
               <div className="bg-white/10 p-2 rounded-full"><Phone size={14} className="text-white" /></div>
               <div>
                <p className="text-[10px] uppercase font-bold opacity-50">Contatto</p>
                <p className="font-bold text-white">{phone}</p>
              </div>
            </div>

             {/* Totale (Spostato qui per equilibrio) */}
             <div className="flex items-center justify-between gap-3 bg-brand-red/20 border border-brand-red/30 p-3 rounded-xl">
               <div>
                <p className="text-[10px] uppercase font-bold opacity-70 text-brand-red">Totale da Pagare</p>
               </div>
               <p className="font-heading font-black text-xl text-white">€{order.totalAmount.toFixed(2)}</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// Icona step della progress bar
function StepIcon({ icon, label, active }: { icon: any, label: string, active: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-2 ${active ? styles.progressIconActive : ''}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
}

// Componente per lo storico (Scontrino)
function ReceiptCard({ order }: { order: Order }) {
  const navigate = useNavigate();

  // Parsing pulito dei dettagli
  const cleanDetails = order.orderDetails
    .split('\n')
    .filter(line => !line.includes('---') && !line.includes('Cliente:') && !line.includes('Indirizzo:') && !line.includes('Tel:') && !line.includes('Orario') && !line.includes('TOTALE:') && line.trim() !== '');

  return (
    <div className={styles.receiptCard}>
      <div className={styles.receiptHeader}>
        <div className={styles.receiptPattern} />
        <p className={styles.receiptDate}>
          {new Date(order.orderDate).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>
      <div className={styles.receiptBody}>
        <p className={styles.receiptOrderId}>Scontrino Fiscale #{order.id}</p>
        
        <div className={styles.receiptItems}>
          {cleanDetails.map((line, idx) => {
            const parts = line.split('€');
            const name = parts[0].replace(/^\d+x\s+/, '');
            const qty = line.match(/^\d+x/)?.[0].replace('x', '') || '1';
            const price = parts[1] || '';
            
            return (
              <div key={idx} className={styles.receiptItemRow}>
                <div><span className={styles.receiptQuantity}>{qty}x</span> {name}</div>
                {price && <div>€{price}</div>}
              </div>
            );
          })}
        </div>

        <div className={styles.receiptTotalSection}>
          <p className={styles.receiptTotalLabel}>Totale Pagato</p>
          <p className={styles.receiptTotalPrice}>€{order.totalAmount.toFixed(2)}</p>
        </div>

        <div className="mt-6 text-center">
           <button 
              onClick={() => navigate('/menu')}
              className="text-xs font-bold text-brand-dark/40 hover:text-brand-red uppercase tracking-wider transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              Ordina di nuovo <ArrowRight size={12} />
           </button>
        </div>
      </div>
    </div>
  );
}

// Empty State
function EmptyState({ message }: { message: string }) {
  const navigate = useNavigate();
  return (
    <div className={styles.emptyState}>
      <Package size={64} className="mb-4 text-brand-dark/20 animate-bounce" />
      <p className="font-heading font-bold text-xl mb-6 text-brand-dark/60">{message}</p>
      <PremiumButton onClick={() => navigate('/menu')}>
        Vai al Menu
      </PremiumButton>
    </div>
  );
}