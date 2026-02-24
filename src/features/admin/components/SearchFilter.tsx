import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface FilterOption {
    value: string;
    label: string;
}

interface SearchFilterProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    filterValue?: string;
    onFilterChange?: (value: string) => void;
    filterOptions?: FilterOption[];
    filterLabel?: string;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
    searchValue,
    onSearchChange,
    searchPlaceholder = 'Search...',
    filterValue,
    onFilterChange,
    filterOptions,
    filterLabel = 'Filter',
}) => {
    return (
        <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/25" />
                <input
                    type="text"
                    value={searchValue}
                    onChange={e => onSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal placeholder:text-charcoal/25 focus:outline-none focus:border-moss/40 transition-colors bg-white"
                />
            </div>

            {/* Filter dropdown */}
            {filterOptions && onFilterChange && (
                <div className="relative">
                    <select
                        value={filterValue}
                        onChange={e => onFilterChange(e.target.value)}
                        className="appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors bg-white cursor-pointer"
                        aria-label={filterLabel}
                    >
                        {filterOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 pointer-events-none" />
                </div>
            )}
        </div>
    );
};
