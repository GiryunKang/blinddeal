-- Contact/inquiry form submissions (public, no auth required)
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('buy', 'sell', 'meeting', 'partnership', 'other')),
  deal_category TEXT CHECK (deal_category IN ('real_estate', 'ma', 'both')),
  budget_range TEXT,
  description TEXT NOT NULL,
  preferences TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Only service role (admin) can read inquiries; anyone can insert
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inquiries_insert" ON inquiries
  FOR INSERT
  WITH CHECK (true);

-- No SELECT policy for anon/authenticated — admin reads via service role key only
