import { User, UserRole } from "@/types/marketplace";

// Mock authentication state
let currentUser: User | null = null;

export const getCurrentUser = (): User | null => {
  // In a real app, this would check localStorage/cookies and validate with backend
  const stored = localStorage.getItem("currentUser");
  if (stored) {
    currentUser = JSON.parse(stored);
  }
  return currentUser;
};

export const login = async (email: string, password: string): Promise<User> => {
  // Mock login - in real app, this would call your authentication API
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

  // Mock user data based on email
  const mockUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    name: email
      .split("@")[0]
      .replace(/[._]/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    role: email.includes("retailer")
      ? "retailer"
      : email.includes("service")
        ? "service-provider"
        : "customer",
    avatar: `https://api.dicebear.com/6.x/avataaars/svg?seed=${email}`,
    location: {
      city: "Harare",
      area: "Avondale",
      address: "123 Market Street",
    },
    createdAt: new Date(),
  };

  currentUser = mockUser;
  localStorage.setItem("currentUser", JSON.stringify(mockUser));
  return mockUser;
};

export const signup = async (
  email: string,
  password: string,
  name: string,
  role: UserRole,
  location: { city: string; area: string; address: string },
): Promise<User> => {
  // Mock signup - in real app, this would call your authentication API
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

  const newUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    name,
    role,
    avatar: `https://api.dicebear.com/6.x/avataaars/svg?seed=${email}`,
    location,
    createdAt: new Date(),
  };

  currentUser = newUser;
  localStorage.setItem("currentUser", JSON.stringify(newUser));
  return newUser;
};

export const logout = () => {
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
