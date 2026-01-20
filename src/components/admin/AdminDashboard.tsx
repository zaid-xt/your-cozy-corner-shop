import { useState, useEffect } from "react";
import { Plus, Package, MessageSquare, LogOut, Pencil, Trash2, ImageIcon, Tag, Palette, X, Star, Ruler } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PRODUCT_CATEGORIES } from "@/components/home/CategoryGrid";

interface ProductFabric {
  id: string;
  product_id: string;
  name: string;
  image_url: string | null;
}

interface ProductColor {
  id: string;
  product_id: string;
  name: string;
  hex_code: string;
}

interface ProductSize {
  id: string;
  product_id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  stock: number;
  images: string[];
  created_at: string;
  is_special: boolean;
  special_price: number | null;
  is_featured: boolean;
  fabrics?: ProductFabric[];
  colors?: ProductColor[];
  sizes?: ProductSize[];
}

interface Enquiry {
  id: string;
  product_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  message: string;
  status: string;
  created_at: string;
}

export const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: [] as string[],
    is_special: false,
    special_price: "",
    is_featured: false,
  });

  // Fabrics, colors, and sizes for the currently editing product
  const [fabrics, setFabrics] = useState<ProductFabric[]>([]);
  const [colors, setColors] = useState<ProductColor[]>([]);
  const [sizes, setSizes] = useState<ProductSize[]>([]);
  const [newFabric, setNewFabric] = useState({ name: "", image_url: "" });
  const [newColor, setNewColor] = useState({ name: "", hex_code: "#000000" });
  const [newSize, setNewSize] = useState({ name: "" });
  const [uploadingFabricImage, setUploadingFabricImage] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchEnquiries();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch products");
      console.error(error);
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  const fetchEnquiries = async () => {
    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch enquiries:", error);
    } else {
      setEnquiries(data || []);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file);

      if (uploadError) {
        toast.error(`Failed to upload ${file.name}`);
        console.error(uploadError);
        continue;
      }

      const { data: publicUrl } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrl.publicUrl);
    }

    setProductForm(prev => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls],
    }));
    setUploading(false);
    toast.success(`${uploadedUrls.length} image(s) uploaded`);
  };

  const removeImage = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      images: [],
      is_special: false,
      special_price: "",
      is_featured: false,
    });
    setFabrics([]);
    setColors([]);
    setSizes([]);
    setNewFabric({ name: "", image_url: "" });
    setNewColor({ name: "", hex_code: "#000000" });
    setNewSize({ name: "" });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const fetchProductFabricsColorsAndSizes = async (productId: string) => {
    const [fabricsRes, colorsRes, sizesRes] = await Promise.all([
      supabase.from("product_fabrics").select("*").eq("product_id", productId),
      supabase.from("product_colors").select("*").eq("product_id", productId),
      supabase.from("product_sizes").select("*").eq("product_id", productId),
    ]);
    
    if (fabricsRes.data) setFabrics(fabricsRes.data);
    if (colorsRes.data) setColors(colorsRes.data);
    if (sizesRes.data) setSizes(sizesRes.data);
  };

  const handleEditProduct = async (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      images: product.images || [],
      is_special: product.is_special,
      special_price: product.special_price?.toString() || "",
      is_featured: product.is_featured,
    });
    await fetchProductFabricsColorsAndSizes(product.id);
    setShowProductForm(true);
  };

  const handleFabricImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFabricImage(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `fabric-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (uploadError) {
      toast.error("Failed to upload fabric image");
      setUploadingFabricImage(false);
      return;
    }

    const { data: publicUrl } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    setNewFabric(prev => ({ ...prev, image_url: publicUrl.publicUrl }));
    setUploadingFabricImage(false);
  };

  const handleAddFabric = async () => {
    if (!newFabric.name) {
      toast.error("Please enter a fabric name");
      return;
    }
    if (!editingProduct) {
      toast.error("Please save the product first before adding fabrics");
      return;
    }

    const { data, error } = await supabase
      .from("product_fabrics")
      .insert({
        product_id: editingProduct.id,
        name: newFabric.name,
        image_url: newFabric.image_url || null,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add fabric");
      console.error(error);
    } else {
      setFabrics([...fabrics, data]);
      setNewFabric({ name: "", image_url: "" });
      toast.success("Fabric added");
    }
  };

  const handleDeleteFabric = async (id: string) => {
    const { error } = await supabase.from("product_fabrics").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete fabric");
    } else {
      setFabrics(fabrics.filter(f => f.id !== id));
      toast.success("Fabric removed");
    }
  };

  const handleAddColor = async () => {
    if (!newColor.name) {
      toast.error("Please enter a color name");
      return;
    }
    if (!editingProduct) {
      toast.error("Please save the product first before adding colors");
      return;
    }

    const { data, error } = await supabase
      .from("product_colors")
      .insert({
        product_id: editingProduct.id,
        name: newColor.name,
        hex_code: newColor.hex_code,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add color");
      console.error(error);
    } else {
      setColors([...colors, data]);
      setNewColor({ name: "", hex_code: "#000000" });
      toast.success("Color added");
    }
  };

  const handleDeleteColor = async (id: string) => {
    const { error } = await supabase.from("product_colors").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete color");
    } else {
      setColors(colors.filter(c => c.id !== id));
      toast.success("Color removed");
    }
  };

  const handleAddSize = async () => {
    if (!newSize.name) {
      toast.error("Please enter a size name");
      return;
    }
    if (!editingProduct) {
      toast.error("Please save the product first before adding sizes");
      return;
    }

    const { data, error } = await supabase
      .from("product_sizes")
      .insert({
        product_id: editingProduct.id,
        name: newSize.name,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add size");
      console.error(error);
    } else {
      setSizes([...sizes, data]);
      setNewSize({ name: "" });
      toast.success("Size added");
    }
  };

  const handleDeleteSize = async (id: string) => {
    const { error } = await supabase.from("product_sizes").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete size");
    } else {
      setSizes(sizes.filter(s => s.id !== id));
      toast.success("Size removed");
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productForm.name || !productForm.price || !productForm.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const productData = {
      name: productForm.name,
      description: productForm.description || null,
      price: parseFloat(productForm.price),
      category: productForm.category,
      stock: parseInt(productForm.stock) || 0,
      images: productForm.images,
      created_by: user?.id,
      is_special: productForm.is_special,
      special_price: productForm.is_special && productForm.special_price 
        ? parseFloat(productForm.special_price) 
        : null,
      is_featured: productForm.is_featured,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id);

      if (error) {
        toast.error("Failed to update product");
        console.error(error);
      } else {
        toast.success("Product updated successfully");
        resetForm();
        fetchProducts();
      }
    } else {
      const { error } = await supabase
        .from("products")
        .insert(productData);

      if (error) {
        toast.error("Failed to create product");
        console.error(error);
      } else {
        toast.success("Product created successfully");
        resetForm();
        fetchProducts();
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete product");
      console.error(error);
    } else {
      toast.success("Product deleted");
      fetchProducts();
    }
  };

  const handleUpdateEnquiryStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("enquiries")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated");
      fetchEnquiries();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back, {user?.email}
          </p>
        </div>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products" className="gap-2">
            <Package className="h-4 w-4" />
            Products ({products.length})
          </TabsTrigger>
          <TabsTrigger value="enquiries" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Enquiries ({enquiries.length})
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          {!showProductForm ? (
            <>
              <Button onClick={() => setShowProductForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>

              {isLoading ? (
                <div className="text-center py-12">Loading products...</div>
              ) : products.length === 0 ? (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No products yet. Add your first product!</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-card rounded-lg p-4 card-shadow flex items-center gap-4"
                    >
                      <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden shrink-0">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium truncate">{product.name}</h3>
                          {product.is_featured && (
                            <Badge className="bg-primary text-primary-foreground shrink-0">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {product.is_special && (
                            <Badge className="bg-destructive text-destructive-foreground shrink-0">
                              <Tag className="h-3 w-3 mr-1" />
                              Special
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          R{product.price}
                          {product.is_special && product.special_price && (
                            <span className="text-destructive"> → R{product.special_price}</span>
                          )}
                          {" "}· {product.stock} in stock · {product.category}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Product Form */
            <div className="bg-card rounded-xl p-6 card-shadow">
              <h2 className="font-display text-xl font-semibold mb-6">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <form onSubmit={handleSubmitProduct} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Product Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Category <span className="text-destructive">*</span>
                    </label>
                    <Select
                      value={productForm.category}
                      onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_CATEGORIES.filter(c => !c.isSpecial).map((category) => (
                          <SelectItem key={category.slug} value={category.slug}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Description</label>
                  <Textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Describe your product..."
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Price <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Stock Quantity</label>
                    <Input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Featured Product Toggle */}
                <div className="bg-primary/5 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Feature on Homepage</label>
                      <p className="text-xs text-muted-foreground">
                        Show this product in the featured products slider
                      </p>
                    </div>
                    <Switch
                      checked={productForm.is_featured}
                      onCheckedChange={(checked) => 
                        setProductForm({ ...productForm, is_featured: checked })
                      }
                    />
                  </div>
                </div>

                {/* Special/Sale Toggle */}
                <div className="bg-muted/50 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Mark as Special/Sale</label>
                      <p className="text-xs text-muted-foreground">
                        Highlight this product with a sale badge
                      </p>
                    </div>
                    <Switch
                      checked={productForm.is_special}
                      onCheckedChange={(checked) => 
                        setProductForm({ ...productForm, is_special: checked })
                      }
                    />
                  </div>
                  
                  {productForm.is_special && (
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Special Price (optional)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={productForm.special_price}
                        onChange={(e) => 
                          setProductForm({ ...productForm, special_price: e.target.value })
                        }
                        placeholder="Leave empty for badge only"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Must be less than R{productForm.price || "0"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Product Images</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        {uploading ? "Uploading..." : "Click to upload images"}
                      </span>
                    </label>
                  </div>
                  
                  {productForm.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {productForm.images.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fabrics Section - Only show when editing */}
                {editingProduct && (
                  <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      <label className="text-sm font-medium">Fabric Options</label>
                    </div>
                    
                    {/* Existing fabrics */}
                    {fabrics.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {fabrics.map((fabric) => (
                          <div key={fabric.id} className="flex items-center gap-2 bg-card rounded-lg p-2 pr-3">
                            {fabric.image_url ? (
                              <img src={fabric.image_url} alt={fabric.name} className="w-8 h-8 rounded object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            <span className="text-sm">{fabric.name}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteFabric(fabric.id)}
                              className="ml-1 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Add new fabric */}
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground mb-1 block">Fabric Name</label>
                        <Input
                          value={newFabric.name}
                          onChange={(e) => setNewFabric({ ...newFabric, name: e.target.value })}
                          placeholder="e.g. Cotton, Silk, Linen"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Image (optional)</label>
                        <div className="flex gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFabricImageUpload}
                            className="hidden"
                            id="fabric-image-upload"
                            disabled={uploadingFabricImage}
                          />
                          <label
                            htmlFor="fabric-image-upload"
                            className="cursor-pointer px-3 py-2 text-sm border rounded-md bg-card hover:bg-accent"
                          >
                            {uploadingFabricImage ? "..." : newFabric.image_url ? "✓" : "Upload"}
                          </label>
                        </div>
                      </div>
                      <Button type="button" size="sm" onClick={handleAddFabric}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Colors Section - Only show when editing */}
                {editingProduct && (
                  <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      <label className="text-sm font-medium">Color Options</label>
                    </div>
                    
                    {/* Existing colors */}
                    {colors.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {colors.map((color) => (
                          <div key={color.id} className="flex items-center gap-2 bg-card rounded-lg p-2 pr-3">
                            <div 
                              className="w-6 h-6 rounded-full border border-border" 
                              style={{ backgroundColor: color.hex_code }}
                            />
                            <span className="text-sm">{color.name}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteColor(color.id)}
                              className="ml-1 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Add new color */}
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground mb-1 block">Color Name</label>
                        <Input
                          value={newColor.name}
                          onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                          placeholder="e.g. Navy Blue, Forest Green"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Color</label>
                        <input
                          type="color"
                          value={newColor.hex_code}
                          onChange={(e) => setNewColor({ ...newColor, hex_code: e.target.value })}
                          className="w-10 h-10 rounded cursor-pointer border border-border"
                        />
                      </div>
                      <Button type="button" size="sm" onClick={handleAddColor}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Sizes Section - Only show when editing */}
                {editingProduct && (
                  <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      <label className="text-sm font-medium">Size Options</label>
                    </div>
                    
                    {/* Existing sizes */}
                    {sizes.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                          <div key={size.id} className="flex items-center gap-2 bg-card rounded-lg p-2 pr-3">
                            <span className="text-sm font-medium">{size.name}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteSize(size.id)}
                              className="ml-1 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Add new size */}
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground mb-1 block">Size Name</label>
                        <Input
                          value={newSize.name}
                          onChange={(e) => setNewSize({ ...newSize, name: e.target.value })}
                          placeholder="e.g. Small, Medium, Large, XL, King, Queen"
                        />
                      </div>
                      <Button type="button" size="sm" onClick={handleAddSize}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {!editingProduct && (
                  <p className="text-sm text-muted-foreground bg-accent/50 rounded-lg p-3">
                    💡 Save the product first, then edit it to add fabric, color, and size options.
                  </p>
                )}

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={uploading}>
                    {editingProduct ? "Update Product" : "Create Product"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}
        </TabsContent>

        {/* Enquiries Tab */}
        <TabsContent value="enquiries" className="space-y-4">
          {enquiries.length === 0 ? (
            <div className="text-center py-12 bg-muted rounded-lg">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No enquiries yet.</p>
            </div>
          ) : (
            enquiries.map((enquiry) => (
              <div key={enquiry.id} className="bg-card rounded-lg p-4 card-shadow space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{enquiry.customer_name}</h3>
                    <p className="text-sm text-muted-foreground">{enquiry.customer_email}</p>
                    {enquiry.customer_phone && (
                      <p className="text-sm text-muted-foreground">{enquiry.customer_phone}</p>
                    )}
                  </div>
                  <Badge
                    variant={enquiry.status === "pending" ? "secondary" : "default"}
                    className="capitalize"
                  >
                    {enquiry.status}
                  </Badge>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Product: {enquiry.product_name}
                  </p>
                  <p className="text-sm">{enquiry.message}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(enquiry.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    {enquiry.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateEnquiryStatus(enquiry.id, "responded")}
                        >
                          Mark Responded
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateEnquiryStatus(enquiry.id, "completed")}
                        >
                          Complete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
