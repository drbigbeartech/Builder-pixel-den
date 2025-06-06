import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Header } from "@/components/layout/Header";
import { ProductCard } from "@/components/marketplace/ProductCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Package,
  TrendingUp,
  Users,
  Star,
  Eye,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { mockProducts } from "@/lib/mockData";
import { getCurrentUser } from "@/lib/auth";

const RetailerDashboard = () => {
  const user = getCurrentUser();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for retailer
  const myProducts = mockProducts.filter(
    (product) => product.sellerId === user?.id,
  );
  const stats = [
    {
      label: "Total Products",
      value: myProducts.length,
      icon: Package,
      change: "+2 this week",
    },
    {
      label: "Total Views",
      value: "1,234",
      icon: Eye,
      change: "+15% this month",
    },
    {
      label: "Total Sales",
      value: "$2,450",
      icon: DollarSign,
      change: "+8% this month",
    },
    {
      label: "Customer Rating",
      value: "4.8",
      icon: Star,
      change: "98% positive",
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      product: "Fresh Tomatoes",
      quantity: 2,
      total: 7.0,
      status: "pending",
      date: "2024-01-25",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      product: "Traditional Chitenge Fabric",
      quantity: 1,
      total: 15.0,
      status: "confirmed",
      date: "2024-01-24",
    },
    {
      id: "ORD-003",
      customer: "Mike Johnson",
      product: "Handmade Pottery Set",
      quantity: 1,
      total: 45.0,
      status: "shipped",
      date: "2024-01-23",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "confirmed":
        return "bg-blue-500";
      case "shipped":
        return "bg-green-500";
      case "delivered":
        return "bg-emerald-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!user || user.role !== "retailer") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need to be logged in as a retailer to access this page.
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
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Retailer Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.name}! Manage your store and track your sales.
            </p>
          </div>
          <Button asChild>
            <Link to="/retailer/add-product">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.label}
                      </CardTitle>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {stat.change}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks to manage your store
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-20 flex-col space-y-2" asChild>
                    <Link to="/retailer/add-product">
                      <Plus className="h-6 w-6" />
                      <span>Add New Product</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    asChild
                  >
                    <Link to="/retailer/products">
                      <Package className="h-6 w-6" />
                      <span>Manage Inventory</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    asChild
                  >
                    <Link to="/messages">
                      <MessageSquare className="h-6 w-6" />
                      <span>Customer Messages</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Latest orders from your customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.product}</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(order.status)}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">My Products</h2>
                <p className="text-muted-foreground">
                  Manage your product catalog and inventory
                </p>
              </div>
              <Button asChild>
                <Link to="/retailer/add-product">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Link>
              </Button>
            </div>

            {myProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProducts.map((product) => (
                  <div key={product.id} className="relative">
                    <ProductCard product={product} />
                    <div className="absolute top-2 right-2 space-x-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No products yet
                  </h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Start selling by adding your first product to the
                    marketplace.
                  </p>
                  <Button asChild>
                    <Link to="/retailer/add-product">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Product
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>
                  Track and manage all your customer orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.product}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(order.status)}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Update Status
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                  <CardDescription>Your sales trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">This Month</span>
                      <span className="text-sm font-medium">$2,450</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Month</span>
                      <span className="text-sm font-medium">$2,100</span>
                    </div>
                    <Progress value={65} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Growth</span>
                      <span className="text-sm font-medium text-green-600">
                        +16.7%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Engagement</CardTitle>
                  <CardDescription>
                    How customers interact with your products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Product Views</span>
                      <span className="text-sm font-medium">1,234</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Add to Cart</span>
                      <span className="text-sm font-medium">245</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Conversion Rate</span>
                      <span className="text-sm font-medium text-green-600">
                        19.8%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>
                  Your best-selling products this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myProducts.slice(0, 3).map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>42 units</TableCell>
                        <TableCell>
                          ${(product.price * 42).toFixed(2)}
                        </TableCell>
                        <TableCell>1,234</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{product.rating}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RetailerDashboard;
