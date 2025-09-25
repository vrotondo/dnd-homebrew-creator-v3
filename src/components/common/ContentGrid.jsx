// ============================================================================
// src/components/common/ContentGrid.jsx - Grid layout for content cards
// ============================================================================

import React from 'react';
import { ContentCard } from './ContentCard';
import { EmptyState } from '../ui';
import { Plus, Search } from 'lucide-react';

export const ContentGrid = ({
    items = [],
    loading = false,
    error = null,
    onView,
    onEdit,
    onDuplicate,
    onDelete,
    onCreate,
    emptyTitle = "No items found",
    emptyDescription = "Get started by creating your first item.",
    emptyIcon = Search,
    className = '',
    cardProps = {}
}) => {
    if (loading) {
        return (
            <div className={`content-grid ${className}`}>
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="content-card-skeleton">
                        <div className="skeleton-header"></div>
                        <div className="skeleton-content"></div>
                        <div className="skeleton-footer"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="content-grid-error">
                <p className="text-red-600">Error loading content: {error}</p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <EmptyState
                title={emptyTitle}
                description={emptyDescription}
                icon={emptyIcon}
                action={onCreate && (
                    <Button onClick={onCreate}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create New
                    </Button>
                )}
            />
        );
    }

    return (
        <div className={`content-grid ${className}`}>
            {items.map(item => (
                <ContentCard
                    key={item.id}
                    item={item}
                    onView={onView}
                    onEdit={onEdit}
                    onDuplicate={onDuplicate}
                    onDelete={onDelete}
                    {...cardProps}
                />
            ))}
        </div>
    );
};