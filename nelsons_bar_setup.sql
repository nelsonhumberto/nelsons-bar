-- ─── Nelson's Bar — table setup ───────────────────────────────────────
-- Run in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/qdhqkcsfslkbhxtogjfp/editor
--
-- This creates the single JSONB row that holds Nelson's bar.
-- The OpenAI proxy (public.ai_call) is already shared with Laura's Food.

CREATE TABLE IF NOT EXISTS public.bar_state (
  id          TEXT PRIMARY KEY DEFAULT 'nelson',
  data        JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bar_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS bar_allow_all ON public.bar_state;
CREATE POLICY bar_allow_all ON public.bar_state
  FOR ALL USING (true) WITH CHECK (true);

-- Realtime: enables cross-device live sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.bar_state;

-- Seed the single row
INSERT INTO public.bar_state (id, data)
VALUES ('nelson', '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

SELECT 'Nelson''s Bar table ready ✓' AS status;
