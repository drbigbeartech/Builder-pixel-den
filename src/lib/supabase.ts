import { createClient } from "@supabase/supabase-js";

// Get Supabase credentials from environment variables
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://your-project-ref.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

// For development/demo, we'll use fallback demo credentials if environment variables aren't set
const isDevelopment = import.meta.env.DEV;
const hasValidConfig =
  supabaseUrl !== "https://your-project-ref.supabase.co" &&
  supabaseAnonKey !== "your-anon-key";

// Create a single supabase client for interacting with your database
export const supabase = hasValidConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : // Fallback for demo - returns a mock client that doesn't make real requests
    createMockSupabaseClient();

// Database Types based on our schema
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: "customer" | "retailer" | "service-provider";
          avatar_url?: string;
          city: string;
          area: string;
          address?: string;
          coordinates?: { lat: number; lng: number };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role: "customer" | "retailer" | "service-provider";
          avatar_url?: string;
          city: string;
          area: string;
          address?: string;
          coordinates?: { lat: number; lng: number };
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: "customer" | "retailer" | "service-provider";
          avatar_url?: string;
          city?: string;
          area?: string;
          address?: string;
          coordinates?: { lat: number; lng: number };
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          images: string[];
          category: string;
          colors: string[];
          sizes: string[];
          availability: number;
          seller_id: string;
          delivery_time: string;
          payment_options: string[];
          promoted: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          images: string[];
          category: string;
          colors: string[];
          sizes: string[];
          availability: number;
          seller_id: string;
          delivery_time: string;
          payment_options: string[];
          promoted?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          images?: string[];
          category?: string;
          colors?: string[];
          sizes?: string[];
          availability?: number;
          seller_id?: string;
          delivery_time?: string;
          payment_options?: string[];
          promoted?: boolean;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          duration: number;
          category: string;
          provider_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          duration: number;
          category: string;
          provider_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          duration?: number;
          category?: string;
          provider_id?: string;
          updated_at?: string;
        };
      };
      service_availability: {
        Row: {
          id: string;
          service_id: string;
          date: string;
          time_slots: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          service_id: string;
          date: string;
          time_slots: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          service_id?: string;
          date?: string;
          time_slots?: string[];
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          product_id?: string;
          service_id?: string;
          rating: number;
          comment: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id?: string;
          service_id?: string;
          rating: number;
          comment: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          service_id?: string;
          rating?: number;
          comment?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_id: string;
          total: number;
          status:
            | "pending"
            | "confirmed"
            | "shipped"
            | "delivered"
            | "cancelled";
          delivery_city: string;
          delivery_area: string;
          delivery_address: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          total: number;
          status?:
            | "pending"
            | "confirmed"
            | "shipped"
            | "delivered"
            | "cancelled";
          delivery_city: string;
          delivery_area: string;
          delivery_address: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          total?: number;
          status?:
            | "pending"
            | "confirmed"
            | "shipped"
            | "delivered"
            | "cancelled";
          delivery_city?: string;
          delivery_area?: string;
          delivery_address?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
          color?: string;
          size?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
          color?: string;
          size?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          price?: number;
          color?: string;
          size?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          customer_id: string;
          service_id: string;
          date: string;
          time: string;
          status: "pending" | "confirmed" | "completed" | "cancelled";
          total: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          service_id: string;
          date: string;
          time: string;
          status?: "pending" | "confirmed" | "completed" | "cancelled";
          total: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          service_id?: string;
          date?: string;
          time?: string;
          status?: "pending" | "confirmed" | "completed" | "cancelled";
          total?: number;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          recipient_id: string;
          content: string;
          type: "text" | "image";
          image_url?: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          recipient_id: string;
          content: string;
          type?: "text" | "image";
          image_url?: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          recipient_id?: string;
          content?: string;
          type?: "text" | "image";
          image_url?: string;
          read?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: "customer" | "retailer" | "service-provider";
      order_status:
        | "pending"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "cancelled";
      booking_status: "pending" | "confirmed" | "completed" | "cancelled";
      message_type: "text" | "image";
    };
  };
};

// Mock Supabase client for demo purposes
function createMockSupabaseClient() {
  console.warn(
    "Using mock Supabase client for demo. Please set up real Supabase credentials in .env file.",
  );

  return {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
      eq: () => ({ data: [], error: null }),
      single: () => ({ data: null, error: null }),
      order: () => ({ data: [], error: null }),
      gte: () => ({ data: [], error: null }),
      lte: () => ({ data: [], error: null }),
      gt: () => ({ data: [], error: null }),
      or: () => ({ data: [], error: null }),
      ilike: () => ({ data: [], error: null }),
    }),
    auth: {
      signUp: () => ({ data: null, error: null }),
      signInWithPassword: () => ({ data: null, error: null }),
      signOut: () => ({ error: null }),
      getSession: () => ({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: null } }),
    },
    channel: () => ({
      on: () => ({ subscribe: () => {} }),
      subscribe: () => {},
    }),
  };
}

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error("Supabase error:", error);
  throw new Error(error?.message || "An unexpected error occurred");
};

// Check if we have a valid Supabase configuration
export const hasValidSupabaseConfig = () => hasValidConfig;
