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
  RefreshCw,
} from "lucide-react";
import { useRealTimeProducts } from "@/lib/realtime";
import { getServices } from "@/lib/database";
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
  const [services, setServices] = useState<any[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const user = getCurrentUser();
  const { toast } = useToast();
  const hasSupabase = hasValidSupabaseConfig();

  // Use real-time products hook
  const { products, loading: isLoadingProducts } = useRealTimeProducts({
    ...filters,
    query: searchQuery,
  });

  useEffect(() => {
    loadServices();
  }, [filters, searchQuery]);

  const loadServices = async () => {
    setIsLoadingServices(true);
    try {
      if (hasSupabase) {
        // Use real Supabase data
        const servicesData = await getServices({
          ...filters,
          query: searchQuery,
        });
        setServices(servicesData || []);
      } else {
        // Use mock data with client-side filtering
        let filteredServices = [...mockServices];

        // Apply search query
        if (searchQuery) {
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
          filteredServices = filteredServices.filter(
            (service) => service.category === filters.category,
          );
        }

        // Apply location filter
        if (filters.location && filters.location !== "All Areas") {
          filteredServices = filteredServices.filter(
            (service) => service.location?.area === filters.location,
          );
        }

        // Apply price filter
        if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
          const minPrice = filters.priceMin || 0;
          const maxPrice = filters.priceMax || Infinity;
          filteredServices = filteredServices.filter(
            (service) => service.price >= minPrice && service.price <= maxPrice,
          );
        }

        // Apply rating filter
        if (filters.rating) {
          filteredServices = filteredServices.filter(
            (service) => service.rating >= filters.rating!,
          );
        }

        // Apply new arrivals filter
        if (filters.newArrivals) {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          filteredServices = filteredServices.filter(
            (service) => service.createdAt > oneWeekAgo,
          );
        }

        // Apply sorting
        const sortFn = getSortFunction(filters.sortBy);
        if (sortFn) {
          filteredServices.sort(sortFn as any);
        }

        setServices(filteredServices);
      }
    } catch (error: any) {
      console.error("Error loading services:", error);
      toast({
        title: "Error",
        description: "Failed to load services. Using demo data.",
        variant: "destructive",
      });

      // Fallback to mock data
      setServices(mockServices);
    } finally {
      setIsLoadingServices(false);
    }
  };

  const getSortFunction = (sortBy?: string) => {
    switch (sortBy) {
      case "price-asc":
        return (a: any, b: any) => a.price - b.price;
      case "price-desc":
        return (a: any, b: any) => b.price - a.price;
      case "rating":
        return (a: any, b: any) => b.rating - a.rating;
      case "newest":
        return (a: any, b: any) =>
          new Date(b.createdAt || b.created_at).getTime() -
          new Date(a.createdAt || a.created_at).getTime();
      case "popularity":
        return (a: any, b: any) =>
          (b.reviews?.length || 0) - (a.reviews?.length || 0);
      default:
        return null;
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    setLastRefresh(new Date());
    loadServices();
    toast({
      title: "Refreshed",
      description: "Marketplace data has been updated",
    });
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

          <Button
            className="w-full"
            onClick={() => {
              toast({
                title: "Booking Feature",
                description: "Service booking will be available soon!",
              });
            }}
          >
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

  const displayProducts = hasSupabase
    ? products
    : searchQuery || Object.keys(filters).length > 0
      ? mockProducts.filter((product) => {
          const matchesSearch =
            !searchQuery ||
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase());

          const matchesCategory =
            !filters.category ||
            filters.category === "All Categories" ||
            product.category === filters.category;

          const matchesLocation =
            !filters.location ||
            filters.location === "All Areas" ||
            product.location?.area === filters.location;

          return matchesSearch && matchesCategory && matchesLocation;
        })
      : mockProducts;

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user.name}!
              </h1>
              <p className="text-muted-foreground">
                Discover amazing products and services in {user.area},{" "}
                {user.city}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          {!hasSupabase && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Demo Mode:</strong> Using mock data. Set up Supabase
                credentials in .env file for real-time functionality.
                {hasSupabase && " ✅ Real-time updates enabled!"}
              </p>
            </div>
          )}

          {hasSupabase && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Real-time Mode:</strong> Live updates enabled! Last
                refresh: {lastRefresh.toLocaleTimeString()}
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
                    Products ({displayProducts.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="services"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Services ({services.length})
                  </TabsTrigger>
                </TabsList>

                {(isLoadingProducts || isLoadingServices) && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {hasSupabase ? "Syncing..." : "Loading..."}
                  </div>
                )}
              </div>

              <TabsContent value="products" className="space-y-6">
                {displayProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {displayProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : !isLoadingProducts ? (
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
                {services.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map(renderServiceCard)}
                  </div>
                ) : !isLoadingServices ? (
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
