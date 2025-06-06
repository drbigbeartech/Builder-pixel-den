import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/Header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  MapPin,
  Truck,
  Shield,
  MessageCircle,
  ChevronLeft,
  Plus,
  Minus,
  CreditCard,
} from "lucide-react";
import { getProductById } from "@/lib/database";
import { hasValidSupabaseConfig } from "@/lib/supabase";
import { mockProducts } from "@/lib/mockData";
import { getCurrentUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const user = getCurrentUser();
  const { toast } = useToast();
  const hasSupabase = hasValidSupabaseConfig();

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      if (hasSupabase) {
        const data = await getProductById(productId);
        setProduct(data);
      } else {
        // Use mock data
        const mockProduct = mockProducts.find((p) => p.id === productId);
        setProduct(mockProduct);
      }

      if (product) {
        setSelectedColor(product.colors?.[0] || "");
        setSelectedSize(product.sizes?.[0] || "");
      }
    } catch (error) {
      console.error("Error loading product:", error);
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAverageRating = () => {
    if (!product?.reviews || product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce(
      (acc: number, review: any) => acc + review.rating,
      0,
    );
    return (sum / product.reviews.length).toFixed(1);
  };

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would add to cart in database
    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name} added to your cart`,
    });
  };

  const handleBuyNow = () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to make a purchase",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would redirect to checkout
    toast({
      title: "Redirecting to checkout",
      description: "Taking you to secure checkout...",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-96 bg-muted rounded"></div>
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 w-20 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-6 bg-muted rounded w-1/4"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-lg font-semibold mb-2">Product not found</h3>
              <p className="text-muted-foreground mb-4">
                The product you're looking for doesn't exist or has been
                removed.
              </p>
              <Button asChild>
                <Link to="/customer">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const averageRating = calculateAverageRating();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <Link to="/customer" className="hover:text-foreground">
            <ChevronLeft className="h-4 w-4 inline mr-1" />
            Back to marketplace
          </Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.images?.[selectedImage] || product.images?.[0]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-16 bg-white/80 hover:bg-white"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Image thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                {product.promoted && (
                  <Badge className="bg-orange-500">Promoted</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                {renderStars(parseFloat(averageRating))}
                <span className="text-sm text-muted-foreground">
                  {averageRating} ({product.reviews?.length || 0} reviews)
                </span>
              </div>
              <div className="text-3xl font-bold text-primary mb-4">
                ${product.price.toFixed(2)}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Color</h3>
                <RadioGroup
                  value={selectedColor}
                  onValueChange={setSelectedColor}
                >
                  <div className="flex gap-2">
                    {product.colors.map((color: string) => (
                      <div key={color} className="flex items-center space-x-2">
                        <RadioGroupItem value={color} id={color} />
                        <Label htmlFor={color} className="cursor-pointer">
                          {color}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Size</h3>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size: string) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-2">Quantity</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setQuantity(Math.min(product.availability, quantity + 1))
                  }
                  disabled={quantity >= product.availability}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground ml-2">
                  {product.availability} available
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button className="w-full" size="lg" onClick={handleBuyNow}>
                <CreditCard className="h-5 w-5 mr-2" />
                Buy Now
              </Button>
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={handleAddToCart}
                disabled={product.availability === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </div>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seller Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={product.seller?.avatar}
                      alt={product.seller?.name}
                    />
                    <AvatarFallback>
                      {product.seller?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{product.seller?.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {product.seller?.area || product.location?.area},{" "}
                        {product.seller?.city || product.location?.city}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/messages">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Seller
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Delivery & Payment Info */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Delivery</div>
                  <div className="text-sm text-muted-foreground">
                    {product.delivery_time}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Payment Options</div>
                  <div className="text-sm text-muted-foreground">
                    {product.payment_options?.join(", ")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <div className="space-y-4">
              {product.reviews.slice(0, 5).map((review: any) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage
                          src={review.user?.avatar}
                          alt={review.user?.name}
                        />
                        <AvatarFallback>
                          {review.user?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">
                            {review.user?.name}
                          </span>
                          {renderStars(review.rating)}
                          <span className="text-sm text-muted-foreground">
                            {new Date(
                              review.created_at || review.createdAt,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-muted-foreground">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
