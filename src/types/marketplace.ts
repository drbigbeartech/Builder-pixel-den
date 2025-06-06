export type UserRole = "customer" | "retailer" | "service-provider";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  location: Location;
  createdAt: Date;
}

export interface Location {
  city: string;
  area: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  colors: string[];
  sizes: string[];
  availability: number;
  sellerId: string;
  seller: User;
  deliveryTime: string;
  paymentOptions: string[];
  reviews: Review[];
  rating: number;
  location: Location;
  createdAt: Date;
  promoted: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  providerId: string;
  provider: User;
  availability: ServiceAvailability[];
  reviews: Review[];
  rating: number;
  location: Location;
  createdAt: Date;
}

export interface ServiceAvailability {
  date: Date;
  timeSlots: string[];
}

export interface Review {
  id: string;
  userId: string;
  user: User;
  productId?: string;
  serviceId?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  customerId: string;
  customer: User;
  items: OrderItem[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  deliveryAddress: Location;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customer: User;
  serviceId: string;
  service: Service;
  date: Date;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  total: number;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  sender: User;
  recipientId: string;
  recipient: User;
  content: string;
  type: "text" | "image";
  imageUrl?: string;
  timestamp: Date;
  read: boolean;
}

export interface Chat {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
  updatedAt: Date;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  availability?: boolean;
  newArrivals?: boolean;
  sortBy?: "price-asc" | "price-desc" | "rating" | "newest" | "popularity";
}
