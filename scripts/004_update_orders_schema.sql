-- Add new status fields and customer contact column
-- Update orders table to add status tracking and customer telegram contact
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_telegram TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]';

-- Update status field to use specific values
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'requested';

-- Add comment to clarify status values
COMMENT ON COLUMN orders.status IS 'Order status: requested, approved, preparing, delivery, completed, cancelled';
