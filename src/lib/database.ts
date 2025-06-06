import { supabase, handleSupabaseError } from "./supabase";
import {
  User,
  Product,
  Service,
  Review,
  Order,
  Booking,
  Message,
  SearchFilters,
} from "@/types/marketplace";

// User operations
export const createUser = async (userData: {
  email: string;
  name: string;
  role: "customer" | "retailer" | "service-provider";
  city: string;
  area: string;
  address?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert([userData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error);
  }
};

export const getUserById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error);
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error);
  }
};

// Product operations
export const getProducts = async (filters?: SearchFilters) => {
  try {
    let query = supabase.from("products").select(`
        *,
        seller:users!products_seller_id_fkey(*),
        reviews(*, user:users(*))
      `);

    // Apply filters
    if (filters?.category && filters.category !== "All Categories") {
      query = query.eq("category", filters.category);
    }

    if (filters?.priceMin !== undefined) {
      query = query.gte("price", filters.priceMin);
    }

    if (filters?.priceMax !== undefined) {
      query = query.lte("price", filters.priceMax);
    }

    if (filters?.availability) {
      query = query.gt("availability", 0);
    }

    if (filters?.query) {
      query = query.or(
        `name.ilike.%${filters.query}%,description.ilike.%${filters.query}%`,
      );
    }

    // Apply sorting
    switch (filters?.sortBy) {
      case "price-asc":
        query = query.order("price", { ascending: true });
        break;
      case "price-desc":
        query = query.order("price", { ascending: false });
        break;
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error);
  }
};

export const getProductById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        seller:users!products_seller_id_fkey(*),
        reviews(*, user:users(*))
      `,
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error);
  }
};

export const createProduct = async (productData: {
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
}) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .insert([productData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error);
  }
};

export const updateProduct = async (id: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error);
  }
};

// Service operations
export const getServices = async (filters?: SearchFilters) => {
  try {
    let query = supabase.from("services").select(`
        *,
        provider:users!services_provider_id_fkey(*),
        reviews(*, user:users(*))
      `);

    // Apply filters
    if (filters?.category && filters.category !== "All Categories") {
      query = query.eq("category", filters.category);
    }

    if (filters?.priceMin !== undefined) {
      query = query.gte("price", filters.priceMin);
    }

    if (filters?.priceMax !== undefined) {
      query = query.lte("price", filters.priceMax);
    }

    if (filters?.query) {
      query = query.or(
        `name.ilike.%${filters.query}%,description.ilike.%${filters.query}%`,
      );
    }

    // Apply sorting
    switch (filters?.sortBy) {
      case "price-asc":
        query = query.order("price", { ascending: true });
        break;
      case "price-desc":
        query = query.order("price", { ascending: false });
        break;
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error);
  }
};

export const createService = async (serviceData: {
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  provider_id: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("services")
      .insert([serviceData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error);
  }
};

// Review operations
export const createReview = async (reviewData: {
  user_id: string;
  product_id?: string;
  service_id?: string;
  rating: number;
  comment: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .insert([reviewData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error);
  }
};

// Order operations
export const createOrder = async (orderData: {
  customer_id: string;
  total: number;
  delivery_city: string;
  delivery_area: string;
  delivery_address: string;
  items: {
    product_id: string;
    quantity: number;
    price: number;
    color?: string;
    size?: string;
  }[];
}) => {
  try {
    // Create order first
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          customer_id: orderData.customer_id,
          total: orderData.total,
          delivery_city: orderData.delivery_city,
          delivery_area: orderData.delivery_area,
          delivery_address: orderData.delivery_address,
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = orderData.items.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)
      .select();

    if (itemsError) throw itemsError;

    return { order, items };
  } catch (error) {
    handleSupabaseError(error);
  }
};

export const getOrdersByCustomer = async (customerId: string) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items(*,
          product:products(*, seller:users(*))
        )
      `,
      )
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error);
  }
};

// Booking operations
export const createBooking = async (bookingData: {
  customer_id: string;
  service_id: string;
  date: string;
  time: string;
  total: number;
}) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .insert([bookingData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error);
  }
};

export const getBookingsByCustomer = async (customerId: string) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        service:services(*,
          provider:users(*)
        )
      `,
      )
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error);
  }
};

export const getBookingsByProvider = async (providerId: string) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        customer:users(*),
        service:services(*)
      `,
      )
      .eq("service.provider_id", providerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error);
  }
};

// Message operations
export const getConversations = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        *,
        sender:users!messages_sender_id_fkey(*),
        recipient:users!messages_recipient_id_fkey(*)
      `,
      )
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Group messages by conversation
    const conversationsMap = new Map();

    data?.forEach((message) => {
      const otherUserId =
        message.sender_id === userId ? message.recipient_id : message.sender_id;
      const otherUser =
        message.sender_id === userId ? message.recipient : message.sender;

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          id: otherUserId,
          otherUser,
          messages: [],
          lastMessage: message,
          unreadCount: 0,
        });
      }

      const conversation = conversationsMap.get(otherUserId);
      conversation.messages.push(message);

      // Count unread messages (messages sent to current user that are unread)
      if (message.recipient_id === userId && !message.read) {
        conversation.unreadCount++;
      }
    });

    return Array.from(conversationsMap.values());
  } catch (error) {
    handleSupabaseError(error);
  }
};

export const getMessages = async (userId: string, otherUserId: string) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        *,
        sender:users!messages_sender_id_fkey(*),
        recipient:users!messages_recipient_id_fkey(*)
      `,
      )
      .or(
        `and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`,
      )
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error);
  }
};

export const sendMessage = async (messageData: {
  sender_id: string;
  recipient_id: string;
  content: string;
  type?: "text" | "image";
  image_url?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert([messageData])
      .select(
        `
        *,
        sender:users!messages_sender_id_fkey(*),
        recipient:users!messages_recipient_id_fkey(*)
      `,
      )
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error);
  }
};

export const markMessagesAsRead = async (messageIds: string[]) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .update({ read: true })
      .in("id", messageIds)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error);
  }
};

// Real-time subscriptions
export const subscribeToMessages = (
  userId: string,
  callback: (payload: any) => void,
) => {
  return supabase
    .channel("messages")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "messages",
        filter: `or(sender_id.eq.${userId},recipient_id.eq.${userId})`,
      },
      callback,
    )
    .subscribe();
};

export const subscribeToOrders = (
  userId: string,
  userRole: string,
  callback: (payload: any) => void,
) => {
  let filter = "";

  if (userRole === "customer") {
    filter = `customer_id=eq.${userId}`;
  } else if (userRole === "retailer") {
    // For retailers, we need to watch orders that contain their products
    // This requires a more complex setup - for now, we'll use a simpler approach
    filter = `customer_id=neq.${userId}`; // Watch all orders and filter in callback
  }

  return supabase
    .channel("orders")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "orders",
        filter,
      },
      callback,
    )
    .subscribe();
};

export const subscribeToBookings = (
  userId: string,
  userRole: string,
  callback: (payload: any) => void,
) => {
  let filter = "";

  if (userRole === "customer") {
    filter = `customer_id=eq.${userId}`;
  } else if (userRole === "service-provider") {
    // For service providers, watch bookings for their services
    filter = `customer_id=neq.${userId}`; // Watch all bookings and filter in callback
  }

  return supabase
    .channel("bookings")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookings",
        filter,
      },
      callback,
    )
    .subscribe();
};
