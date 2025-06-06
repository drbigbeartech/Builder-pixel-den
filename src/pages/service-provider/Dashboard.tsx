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
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { Header } from "@/components/layout/Header";
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
  Calendar as CalendarIcon,
  TrendingUp,
  Users,
  Star,
  Clock,
  DollarSign,
  Eye,
  CheckCircle,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { mockServices } from "@/lib/mockData";
import { getCurrentUser } from "@/lib/auth";

const ServiceProviderDashboard = () => {
  const user = getCurrentUser();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  // Mock data for service provider
  const myServices = mockServices.filter(
    (service) => service.providerId === user?.id,
  );
  const stats = [
    {
      label: "Total Services",
      value: myServices.length,
      icon: CalendarIcon,
      change: "+1 this week",
    },
    {
      label: "This Month Bookings",
      value: "23",
      icon: Users,
      change: "+12% this month",
    },
    {
      label: "Revenue",
      value: "$1,840",
      icon: DollarSign,
      change: "+8% this month",
    },
    {
      label: "Customer Rating",
      value: "4.9",
      icon: Star,
      change: "99% positive",
    },
  ];

  const recentBookings = [
    {
      id: "BOOK-001",
      customer: "Sarah Johnson",
      service: "Hair Styling & Braiding",
      date: "2024-01-26",
      time: "10:00",
      duration: 120,
      status: "confirmed",
      total: 20.0,
    },
    {
      id: "BOOK-002",
      customer: "Emma Wilson",
      service: "Hair Styling & Braiding",
      date: "2024-01-26",
      time: "14:00",
      duration: 120,
      status: "pending",
      total: 20.0,
    },
    {
      id: "BOOK-003",
      customer: "Michael Brown",
      service: "Mobile Phone Repair",
      date: "2024-01-25",
      time: "09:00",
      duration: 60,
      status: "completed",
      total: 25.0,
    },
  ];

  const todayBookings = recentBookings.filter(
    (booking) => booking.date === "2024-01-26",
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "confirmed":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (!user || user.role !== "service-provider") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need to be logged in as a service provider to access this
              page.
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
            <h1 className="text-3xl font-bold mb-2">
              Service Provider Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user.name}! Manage your services and bookings.
            </p>
          </div>
          <Button asChild>
            <Link to="/service-provider/add-service">
              <Plus className="h-4 w-4 mr-2" />
              Add Service
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
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="services">My Services</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
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

            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>
                  Your appointments for today, January 26th
                </CardDescription>
              </CardHeader>
              <CardContent>
                {todayBookings.length > 0 ? (
                  <div className="space-y-4">
                    {todayBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <CalendarIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{booking.service}</h4>
                            <p className="text-sm text-muted-foreground">
                              {booking.customer} • {booking.time} •{" "}
                              {booking.duration} min
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="secondary"
                            className={getStatusColor(booking.status)}
                          >
                            {getStatusIcon(booking.status)}
                            <span className="ml-1">{booking.status}</span>
                          </Badge>
                          <span className="font-medium">
                            ${booking.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No appointments today
                    </h3>
                    <p className="text-muted-foreground">
                      You have a free day! Time to relax or promote your
                      services.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks to manage your services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-20 flex-col space-y-2" asChild>
                    <Link to="/service-provider/add-service">
                      <Plus className="h-6 w-6" />
                      <span>Add New Service</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    asChild
                  >
                    <Link to="/service-provider/calendar">
                      <CalendarIcon className="h-6 w-6" />
                      <span>Manage Schedule</span>
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
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Availability Calendar</CardTitle>
                  <CardDescription>
                    Manage your availability and view upcoming bookings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Bookings</CardTitle>
                  <CardDescription>Next 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {booking.date}
                          </span>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(booking.status)}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <h4 className="font-medium">{booking.service}</h4>
                        <p className="text-sm text-muted-foreground">
                          {booking.customer} • {booking.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">My Services</h2>
                <p className="text-muted-foreground">
                  Manage your service offerings and pricing
                </p>
              </div>
              <Button asChild>
                <Link to="/service-provider/add-service">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Link>
              </Button>
            </div>

            {myServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myServices.map((service) => (
                  <Card key={service.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {service.name}
                          </CardTitle>
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
                            {service.rating} ({service.reviews.length} reviews)
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            View Bookings
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No services yet
                  </h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Start offering services by adding your first service to the
                    marketplace.
                  </p>
                  <Button asChild>
                    <Link to="/service-provider/add-service">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Service
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>
                  Track and manage all your customer bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          {booking.id}
                        </TableCell>
                        <TableCell>{booking.customer}</TableCell>
                        <TableCell>{booking.service}</TableCell>
                        <TableCell>
                          {booking.date} at {booking.time}
                        </TableCell>
                        <TableCell>{booking.duration} min</TableCell>
                        <TableCell>${booking.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(booking.status)}
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
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
                  <CardTitle>Revenue Performance</CardTitle>
                  <CardDescription>Your earnings over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">This Month</span>
                      <span className="text-sm font-medium">$1,840</span>
                    </div>
                    <Progress value={80} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Month</span>
                      <span className="text-sm font-medium">$1,650</span>
                    </div>
                    <Progress value={70} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Growth</span>
                      <span className="text-sm font-medium text-green-600">
                        +11.5%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Trends</CardTitle>
                  <CardDescription>
                    How customers book your services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Bookings</span>
                      <span className="text-sm font-medium">23</span>
                    </div>
                    <Progress value={90} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Completed</span>
                      <span className="text-sm font-medium">18</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Completion Rate</span>
                      <span className="text-sm font-medium text-green-600">
                        78%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Services</CardTitle>
                <CardDescription>
                  Your most popular services this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Bookings</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Avg Duration</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">
                          {service.name}
                        </TableCell>
                        <TableCell>12 bookings</TableCell>
                        <TableCell>
                          ${(service.price * 12).toFixed(2)}
                        </TableCell>
                        <TableCell>{service.duration} min</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{service.rating}</span>
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

export default ServiceProviderDashboard;
