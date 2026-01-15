import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, Package, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StarRating } from "./StarRating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Product, Review, ProductFabric, ProductColor } from "@/types/product";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newReview, setNewReview] = useState({ author: "", comment: "", rating: 0 });
  const [reviews, setReviews] = useState<Review[]>(product.reviews);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFabric, setSelectedFabric] = useState<ProductFabric | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);

  const hasFabrics = product.fabrics && product.fabrics.length > 0;
  const hasColors = product.colors && product.colors.length > 0;

  // Determine if enquiry is allowed based on selections
  const fabricRequired = hasFabrics;
  const colorRequired = hasColors;
  const canEnquire = 
    (!fabricRequired || selectedFabric !== null) && 
    (!colorRequired || selectedColor !== null);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  const hasImages = product.images && product.images.length > 0;

  const nextImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.author || !newReview.comment || newReview.rating === 0) {
      toast.error("Please fill in all fields and select a rating");
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        product_id: product.id,
        author: newReview.author,
        comment: newReview.comment,
        rating: newReview.rating,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to submit review");
      console.error(error);
    } else {
      setReviews([data, ...reviews]);
      setNewReview({ author: "", comment: "", rating: 0 });
      toast.success("Review submitted successfully!");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in card-shadow-hover">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors sticky"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Gallery */}
          <div className="bg-muted flex flex-col">
            {/* Main Image */}
            <div className="relative w-full" style={{ paddingBottom: '100%' }}>
              {hasImages ? (
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                  <Package className="h-16 w-16 text-muted-foreground" />
                </div>
              )}

              {hasImages && product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors z-10"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors z-10"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {hasImages && product.images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all {
                      index === currentImageIndex 
                        ? "border-primary ring-2 ring-primary/20" 
                        : "border-transparent hover:border-primary/50"
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Description below image */}
            {product.description && (
              <div className="p-4 bg-card/50 border-t border-border">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 overflow-y-auto max-h-[90vh] md:max-h-none">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
              {product.category}
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
              {product.name}
            </h2>

            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={Math.round(averageRating)} size="md" />
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>

            <p className="text-2xl font-semibold text-foreground mb-4">
              R{Number(product.price).toFixed(2)}
            </p>

            <div className="flex items-center gap-2 mb-6">
              <Package className="h-4 w-4 text-muted-foreground" />
              {product.stock > 0 ? (
                <span className="text-sm">
                  <span className="text-success font-medium">{product.stock} in stock</span>
                </span>
              ) : (
                <Badge variant="secondary">Out of Stock</Badge>
              )}
            </div>


            {/* Fabric Selection */}
            {hasFabrics && (
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">Select Fabric</label>
                <div className="flex flex-wrap gap-2">
                  {product.fabrics!.map((fabric) => (
                    <button
                      key={fabric.id}
                      onClick={() => setSelectedFabric(fabric)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                        selectedFabric?.id === fabric.id
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {fabric.image_url ? (
                        <img src={fabric.image_url} alt={fabric.name} className="w-6 h-6 rounded object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded bg-muted" />
                      )}
                      <span className="text-sm">{fabric.name}</span>
                      {selectedFabric?.id === fabric.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {hasColors && (
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Select Color</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors!.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                        selectedColor?.id === color.id
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div 
                        className="w-5 h-5 rounded-full border border-border" 
                        style={{ backgroundColor: color.hex_code }}
                      />
                      <span className="text-sm">{color.name}</span>
                      {selectedColor?.id === color.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <Button 
                className="w-full button-shadow" 
                disabled={!canEnquire}
                onClick={() => {
                  onClose();
                  const params = new URLSearchParams();
                  if (selectedFabric) params.set("fabric", selectedFabric.name);
                  if (selectedColor) params.set("color", selectedColor.name);
                  navigate(`/enquire/${product.id}${params.toString() ? `?${params.toString()}` : ""}`);
                }}
              >
                Enquire Now
              </Button>
              {!canEnquire && (
                <p className="text-sm text-muted-foreground text-center mt-2">
                  {!selectedFabric && fabricRequired && !selectedColor && colorRequired
                    ? "Please select a fabric and color to continue"
                    : !selectedFabric && fabricRequired
                    ? "Please select a fabric to continue"
                    : "Please select a color to continue"}
                </p>
              )}
            </div>
            <div className="border-t border-border pt-6">
              <h3 className="font-display text-lg font-semibold mb-4">
                Customer Reviews
              </h3>

              {/* Add Review Form */}
              <form onSubmit={handleSubmitReview} className="space-y-3 mb-6 p-4 bg-muted rounded-lg">
                <h4 className="text-sm font-medium">Write a Review</h4>
                <Input
                  placeholder="Your name"
                  value={newReview.author}
                  onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                  className="bg-card"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Rating:</span>
                  <StarRating
                    rating={newReview.rating}
                    size="md"
                    interactive
                    onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                  />
                </div>
                <Textarea
                  placeholder="Share your experience..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="bg-card resize-none"
                  rows={3}
                />
                <Button type="submit" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </form>

              {/* Reviews List */}
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {reviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="pb-4 border-b border-border last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{review.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                      {review.comment && (
                        <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
