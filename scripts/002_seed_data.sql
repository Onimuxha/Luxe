-- Insert categories
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Watches', 'watches', 'Elegant timepieces for every occasion', '/placeholder.svg?height=400&width=600'),
  ('Jewelry', 'jewelry', 'Beautiful jewelry pieces', '/placeholder.svg?height=400&width=600'),
  ('Bags', 'bags', 'Stylish bags and accessories', '/placeholder.svg?height=400&width=600'),
  ('Sunglasses', 'sunglasses', 'Premium sunglasses', '/placeholder.svg?height=400&width=600')
ON CONFLICT (slug) DO NOTHING;

-- Get category IDs
DO $$
DECLARE
  watches_id UUID;
  jewelry_id UUID;
  bags_id UUID;
  sunglasses_id UUID;
BEGIN
  SELECT id INTO watches_id FROM categories WHERE slug = 'watches';
  SELECT id INTO jewelry_id FROM categories WHERE slug = 'jewelry';
  SELECT id INTO bags_id FROM categories WHERE slug = 'bags';
  SELECT id INTO sunglasses_id FROM categories WHERE slug = 'sunglasses';

  -- Insert products (30 total products across 4 categories)
  INSERT INTO products (name, slug, description, price, compare_at_price, category_id, image_url, additional_images, stock, is_featured, is_active) VALUES
    -- Watches (8 products)
    ('Classic Gold Watch', 'classic-gold-watch', 'Timeless elegance with a modern twist. Features precision movement and scratch-resistant sapphire crystal.', 299.99, 399.99, watches_id, '/placeholder.svg?height=600&width=600', ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'], 15, true, true),
    ('Silver Chronograph', 'silver-chronograph', 'Precision meets style in this sophisticated chronograph with multiple time zones.', 449.99, 599.99, watches_id, '/placeholder.svg?height=600&width=600', ARRAY['/placeholder.svg?height=600&width=600'], 8, true, true),
    ('Rose Gold Automatic', 'rose-gold-automatic', 'Feminine elegance in rose gold with automatic movement and exhibition caseback.', 349.99, NULL, watches_id, '/placeholder.svg?height=600&width=600', ARRAY['/placeholder.svg?height=600&width=600'], 10, true, true),
    ('Black Sport Watch', 'black-sport-watch', 'Durable sports watch with water resistance up to 100m and luminous hands.', 189.99, 249.99, watches_id, '/placeholder.svg?height=600&width=600', ARRAY[], 25, false, true),
    ('Minimalist White', 'minimalist-white', 'Clean Scandinavian design with white dial and genuine leather strap.', 159.99, NULL, watches_id, '/placeholder.svg?height=600&width=600', ARRAY[], 18, false, true),
    ('Vintage Diver', 'vintage-diver', 'Classic diver style with rotating bezel and retro aesthetic.', 399.99, 499.99, watches_id, '/placeholder.svg?height=600&width=600', ARRAY[], 6, false, true),
    ('Smart Hybrid Watch', 'smart-hybrid-watch', 'Traditional watch face with smart notifications and fitness tracking.', 279.99, 329.99, watches_id, '/placeholder.svg?height=600&width=600', ARRAY[], 20, false, true),
    ('Skeleton Mechanical', 'skeleton-mechanical', 'Show off the intricate mechanics with this stunning skeleton design.', 549.99, 699.99, watches_id, '/placeholder.svg?height=600&width=600', ARRAY['/placeholder.svg?height=600&width=600'], 5, true, true),
    
    -- Jewelry (8 products)
    ('Diamond Necklace', 'diamond-necklace', 'Sparkling beauty for special occasions. Features genuine diamonds in 18k white gold.', 899.99, 1299.99, jewelry_id, '/placeholder.svg?height=600&width=600', ARRAY['/placeholder.svg?height=600&width=600'], 5, true, true),
    ('Pearl Earrings', 'pearl-earrings', 'Classic freshwater pearls with contemporary sterling silver design.', 149.99, 199.99, jewelry_id, '/placeholder.svg?height=600&width=600', ARRAY[], 20, false, true),
    ('Gold Bracelet Set', 'gold-bracelet-set', 'Delicate chain bracelet set in 14k gold, perfect for layering.', 199.99, 249.99, jewelry_id, '/placeholder.svg?height=600&width=600', ARRAY[], 15, false, true),
    ('Sapphire Ring', 'sapphire-ring', 'Stunning blue sapphire surrounded by diamond accents in platinum setting.', 1299.99, 1599.99, jewelry_id, '/placeholder.svg?height=600&width=600', ARRAY['/placeholder.svg?height=600&width=600'], 3, true, true),
    ('Pendant Necklace', 'pendant-necklace', 'Elegant pendant with cubic zirconia stones on delicate chain.', 79.99, 99.99, jewelry_id, '/placeholder.svg?height=600&width=600', ARRAY[], 30, false, true),
    ('Hoop Earrings', 'hoop-earrings', 'Modern twisted hoop earrings in rose gold plated sterling silver.', 89.99, NULL, jewelry_id, '/placeholder.svg?height=600&width=600', ARRAY[], 25, false, true),
    ('Tennis Bracelet', 'tennis-bracelet', 'Classic tennis bracelet with lab-created diamonds for everyday luxury.', 349.99, 449.99, jewelry_id, '/placeholder.svg?height=600&width=600', ARRAY[], 12, false, true),
    ('Statement Ring', 'statement-ring', 'Bold cocktail ring with large emerald-cut stone and intricate detailing.', 229.99, NULL, jewelry_id, '/placeholder.svg?height=600&width=600', ARRAY[], 8, false, true),
    
    -- Bags (8 products)
    ('Leather Tote Bag', 'leather-tote-bag', 'Premium full-grain leather tote with spacious interior and multiple pockets.', 249.99, 329.99, bags_id, '/placeholder.svg?height=600&width=600', ARRAY['/placeholder.svg?height=600&width=600'], 12, true, true),
    ('Designer Crossbody', 'designer-crossbody', 'Compact crossbody with adjustable strap and gold-tone hardware.', 179.99, 229.99, bags_id, '/placeholder.svg?height=600&width=600', ARRAY[], 18, false, true),
    ('Canvas Backpack', 'canvas-backpack', 'Casual canvas backpack with leather trim and laptop compartment.', 89.99, NULL, bags_id, '/placeholder.svg?height=600&width=600', ARRAY[], 22, false, true),
    ('Evening Clutch', 'evening-clutch', 'Sophisticated evening clutch with crystal embellishments and chain strap.', 129.99, 169.99, bags_id, '/placeholder.svg?height=600&width=600', ARRAY[], 15, false, true),
    ('Satchel Bag', 'satchel-bag', 'Classic satchel in structured leather with top handle and shoulder strap.', 299.99, 379.99, bags_id, '/placeholder.svg?height=600&width=600', ARRAY['/placeholder.svg?height=600&width=600'], 10, true, true),
    ('Bucket Bag', 'bucket-bag', 'Trendy bucket bag with drawstring closure and removable pouch.', 139.99, NULL, bags_id, '/placeholder.svg?height=600&width=600', ARRAY[], 20, false, true),
    ('Weekender Duffel', 'weekender-duffel', 'Spacious weekender bag perfect for short trips, with shoe compartment.', 189.99, 249.99, bags_id, '/placeholder.svg?height=600&width=600', ARRAY[], 14, false, true),
    ('Mini Shoulder Bag', 'mini-shoulder-bag', 'Cute mini bag perfect for essentials, available in multiple colors.', 69.99, 89.99, bags_id, '/placeholder.svg?height=600&width=600', ARRAY[], 35, false, true),
    
    -- Sunglasses (6 products)
    ('Aviator Sunglasses', 'aviator-sunglasses', 'Classic aviator style with polarized lenses and UV400 protection.', 129.99, 169.99, sunglasses_id, '/placeholder.svg?height=600&width=600', ARRAY[], 25, true, true),
    ('Cat Eye Frames', 'cat-eye-frames', 'Retro-inspired cat eye frames with gradient lenses and rhinestone details.', 99.99, 139.99, sunglasses_id, '/placeholder.svg?height=600&width=600', ARRAY[], 30, false, true),
    ('Sport Sunglasses', 'sport-sunglasses', 'Performance eyewear with rubber grips and impact-resistant lenses.', 79.99, 99.99, sunglasses_id, '/placeholder.svg?height=600&width=600', ARRAY[], 40, false, true),
    ('Round Frames', 'round-frames', 'Trendy round frames with metal accents and colored lens options.', 109.99, NULL, sunglasses_id, '/placeholder.svg?height=600&width=600', ARRAY[], 28, false, true),
    ('Oversized Glam', 'oversized-glam', 'Oversized frames for maximum sun protection and Hollywood glamour.', 149.99, 189.99, sunglasses_id, '/placeholder.svg?height=600&width=600', ARRAY[], 18, false, true),
    ('Wayfarer Style', 'wayfarer-style', 'Timeless wayfarer design with premium acetate frames and crystal lenses.', 119.99, 159.99, sunglasses_id, '/placeholder.svg?height=600&width=600', ARRAY[], 32, false, true)
  ON CONFLICT (slug) DO NOTHING;
END $$;
