import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { categories, priceRanges } from "@/data/products";

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  materials: string[];
  inStockOnly: boolean;
  handmadeOnly: boolean;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  activeFiltersCount: number;
}

const materials = [
  "Cotton", "Silk", "Wool", "Terracotta", "Ceramic", "Brass", "Wood", "Silver"
];

export const ProductFilters = ({ filters, onFiltersChange, activeFiltersCount }: ProductFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: [0, 10000],
      materials: [],
      inStockOnly: false,
      handmadeOnly: false,
    });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Active Filters Count */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied
          </span>
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        </div>
      )}

      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={filters.categories.includes(category.id)}
                onCheckedChange={(checked) => {
                  const updatedCategories = checked
                    ? [...filters.categories, category.id]
                    : filters.categories.filter(id => id !== category.id);
                  updateFilters({ categories: updatedCategories });
                }}
              />
              <label 
                htmlFor={category.id} 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
              >
                {category.name} ({category.count})
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
            max={10000}
            min={0}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹{filters.priceRange[0].toLocaleString()}</span>
            <span>₹{filters.priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Materials */}
      <div>
        <h3 className="font-semibold mb-3">Materials</h3>
        <div className="space-y-2">
          {materials.map((material) => (
            <div key={material} className="flex items-center space-x-2">
              <Checkbox
                id={material}
                checked={filters.materials.includes(material)}
                onCheckedChange={(checked) => {
                  const updatedMaterials = checked
                    ? [...filters.materials, material]
                    : filters.materials.filter(m => m !== material);
                  updateFilters({ materials: updatedMaterials });
                }}
              />
              <label 
                htmlFor={material} 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {material}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Special Filters */}
      <div>
        <h3 className="font-semibold mb-3">Special Filters</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={filters.inStockOnly}
              onCheckedChange={(checked) => updateFilters({ inStockOnly: !!checked })}
            />
            <label 
              htmlFor="in-stock" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              In Stock Only
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="handmade"
              checked={filters.handmadeOnly}
              onCheckedChange={(checked) => updateFilters({ handmadeOnly: !!checked })}
            />
            <label 
              htmlFor="handmade" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Handmade Only
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block w-80 bg-card rounded-2xl p-6 shadow-soft h-fit sticky top-4">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <FilterContent />
      </div>
    </>
  );
};