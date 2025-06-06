import { supabase } from "./supabase";
import { useEffect, useState } from "react";

// Real-time hooks and utilities that work without replication feature
// Uses Supabase's postgres_changes which is available in all plans

export const useRealTimeMessages = (userId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    // Initial load
    const loadMessages = async () => {
      try {
        const { data } = await supabase
          .from("messages")
          .select(
            `
            *,
            sender:users!messages_sender_id_fkey(*),
            recipient:users!messages_recipient_id_fkey(*)
          `,
          )
          .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
          .order("created_at", { ascending: true });

        setMessages(data || []);
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Set up real-time subscription
    const subscription = supabase
      .channel("messages-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `or(sender_id.eq.${userId},recipient_id.eq.${userId})`,
        },
        (payload) => {
          console.log("Real-time message update:", payload);

          if (payload.eventType === "INSERT") {
            setMessages((prev) => [...prev, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === payload.new.id ? { ...msg, ...payload.new } : msg,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return { messages, loading, setMessages };
};

export const useRealTimeProducts = (filters?: any) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load
    const loadProducts = async () => {
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

        if (filters?.query) {
          query = query.or(
            `name.ilike.%${filters.query}%,description.ilike.%${filters.query}%`,
          );
        }

        const { data } = await query.order("created_at", { ascending: false });
        setProducts(data || []);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();

    // Set up real-time subscription for product changes
    const subscription = supabase
      .channel("products-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        (payload) => {
          console.log("Real-time product update:", payload);

          if (payload.eventType === "INSERT") {
            setProducts((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setProducts((prev) =>
              prev.map((product) =>
                product.id === payload.new.id
                  ? { ...product, ...payload.new }
                  : product,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setProducts((prev) =>
              prev.filter((product) => product.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [JSON.stringify(filters)]);

  return { products, loading, setProducts };
};

export const useRealTimeOrders = (userId: string, userRole: string) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    // Initial load
    const loadOrders = async () => {
      try {
        let query = supabase.from("orders").select(`
            *,
            order_items(*,
              product:products(*, seller:users(*))
            )
          `);

        if (userRole === "customer") {
          query = query.eq("customer_id", userId);
        }

        const { data } = await query.order("created_at", { ascending: false });
        setOrders(data || []);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();

    // Set up real-time subscription
    const subscription = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          console.log("Real-time order update:", payload);

          // Filter based on user role
          let shouldUpdate = false;
          if (userRole === "customer" && payload.new?.customer_id === userId) {
            shouldUpdate = true;
          } else if (userRole === "retailer") {
            // For retailers, we need to check if the order contains their products
            // This is a simplified check - in production you'd want more sophisticated filtering
            shouldUpdate = true;
          }

          if (shouldUpdate) {
            if (payload.eventType === "INSERT") {
              setOrders((prev) => [payload.new, ...prev]);
            } else if (payload.eventType === "UPDATE") {
              setOrders((prev) =>
                prev.map((order) =>
                  order.id === payload.new.id
                    ? { ...order, ...payload.new }
                    : order,
                ),
              );
            }
          }
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, userRole]);

  return { orders, loading, setOrders };
};

export const useRealTimeBookings = (userId: string, userRole: string) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    // Initial load
    const loadBookings = async () => {
      try {
        let query = supabase.from("bookings").select(`
            *,
            customer:users!bookings_customer_id_fkey(*),
            service:services(*,
              provider:users!services_provider_id_fkey(*)
            )
          `);

        if (userRole === "customer") {
          query = query.eq("customer_id", userId);
        } else if (userRole === "service-provider") {
          // Join with services to filter by provider
          query = query.eq("service.provider_id", userId);
        }

        const { data } = await query.order("created_at", { ascending: false });
        setBookings(data || []);
      } catch (error) {
        console.error("Error loading bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();

    // Set up real-time subscription
    const subscription = supabase
      .channel("bookings-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        (payload) => {
          console.log("Real-time booking update:", payload);

          if (payload.eventType === "INSERT") {
            setBookings((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setBookings((prev) =>
              prev.map((booking) =>
                booking.id === payload.new.id
                  ? { ...booking, ...payload.new }
                  : booking,
              ),
            );
          }
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, userRole]);

  return { bookings, loading, setBookings };
};

// Utility functions for real-time operations
export const sendRealTimeMessage = async (messageData: {
  sender_id: string;
  recipient_id: string;
  content: string;
  type?: "text" | "image";
  image_url?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          ...messageData,
          type: messageData.type || "text",
          read: false,
          created_at: new Date().toISOString(),
        },
      ])
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
    console.error("Error sending message:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const updateBookingStatus = async (
  bookingId: string,
  status: string,
) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
};

// Real-time notification system
export const useRealTimeNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;

    // Subscribe to multiple tables for notifications
    const messagesSubscription = supabase
      .channel("user-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [
            ...prev,
            {
              id: Date.now(),
              type: "message",
              title: "New Message",
              message: `You have a new message`,
              timestamp: new Date(),
              data: payload.new,
            },
          ]);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `customer_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [
            ...prev,
            {
              id: Date.now(),
              type: "order",
              title: "Order Update",
              message: `Your order status has been updated to ${payload.new.status}`,
              timestamp: new Date(),
              data: payload.new,
            },
          ]);
        },
      )
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
    };
  }, [userId]);

  const clearNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return { notifications, clearNotification };
};
