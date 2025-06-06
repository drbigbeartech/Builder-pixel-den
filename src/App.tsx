import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AuthCallback from "./pages/auth/Callback";
import CustomerDashboard from "./pages/customer/Dashboard";
import ProductDetail from "./pages/customer/ProductDetail";
import RetailerDashboard from "./pages/retailer/Dashboard";
import AddProduct from "./pages/retailer/AddProduct";
import ServiceProviderDashboard from "./pages/service-provider/Dashboard";
import Chat from "./pages/messaging/Chat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/retailer" element={<RetailerDashboard />} />
          <Route path="/retailer/add-product" element={<AddProduct />} />
          <Route
            path="/service-provider"
            element={<ServiceProviderDashboard />}
          />
          <Route path="/messages" element={<Chat />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
