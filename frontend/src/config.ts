// Se siamo in sviluppo (localhost), usa la porta 8080.
// Se siamo online (Vercel), useremo l'indirizzo del backend di Render.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";