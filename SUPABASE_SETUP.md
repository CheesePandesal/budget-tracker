# Supabase Setup Guide for Your Budget Tracker App

## Step 1: Create a Supabase Account and Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign In" if you already have an account
3. After signing in, click "New Project"
4. Fill in your project details:
   - **Project Name**: budget-tracker (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the region closest to you
5. Click "Create new project" and wait for it to initialize (this takes ~2 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (gear icon) in the left sidebar
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **Project API keys** section - find the `anon` `public` key (you want the key in the first row)

## Step 3: Set Up Environment Variables

Create a file named `.env.local` in the root of your project with the following content:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace:
- `your-project-url-here` with your actual Project URL
- `your-anon-key-here` with your actual `anon` public key

**Important**: The `.env.local` file should NEVER be committed to git. It's already included in `.gitignore`.

## Step 4: Create Your First Database Table (Optional Example)

Let's create a simple table for budget transactions:

1. In your Supabase dashboard, click on **Table Editor** in the left sidebar
2. Click **New Table**
3. Table name: `transactions`
4. Enable "Enable Row Level Security (RLS)"
5. Click "Add column" and create these columns:

| Column Name | Type | Default | Nullable |
|-------------|------|---------|----------|
| id | uuid | uuid_generate_v4() | No (primary key) |
| created_at | timestamptz | now() | No |
| amount | numeric | - | No |
| description | text | - | No |
| category | text | - | Yes |
| type | text | - | No (check constraint: 'income' OR 'expense') |

6. Click "Save" to create the table

## Step 5: Using Supabase in Your Code

The Supabase client has already been set up in `lib/supabaseClient.ts`. You can import and use it in your components like this:

```typescript
import { supabase } from '@/lib/supabaseClient'

// Example: Insert data
async function addTransaction(amount: number, description: string) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([
      { 
        amount: amount, 
        description: description,
        type: 'expense' 
      }
    ])
}

// Example: Fetch data
async function getTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
}

// Example: Update data
async function updateTransaction(id: string, updates: any) {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
}

// Example: Delete data
async function deleteTransaction(id: string) {
  const { data, error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
}
```

## Step 6: Test Your Connection

After setting up your environment variables, restart your development server:

```bash
npm run dev
```

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client Reference](https://supabase.com/docs/reference/javascript/introduction)
- [Next.js with Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
