# Quick Start: Supabase Setup

## What's Been Done
✅ Installed `@supabase/supabase-js` package  
✅ Created `lib/supabaseClient.ts` - The Supabase client configuration  
✅ Created `app/components/TransactionExample.tsx` - Example component showing how to use Supabase

## What You Need to Do

### 1. Create Supabase Account & Project (5 minutes)
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project called "budget-tracker"
3. Wait for initialization (~2 minutes)

### 2. Get Your API Keys (2 minutes)
1. In your Supabase dashboard → Settings → API
2. Copy your **Project URL** and **anon public key**

### 3. Create Environment File (1 minute)
Create a file named `.env.local` in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Paste your actual credentials from Step 2.

### 4. Create Database Table (3 minutes)
1. In Supabase dashboard → Table Editor → New Table
2. Name it `transactions`
3. Enable RLS (Row Level Security)
4. Add these columns:

   - `id` - uuid, Primary Key, Default: uuid_generate_v4()
   - `created_at` - timestamptz, Default: now()
   - `amount` - numeric (NOT nullable)
   - `description` - text (NOT nullable)
   - `category` - text (nullable)
   - `type` - text (NOT nullable)

5. Save the table

### 5. Test It! (1 minute)
Restart your dev server:
```bash
npm run dev
```

## Next Steps
- Import and use the `TransactionExample` component in your app
- See `SUPABASE_SETUP.md` for detailed documentation
- Check out the examples in `app/components/TransactionExample.tsx`
