export interface Sale {
  _id: string;
  userId: string;
  productId: {
    _id: string;
    name: string;
    category: string;
    // ...other product fields
  };
  quantity: number;
  price: number;
  date: string;
  customerSegment?: string;
  paymentMethod?: string;
}

export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  tags?: string[];
}

export interface AnalyticsData {
  totalSales: number;
  totalRevenue: number;
  topProduct: string;
  products: Product[];
  sales: Sale[];
}
