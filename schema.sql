-- SQL Script for Supabase Table Creation

CREATE TABLE applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    system TEXT NOT NULL,
    has_database BOOLEAN DEFAULT false,
    database_type TEXT,
    database_location TEXT,
    online_url TEXT,
    hosting_location TEXT,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'In Development', 'Maintenance', 'Archived')),
    notes TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (Select, Insert, Update, Delete)
-- NOTE: In a production environment, you should refine this policy based on user auth.
CREATE POLICY "Allow all" ON applications FOR ALL USING (true);
