-- Add special/sale fields to products table
ALTER TABLE public.products 
ADD COLUMN is_special boolean NOT NULL DEFAULT false,
ADD COLUMN special_price numeric DEFAULT NULL;

-- Add a check to ensure special_price is less than regular price when set
CREATE OR REPLACE FUNCTION validate_special_price()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.special_price IS NOT NULL AND NEW.special_price >= NEW.price THEN
    RAISE EXCEPTION 'Special price must be less than regular price';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_special_price
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION validate_special_price();