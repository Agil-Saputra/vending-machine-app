export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  category: string;
}

export interface Transaction {
  id: number;
  productId: number;
  productName: string;
  price: number;
  moneyInserted: number;
  change: number;
  timestamp: string;
}

export interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  image: string;
  category: string;
}
