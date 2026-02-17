import { useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, MapPin, Clock, User } from "lucide-react";
import { useCart } from "../context/CartContext";

// Configurazione costi consegna dal menu ufficiale
const CITIES = [
  { name: 'Vinovo', price: 2.0 },
  { name: 'Candiolo', price: 3.0 },
  { name: 'La Loggia', price: 3.0 },
  { name: 'Piobesi', price: 3.0 },
  { name: 'Altro Comune', price: 3.5 }
];

export const CartSidebar = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, cartTotal, removeFromCart } = useCart();

  // Stati per il modulo di consegna
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [selectedCity, setSelectedCity] = useState('Vinovo');

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (!customerName || !address || !deliveryTime) {
      alert("⚠️ Per favore, inserisci Nome, Indirizzo e Orario per la consegna!");
      return;
    }

    const deliveryCost = CITIES.find(c => c.name === selectedCity)?.price || 0;
    const finalTotal = cartTotal + deliveryCost;
    const phoneNumber = "393331234567"; // ⚠️ METTI IL TUO NUMERO REALE QUI (con 39 davanti)

    // Costruzione messaggio WhatsApp professionale
    let message = `*🍕 NUOVO ORDINE DA PAKINO 🍕*\n\n`;
    message += `👤 *Cliente:* ${customerName}\n`;
    message += `📍 *Indirizzo:* ${address} (${selectedCity})\n`;
    message += `⏰ *Orario:* ${deliveryTime}\n`;
    message += `\n----------------------------\n\n`;

    cart.forEach((item) => {
      const extrasText = item.selectedExtras && item.selectedExtras.length > 0
        ? `\n   └ ➕ _Extra: ${item.selectedExtras.map((e: any) => e.name).join(', ')}_`
        : '';

      message += `▫️ ${item.quantity}x *${item.name}* ${extrasText}\n   Prezzo: €${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    message += `----------------------------\n`;
    message += `🍕 Totale Pizze: €${cartTotal.toFixed(2)}\n`;
    message += `🚚 Consegna (${selectedCity}): €${deliveryCost.toFixed(2)}\n`;
    message += `*💰 TOTALE DA PAGARE: €${finalTotal.toFixed(2)}*`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end font-sans">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* HEADER */}
        <div className="p-6 border-b flex justify-between items-center bg-rose-600 text-white">
          <div className="flex items-center space-x-2">
            <ShoppingBag size={24} />
            <h2 className="text-xl font-black uppercase tracking-tight italic">Il tuo Ordine</h2>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="hover:bg-rose-700 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* LISTA PRODOTTI */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <ShoppingBag size={64} className="mx-auto mb-4 opacity-10" />
              <p className="font-bold text-lg">Carrello vuoto</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-black text-gray-900 leading-tight uppercase text-sm">{item.name}</h3>
                    {item.selectedExtras && item.selectedExtras.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.selectedExtras.map((extra: any, i: number) => (
                          <span key={i} className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-md font-black">
                            + {extra.name.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-rose-600 font-black text-sm ml-2">
                    €{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-gray-50 rounded text-rose-600">
                      {item.quantity === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
                    </button>
                    <span className="font-black w-6 text-center text-xs">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-gray-50 rounded text-green-600">
                      <Plus size={16} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-rose-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODULO DATI CONSEGNA */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t space-y-3 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1">
              <MapPin size={12} /> Dati per la consegna
            </h3>
            
            <div className="relative">
              <User size={16} className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" placeholder="Nome sul citofono"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-rose-500 outline-none text-sm transition-all"
                value={customerName} onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <select 
                className="w-1/3 p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold outline-none"
                value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}
              >
                {CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
              <input 
                type="text" placeholder="Via e civico"
                className="flex-1 p-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-rose-500 outline-none text-sm"
                value={address} onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="relative">
              <Clock size={16} className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="time"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-rose-500 outline-none text-sm"
                value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* FOOTER E CHECKOUT */}
        {cart.length > 0 && (
          <div className="p-6 border-t bg-gray-50">
            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Prodotti:</span>
                <span>€{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Consegna ({selectedCity}):</span>
                <span>€{(CITIES.find(c => c.name === selectedCity)?.price || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-2xl font-black text-gray-900 pt-2 border-t">
                <span>TOTALE:</span>
                <span className="text-rose-600">€{(cartTotal + (CITIES.find(c => c.name === selectedCity)?.price || 0)).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-2xl flex items-center justify-center space-x-3 transition-all transform active:scale-95 shadow-xl"
            >
              <span className="text-lg">INVIA ORDINE SU WHATSAPP</span>
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};