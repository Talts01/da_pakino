import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Product } from '../types/Product'; // Assicurati che questo import sia corretto
 // Assicurati che questo import sia corretto

// Estendiamo il prodotto aggiungendo la quantità
export interface CartItem extends Product {
  quantity: number;
  selectedExtras: { name: string; price: number }[];
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Recupera dal local storage all'avvio (così se ricarica la pagina non perde l'ordine)
    const savedCart = localStorage.getItem('dapakino_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Salva nel local storage ad ogni modifica
  useEffect(() => {
    localStorage.setItem('dapakino_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Apre il carrello automaticamente quando aggiungi il primo prodotto
      setIsCartOpen(true); 
      return [...prev, { ...product, quantity: 1, selectedExtras: [] }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return removeFromCart(productId);
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, clearCart, 
      cartTotal, cartCount, isCartOpen, setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};