import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Star } from "lucide-react";
import { SearchFilters as Filters } from "@/types/marketplace";
import { categories, locations } from "@/lib/mockData";

interface SearchFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  className?: string;
}

export const SearchFilters = ({
  filters,
  onFiltersChange,
  className,
}: SearchFiltersProps) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([
    filters.priceMin || 0,
    filters.priceMax || 100,
  ]);

  const updateFilters = (newFilters: Partial<Filters>) => {
    onFiltersChange({ ...filters, ...newFilters });
  };

  const clearFilters = () => {
    onFiltersChange({});
    setPriceRange([0, 100]);
  };

  const hasActiveFilters = () => {
    return Object.keys(filters).some((key) => {
      const value = filters[key as keyof Filters];
      return (
        value !== undefined &&
        value !== "" &&
        value !== "All Categories" &&
        value !== "All Areas"
      );
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category && filters.category !== "All Categories") count++;
    if (filters.location && filters.location !== "All Areas") count++;
    if (filters.priceMin || filters.priceMax) count++;
    if (filters.rating) count++;
    if (filters.availability) count++;
    if (filters.newArrivals) count++;
    return count;
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Category</Label>
        <Select
          value={filters.category || "All Categories"}
          onValueChange={(value) =>
            updateFilters({
              category: value === "All Categories" ? undefined : value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Location</Label>
        <Select
          value={filters.location || "All Areas"}
          onValueChange={(value) =>
            updateFilters({
              location: value === "All Areas" ? undefined : value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Price Range</Label>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            onValueCommit={(value) =>
              updateFilters({ priceMin: value[0], priceMax: value[1] })
            }
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Minimum Rating</Label>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.rating === rating}
                onCheckedChange={(checked) =>
                  updateFilters({ rating: checked ? rating : undefined })
                }
              />
              <Label
                htmlFor={`rating-${rating}`}
                className="flex items-center gap-1 cursor-pointer"
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm">& up</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Quick Filters</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="availability"
              checked={filters.availability || false}
              onCheckedChange={(checked) =>
                updateFilters({ availability: checked })
              }
            />
            <Label htmlFor="availability" className="cursor-pointer">
              In Stock Only
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="new-arrivals"
              checked={filters.newArrivals || false}
              onCheckedChange={(checked) =>
                updateFilters({ newArrivals: checked })
              }
            />
            <Label htmlFor="new-arrivals" className="cursor-pointer">
              New Arrivals
            </Label>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters() && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className={className}>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {getActiveFilterCount() > 0 && (
            <Badge className="ml-2">{getActiveFilterCount()}</Badge>
          )}
        </Button>
      </div>

      {/* Sort By */}
      <div className="mb-4">
        <Select
          value={filters.sortBy || "newest"}
          onValueChange={(value) =>
            updateFilters({ sortBy: value as Filters["sortBy"] })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="popularity">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Filters */}
      <Card className="hidden lg:block">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {getActiveFilterCount() > 0 && (
              <Badge>{getActiveFilterCount()}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FilterContent />
        </CardContent>
      </Card>

      {/* Mobile Filters */}
      {showMobileFilters && (
        <Card className="lg:hidden mb-4">
          <CardContent className="pt-6">
            <FilterContent />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
