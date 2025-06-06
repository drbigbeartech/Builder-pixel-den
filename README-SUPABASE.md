# 🚀 WESTGATE MARKETPLACE - Complete Production Setup Guide

## Overview

This guide will help you set up the complete WESTGATE MARKETPLACE with real-time database, OAuth authentication (Google/GitHub), and all production features.

## 🏁 Quick Setup (10 minutes)

### 1. Create Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account (no credit card required)
3. Create a new project
4. Choose a region close to your users
5. Wait for the project to be provisioned (~2 minutes)

### 2. Configure OAuth Providers

#### Google OAuth Setup:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set authorized redirect URIs:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
6. Copy your **Client ID** and **Client Secret**

#### GitHub OAuth Setup:

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Set Authorization callback URL:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
4. Copy your **Client ID** and **Client Secret**

#### Configure in Supabase:

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable **Google** and **GitHub**
3. Add your Client ID and Client Secret for each provider
4. Set redirect URLs to: `http://localhost:5173/auth/callback` (development)

### 3. Get Your Credentials

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

### 4. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase-setup.sql`
3. Paste it into the SQL Editor and click **Run**
4. Wait for all tables and policies to be created

### 5. Enable Real-time (New Method)

The app uses **postgres_changes** which works without replication setup:

1. Go to **Database** → **API Docs**
2. Verify these tables exist:
   - `messages` ✅
   - `orders` ✅
   - `bookings` ✅
   - `products` ✅
   - `services` ✅

**No additional setup needed!** Real-time works automatically with our implementation.

### 6. Test Your Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```
2. You should see "Real-time Mode" message in customer dashboard
3. Try Google/GitHub login
4. Test real-time messaging between different browser windows
5. Add products as retailer and see them appear instantly

## 🔐 Authentication Features

### OAuth Providers

- ✅ **Google OAuth** - Sign in with Google account
- ✅ **GitHub OAuth** - Sign in with GitHub account
- ✅ **Email/Password** - Traditional signup/login
- ✅ **Role Selection** - Choose customer/retailer/service-provider
- ✅ **Profile Completion** - Location and details setup

### Security

- ✅ **Row Level Security** on all tables
- ✅ **JWT Authentication** with secure sessions
- ✅ **Role-based access** control
- ✅ **OAuth state validation**

## 📊 Real-time Features (Working!)

### What's Real-time:

- ✅ **Live Messaging** - Chat updates instantly
- ✅ **Product Updates** - New products appear immediately
- ✅ **Order Status** - Status changes in real-time
- ✅ **Inventory Changes** - Stock updates across all users
- ✅ **New User Signups** - User activity updates

### How It Works:

```javascript
// Uses postgres_changes (no replication needed)
const { products, loading } = useRealTimeProducts(filters);
const { messages } = useRealTimeMessages(userId);
const { orders } = useRealTimeOrders(userId, userRole);
```

## 🎯 Working Features

### ✅ Authentication

- Google OAuth login (**working**)
- GitHub OAuth login (**working**)
- Email/password signup (**working**)
- Role selection (**working**)
- Auto user profile creation (**working**)

### ✅ Customer Features

- Product browsing with real-time updates (**working**)
- Advanced search and filters (**working**)
- Product detail pages (**working**)
- Service discovery (**working**)
- Real-time messaging (**working**)

### ✅ Retailer Features

- Product management (**working**)
- Add/edit products (**working**)
- Order tracking (**working**)
- Real-time inventory updates (**working**)

### ✅ Service Provider Features

- Service management (**working**)
- Booking tracking (**working**)
- Calendar view (**working**)

### ✅ Real-time Features

- Live chat messaging (**working**)
- Product updates (**working**)
- Order notifications (**working**)
- User activity (**working**)

## 🚀 Production Deployment

### Environment Variables for Production:

```env
VITE_SUPABASE_URL=your-production-url
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### OAuth Redirect URLs for Production:

Add these to your OAuth providers:

```
https://your-domain.com/auth/callback
```

### Vercel Deployment:

1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

## 📱 Database Schema

### Core Tables (All Working):

- **users** - OAuth & email auth, roles, profiles
- **products** - Real-time product listings
- **services** - Service provider offerings
- **orders** - Customer purchases with real-time status
- **bookings** - Service appointments
- **messages** - Real-time chat system
- **reviews** - Rating and feedback system

### Real-time Subscriptions:

```sql
-- Automatic triggers for real-time updates
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 🆓 Free Tier Limits

Supabase free tier includes:

- **Database**: 500MB storage
- **Auth**: 50,000 monthly active users
- **Real-time**: 2GB data transfer
- **API**: 500MB data transfer per month
- **OAuth**: Unlimited providers

Perfect for production use!

## 🔧 Troubleshooting

### OAuth Issues:

1. **Google login not working**

   - Check redirect URI in Google Console
   - Verify client ID/secret in Supabase
   - Ensure URLs match exactly

2. **GitHub login not working**
   - Check callback URL in GitHub app settings
   - Verify client credentials

### Real-time Issues:

1. **Messages not updating**

   - Check browser console for errors
   - Verify user is authenticated
   - Check Supabase logs

2. **Products not syncing**
   - Verify database connection
   - Check RLS policies
   - Restart development server

### Database Issues:

1. **Tables not found**

   - Re-run `supabase-setup.sql`
   - Check for SQL errors in Supabase dashboard

2. **Permission denied**
   - Verify RLS policies are correct
   - Check user authentication status

## 🎉 What You Get

Your WESTGATE MARKETPLACE now has:

- ✅ **Real OAuth authentication** like Instagram/Vercel
- ✅ **Real-time database** with instant updates
- ✅ **Production-grade security** with RLS
- ✅ **Working buttons and functions**
- ✅ **Scalable architecture** that grows with you
- ✅ **Free hosting** on Supabase
- ✅ **Professional UI/UX** with modern design

**This is a complete, production-ready application** that can handle thousands of users with real-time functionality! 🚀

## 📞 Support

Need help?

- Check Supabase docs: [https://supabase.com/docs](https://supabase.com/docs)
- Join Supabase Discord: [https://discord.supabase.com](https://discord.supabase.com)
- OAuth troubleshooting: [https://supabase.com/docs/guides/auth](https://supabase.com/docs/guides/auth)
