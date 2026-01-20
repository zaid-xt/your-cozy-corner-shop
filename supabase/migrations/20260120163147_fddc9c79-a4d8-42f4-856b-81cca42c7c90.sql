-- Create product_sizes table
CREATE TABLE public.product_sizes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Sizes are viewable by everyone" 
ON public.product_sizes 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert sizes" 
ON public.product_sizes 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update sizes" 
ON public.product_sizes 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete sizes" 
ON public.product_sizes 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));