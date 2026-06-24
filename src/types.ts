export interface CustomizationColors {
  primary: string;   // e.g. for Lollipop: Cloud Base color
  secondary: string; // e.g. for Lollipop: Flower Collar color
  tertiary: string;  // e.g. for Lollipop: Sphere color
  stick?: string;    // e.g. for Lollipop: Stick/Pen color
}

export interface Product3D {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  category: 'organizer' | 'decor' | 'modular';
  estimatedPrintTime: string; // e.g. "4h 30m"
  dimensions: string; // e.g. "12 x 12 x 15 cm"
  weightGrams: number; // e.g. 150g PLA
  customizableParts: {
    primaryLabel: string;
    secondaryLabel: string;
    tertiaryLabel: string;
    hasStick?: boolean;
    stickLabel?: string;
  };
}

export interface CartItem {
  id: string; // unique cart item id (product.id + colors key)
  product: Product3D;
  customColors: CustomizationColors;
  quantity: number;
  totalPrice: number;
  sizeMultiplier: 'standard' | 'large' | 'mini';
}

export type OrderStatus = 'received' | 'printing' | 'finishing' | 'shipped' | 'delivered';

export interface Order {
  id: string; // tracking code like FR-3D-XXXXX
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCPF: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
  items: {
    productId: string;
    productName: string;
    customColors: CustomizationColors;
    quantity: number;
    sizeMultiplier: 'standard' | 'large' | 'mini';
    price: number;
  }[];
  paymentMethod: 'pix' | 'credit_card';
  paymentDetails: {
    installments?: number;
    pixCode?: string;
    cardLast4?: string;
  };
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  history: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage: string;
  category: string;
  tags: string[];
  createdAt: string;
  readTime: string;
}

export interface FilamentStock {
  id: string;
  colorName: string;
  colorHex: string;
  gramsRemaining: number;
  capacityGrams: number;
  pricePerGram: number;
}

export interface StoreNotification {
  id: string;
  orderId: string;
  title: string;
  message: string;
  type: 'status_update' | 'new_order' | 'low_stock';
  isRead: boolean;
  createdAt: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  googleAnalyticsId: string;
  sitemapEnabled: boolean;
}

export interface SalesReport {
  totalRevenue: number;
  totalOrdersCount: number;
  ordersByStatus: Record<OrderStatus, number>;
  filamentUsageGrams: number;
  dailyRevenue: { date: string; value: number }[];
  popularProducts: { name: string; salesCount: number }[];
}
