-- Supabase Schema for SELLSPICE AI

-- Restaurants
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id),
  item_name TEXT NOT NULL,
  current_qty NUMERIC DEFAULT 0,
  required_qty NUMERIC DEFAULT 0,
  unit TEXT NOT NULL,
  status TEXT DEFAULT 'good'
);

-- Recipes (For Bill Scanning Deduction)
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id),
  dish_name TEXT NOT NULL,
  ingredients_json JSONB NOT NULL -- e.g. [{"name": "Mutton", "qty": 0.15, "unit": "kg"}]
);

-- Scanned Bills
CREATE TABLE scanned_bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id),
  image_url TEXT,
  parsed_data_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Context Memory
CREATE TABLE context_memory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id),
  context_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Demo Data
INSERT INTO restaurants (id, name, location) VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Spice Garden', 'Delhi');

INSERT INTO inventory (restaurant_id, item_name, current_qty, required_qty, unit, status) VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Chicken', 12.4, 18.0, 'kg', 'low'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Rice', 24.0, 15.0, 'kg', 'good'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Oil', 8.0, 10.0, 'L', 'low');

INSERT INTO recipes (restaurant_id, dish_name, ingredients_json) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Mutton Biryani', '[{"name": "Mutton", "qty": 0.15, "unit": "kg"}, {"name": "Basmati Rice", "qty": 0.13, "unit": "kg"}, {"name": "Spices", "qty": 0.015, "unit": "kg"}]'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Paneer Tikka', '[{"name": "Paneer", "qty": 0.12, "unit": "kg"}, {"name": "Curd", "qty": 0.05, "unit": "kg"}]');
