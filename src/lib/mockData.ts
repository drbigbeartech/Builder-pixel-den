import {
  Product,
  Service,
  User,
  Review,
  Order,
  Booking,
} from "@/types/marketplace";

export const mockUsers: User[] = [
  {
    id: "1",
    email: "john@customer.com",
    name: "John Doe",
    role: "customer",
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=john",
    location: {
      city: "Harare",
      area: "Avondale",
      address: "123 Main Street",
    },
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    email: "mary@retailer.com",
    name: "Mary Chikara",
    role: "retailer",
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=mary",
    location: {
      city: "Harare",
      area: "Mbare",
      address: "Mbare Musika Stall 45",
    },
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    email: "grace@service.com",
    name: "Grace Mutindi",
    role: "service-provider",
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=grace",
    location: {
      city: "Harare",
      area: "Eastlea",
      address: "Beauty Salon Complex",
    },
    createdAt: new Date("2024-01-05"),
  },
];

export const mockReviews: Review[] = [
  {
    id: "1",
    userId: "1",
    user: mockUsers[0],
    productId: "1",
    rating: 5,
    comment: "Excellent quality vegetables, fresh and well-packaged!",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    userId: "1",
    user: mockUsers[0],
    serviceId: "1",
    rating: 4,
    comment: "Great hairstyling service, very professional.",
    createdAt: new Date("2024-01-18"),
  },
];

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Fresh Tomatoes",
    description:
      "Farm-fresh tomatoes from Mazowe. Perfect for cooking and salads.",
    price: 3.5,
    images: [
      "https://images.unsplash.com/photo-1546470427-e5ac5d3ff1ce?w=400",
      "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400",
    ],
    category: "Vegetables",
    colors: ["Red", "Green"],
    sizes: ["1kg", "2kg", "5kg"],
    availability: 50,
    sellerId: "2",
    seller: mockUsers[1],
    deliveryTime: "Same day delivery",
    paymentOptions: ["Cash on Delivery", "EcoCash", "Bank Transfer"],
    reviews: [mockReviews[0]],
    rating: 4.8,
    location: mockUsers[1].location,
    createdAt: new Date("2024-01-15"),
    promoted: true,
  },
  {
    id: "2",
    name: "Traditional Chitenge Fabric",
    description:
      "Beautiful traditional African fabric perfect for dresses and wraps.",
    price: 15.0,
    images: [
      "https://images.unsplash.com/photo-1594736797933-d0c6ec8c75ae?w=400",
      "https://images.unsplash.com/photo-1618898227248-42c9f5d5b1b4?w=400",
    ],
    category: "Clothing & Fabric",
    colors: ["Blue", "Red", "Green", "Yellow"],
    sizes: ["2 meters", "4 meters", "6 meters"],
    availability: 25,
    sellerId: "2",
    seller: mockUsers[1],
    deliveryTime: "1-2 days",
    paymentOptions: ["Cash on Delivery", "EcoCash"],
    reviews: [],
    rating: 4.5,
    location: mockUsers[1].location,
    createdAt: new Date("2024-01-12"),
    promoted: false,
  },
  {
    id: "3",
    name: "Handmade Pottery Set",
    description:
      "Beautiful handcrafted pottery set including plates, bowls, and cups.",
    price: 45.0,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    ],
    category: "Home & Garden",
    colors: ["Brown", "Black", "White"],
    sizes: ["4-piece set", "6-piece set", "8-piece set"],
    availability: 10,
    sellerId: "2",
    seller: mockUsers[1],
    deliveryTime: "2-3 days",
    paymentOptions: ["Bank Transfer", "Cash on Delivery"],
    reviews: [],
    rating: 4.7,
    location: mockUsers[1].location,
    createdAt: new Date("2024-01-10"),
    promoted: true,
  },
];

export const mockServices: Service[] = [
  {
    id: "1",
    name: "Hair Styling & Braiding",
    description: "Professional hair styling, braiding, and treatment services.",
    price: 20.0,
    duration: 120,
    category: "Beauty & Wellness",
    providerId: "3",
    provider: mockUsers[2],
    availability: [
      {
        date: new Date("2024-02-01"),
        timeSlots: ["09:00", "11:00", "14:00", "16:00"],
      },
      {
        date: new Date("2024-02-02"),
        timeSlots: ["10:00", "13:00", "15:00"],
      },
    ],
    reviews: [mockReviews[1]],
    rating: 4.6,
    location: mockUsers[2].location,
    createdAt: new Date("2024-01-08"),
  },
  {
    id: "2",
    name: "Mobile Phone Repair",
    description:
      "Quick and reliable mobile phone repair services. Screen replacement, battery, etc.",
    price: 25.0,
    duration: 60,
    category: "Technology",
    providerId: "3",
    provider: mockUsers[2],
    availability: [
      {
        date: new Date("2024-02-01"),
        timeSlots: ["08:00", "10:00", "12:00", "14:00", "16:00"],
      },
    ],
    reviews: [],
    rating: 4.8,
    location: mockUsers[2].location,
    createdAt: new Date("2024-01-06"),
  },
];

export const categories = [
  "All Categories",
  "Vegetables",
  "Fruits",
  "Clothing & Fabric",
  "Home & Garden",
  "Beauty & Wellness",
  "Technology",
  "Food & Beverages",
  "Crafts & Art",
];

export const locations = [
  "All Areas",
  "Avondale",
  "Mbare",
  "Eastlea",
  "Borrowdale",
  "Waterfalls",
  "Kuwadzana",
  "Chitungwiza",
  "Norton",
];
