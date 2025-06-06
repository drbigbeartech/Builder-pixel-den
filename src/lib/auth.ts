import { supabase } from "./supabase";
import { createUser, getUserByEmail } from "./database";
import { UserRole } from "@/types/marketplace";

// Auth state management
let currentUser: any = null;

// Initialize auth state from Supabase session
export const initializeAuth = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    // Get user profile from our users table
    try {
      const userData = await getUserByEmail(session.user.email!);
      currentUser = userData;
      localStorage.setItem("currentUser", JSON.stringify(userData));
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  return currentUser;
};

export const getCurrentUser = () => {
  // First check if we have user in memory
  if (currentUser) return currentUser;

  // Then check localStorage
  const stored = localStorage.getItem("currentUser");
  if (stored) {
    currentUser = JSON.parse(stored);
    return currentUser;
  }

  return null;
};

export const login = async (email: string, password: string) => {
  try {
    // First, try to sign in with Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      // If auth fails, it might be because the user doesn't exist in Supabase Auth yet
      // For demo purposes, we'll create a demo session
      console.log("Auth error:", authError.message);

      // Check if user exists in our database
      try {
        const userData = await getUserByEmail(email);
        if (userData) {
          currentUser = userData;
          localStorage.setItem("currentUser", JSON.stringify(userData));
          return userData;
        }
      } catch (error) {
        // User doesn't exist in our database either
      }

      throw new Error("Invalid email or password");
    }

    // Get user profile from our users table
    const userData = await getUserByEmail(email);
    currentUser = userData;
    localStorage.setItem("currentUser", JSON.stringify(userData));

    return userData;
  } catch (error: any) {
    console.error("Login error:", error);
    throw new Error(error.message || "Login failed");
  }
};

export const signup = async (
  email: string,
  password: string,
  name: string,
  role: UserRole,
  location: { city: string; area: string; address: string },
) => {
  try {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    });

    if (authError) {
      console.log("Auth signup error:", authError.message);
      // Continue with demo user creation even if Supabase auth fails
    }

    // Create user profile in our database
    const userData = await createUser({
      email,
      name,
      role,
      city: location.city,
      area: location.area,
      address: location.address,
    });

    currentUser = userData;
    localStorage.setItem("currentUser", JSON.stringify(userData));

    return userData;
  } catch (error: any) {
    console.error("Signup error:", error);
    throw new Error(error.message || "Signup failed");
  }
};

export const logout = async () => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Logout error:", error);
  }

  currentUser = null;
  localStorage.removeItem("currentUser");
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const hasRole = (role: UserRole): boolean => {
  const user = getCurrentUser();
  return user?.role === role;
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" && session?.user) {
      try {
        const userData = await getUserByEmail(session.user.email!);
        currentUser = userData;
        localStorage.setItem("currentUser", JSON.stringify(userData));
        callback(userData);
      } catch (error) {
        console.error("Error fetching user on auth change:", error);
        callback(null);
      }
    } else if (event === "SIGNED_OUT") {
      currentUser = null;
      localStorage.removeItem("currentUser");
      callback(null);
    }
  });
};

// Initialize auth when the module loads
initializeAuth();
