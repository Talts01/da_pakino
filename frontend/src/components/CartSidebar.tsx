import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { generateWhatsAppLink } from "../utils/whatsapp";

export const CartSidebar = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, cartTotal } = useCart();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const link = generateWhatsAppLink(cart, cartTotal);
    window.open(link, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Sfondo scuro (clicca per chiudere) */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Pannello Bianco */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Intestazione */}
        <div className="p-4 border-b flex justify-between items-center bg-red-600 text-white">
          <h2 className="text-xl font-bold">Il tuo Ordine 🛒</h2>
          <button onClick={() => setIsCartOpen(false)} className="hover:bg-red-700 p-1 rounded">
            <X size={24} />
          </button>
        </div>

        {/* Lista Prodotti */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <p>Il carrello è vuoto 😢</p>
              <p className="text-sm">Aggiungi qualche pizza!</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg shadow-sm">
                {/* Immagine Piccola */}
                <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                   {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                </div>

                {/* Info Prodotto */}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{item.name}</h3>
                  <div className="text-red-600 font-medium">€{item.price.toFixed(2)}</div>
                </div>

                {/* Controlli Quantità */}
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2 bg-white border rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100 rounded text-red-600"
                    >
                      {item.quantity === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
                    </button>
                    <span className="font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded text-green-600"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer col Totale e Bottone WhatsApp */}
        {cart.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-4 text-xl font-bold">
              <span>Totale:</span>
              <span className="text-red-600">€{cartTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg"
            >
              <span>Ordina su WhatsApp</span>
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};