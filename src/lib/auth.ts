import { supabase } from "./supabase";
import { createUser, getUserByEmail, getUserById } from "./database";
import { UserRole } from "@/types/marketplace";

// Auth state management
let currentUser: any = null;

// Initialize auth state from Supabase session
export const initializeAuth = async () => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      // Get user profile from our users table
      try {
        const userData = await getUserByEmail(session.user.email!);
        currentUser = userData;
        localStorage.setItem("currentUser", JSON.stringify(userData));
        return userData;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // If user doesn't exist in our database, create them
        if (session.user.email) {
          try {
            const newUser = await createUser({
              email: session.user.email,
              name:
                session.user.user_metadata?.full_name ||
                session.user.email.split("@")[0],
              role: "customer", // Default role
              city: "Harare",
              area: "City Center",
              address: "",
            });
            currentUser = newUser;
            localStorage.setItem("currentUser", JSON.stringify(newUser));
            return newUser;
          } catch (createError) {
            console.error("Error creating user profile:", createError);
          }
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error initializing auth:", error);
    return null;
  }
};

export const getCurrentUser = () => {
  // First check if we have user in memory
  if (currentUser) return currentUser;

  // Then check localStorage
  const stored = localStorage.getItem("currentUser");
  if (stored) {
    try {
      currentUser = JSON.parse(stored);
      return currentUser;
    } catch (error) {
      localStorage.removeItem("currentUser");
    }
  }

  return null;
};

// Google OAuth sign in
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Google sign in error:", error);
    throw new Error(error.message || "Failed to sign in with Google");
  }
};

// GitHub OAuth sign in
export const signInWithGitHub = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("GitHub sign in error:", error);
    throw new Error(error.message || "Failed to sign in with GitHub");
  }
};

// Email/password sign in
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Get user profile from our users table
    const userData = await getUserByEmail(email);
    currentUser = userData;
    localStorage.setItem("currentUser", JSON.stringify(userData));

    return userData;
  } catch (error: any) {
    console.error("Email sign in error:", error);
    throw new Error(error.message || "Invalid email or password");
  }
};

// Email/password sign up
export const signUpWithEmail = async (
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
          full_name: name,
          role: role,
        },
      },
    });

    if (authError) throw authError;

    if (authData.user) {
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
    }

    throw new Error("Failed to create user account");
  } catch (error: any) {
    console.error("Email signup error:", error);
    throw new Error(error.message || "Failed to create account");
  }
};

// Update user role (for after OAuth signup)
export const updateUserRole = async (
  role: UserRole,
  location?: { city: string; area: string; address: string },
) => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error("No user logged in");

    const updates: any = { role };
    if (location) {
      updates.city = location.city;
      updates.area = location.area;
      updates.address = location.address;
    }

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;

    currentUser = data;
    localStorage.setItem("currentUser", JSON.stringify(data));

    return data;
  } catch (error: any) {
    console.error("Update user role error:", error);
    throw new Error(error.message || "Failed to update user role");
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

// Reset password
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error("Reset password error:", error);
    throw new Error(error.message || "Failed to send reset email");
  }
};

// Update password
export const updatePassword = async (password: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error("Update password error:", error);
    throw new Error(error.message || "Failed to update password");
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    console.log("Auth state change:", event, session?.user?.email);

    if (event === "SIGNED_IN" && session?.user) {
      try {
        // Check if user exists in our database
        let userData;
        try {
          userData = await getUserByEmail(session.user.email!);
        } catch (error) {
          // User doesn't exist, create them
          userData = await createUser({
            email: session.user.email!,
            name:
              session.user.user_metadata?.full_name ||
              session.user.email!.split("@")[0],
            role: "customer", // Default role for OAuth users
            city: "Harare",
            area: "City Center",
            address: "",
          });
        }

        currentUser = userData;
        localStorage.setItem("currentUser", JSON.stringify(userData));
        callback(userData);
      } catch (error) {
        console.error("Error handling auth state change:", error);
        callback(null);
      }
    } else if (event === "SIGNED_OUT") {
      currentUser = null;
      localStorage.removeItem("currentUser");
      callback(null);
    }
  });
};

// Get auth session
export const getSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

// Initialize auth when the module loads
initializeAuth();
