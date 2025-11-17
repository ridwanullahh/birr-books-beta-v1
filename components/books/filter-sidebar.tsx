'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { BRAND_COLORS } from '@/lib/constants';

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
  isOpen?: boolean;
  onClose?: () => void;
  categories?: Array<{ name: string; value: string }>;
  authors?: Array<{ name: string; value: string }>;
  languages?: string[];
  formats?: string[];
}

export function FilterSidebar({
  onFilterChange,
  isOpen = true,
  onClose,
  categories = [],
  authors = [],
  languages = [],
  formats = []
}: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const applyFilters = () => {
    onFilterChange({
      priceMin: priceRange[0],
      priceMax: priceRange[1],
      category: selectedCategory || undefined,
      format: selectedFormat || undefined,
      rating: selectedRating || undefined,
      language: selectedLanguage || undefined
    });
    onClose?.();
  };

  const clearFilters = () => {
    setPriceRange([0, 100]);
    setSelectedCategory('');
    setSelectedFormat('');
    setSelectedRating(0);
    setSelectedLanguage('');
    onFilterChange({});
  };

  const sidebarClass = `
    fixed md:relative md:block
    ${isOpen ? 'block' : 'hidden'}
    left-0 top-0 h-screen md:h-auto
    w-64 md:w-full
    bg-white md:bg-transparent
    z-40 md:z-auto
    border-r md:border-r-0
    overflow-y-auto md:overflow-y-visible
    p-4 md:p-0
  `;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden z-30"
          onClick={onClose}
        />
      )}

      <aside className={sidebarClass}>
        {/* Close button for mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden absolute top-4 right-4"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        <div className="space-y-6 mt-12 md:mt-0">
          {/* Price Filter */}
          <div>
            <h3 className="font-semibold text-dark mb-3">Price Range</h3>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={0}
              max={200}
              step={5}
            />
            <div className="flex justify-between mt-2 text-sm text-gray">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div>
              <h3 className="font-semibold text-dark mb-3">Category</h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <label key={cat.value} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selectedCategory === cat.value}
                      onCheckedChange={() =>
                        setSelectedCategory(selectedCategory === cat.value ? '' : cat.value)
                      }
                    />
                    <span className="text-sm text-gray">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Format Filter */}
          {formats.length > 0 && (
            <div>
              <h3 className="font-semibold text-dark mb-3">Format</h3>
              <div className="space-y-2">
                {formats.map(format => (
                  <label key={format} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selectedFormat === format}
                      onCheckedChange={() =>
                        setSelectedFormat(selectedFormat === format ? '' : format)
                      }
                    />
                    <span className="text-sm text-gray">{format}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Rating Filter */}
          <div>
            <h3 className="font-semibold text-dark mb-3">Rating</h3>
            <div className="space-y-2">
              {[4, 3, 2, 1].map(rating => (
                <label key={rating} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={selectedRating === rating}
                    onCheckedChange={() =>
                      setSelectedRating(selectedRating === rating ? 0 : rating)
                    }
                  />
                  <span className="text-sm text-gray">{rating}+ stars</span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-2 pt-4">
            <Button
              onClick={applyFilters}
              className="w-full text-white"
              style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
            >
              Apply Filters
            </Button>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="w-full"
            >
              Clear All
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
