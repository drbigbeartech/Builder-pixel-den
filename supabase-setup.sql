-- Westgate Marketplace Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('customer', 'retailer', 'service-provider');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE message_type AS ENUM ('text', 'image');

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'customer',
    avatar_url TEXT,
    city VARCHAR(100) NOT NULL,
    area VARCHAR(100) NOT NULL,
    address TEXT,
    coordinates JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    images TEXT[] DEFAULT '{}',
    category VARCHAR(100) NOT NULL,
    colors TEXT[] DEFAULT '{}',
    sizes TEXT[] DEFAULT '{}',
    availability INTEGER NOT NULL DEFAULT 0 CHECK (availability >= 0),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    delivery_time VARCHAR(100) NOT NULL,
    payment_options TEXT[] DEFAULT '{}',
    promoted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    duration INTEGER NOT NULL CHECK (duration > 0), -- in minutes
    category VARCHAR(100) NOT NULL,
    provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service availability table
CREATE TABLE IF NOT EXISTS service_availability (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_slots TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(service_id, date)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT check_product_or_service CHECK (
        (product_id IS NOT NULL AND service_id IS NULL) OR 
        (product_id IS NULL AND service_id IS NOT NULL)
    )
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total DECIMAL(10,2) NOT NULL CHECK (total > 0),
    status order_status DEFAULT 'pending',
    delivery_city VARCHAR(100) NOT NULL,
    delivery_area VARCHAR(100) NOT NULL,
    delivery_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    color VARCHAR(50),
    size VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status booking_status DEFAULT 'pending',
    total DECIMAL(10,2) NOT NULL CHECK (total > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type message_type DEFAULT 'text',
    image_url TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_services_provider_id ON services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_service_id ON reviews(service_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table (allow reading all users for public profiles)
CREATE POLICY "Allow all to view user profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- RLS Policies for products table
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert products" ON products FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own products" ON products FOR UPDATE USING (auth.uid()::text = seller_id::text);
CREATE POLICY "Users can delete own products" ON products FOR DELETE USING (auth.uid()::text = seller_id::text);

-- RLS Policies for services table
CREATE POLICY "Anyone can view services" ON services FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert services" ON services FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own services" ON services FOR UPDATE USING (auth.uid()::text = provider_id::text);
CREATE POLICY "Users can delete own services" ON services FOR DELETE USING (auth.uid()::text = provider_id::text);

-- RLS Policies for service_availability table
CREATE POLICY "Anyone can view service availability" ON service_availability FOR SELECT USING (true);
CREATE POLICY "Service providers can manage own availability" ON service_availability FOR ALL USING (
    EXISTS (SELECT 1 FROM services WHERE id = service_id AND provider_id::text = auth.uid()::text)
);

-- RLS Policies for reviews table
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid()::text = user_id::text);

-- RLS Policies for orders table
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid()::text = customer_id::text);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid()::text = customer_id::text);
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE USING (auth.uid()::text = customer_id::text);

-- RLS Policies for order_items table
CREATE POLICY "Users can view order items for own orders" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND customer_id::text = auth.uid()::text)
);
CREATE POLICY "Users can insert order items for own orders" ON order_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND customer_id::text = auth.uid()::text)
);

-- RLS Policies for bookings table
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid()::text = customer_id::text);
CREATE POLICY "Service providers can view bookings for their services" ON bookings FOR SELECT USING (
    EXISTS (SELECT 1 FROM services WHERE id = service_id AND provider_id::text = auth.uid()::text)
);
CREATE POLICY "Users can insert own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid()::text = customer_id::text);
CREATE POLICY "Users can update own bookings" ON bookings FOR UPDATE USING (auth.uid()::text = customer_id::text);

-- RLS Policies for messages table
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (
    auth.uid()::text = sender_id::text OR auth.uid()::text = recipient_id::text
);
CREATE POLICY "Users can insert messages they send" ON messages FOR INSERT WITH CHECK (auth.uid()::text = sender_id::text);
CREATE POLICY "Users can update messages they received (mark as read)" ON messages FOR UPDATE USING (
    auth.uid()::text = recipient_id::text
);

-- Function to handle user creation from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, role, city, area)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer'),
        COALESCE(NEW.raw_user_meta_data->>'city', 'Harare'),
        COALESCE(NEW.raw_user_meta_data->>'area', 'City Center')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data for demonstration
INSERT INTO users (id, email, name, role, city, area, address) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'john@customer.com', 'John Doe', 'customer', 'Harare', 'Avondale', '123 Main Street'),
('550e8400-e29b-41d4-a716-446655440001', 'mary@retailer.com', 'Mary Chikara', 'retailer', 'Harare', 'Mbare', 'Mbare Musika Stall 45'),
('550e8400-e29b-41d4-a716-446655440002', 'grace@service.com', 'Grace Mutindi', 'service-provider', 'Harare', 'Eastlea', 'Beauty Salon Complex')
ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, images, category, colors, sizes, availability, seller_id, delivery_time, payment_options) VALUES
('Fresh Tomatoes', 'Farm-fresh tomatoes from Mazowe. Perfect for cooking and salads.', 3.50, 
 ARRAY['https://images.unsplash.com/photo-1546470427-e5ac5d3ff1ce?w=400'], 
 'Vegetables', ARRAY['Red', 'Green'], ARRAY['1kg', '2kg', '5kg'], 50,
 '550e8400-e29b-41d4-a716-446655440001', 'Same day delivery', ARRAY['Cash on Delivery', 'EcoCash']),
('Traditional Chitenge Fabric', 'Beautiful traditional African fabric perfect for dresses and wraps.', 15.00,
 ARRAY['https://images.unsplash.com/photo-1594736797933-d0c6ec8c75ae?w=400'],
 'Clothing & Fabric', ARRAY['Blue', 'Red', 'Green'], ARRAY['2 meters', '4 meters'], 25,
 '550e8400-e29b-41d4-a716-446655440001', '1-2 days', ARRAY['Cash on Delivery', 'EcoCash'])
ON CONFLICT DO NOTHING;

-- Insert sample services
INSERT INTO services (name, description, price, duration, category, provider_id) VALUES
('Hair Styling & Braiding', 'Professional hair styling, braiding, and treatment services.', 20.00, 120, 'Beauty & Wellness', '550e8400-e29b-41d4-a716-446655440002'),
('Mobile Phone Repair', 'Quick and reliable mobile phone repair services.', 25.00, 60, 'Technology', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT DO NOTHING;

-- Enable real-time for all tables
-- Note: Run these commands in the Supabase Dashboard under Database > Publications
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.services;
