Supabase setup for signup (simple and minimal)

Required table: `profiles`

Overview

- The signup flow uses Supabase Auth to create a user. When Supabase immediately returns a `user` object (no email confirmation required), we insert a `profiles` row that stores user metadata like full name and role.
- If your Supabase project requires email confirmation, signUp may not return a `user` immediately — the UI will navigate to a confirmation page that shows the email to check.

Simple `profiles` schema (recommended)

- Table name: profiles
- Primary key: `id` (type: uuid or text) — must match the auth user's id
- Columns:
  - id: uuid/text (primary key)
  - full_name: text
  - role: text (e.g., 'student' or 'admin')
  - created_at: timestamp with time zone (default: now())

SQL to create table (run in Supabase SQL editor):

```sql
create table if not exists public.profiles (
  id uuid primary key,
  full_name text,
  role text,
  created_at timestamptz default now()
);
```

Notes

- The `id` is the Supabase auth user's `id` (a UUID). If you use `text` instead of `uuid`, it still works but keep types consistent.
- For production you should add Row Level Security (RLS) policies and only allow users to insert/update their own profile. For a simple demo, you can leave RLS off.

Quick checklist for this repo

1. Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` are set in `.env` (they already exist).
2. Create the `profiles` table with the SQL above.
3. Run the app and sign up a user. If the app shows the confirmation page, check your inbox.
