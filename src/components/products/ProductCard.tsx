import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./StarRating";

interface Review {
  id: string;
  rating: number;
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

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0;

  const hasImages = product.images && product.images.length > 0;

  return (
    <div
      onClick={() => onClick(product)}
      className="group cursor-pointer bg-card rounded-lg overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {hasImages ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            <img
              src={product.images[0]}
              alt={product.name}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        
        {/* Stock Badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            Only {product.stock} left
          </Badge>
        )}
        {product.stock === 0 && (
          <Badge variant="secondary" className="absolute top-3 left-3">
            Out of Stock
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {product.category}
        </p>
        <h3 className="font-display text-lg font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2">
          <StarRating rating={Math.round(averageRating)} size="sm" />
          <span className="text-xs text-muted-foreground">
            ({product.reviews.length})
          </span>
        </div>
        
        <p className="font-semibold text-foreground">
          ${Number(product.price).toFixed(2)}
        </p>
      </div>
    </div>
  );
};
