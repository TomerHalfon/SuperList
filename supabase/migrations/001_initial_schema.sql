-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create items table
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    emoji TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create shopping_lists table
CREATE TABLE shopping_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create shopping_list_items junction table
CREATE TABLE shopping_list_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    list_id UUID NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    collected BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE(list_id, item_id)
);

-- Create indexes for better performance
CREATE INDEX idx_items_name ON items(name);
CREATE INDEX idx_items_tags ON items USING GIN(tags);
CREATE INDEX idx_shopping_lists_name ON shopping_lists(name);
CREATE INDEX idx_shopping_lists_updated_at ON shopping_lists(updated_at DESC);
CREATE INDEX idx_shopping_list_items_list_id ON shopping_list_items(list_id);
CREATE INDEX idx_shopping_list_items_item_id ON shopping_list_items(item_id);
CREATE INDEX idx_shopping_list_items_collected ON shopping_list_items(collected);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_items_updated_at 
    BEFORE UPDATE ON items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopping_lists_updated_at 
    BEFORE UPDATE ON shopping_lists 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update shopping_lists.updated_at when items are modified
CREATE OR REPLACE FUNCTION update_list_updated_at_on_item_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the parent list's updated_at timestamp
    UPDATE shopping_lists 
    SET updated_at = NOW() 
    WHERE id = COALESCE(NEW.list_id, OLD.list_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER update_list_on_item_insert
    AFTER INSERT ON shopping_list_items
    FOR EACH ROW
    EXECUTE FUNCTION update_list_updated_at_on_item_change();

CREATE TRIGGER update_list_on_item_update
    AFTER UPDATE ON shopping_list_items
    FOR EACH ROW
    EXECUTE FUNCTION update_list_updated_at_on_item_change();

CREATE TRIGGER update_list_on_item_delete
    AFTER DELETE ON shopping_list_items
    FOR EACH ROW
    EXECUTE FUNCTION update_list_updated_at_on_item_change();

-- Enable Row Level Security (RLS) for future multi-user support
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (single-user mode)
-- These can be updated later for multi-user support
CREATE POLICY "Allow all operations on items" ON items
    FOR ALL USING (true);

CREATE POLICY "Allow all operations on shopping_lists" ON shopping_lists
    FOR ALL USING (true);

CREATE POLICY "Allow all operations on shopping_list_items" ON shopping_list_items
    FOR ALL USING (true);
