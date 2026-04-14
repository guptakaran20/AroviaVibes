export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: 'Men' | 'Women' | 'Unisex';
  image: string;
  secondaryImage?: string;
  rating: number;
  stock: number;
  isNew?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  customer: {
    name: string;
    phone: string;
    address: string;
    paymentMethod: 'COD' | 'UPI';
  };
}
