export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  price: number;
  discount_price?: number;
  category: 'Men' | 'Women' | 'Unisex';
  image_url: string;
  secondary_image_url?: string;
  rating: number;
  stock: number;
  is_new?: boolean;
  is_featured?: boolean;
  is_active?: boolean;
  cod_charges?: number;
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
