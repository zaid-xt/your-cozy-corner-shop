import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Truck, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductModal } from "@/components/products/ProductModal";
import { Product } from "@/types/product";

// Import your images or use paths
import hero1 from "..//components/images//WhatsApp Image 2026-01-08 at 10.31.02.jpeg"
import hero2 from "..//components/images/WhatsApp Image 2026-01-08 at 10.25.25.jpeg"
import hero3 from "..//components/images/WhatsApp Image 2026-01-08 at 10.25.55.jpeg";
import hero4 from "..//components/images/WhatsApp Image 2026-01-08 at 10.30.34.jpeg";
const features = [
  { icon: Sparkles, title: "Handcrafted Quality", description: "Every piece is made with care by skilled artisans." },
  { icon: Truck, title: "Free Shipping", description: "Complimentary shipping on orders over $100." },
  { icon: Shield, title: "Secure Checkout", description: "Your payment information is always protected." },
];

const slides = [
  {
    id: 1,
    title: "Discover Handcrafted",
    highlight: "Treasures",
    description: "Curated collection of artisan-made products crafted with passion, tradition, and sustainable materials.",
    image: hero1, 
    buttonText: "Shop Collection",
    buttonLink: "/products"
  },
  {
    id: 2,
    title: "Premium Quality",
    highlight: "Materials",
    description: "Sourced from sustainable origins, each material tells a story of heritage and craftsmanship.",
    image: hero2, 
    buttonText: "Our Materials",
    buttonLink: "/about#materials"
  },
  {
    id: 3,
    title: "Artisan",
    highlight: "Stories",
    description: "Meet the makers behind our products and learn about their traditions and techniques.",
    image: hero3, 
    buttonText: "Meet Our Artisans",
    buttonLink: "/about#artisans"
  },
  {
    id: 4,
    title: "Limited Edition",
    highlight: "Collections",
    description: "Exclusive pieces crafted in limited quantities for the discerning collector.",
    image: hero4,
    buttonText: "View Collections",
    buttonLink: "/products?collection=limited"
  }
];

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data: productsData } = await supabase.from("products").select("*").limit(3);
      const { data: reviewsData } = await supabase.from("reviews").select("*");
      
      const productsWithReviews: Product[] = (productsData || []).map((product) => ({
        ...product,
        reviews: (reviewsData || []).filter((r) => r.product_id === product.id),
      }));
      setFeaturedProducts(productsWithReviews);
    };
    fetchProducts();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000); // Resume auto-play after 3 seconds
  };

  return (
    <Layout>
      {/* Hero Slider Section */}
      <section className="relative overflow-hidden">
        {/* Slides */}
        <div className="relative h-[500px] md:h-[600px] lg:h-[700px]">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Background Image with Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                {/* Dark Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                
                {/* Gradient Overlay (optional - adds depth) */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
              </div>
              
              {/* Content */}
              <div className="relative h-full w-full flex items-center">
                <div className="container mx-auto px-4">
                  <div 
                    className={`max-w-3xl text-white transition-all duration-1000 transform ${
                      index === currentSlide 
                        ? "translate-y-0 opacity-100" 
                        : "translate-y-8 opacity-0"
                    }`}
                  >
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
                      {slide.title} <span className="text-primary-foreground">{slide.highlight}</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl drop-shadow-lg">
                      {slide.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to={slide.buttonLink}>
                        <Button 
                          size="lg" 
                          className="bg-white text-foreground hover:bg-white/90 gap-2 hover:scale-105 transition-transform shadow-xl"
                        >
                          {slide.buttonText}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to="/about">
                        <Button 
                          variant="outline" 
                          size="lg"
                          className="bg-transparent border-white text-white hover:bg-white/10 hover:text-white"
                        >
                          Our Story
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 z-10 group"
          aria-label="Previous slide"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <ChevronLeft className="h-6 w-6 text-white group-hover:text-primary-foreground" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 z-10 group"
          aria-label="Next slide"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <ChevronRight className="h-6 w-6 text-white group-hover:text-primary-foreground" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-10 bg-white"
                  : "w-3 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-10">
          <div 
            className="h-full bg-white transition-all duration-1000 ease-linear"
            style={{ 
              width: isAutoPlaying ? '100%' : '0%',
              transition: isAutoPlaying ? 'width 5s linear' : 'none'
            }}
            key={currentSlide} // Reset animation on slide change
          />
        </div>
      </section>

      {/* Rest of your existing code remains the same */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">Featured Products</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Discover our most loved handcrafted pieces.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <ProductCard product={product} onClick={setSelectedProduct} />
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/products"><Button variant="outline" size="lg" className="gap-2">View All Products<ArrowRight className="h-4 w-4" /></Button></Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-foreground text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">Need Something Custom?</h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">We offer bespoke services for special orders.</p>
          <Link to="/services"><Button size="lg" className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90">Explore Services</Button></Link>
        </div>
      </section>

      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </Layout>
  );
};

export default Index;