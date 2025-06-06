import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/types/marketplace";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = ({ product, className }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3 w-3",
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300",
            )}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">
          ({product.reviews.length})
        </span>
      </div>
    );
  };

  return (
    <Card
      className={cn(
        "group overflow-hidden hover:shadow-lg transition-all duration-200",
        className,
      )}
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {product.promoted && (
            <Badge className="absolute top-2 left-2 bg-orange-500">
              Promoted
            </Badge>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
          {product.availability < 10 && (
            <Badge variant="destructive" className="absolute bottom-2 left-2">
              Only {product.availability} left
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            <Badge variant="secondary">{product.category}</Badge>
          </div>

          {renderStars(product.rating)}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Avatar className="h-5 w-5">
              <AvatarImage src={product.seller.avatar} />
              <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{product.seller.name}</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>
              {product.location.area}, {product.location.city}
            </span>
          </div>

          <div className="text-sm text-muted-foreground">
            <strong>Delivery:</strong> {product.deliveryTime}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="w-full space-y-2">
          <div className="flex gap-2">
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-muted-foreground">
                +{product.colors.length - 4} more
              </span>
            )}
          </div>

          <Button className="w-full" size="sm">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
