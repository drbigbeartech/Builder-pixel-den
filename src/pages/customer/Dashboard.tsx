import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { SearchFilters } from "@/components/marketplace/SearchFilters";
import {
  Search,
  Filter,
  Calendar,
  Star,
  MapPin,
  Clock,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { getProducts, getServices } from "@/lib/database";
import { hasValidSupabaseConfig } from "@/lib/supabase";
import { mockProducts, mockServices } from "@/lib/mockData";
import {
  SearchFilters as Filters,
  Product,
  Service,
} from "@/types/marketplace";
import { getCurrentUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const CustomerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
  const user = getCurrentUser();
  const { toast } = useToast();
  const hasSupabase = hasValidSupabaseConfig();

  useEffect(() => {
    loadData();
  }, [filters, searchQuery]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (hasSupabase) {
        // Use real Supabase data
        const [productsData, servicesData] = await Promise.all([
          getProducts({ ...filters, query: searchQuery }),
          getServices({ ...filters, query: searchQuery }),
        ]);

        setProducts(productsData || []);
        setServices(servicesData || []);
      } else {
        // Use mock data with client-side filtering
        let filteredProducts = [...mockProducts];
        let filteredServices = [...mockServices];

        // Apply search query
        if (searchQuery) {
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              product.category
                .toLowerCase()
                .includes(searchQuery.toLowerCase()),
          );

          filteredServices = filteredServices.filter(
            (service) =>
              service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              service.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              service.category
                .toLowerCase()
                .includes(searchQuery.toLowerCase()),
          );
        }

        // Apply category filter
        if (filters.category && filters.category !== "All Categories") {
          filteredProducts = filteredProducts.filter(
            (product) => product.category === filters.category,
          );
          filteredServices = filteredServices.filter(
            (service) => service.category === filters.category,
          );
        }

        // Apply location filter
        if (filters.location && filters.location !== "All Areas") {
          filteredProducts = filteredProducts.filter(
            (product) => product.location.area === filters.location,
          );
          filteredServices = filteredServices.filter(
            (service) => service.location.area === filters.location,
          );
        }

        // Apply price filter
        if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
          const minPrice = filters.priceMin || 0;
          const maxPrice = filters.priceMax || Infinity;
          filteredProducts = filteredProducts.filter(
            (product) => product.price >= minPrice && product.price <= maxPrice,
          );
          filteredServices = filteredServices.filter(
            (service) => service.price >= minPrice && service.price <= maxPrice,
          );
        }

        // Apply rating filter
        if (filters.rating) {
          filteredProducts = filteredProducts.filter(
            (product) => product.rating >= filters.rating!,
          );
          filteredServices = filteredServices.filter(
            (service) => service.rating >= filters.rating!,
          );
        }

        // Apply availability filter
        if (filters.availability) {
          filteredProducts = filteredProducts.filter(
            (product) => product.availability > 0,
          );
        }

        // Apply new arrivals filter
        if (filters.newArrivals) {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          filteredProducts = filteredProducts.filter(
            (product) => product.createdAt > oneWeekAgo,
          );
          filteredServices = filteredServices.filter(
            (service) => service.createdAt > oneWeekAgo,
          );
        }

        // Apply sorting
        const sortFn = getSortFunction(filters.sortBy);
        if (sortFn) {
          filteredProducts.sort(sortFn);
          filteredServices.sort(sortFn as any);
        }

        setProducts(filteredProducts);
        setServices(filteredServices);
      }
    } catch (error: any) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load marketplace data. Using demo data.",
        variant: "destructive",
      });

      // Fallback to mock data
      setProducts(mockProducts);
      setServices(mockServices);
    } finally {
      setIsLoading(false);
    }
  };

  const getSortFunction = (sortBy?: string) => {
    switch (sortBy) {
      case "price-asc":
        return (a: Product, b: Product) => a.price - b.price;
      case "price-desc":
        return (a: Product, b: Product) => b.price - a.price;
      case "rating":
        return (a: Product, b: Product) => b.rating - a.rating;
      case "newest":
        return (a: Product, b: Product) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "popularity":
        return (a: Product, b: Product) =>
          (b.reviews?.length || 0) - (a.reviews?.length || 0);
      default:
        return null;
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const renderServiceCard = (service: any) => (
    <Card
      key={service.id}
      className="overflow-hidden hover:shadow-lg transition-all duration-200"
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{service.name}</CardTitle>
            <CardDescription className="mt-1">
              {service.description}
            </CardDescription>
          </div>
          <Badge>{service.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              ${service.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{service.duration} min</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(service.rating || 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">
              {service.rating || 0} ({service.reviews?.length || 0})
            </span>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>
              {service.provider?.area || service.location?.area},{" "}
              {service.provider?.city || service.location?.city}
            </span>
          </div>

          <Button className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            Book Appointment
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (!user || user.role !== "customer") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need to be logged in as a customer to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground">
            Discover amazing products and services in{" "}
            {user.location?.area || user.area},{" "}
            {user.location?.city || user.city}
          </p>
          {!hasSupabase && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Demo Mode:</strong> Using mock data. Set up Supabase
                credentials in .env file for real-time functionality.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters
              filters={filters}
              onFiltersChange={setFilters}
              className="space-y-4"
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger
                    value="products"
                    className="flex items-center gap-2"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Products ({products.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="services"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Services ({services.length})
                  </TabsTrigger>
                </TabsList>

                {isLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                )}
              </div>

              <TabsContent value="products" className="space-y-6">
                {!isLoading && products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : !isLoading ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No products found
                      </h3>
                      <p className="text-muted-foreground text-center mb-4">
                        Try adjusting your filters or search terms to find what
                        you're looking for.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFilters({});
                          setSearchQuery("");
                        }}
                      >
                        Clear Filters
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <div className="h-48 bg-muted"></div>
                        <CardContent className="p-4 space-y-2">
                          <div className="h-4 bg-muted rounded"></div>
                          <div className="h-3 bg-muted rounded w-3/4"></div>
                          <div className="h-6 bg-muted rounded w-1/2"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="services" className="space-y-6">
                {!isLoading && services.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map(renderServiceCard)}
                  </div>
                ) : !isLoading ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No services found
                      </h3>
                      <p className="text-muted-foreground text-center mb-4">
                        Try adjusting your filters or search terms to find
                        available services.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFilters({});
                          setSearchQuery("");
                        }}
                      >
                        Clear Filters
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardHeader>
                          <div className="h-4 bg-muted rounded"></div>
                          <div className="h-3 bg-muted rounded w-3/4"></div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="h-6 bg-muted rounded w-1/2"></div>
                          <div className="h-3 bg-muted rounded w-2/3"></div>
                          <div className="h-10 bg-muted rounded"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
