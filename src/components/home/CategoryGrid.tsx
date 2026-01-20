import { Link } from "react-router-dom";
import { Percent } from "lucide-react";

export interface Category {
  name: string;
  slug: string;
  image: string;
  isSpecial?: boolean;
}

export const PRODUCT_CATEGORIES: Category[] = [
  {
    name: "Bed Sets",
    slug: "Bed Sets",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop",
  },
  {
    name: "Side Tables",
    slug: "Side Tables",
    image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=400&h=400&fit=crop",
  },
  {
    name: "Sofas",
    slug: "Sofas",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
  },
  {
    name: "TV Stands",
    slug: "TV Stands",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
  },
  {
    name: "Coffee Tables",
    slug: "Coffee Tables",
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400&h=400&fit=crop",
  },
  {
    name: "Dining Tables",
    slug: "Dining Tables",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=400&fit=crop",
  },
  {
    name: "Dining Chairs",
    slug: "Dining Chairs",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=400&fit=crop",
  },
  {
    name: "Sale!!!",
    slug: "Sale",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=400&fit=crop",
    isSpecial: true,
  },
];

export const CategoryGrid = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Browse our curated collection of furniture and home decor.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {PRODUCT_CATEGORIES.map((category, index) => (
            <Link
              key={category.slug}
              to={category.isSpecial ? "/products?sale=true" : `/products?category=${encodeURIComponent(category.slug)}`}
              className="group relative overflow-hidden bg-card aspect-square animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className={`absolute inset-0 transition-opacity duration-300 ${
                category.isSpecial 
                  ? "bg-destructive/60 group-hover:bg-destructive/70" 
                  : "bg-foreground/40 group-hover:bg-foreground/50"
              }`} />
              
              {/* Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                {category.isSpecial && (
                  <Percent className="h-8 w-8 text-white mb-2" />
                )}
                <h3 className={`font-display text-lg md:text-xl font-semibold text-white text-center ${
                  category.isSpecial ? "text-2xl" : ""
                }`}>
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
