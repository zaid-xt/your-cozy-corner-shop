
-- Create table for product fabric options
CREATE TABLE public.product_fabrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for product color options
CREATE TABLE public.product_colors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  hex_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_fabrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_colors ENABLE ROW LEVEL SECURITY;

-- Fabrics policies
CREATE POLICY "Fabrics are viewable by everyone" 
ON public.product_fabrics 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert fabrics" 
ON public.product_fabrics 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update fabrics" 
ON public.product_fabrics 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete fabrics" 
ON public.product_fabrics 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Colors policies
CREATE POLICY "Colors are viewable by everyone" 
ON public.product_colors 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert colors" 
ON public.product_colors 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update colors" 
ON public.product_colors 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete colors" 
ON public.product_colors 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for faster queries
CREATE INDEX idx_product_fabrics_product_id ON public.product_fabrics(product_id);
CREATE INDEX idx_product_colors_product_id ON public.product_colors(product_id);
