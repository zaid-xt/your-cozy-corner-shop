import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StarRating } from "./StarRating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  reviews: Review[];
}

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newReview, setNewReview] = useState({ author: "", comment: "", rating: 0 });
  const [reviews, setReviews] = useState(product.reviews);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      <div className="relative bg-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in card-shadow-hover">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Gallery */}
          <div className="relative bg-muted">
            <div className="aspect-square">
              {hasImages ? (
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

            {hasImages && product.images.length > 1 && (
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
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-primary" : "bg-card/60"
                      }`}
                    />
                  ))}
                </div>
              </>
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
              ${Number(product.price).toFixed(2)}
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

            {product.description && (
              <p className="text-muted-foreground leading-relaxed mb-6">
                {product.description}
              </p>
            )}

            <Button 
              className="w-full mb-8 button-shadow" 
              onClick={() => {
                onClose();
                navigate(`/enquire/${product.id}`);
              }}
            >
              Enquire Now
            </Button>

            {/* Reviews Section */}
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
