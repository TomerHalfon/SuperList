-- Seed data for SuperList application
-- This script populates the database with mock data for development and testing

-- Clear existing data (in case of re-seeding)
DELETE FROM shopping_list_items;
DELETE FROM shopping_lists;
DELETE FROM items;

-- Insert items (using UUID generation)
INSERT INTO items (name, emoji, tags) VALUES
('Milk', '🥛', ARRAY['dairy', 'beverages', 'breakfast']),
('Bread', '🍞', ARRAY['bakery', 'grains', 'breakfast']),
('Eggs', '🥚', ARRAY['dairy', 'protein', 'breakfast']),
('Chicken Breast', '🍗', ARRAY['meat', 'protein']),
('Rice', '🍚', ARRAY['grains', 'pantry']),
('Tomatoes', '🍅', ARRAY['vegetables', 'fresh']),
('Onions', '🧅', ARRAY['vegetables', 'fresh']),
('Cheese', '🧀', ARRAY['dairy', 'protein', 'breakfast']),
('Apples', '🍎', ARRAY['fruits', 'fresh']),
('Bananas', '🍌', ARRAY['fruits', 'fresh']),
('Potatoes', '🥔', ARRAY['vegetables', 'fresh']),
('Pasta', '🍝', ARRAY['grains', 'pantry']),
('Olive Oil', '🫒', ARRAY['pantry', 'cooking']),
('Salt', '🧂', ARRAY['pantry', 'seasoning']),
('Pepper', '🫚', ARRAY['pantry', 'seasoning']),
('Yogurt', '🥛', ARRAY['dairy', 'snacks']),
('Orange Juice', '🍊', ARRAY['beverages', 'fruits']),
('Ground Beef', '🥩', ARRAY['meat', 'protein']),
('Lettuce', '🥬', ARRAY['vegetables', 'fresh']),
('Carrots', '🥕', ARRAY['vegetables', 'fresh']),
('Cereal', '🥣', ARRAY['grains', 'breakfast']),
('Coffee', '☕', ARRAY['beverages', 'pantry']),
('Butter', '🧈', ARRAY['dairy', 'cooking']),
('Sugar', '🍯', ARRAY['pantry', 'baking']),
('Flour', '🌾', ARRAY['pantry', 'baking']);

-- Insert shopping lists (using UUID generation)
INSERT INTO shopping_lists (name, updated_at) VALUES
('Weekly Groceries', '2025-01-20T10:30:00Z'),
('Dinner Party Prep', '2025-01-19T15:45:00Z'),
('Healthy Breakfast', '2025-01-18T08:20:00Z'),
('Pantry Essentials', '2025-01-17T14:10:00Z'),
('Fresh Vegetables', '2025-01-16T11:30:00Z'),
('BBQ Weekend', '2025-01-15T16:45:00Z'),
('Baking Project', '2025-01-14T09:15:00Z'),
('Quick Snacks', '2025-01-13T13:20:00Z');

-- Insert shopping list items using dynamic references
-- Weekly Groceries
INSERT INTO shopping_list_items (list_id, item_id, quantity, collected)
SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Weekly Groceries' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Milk' LIMIT 1),
    2, true
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Weekly Groceries' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Bread' LIMIT 1),
    1, true
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Weekly Groceries' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Eggs' LIMIT 1),
    1, false
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Weekly Groceries' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Tomatoes' LIMIT 1),
    3, true
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Weekly Groceries' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Onions' LIMIT 1),
    2, false;

-- Dinner Party Prep
INSERT INTO shopping_list_items (list_id, item_id, quantity, collected)
SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Dinner Party Prep' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Chicken Breast' LIMIT 1),
    2, true
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Dinner Party Prep' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Rice' LIMIT 1),
    1, true
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Dinner Party Prep' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Cheese' LIMIT 1),
    1, true
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Dinner Party Prep' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Olive Oil' LIMIT 1),
    1, true
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Dinner Party Prep' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Salt' LIMIT 1),
    1, true
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Dinner Party Prep' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Pepper' LIMIT 1),
    1, true;

-- Healthy Breakfast
INSERT INTO shopping_list_items (list_id, item_id, quantity, collected)
SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Healthy Breakfast' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Apples' LIMIT 1),
    6, true
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Healthy Breakfast' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Bananas' LIMIT 1),
    4, true
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Healthy Breakfast' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Yogurt' LIMIT 1),
    2, false
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Healthy Breakfast' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Cereal' LIMIT 1),
    1, true
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Healthy Breakfast' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Orange Juice' LIMIT 1),
    1, false;

-- Pantry Essentials
INSERT INTO shopping_list_items (list_id, item_id, quantity, collected)
SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Pantry Essentials' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Pasta' LIMIT 1),
    3, false
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Pantry Essentials' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Coffee' LIMIT 1),
    1, false
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Pantry Essentials' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Butter' LIMIT 1),
    2, false
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Pantry Essentials' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Sugar' LIMIT 1),
    1, false
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Pantry Essentials' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Flour' LIMIT 1),
    1, false;

-- Fresh Vegetables
INSERT INTO shopping_list_items (list_id, item_id, quantity, collected)
SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Fresh Vegetables' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Potatoes' LIMIT 1),
    5, true
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Fresh Vegetables' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Lettuce' LIMIT 1),
    2, true
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Fresh Vegetables' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Carrots' LIMIT 1),
    3, true
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Fresh Vegetables' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Tomatoes' LIMIT 1),
    4, true
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Fresh Vegetables' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Onions' LIMIT 1),
    3, true;

-- BBQ Weekend
INSERT INTO shopping_list_items (list_id, item_id, quantity, collected)
SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'BBQ Weekend' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Ground Beef' LIMIT 1),
    2, true
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'BBQ Weekend' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Chicken Breast' LIMIT 1),
    3, false
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'BBQ Weekend' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Tomatoes' LIMIT 1),
    2, true
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'BBQ Weekend' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Lettuce' LIMIT 1),
    1, false
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'BBQ Weekend' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Cheese' LIMIT 1),
    1, true;

-- Baking Project
INSERT INTO shopping_list_items (list_id, item_id, quantity, collected)
SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Baking Project' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Flour' LIMIT 1),
    2, false
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Baking Project' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Sugar' LIMIT 1),
    1, false
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Baking Project' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Butter' LIMIT 1),
    1, false
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Baking Project' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Eggs' LIMIT 1),
    6, false
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Baking Project' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Apples' LIMIT 1),
    3, false;

-- Quick Snacks
INSERT INTO shopping_list_items (list_id, item_id, quantity, collected)
SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Quick Snacks' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Yogurt' LIMIT 1),
    4, true
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Quick Snacks' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Apples' LIMIT 1),
    8, true
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Quick Snacks' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Bananas' LIMIT 1),
    6, true
UNION ALL SELECT 
    (SELECT id FROM shopping_lists WHERE name = 'Quick Snacks' LIMIT 1),
    (SELECT id FROM items WHERE name = 'Cereal' LIMIT 1),
    2, true;

-- Verify the data was inserted correctly
SELECT 
    'Items' as table_name, 
    COUNT(*) as count 
FROM items
UNION ALL
SELECT 
    'Shopping Lists' as table_name, 
    COUNT(*) as count 
FROM shopping_lists
UNION ALL
SELECT 
    'Shopping List Items' as table_name, 
    COUNT(*) as count 
FROM shopping_list_items;
