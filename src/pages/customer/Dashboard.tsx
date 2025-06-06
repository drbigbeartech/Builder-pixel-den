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
} from "lucide-react";
import {
  mockProducts,
  mockServices,
  categories,
  locations,
} from "@/lib/mockData";
import {
  SearchFilters as Filters,
  Product,
  Service,
} from "@/types/marketplace";
import { getCurrentUser } from "@/lib/auth";

const CustomerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [filteredServices, setFilteredServices] = useState(mockServices);
  const [activeTab, setActiveTab] = useState("products");
  const user = getCurrentUser();

  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery]);

  const applyFilters = () => {
    let products = [...mockProducts];
    let services = [...mockServices];

    // Apply search query
    if (searchQuery) {
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      services = services.filter(
        (service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          service.category.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply category filter
    if (filters.category && filters.category !== "All Categories") {
      products = products.filter(
        (product) => product.category === filters.category,
      );
      services = services.filter(
        (service) => service.category === filters.category,
      );
    }

    // Apply location filter
    if (filters.location && filters.location !== "All Areas") {
      products = products.filter(
        (product) => product.location.area === filters.location,
      );
      services = services.filter(
        (service) => service.location.area === filters.location,
      );
    }

    // Apply price filter
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      const minPrice = filters.priceMin || 0;
      const maxPrice = filters.priceMax || Infinity;
      products = products.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice,
      );
      services = services.filter(
        (service) => service.price >= minPrice && service.price <= maxPrice,
      );
    }

    // Apply rating filter
    if (filters.rating) {
      products = products.filter(
        (product) => product.rating >= filters.rating!,
      );
      services = services.filter(
        (service) => service.rating >= filters.rating!,
      );
    }

    // Apply availability filter
    if (filters.availability) {
      products = products.filter((product) => product.availability > 0);
    }

    // Apply new arrivals filter
    if (filters.newArrivals) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      products = products.filter((product) => product.createdAt > oneWeekAgo);
      services = services.filter((service) => service.createdAt > oneWeekAgo);
    }

    // Apply sorting
    const sortFn = getSortFunction(filters.sortBy);
    if (sortFn) {
      products.sort(sortFn);
      services.sort(sortFn as any);
    }

    setFilteredProducts(products);
    setFilteredServices(services);
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
          b.createdAt.getTime() - a.createdAt.getTime();
      case "popularity":
        return (a: Product, b: Product) => b.reviews.length - a.reviews.length;
      default:
        return null;
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const renderServiceCard = (service: Service) => (
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
                  i < Math.floor(service.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">
              {service.rating} ({service.reviews.length})
            </span>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>
              {service.location.area}, {service.location.city}
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
            Discover amazing products and services in {user.location.area},{" "}
            {user.location.city}
          </p>
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
                    Products ({filteredProducts.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="services"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Services ({filteredServices.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="products" className="space-y-6">
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
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
                )}
              </TabsContent>

              <TabsContent value="services" className="space-y-6">
                {filteredServices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredServices.map(renderServiceCard)}
                  </div>
                ) : (
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
