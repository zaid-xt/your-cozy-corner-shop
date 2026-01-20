import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Package, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { StarRating } from "@/components/products/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Review {
  id: string;
  author: string;
  comment: string | null;
  rating: number;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  stock: number;
  images: string[];
}

const ProductEnquiry = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedFabric = searchParams.get("fabric");
  const selectedColor = searchParams.get("color");
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    if (!productId) return;

    const { data: productData, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .maybeSingle();

    if (productError) {
      console.error("Error fetching product:", productError);
      setIsLoading(false);
      return;
    }

    setProduct(productData);

    // Fetch reviews
    if (productData) {
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      setReviews(reviewsData || []);
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-semibold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  const nextImage = () => {
    if (product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/product-enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          product: {
            id: product.id,
            name: product.name,
          },
          color: selectedColor || null,
          fabric: selectedFabric || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send enquiry");
      }

      toast.success("Enquiry Sent! We'll get back to you shortly.");

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Enquiry error:", error);
      toast.error("Failed to send enquiry. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Details */}
          <div className="space-y-6">
            {/* Image Gallery */}
            <div className="relative bg-muted overflow-hidden">
              <div className="aspect-square">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>

              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Thumbnails */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2.5 h-2.5 transition-colors ${
                          index === currentImageIndex ? "bg-primary" : "bg-card/60"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                {product.category}
              </p>
              <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                {product.name}
              </h1>

              <div className="flex items-center gap-3">
                <StarRating rating={Math.round(averageRating)} size="md" />
                <span className="text-sm text-muted-foreground">
                  {averageRating.toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>

              <p className="text-2xl font-semibold text-foreground">
                R{Number(product.price).toFixed(2)}
              </p>

              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                {product.stock > 0 ? (
                  <span className="text-sm">
                    <span className="text-success font-medium">{product.stock} in stock</span>
                  </span>
                ) : (
                  <Badge variant="secondary">Out of Stock</Badge>
                )}
              </div>

              {product.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Selected Options */}
              {(selectedFabric || selectedColor) && (
                <div className="bg-muted p-4 space-y-2">
                  <p className="text-sm font-medium">Selected Options:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFabric && (
                      <Badge variant="secondary">Fabric: {selectedFabric}</Badge>
                    )}
                    {selectedColor && (
                      <Badge variant="secondary">Color: {selectedColor}</Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-card p-6 md:p-8 card-shadow">
              <h2 className="font-display text-xl md:text-2xl font-semibold mb-2">
                Enquire About This Product
              </h2>
              <p className="text-muted-foreground mb-6">
                Fill in your details below and we'll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="text-sm font-medium mb-1.5 block">
                    Your Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="text-sm font-medium mb-1.5 block">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="text-sm font-medium mb-1.5 block">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+27 (0) 00 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="text-sm font-medium mb-1.5 block">
                    Your Message <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    id="message"
                    placeholder={`I'm interested in the ${product.name}. I would like to know more about...`}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full button-shadow" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Enquiry"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductEnquiry;
