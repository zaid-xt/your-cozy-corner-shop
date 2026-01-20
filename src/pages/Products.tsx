import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductModal } from "@/components/products/ProductModal";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Package } from "lucide-react";
import { Product } from "@/types/product";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category");
  const showSaleOnly = searchParams.get("sale") === "true";
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || "All");

  useEffect(() => {
    // Sync URL param with state
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    } else if (showSaleOnly) {
      setSelectedCategory("Sale");
    } else {
      setSelectedCategory("All");
    }
  }, [urlCategory, showSaleOnly]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (productsError) {
      console.error("Error fetching products:", productsError);
      setIsLoading(false);
      return;
    }

    // Fetch reviews, fabrics, and colors in parallel
    const [reviewsRes, fabricsRes, colorsRes] = await Promise.all([
      supabase.from("reviews").select("*").order("created_at", { ascending: false }),
      supabase.from("product_fabrics").select("*"),
      supabase.from("product_colors").select("*"),
    ]);

    const productsWithData: Product[] = (productsData || []).map((product) => ({
      ...product,
      reviews: (reviewsRes.data || []).filter((review) => review.product_id === product.id),
      fabrics: (fabricsRes.data || []).filter((fabric) => fabric.product_id === product.id),
      colors: (colorsRes.data || []).filter((color) => color.product_id === product.id),
    }));

    setProducts(productsWithData);

    const uniqueCategories = ["All", ...new Set(productsData?.map((p) => p.category) || [])];
    setCategories(uniqueCategories);

    setIsLoading(false);
  };

  const filteredProducts = (() => {
    if (selectedCategory === "Sale" || showSaleOnly) {
      return products.filter((p) => p.is_special);
    }
    if (selectedCategory === "All") {
      return products;
    }
    return products.filter((p) => p.category === selectedCategory);
  })();

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "All") {
      setSearchParams({});
    } else if (category === "Sale") {
      setSearchParams({ sale: "true" });
    } else {
      setSearchParams({ category });
    }
  };

  const pageTitle = showSaleOnly || selectedCategory === "Sale" 
    ? "Sale Items" 
    : selectedCategory !== "All" 
      ? selectedCategory 
      : "Our Products";

  return (
    <Layout>
      {/* Header */}
      <section className="hero-gradient py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4 animate-slide-up">
            {pageTitle}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto animate-fade-in">
            {showSaleOnly || selectedCategory === "Sale" 
              ? "Don't miss out on these amazing deals!"
              : "Browse our collection of handcrafted goods, each piece made with love and attention to detail."}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border sticky top-16 md:top-20 bg-background/95 backdrop-blur-sm z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {["All", ...categories.filter(c => c !== "All"), "Sale"].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category)}
                className="transition-all"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="font-display text-xl font-semibold mb-2">No Products Yet</h2>
              <p className="text-muted-foreground">Check back soon for our latest products!</p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-sm text-muted-foreground">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard product={product} onClick={setSelectedProduct} />
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products found in this category.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </Layout>
  );
};

export default Products;
