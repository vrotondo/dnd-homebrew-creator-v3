// ============================================================================
// src/components/common/SearchAndFilter.jsx - Reusable search/filter component
// ============================================================================

import React, { useState } from 'react';
import { SearchInput, Button, Badge } from '../ui';
import { Filter, X, SortAsc, SortDesc } from 'lucide-react';

export const SearchAndFilter = ({
    searchTerm,
    onSearchChange,
    filters = {},
    onFiltersChange,
    availableFilters = [],
    sortBy,
    sortDirection = 'asc',
    onSortChange,
    availableSorts = [],
    showClearAll = true,
    placeholder = "Search..."
}) => {
    const [showFilters, setShowFilters] = useState(false);

    const activeFilterCount = Object.values(filters).filter(v =>
        v !== null && v !== undefined && v !== '' &&
        (!Array.isArray(v) || v.length > 0)
    ).length;

    const clearAllFilters = () => {
        onSearchChange?.('');
        onFiltersChange?.({});
        if (onSortChange) {
            onSortChange('name', 'asc');
        }
    };

    const updateFilter = (key, value) => {
        onFiltersChange?.({
            ...filters,
            [key]: value
        });
    };

    return (
        <div className="search-and-filter">
            {/* Search Bar */}
            <div className="search-bar">
                <SearchInput
                    placeholder={placeholder}
                    value={searchTerm || ''}
                    onChange={onSearchChange}
                    onClear={() => onSearchChange?.('')}
                />

                {/* Filter Toggle */}
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="filter-toggle"
                >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                        <Badge variant="primary" size="sm" className="ml-2">
                            {activeFilterCount}
                        </Badge>
                    )}
                </Button>

                {/* Sort Dropdown */}
                {availableSorts.length > 0 && (
                    <select
                        value={`${sortBy}-${sortDirection}`}
                        onChange={(e) => {
                            const [field, direction] = e.target.value.split('-');
                            onSortChange?.(field, direction);
                        }}
                        className="sort-select"
                    >
                        {availableSorts.map(sort => (
                            <React.Fragment key={sort.field}>
                                <option value={`${sort.field}-asc`}>
                                    {sort.label} (A-Z)
                                </option>
                                <option value={`${sort.field}-desc`}>
                                    {sort.label} (Z-A)
                                </option>
                            </React.Fragment>
                        ))}
                    </select>
                )}

                {/* Clear All */}
                {showClearAll && (searchTerm || activeFilterCount > 0) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                    >
                        <X className="w-4 h-4 mr-1" />
                        Clear
                    </Button>
                )}
            </div>

            {/* Filter Panel */}
            {showFilters && availableFilters.length > 0 && (
                <div className="filter-panel">
                    <div className="filter-grid">
                        {availableFilters.map(filter => (
                            <div key={filter.key} className="filter-item">
                                <label className="filter-label">
                                    {filter.label}
                                </label>

                                {filter.type === 'select' && (
                                    <select
                                        value={filters[filter.key] || ''}
                                        onChange={(e) => updateFilter(filter.key, e.target.value || null)}
                                        className="filter-select"
                                    >
                                        <option value="">All</option>
                                        {filter.options?.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {filter.type === 'multiselect' && (
                                    <div className="filter-checkboxes">
                                        {filter.options?.map(option => (
                                            <label key={option.value} className="filter-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={(filters[filter.key] || []).includes(option.value)}
                                                    onChange={(e) => {
                                                        const current = filters[filter.key] || [];
                                                        const updated = e.target.checked
                                                            ? [...current, option.value]
                                                            : current.filter(v => v !== option.value);
                                                        updateFilter(filter.key, updated.length > 0 ? updated : null);
                                                    }}
                                                />
                                                {option.label}
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {filter.type === 'range' && (
                                    <div className="filter-range">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            min={filter.min}
                                            max={filter.max}
                                            value={filters[filter.key]?.min || ''}
                                            onChange={(e) => updateFilter(filter.key, {
                                                ...filters[filter.key],
                                                min: e.target.value ? parseInt(e.target.value) : null
                                            })}
                                        />
                                        <span>-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            min={filter.min}
                                            max={filter.max}
                                            value={filters[filter.key]?.max || ''}
                                            onChange={(e) => updateFilter(filter.key, {
                                                ...filters[filter.key],
                                                max: e.target.value ? parseInt(e.target.value) : null
                                            })}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};