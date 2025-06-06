import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/Header";
import { ProductCard } from "@/components/marketplace/ProductCard";
import {
  Search,
  Store,
  Users,
  Calendar,
  TrendingUp,
  MapPin,
  Star,
  ShoppingCart,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { mockProducts, mockServices } from "@/lib/mockData";
import { getCurrentUser } from "@/lib/auth";
import { SearchFilters } from "@/types/marketplace";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState(
    mockProducts.slice(0, 6),
  );
  const user = getCurrentUser();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app, this would trigger a search API call
    if (query) {
      const filtered = mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()),
      );
      setFeaturedProducts(filtered.slice(0, 6));
    } else {
      setFeaturedProducts(mockProducts.slice(0, 6));
    }
  };

  const stats = [
    { label: "Active Retailers", value: "1,200+", icon: Store },
    { label: "Happy Customers", value: "15,000+", icon: Users },
    { label: "Service Providers", value: "800+", icon: Calendar },
    { label: "Monthly Orders", value: "25,000+", icon: TrendingUp },
  ];

  const features = [
    {
      title: "Local Marketplace",
      description: "Connect with retailers and service providers in your area",
      icon: MapPin,
    },
    {
      title: "Trusted Reviews",
      description:
        "Read reviews from verified customers to make informed decisions",
      icon: Star,
    },
    {
      title: "Easy Shopping",
      description: "Browse, compare, and buy products with just a few clicks",
      icon: ShoppingCart,
    },
    {
      title: "Direct Communication",
      description: "Chat directly with sellers and service providers",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Welcome to <span className="text-primary">WESTGATE</span>
              <br />
              Marketplace
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Africa's digital marketplace connecting communities. Buy products,
              book services, and support local businesses all in one place.
            </p>

            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/signup">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            ) : (
              <Button size="lg" asChild>
                <Link to={`/${user.role}`}>
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}

            {/* Search Bar */}
            <div className="mt-12 max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products and services..."
                  className="pl-12 h-12 text-lg"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover top-quality products from local retailers in your area
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link to="/customer">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Westgate?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're transforming how Africa shops and does business online
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <Icon className="h-10 w-10 text-primary mx-auto mb-2" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Book appointments with trusted service providers in your community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {mockServices.slice(0, 2).map((service) => (
              <Card
                key={service.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {service.description}
                      </CardDescription>
                    </div>
                    <Badge className="ml-2">{service.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        ${service.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {service.duration} minutes
                      </span>
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
                        {service.rating} ({service.reviews.length} reviews)
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {service.location.area}, {service.location.city}
                      </span>
                    </div>

                    <Button className="w-full mt-4">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button size="lg" variant="outline" asChild>
              <Link to="/customer">
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses and customers who trust Westgate for
            their marketplace needs
          </p>

          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup">Join as Seller</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link to="/signup">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <Button size="lg" variant="secondary" asChild>
              <Link to={`/${user.role}`}>Go to Your Dashboard</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Store className="h-5 w-5" />
                </div>
                <span className="font-bold text-xl">WESTGATE</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting communities through digital commerce across Africa.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Customers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/customer" className="hover:text-foreground">
                    Browse Products
                  </Link>
                </li>
                <li>
                  <Link to="/customer" className="hover:text-foreground">
                    Book Services
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-foreground">
                    Track Orders
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-foreground">
                    Join Now
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Sellers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/signup" className="hover:text-foreground">
                    Become a Retailer
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-foreground">
                    Offer Services
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-foreground">
                    Seller Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-foreground">
                    Success Stories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="#" className="hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>
              &copy; 2024 Westgate Marketplace by Trycene & Brandon. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
