// ============================================================================
// src/components/common/Breadcrumbs.jsx
// ============================================================================

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbs } from '../../utils/routes';

export const Breadcrumbs = ({ contentData = {} }) => {
    const location = useLocation();
    const breadcrumbs = generateBreadcrumbs(location.pathname, contentData);

    if (breadcrumbs.length <= 1) return null;

    return (
        <nav className="breadcrumbs">
            <ol className="breadcrumbs-list">
                {breadcrumbs.map((crumb, index) => (
                    <li key={crumb.path} className="breadcrumb-item">
                        {index === 0 ? (
                            <Link to={crumb.path} className="breadcrumb-link breadcrumb-home">
                                <Home className="breadcrumb-icon" />
                                <span className="sr-only">{crumb.name}</span>
                            </Link>
                        ) : index === breadcrumbs.length - 1 ? (
                            <span className="breadcrumb-current">
                                {crumb.name}
                            </span>
                        ) : (
                            <Link to={crumb.path} className="breadcrumb-link">
                                {crumb.name}
                            </Link>
                        )}
                        {index < breadcrumbs.length - 1 && (
                            <ChevronRight className="breadcrumb-separator" />
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};