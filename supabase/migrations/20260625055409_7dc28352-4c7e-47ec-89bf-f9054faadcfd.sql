
-- 1. Payment status enum + columns on orders
DO $$ BEGIN
  CREATE TYPE public.payment_status AS ENUM ('pending','submitted','confirmed','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_status public.payment_status NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_notes text,
  ADD COLUMN IF NOT EXISTS payment_submitted_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_confirmed_at timestamptz;

-- Allow customers to mark their own order as 'submitted' (after they sent WhatsApp message)
DROP POLICY IF EXISTS "Customers mark own payment submitted" ON public.orders;
CREATE POLICY "Customers mark own payment submitted"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 2. WhatsApp settings table (single-row config)
CREATE TABLE IF NOT EXISTS public.whatsapp_settings (
  id text PRIMARY KEY DEFAULT 'default',
  business_number text NOT NULL DEFAULT '923496881538',
  payment_instructions text NOT NULL DEFAULT 'Please send your payment via JazzCash / EasyPaisa to 03496881538 and share the screenshot on WhatsApp.',
  message_template text NOT NULL DEFAULT 'Hello, I want to confirm my order.\n\nOrder ID: {order_code}\nTracking ID: {order_code}\nCustomer Name: {customer_name}\nPhone Number: {phone}\nOrder Amount: Rs. {amount}\n\nPayment completed. Please verify and confirm my order.',
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.whatsapp_settings TO anon, authenticated;
GRANT UPDATE ON public.whatsapp_settings TO authenticated;
GRANT ALL ON public.whatsapp_settings TO service_role;

ALTER TABLE public.whatsapp_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone reads whatsapp settings" ON public.whatsapp_settings;
CREATE POLICY "Anyone reads whatsapp settings"
  ON public.whatsapp_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admins update whatsapp settings" ON public.whatsapp_settings;
CREATE POLICY "Admins update whatsapp settings"
  ON public.whatsapp_settings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed the default row
INSERT INTO public.whatsapp_settings (id) VALUES ('default')
ON CONFLICT (id) DO NOTHING;
