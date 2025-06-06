# 🚀 WESTGATE MARKETPLACE - Supabase Integration Guide

## Overview

This guide will help you set up Supabase for the WESTGATE MARKETPLACE application to enable real-time database functionality, authentication, and live updates.

## 🏁 Quick Setup (5 minutes)

### 1. Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account (no credit card required)
3. Create a new project
4. Choose a region close to your users
5. Wait for the project to be provisioned (~2 minutes)

### 2. Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon/public** key
3. In your project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Edit `.env` and add your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase-setup.sql`
3. Paste it into the SQL Editor and click **Run**
4. Wait for all tables and policies to be created

### 4. Enable Real-time

1. Go to **Database** → **Replication**
2. Enable real-time for these tables:
   - `messages`
   - `orders`
   - `bookings`
   - `products`
   - `services`

### 5. Test Your Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```
2. You should see real database data instead of mock data
3. Try creating an account and see it in Supabase dashboard
4. Test real-time messaging between different browser windows

## 📊 Database Schema

The application creates the following tables:

### Core Tables

- **users** - User profiles and authentication
- **products** - Product listings from retailers
- **services** - Service offerings from providers
- **reviews** - Customer reviews and ratings

### Transaction Tables

- **orders** - Customer purchase orders
- **order_items** - Individual items in orders
- **bookings** - Service appointments
- **messages** - Real-time chat messages

### Supporting Tables

- **service_availability** - Provider calendar slots

## 🔒 Security Features

### Row Level Security (RLS)

- All tables have RLS policies enabled
- Users can only access their own data
- Customers see products/services from all sellers
- Sellers only manage their own listings

### Authentication

- Built-in Supabase Auth integration
- Role-based access control
- Secure password handling
- Session management

## 🔄 Real-time Features

### Live Updates

- **Messages**: Instant chat updates
- **Orders**: Order status changes
- **Bookings**: Appointment confirmations
- **Inventory**: Product availability updates

### Subscriptions

The app automatically subscribes to:

```javascript
// Real-time message updates
subscribeToMessages(userId, callback);

// Order status changes
subscribeToOrders(userId, userRole, callback);

// Booking updates
subscribeToBookings(userId, userRole, callback);
```

## 🛠️ API Functions

### Product Operations

```javascript
// Get all products with filters
const products = await getProducts(filters);

// Create new product
const product = await createProduct(productData);

// Update product
const updated = await updateProduct(id, updates);
```

### Service Operations

```javascript
// Get services with filters
const services = await getServices(filters);

// Create service
const service = await createService(serviceData);
```

### Messaging

```javascript
// Get conversations
const conversations = await getConversations(userId);

// Send message
const message = await sendMessage(messageData);

// Mark as read
await markMessagesAsRead(messageIds);
```

### Orders & Bookings

```javascript
// Create order
const order = await createOrder(orderData);

// Create booking
const booking = await createBooking(bookingData);

// Get user orders
const orders = await getOrdersByCustomer(customerId);
```

## 🎯 Production Deployment

### Environment Variables

For production, set these environment variables:

```env
VITE_SUPABASE_URL=your-production-url
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### Database Optimization

1. **Indexes**: Already created for common queries
2. **Functions**: Triggers for `updated_at` timestamps
3. **Policies**: Optimized RLS for performance

### Monitoring

- Use Supabase dashboard for query monitoring
- Set up database usage alerts
- Monitor real-time connection limits

## 🆓 Free Tier Limits

Supabase free tier includes:

- **Database**: 500MB storage
- **Auth**: 50,000 monthly active users
- **Real-time**: 2GB data transfer
- **API**: 500MB data transfer per month

Perfect for development and small production deployments!

## 🔧 Troubleshooting

### Common Issues

1. **"Invalid API key" error**

   - Check your `.env` file has correct credentials
   - Restart development server after changing `.env`

2. **Tables not found**

   - Run the `supabase-setup.sql` script in SQL Editor
   - Check all tables were created successfully

3. **Real-time not working**

   - Enable replication for tables in Database → Replication
   - Check browser console for connection errors

4. **Authentication issues**
   - Verify RLS policies are enabled
   - Check user exists in `users` table after signup

### Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## 🎉 Next Steps

With Supabase set up, you now have:

- ✅ Real-time database with live updates
- ✅ Secure authentication and authorization
- ✅ Scalable backend that grows with your needs
- ✅ Built-in API and real-time subscriptions
- ✅ Production-ready infrastructure

Your WESTGATE MARKETPLACE is now production-ready with enterprise-grade backend capabilities!
