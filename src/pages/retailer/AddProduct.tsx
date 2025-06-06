import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Header } from "@/components/layout/Header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  X,
  Upload,
  Package,
  DollarSign,
  Truck,
  CreditCard,
  Star,
  ArrowLeft,
} from "lucide-react";
import { createProduct } from "@/lib/database";
import { hasValidSupabaseConfig } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { categories } from "@/lib/mockData";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    availability: "",
    delivery_time: "",
    colors: [] as string[],
    sizes: [] as string[],
    payment_options: [] as string[],
    images: [] as string[],
    promoted: false,
  });

  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newImage, setNewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const user = getCurrentUser();
  const { toast } = useToast();
  const hasSupabase = hasValidSupabaseConfig();

  const paymentOptions = [
    "Cash on Delivery",
    "EcoCash",
    "Bank Transfer",
    "Mobile Money",
    "Credit Card",
  ];

  const deliveryOptions = [
    "Same day delivery",
    "1-2 days",
    "2-3 days",
    "3-5 days",
    "Weekly delivery",
    "Pickup only",
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      handleInputChange("colors", [...formData.colors, newColor.trim()]);
      setNewColor("");
    }
  };

  const removeColor = (color: string) => {
    handleInputChange(
      "colors",
      formData.colors.filter((c) => c !== color),
    );
  };

  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      handleInputChange("sizes", [...formData.sizes, newSize.trim()]);
      setNewSize("");
    }
  };

  const removeSize = (size: string) => {
    handleInputChange(
      "sizes",
      formData.sizes.filter((s) => s !== size),
    );
  };

  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      handleInputChange("images", [...formData.images, newImage.trim()]);
      setNewImage("");
    }
  };

  const removeImage = (image: string) => {
    handleInputChange(
      "images",
      formData.images.filter((i) => i !== image),
    );
  };

  const togglePaymentOption = (option: string) => {
    const current = formData.payment_options;
    if (current.includes(option)) {
      handleInputChange(
        "payment_options",
        current.filter((p) => p !== option),
      );
    } else {
      handleInputChange("payment_options", [...current, option]);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Product name is required",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Product description is required",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast({
        title: "Validation Error",
        description: "Valid price is required",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.category) {
      toast({
        title: "Validation Error",
        description: "Category is required",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.availability || parseInt(formData.availability) < 0) {
      toast({
        title: "Validation Error",
        description: "Valid availability quantity is required",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.delivery_time) {
      toast({
        title: "Validation Error",
        description: "Delivery time is required",
        variant: "destructive",
      });
      return false;
    }

    if (formData.payment_options.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one payment option is required",
        variant: "destructive",
      });
      return false;
    }

    if (formData.images.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one product image is required",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!user || user.role !== "retailer") {
      toast({
        title: "Access Denied",
        description: "Only retailers can add products",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        images: formData.images,
        category: formData.category,
        colors: formData.colors,
        sizes: formData.sizes,
        availability: parseInt(formData.availability),
        seller_id: user.id,
        delivery_time: formData.delivery_time,
        payment_options: formData.payment_options,
        promoted: formData.promoted,
      };

      if (hasSupabase) {
        await createProduct(productData);
      } else {
        // Demo mode - just show success message
        console.log("Demo: Product created", productData);
      }

      toast({
        title: "Success!",
        description: "Product added successfully",
      });

      navigate("/retailer");
    } catch (error: any) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add product",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== "retailer") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                Only retailers can add products to the marketplace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="/login">Login as Retailer</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/retailer")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New Product</h1>
            <p className="text-muted-foreground">
              Create a new listing for your marketplace store
            </p>
          </div>
        </div>

        {!hasSupabase && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Product will be saved locally. Set up
              Supabase for persistent storage.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Product Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Describe your product..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleInputChange("category", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories
                            .filter((c) => c !== "All Categories")
                            .map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="availability">Availability *</Label>
                      <Input
                        id="availability"
                        type="number"
                        min="0"
                        value={formData.availability}
                        onChange={(e) =>
                          handleInputChange("availability", e.target.value)
                        }
                        placeholder="Quantity available"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="price">Price (USD) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      placeholder="0.00"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Product Variants */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Variants</CardTitle>
                  <CardDescription>
                    Add different colors and sizes for your product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Colors */}
                  <div>
                    <Label>Colors</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        placeholder="Add color"
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addColor())
                        }
                      />
                      <Button type="button" onClick={addColor} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.colors.map((color) => (
                        <Badge key={color} variant="secondary">
                          {color}
                          <button
                            type="button"
                            onClick={() => removeColor(color)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <Label>Sizes</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newSize}
                        onChange={(e) => setNewSize(e.target.value)}
                        placeholder="Add size"
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addSize())
                        }
                      />
                      <Button type="button" onClick={addSize} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.sizes.map((size) => (
                        <Badge key={size} variant="secondary">
                          {size}
                          <button
                            type="button"
                            onClick={() => removeSize(size)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Images */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Product Images *
                  </CardTitle>
                  <CardDescription>
                    Add image URLs for your product (at least one required)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="Enter image URL"
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addImage())
                      }
                    />
                    <Button type="button" onClick={addImage} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/400x300?text=Invalid+URL";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image)}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Delivery & Payment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Delivery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label>Delivery Time *</Label>
                    <Select
                      value={formData.delivery_time}
                      onValueChange={(value) =>
                        handleInputChange("delivery_time", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select delivery time" />
                      </SelectTrigger>
                      <SelectContent>
                        {deliveryOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Options *
                  </CardTitle>
                  <CardDescription>
                    Select accepted payment methods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {paymentOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={formData.payment_options.includes(option)}
                          onCheckedChange={() => togglePaymentOption(option)}
                        />
                        <Label htmlFor={option} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Promotion */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Promotion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="promoted"
                      checked={formData.promoted}
                      onCheckedChange={(checked) =>
                        handleInputChange("promoted", checked)
                      }
                    />
                    <Label htmlFor="promoted" className="cursor-pointer">
                      Feature this product (promoted listing)
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Card>
                <CardContent className="pt-6">
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Adding Product..." : "Add Product"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
