import React from 'react';
import type { Category } from '../types';

interface CategoryFilterProps {
    categories: Category[];
    activeCategory: Category;
    onSelectCategory: (category: Category) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categories,
    activeCategory,
    onSelectCategory,
}) => {
    return (
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-12">
            {categories.map((category) => {
                const isActive = activeCategory === category;
                return (
                    <button
                        key={category}
                        onClick={() => onSelectCategory(category)}
                        className={`min-h-[44px] min-w-[44px] px-6 py-2 rounded-full text-sm font-sans tracking-wide transition-all duration-300 border ${isActive
                            ? 'bg-moss border-moss text-stone dark:bg-stone dark:border-stone dark:text-moss'
                            : 'bg-transparent border-charcoal/20 text-charcoal/70 hover:border-charcoal/50 hover:text-charcoal dark:border-stone/20 dark:text-stone/70 dark:hover:border-stone/50 dark:hover:text-stone'
                            }`}
                        aria-pressed={isActive}
                    >
                        {category}
                    </button>
                );
            })}
        </div>
    );
};
