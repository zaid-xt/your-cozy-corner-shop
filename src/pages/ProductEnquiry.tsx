import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { products } from "@/data/products";
import { StarRating } from "@/components/products/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const ProductEnquiry = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === productId);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Here you would typically send the enquiry to your backend
    console.log("Enquiry submitted:", {
      product: product.name,
      productId: product.id,
      ...formData,
    });

    toast.success("Enquiry sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
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
            <div className="relative bg-muted rounded-xl overflow-hidden">
              <div className="aspect-square">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Thumbnails */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
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
                  {averageRating.toFixed(1)} ({product.reviews.length} reviews)
                </span>
              </div>

              <p className="text-2xl font-semibold text-foreground">
                ${product.price.toFixed(2)}
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

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-card rounded-xl p-6 md:p-8 card-shadow">
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
                    placeholder="+1 (555) 000-0000"
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

                <Button type="submit" className="w-full button-shadow" size="lg">
                  Send Enquiry
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
