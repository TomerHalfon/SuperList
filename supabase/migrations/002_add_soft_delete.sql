-- Add soft delete functionality to shopping_lists table
-- This migration adds a deleted_at column to support soft deletes

-- Add deleted_at column to shopping_lists table
ALTER TABLE shopping_lists 
ADD COLUMN deleted_at TIMESTAMPTZ NULL;

-- Create index on deleted_at for better performance when filtering
CREATE INDEX idx_shopping_lists_deleted_at ON shopping_lists(deleted_at);

-- Update the existing index to include deleted_at for better query performance
-- This helps with queries that filter by deleted_at IS NULL
CREATE INDEX idx_shopping_lists_active ON shopping_lists(updated_at DESC) 
WHERE deleted_at IS NULL;

-- Add comment to document the soft delete functionality
COMMENT ON COLUMN shopping_lists.deleted_at IS 'Timestamp when the list was soft deleted. NULL means the list is active.';
