import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./StarRating";
import { Product } from "@/types/product";

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

  const displayPrice = product.is_special && product.special_price ? product.special_price : product.price;
  const discountPercent = product.is_special && product.special_price 
    ? Math.round((1 - product.special_price / product.price) * 100) 
    : 0;

  return (
    <div
      onClick={() => onClick(product)}
      className={`group cursor-pointer bg-card overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 ${
        product.is_special ? "ring-2 ring-destructive" : ""
      }`}
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
        
        {/* Special Badge */}
        {product.is_special && (
          <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground animate-pulse">
            {discountPercent > 0 ? `${discountPercent}% OFF` : "SPECIAL"}
          </Badge>
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
        
        <div className="flex items-center gap-2">
          {product.is_special && product.special_price ? (
            <>
              <p className="font-semibold text-destructive">
                R{Number(displayPrice).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground line-through">
                R{Number(product.price).toFixed(2)}
              </p>
            </>
          ) : (
            <p className="font-semibold text-foreground">
              R{Number(product.price).toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
