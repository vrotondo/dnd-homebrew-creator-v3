// src/components/layout/PageHeader.jsx - Simple PageHeader component
import React from 'react';

export const PageHeader = ({
    title,
    subtitle,
    actionButton,
    children
}) => {
    return (
        <div className="page-header mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {subtitle}
                        </p>
                    )}
                </div>

                {actionButton && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {actionButton}
                    </div>
                )}
            </div>

            {children}
        </div>
    );
};