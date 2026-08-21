CREATE TABLE public.bio_links (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL CHECK (char_length(label) BETWEEN 1 AND 80),
  url TEXT NOT NULL CHECK (char_length(url) BETWEEN 1 AND 2048),
  icon TEXT NOT NULL CHECK (icon IN ('instagram', 'facebook', 'whatsapp', 'tiktok', 'youtube', 'telegram', 'website', 'email', 'custom')),
  emoji TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.bio_links TO anon, authenticated;
GRANT ALL ON public.bio_links TO service_role;

ALTER TABLE public.bio_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view bio links"
ON public.bio_links
FOR SELECT
TO anon, authenticated
USING (true);

CREATE OR REPLACE FUNCTION public.set_bio_links_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_bio_links_updated_at
BEFORE UPDATE ON public.bio_links
FOR EACH ROW
EXECUTE FUNCTION public.set_bio_links_updated_at();

INSERT INTO public.bio_links (id, label, url, icon, visible, sort_order)
VALUES
  ('instagram', 'Instagram', 'INSTAGRAM_URL_HERE', 'instagram', true, 0),
  ('facebook', 'Facebook', 'https://www.facebook.com/share/18p68CpnTd/?mibextid=wwXIfr', 'facebook', true, 1),
  ('whatsapp', 'WhatsApp', 'WHATSAPP_URL_HERE', 'whatsapp', true, 2),
  ('tiktok', 'TikTok', 'TIKTOK_URL_HERE', 'tiktok', true, 3);