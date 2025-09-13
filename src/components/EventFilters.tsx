import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";

interface EventFiltersProps {
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string) => void;
  onLocationChange: (location: string) => void;
  searchValue: string;
  selectedCategory: string;
  selectedLocation: string;
  onClearFilters: () => void;
}

const categories = [
  "All Categories",
  "Music", 
  "Tech", 
  "Sports", 
  "Arts", 
  "Food & Drink",
  "Business",
  "Health & Wellness",
  "Education",
  "Community",
  "Entertainment"
];

const EventFilters = ({
  onSearchChange,
  onCategoryChange, 
  onLocationChange,
  searchValue,
  selectedCategory,
  selectedLocation,
  onClearFilters
}: EventFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = searchValue || selectedCategory !== "All Categories" || selectedLocation;

  return (
    <div className="space-y-4">
      {/* Search Bar - Always Visible */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search events by title, description, or location..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              Active
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Expandable Filters */}
      {isExpanded && (
        <div className="grid gap-4 md:grid-cols-2 p-4 border rounded-lg bg-muted/50">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input
              placeholder="Filter by location..."
              value={selectedLocation}
              onChange={(e) => onLocationChange(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchValue && (
            <Badge variant="outline" className="gap-1">
              Search: "{searchValue}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onSearchChange("")}
              />
            </Badge>
          )}
          {selectedCategory !== "All Categories" && (
            <Badge variant="outline" className="gap-1">
              {selectedCategory}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onCategoryChange("All Categories")}
              />
            </Badge>
          )}
          {selectedLocation && (
            <Badge variant="outline" className="gap-1">
              Location: "{selectedLocation}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onLocationChange("")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default EventFilters;