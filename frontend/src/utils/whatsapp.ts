import type { CartItem } from "../context/CartContext";

export const generateWhatsAppLink = (cart: CartItem[], total: number) => {
  const phoneNumber = "393331234567"; // ⚠️ METTI QUI IL TUO NUMERO (con 39 davanti)

  // 1. Intestazione Messaggio
  let message = `*🍕 NUOVO ORDINE DA PAKINO 🍕*\n\n`;

  // 2. Lista Prodotti
  cart.forEach((item) => {
    message += `▫️ ${item.quantity}x *${item.name}* - €${(item.price * item.quantity).toFixed(2)}\n`;
  });

  // 3. Totale
  message += `\n*💰 TOTALE: €${total.toFixed(2)}*`;
  message += `\n\n----------------------------\n`;
  message += `📍 *Indirizzo di consegna:*\n(Scrivi qui il tuo indirizzo)`;

  // 4. Codifica per URL (trasforma spazi e a capo in %20, %0A ecc.)
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};