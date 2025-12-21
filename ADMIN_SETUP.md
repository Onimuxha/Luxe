# Admin User Setup Guide

To create admin users for your e-commerce store, you need to manually insert them through the Supabase SQL Editor.

## Steps to Create an Admin User

1. Go to your Supabase project dashboard at https://supabase.com
2. Navigate to the **SQL Editor** section
3. Create a new query and run the following SQL:

```sql
-- Create admin user with email and hashed password
INSERT INTO admin_users (email, password_hash, name, role)
VALUES (
  'admin@luxe.com',                                                          -- Your admin email
  '$2a$10$X8qKZvN3J8h7qKt.OQqRxeF1zMVm4VhZRmhL1WQE5UmPKkJ3zHG7K',            -- Hashed password for 'admin123'
  'Admin User',                                                              -- Admin name
  'admin'                                                                     -- Role
)
ON CONFLICT (email) DO NOTHING;
```

4. The above script creates an admin user with:
   - **Email**: admin@luxe.com
   - **Password**: admin123
   - **Name**: Admin User

## Creating Custom Admin Users

To create a different admin user with a custom password, you need to:

1. Generate a bcrypt hash for your desired password
2. You can use online bcrypt generators (search "bcrypt generator online")
3. Use bcrypt with 10 rounds
4. Replace the `password_hash` value in the SQL above

Example SQL for custom admin:

```sql
INSERT INTO admin_users (email, password_hash, name, role)
VALUES (
  'yourname@example.com',
  'YOUR_BCRYPT_HASHED_PASSWORD_HERE',
  'Your Name',
  'admin'
)
ON CONFLICT (email) DO NOTHING;
```

## Security Notes

- Admin users can ONLY be created through Supabase SQL Editor (requires Supabase project access)
- This prevents unauthorized users from creating admin accounts through your website
- Row Level Security (RLS) policies block all public access to the admin_users table
- Only authenticated admins can access the admin dashboard at `/admin/login`

## Default Admin Credentials

After running the SQL script above, you can login at `/admin/login` with:
- **Email**: admin@luxe.com
- **Password**: admin123

**Important**: Change the default password after your first login by creating a new admin user with a secure password.
