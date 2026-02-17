export const generateWhatsAppLink = (cart: any[], total: number) => {
  const phoneNumber = "39XXXXXXXXXX"; // Inserisci il tuo numero reale qui

  let message = `*🍕 NUOVO ORDINE DA PAKINO 🍕*\n\n`;

  cart.forEach((item) => {
    // Gestione della stringa degli extra
    const extrasText = item.selectedExtras && item.selectedExtras.length > 0
      ? `\n   └ ➕ _Extra: ${item.selectedExtras.map((e: any) => e.name).join(', ')}_`
      : '';

    message += `▫️ ${item.quantity}x *${item.name}* ${extrasText}\n   Prezzo: €${(item.price * item.quantity).toFixed(2)}\n\n`;
  });

  message += `*💰 TOTALE ORDINE: €${total.toFixed(2)}*\n`;
  message += `\n----------------------------\n`;
  message += `📍 *Indirizzo di consegna:*\n(Scrivi qui Via e Comune)\n`;
  message += `⏰ *Orario desiderato:*\n(Scrivi l'ora)`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};