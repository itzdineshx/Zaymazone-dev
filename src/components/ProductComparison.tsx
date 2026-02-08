import { useState } from "react";
import { X, Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Product, getImageUrl } from "@/lib/api";

interface ProductComparisonProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveProduct: (productId: string) => void;
}

export const ProductComparison = ({ 
  products, 
  isOpen, 
  onClose, 
  onRemoveProduct 
}: ProductComparisonProps) => {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  const toggleProductSelection = (productId: string) => {
    const newSelection = new Set(selectedProducts);
    if (newSelection.has(productId)) {
      newSelection.delete(productId);
    } else {
      newSelection.add(productId);
    }
    setSelectedProducts(newSelection);
  };

  const comparisonFeatures = [
    { key: 'price' as keyof Product, label: 'Price', format: (value: any) => `₹${value.toLocaleString()}` },
    { key: 'rating' as keyof Product, label: 'Rating', format: (value: any) => `${value} ⭐` },
    { key: 'reviewCount' as keyof Product, label: 'Reviews', format: (value: any) => `${value} reviews` },
    { key: 'materials' as keyof Product, label: 'Materials', format: (value: any) => Array.isArray(value) ? value.join(', ') : value },
    { key: 'dimensions' as keyof Product, label: 'Dimensions', format: (value: any) => value },
    { key: 'weight' as keyof Product, label: 'Weight', format: (value: any) => value },
    { key: 'shippingTime' as keyof Product, label: 'Shipping', format: (value: any) => value },
    { key: 'stockCount' as keyof Product, label: 'Stock', format: (value: any) => `${value} available` },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Compare Products</DialogTitle>
          <DialogDescription>Compare features and specifications of selected products side by side</DialogDescription>
        </DialogHeader>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products to compare yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add products to comparison from the shop page.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <td className="p-4 font-medium">Feature</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center min-w-[250px]">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => onRemoveProduct(product.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        
                        <img 
                          src={getImageUrl(product.images[0])} 
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg mx-auto mb-2"
                        />
                        <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                        {product.artisan && (
                          <p className="text-xs text-muted-foreground mt-1">
                            by {product.artisan.name}
                          </p>
                        )}
                        
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => toggleProductSelection(product.id)}
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Cart
                          </Button>
                          <Button variant="outline" size="sm">
                            <Heart className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature) => (
                  <tr key={feature.key} className="border-t">
                    <td className="p-4 font-medium bg-muted/50">{feature.label}</td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <span className="text-sm">
                          {feature.format(product[feature.key])}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
                
                {/* Special Features Row */}
                <tr className="border-t">
                  <td className="p-4 font-medium bg-muted/50">Special Features</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {product.featured && (
                          <Badge variant="secondary" className="text-xs">Featured</Badge>
                        )}
                        {product.isHandmade && (
                          <Badge variant="outline" className="text-xs">Handmade</Badge>
                        )}
                        {product.originalPrice && (
                          <Badge variant="destructive" className="text-xs">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                          </Badge>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close Comparison
          </Button>
          {selectedProducts.size > 0 && (
            <Button className="btn-hero">
              Add {selectedProducts.size} item(s) to Cart
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};