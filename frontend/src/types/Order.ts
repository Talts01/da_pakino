export interface Order {
  id: number;
  orderDate: string;      
  deliveryTime: string;   
  totalAmount: number;
  orderDetails: string;   
  status: 'INVIATO' | 'IN_PREPARAZIONE' | 'IN_CONSEGNA' | 'COMPLETATO' | 'CONSEGNATO' | 'RIFIUTATO';
  user?: {
    id: number;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}