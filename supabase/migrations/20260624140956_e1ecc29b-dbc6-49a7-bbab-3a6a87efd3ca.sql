
ALTER FUNCTION public.generate_order_code() SET search_path = public;
ALTER FUNCTION public.touch_updated_at() SET search_path = public;

DROP POLICY "Anyone can create order" ON public.orders;
CREATE POLICY "Anyone can create order" ON public.orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());
