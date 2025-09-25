// ============================================================================
// src/components/layout/PageHeader.jsx
// ============================================================================

import React from 'react';
import { useLocation } from 'react-router-dom';
import { navigationHelpers } from '../../utils/routes';
import { Breadcrumbs } from '../common/Breadcrumbs';

export const PageHeader = ({
    title,
    subtitle,
    actions,
    showBreadcrumbs = true,
    contentData = {}
}) => {
    const location = useLocation();

    const pageTitle = title || navigationHelpers.getPageTitle(location.pathname, contentData);

    return (
        <div className="page-header">
            {showBreadcrumbs && <Breadcrumbs contentData={contentData} />}

            <div className="page-header-content">
                <div className="page-header-text">
                    <h1 className="page-title">{pageTitle}</h1>
                    {subtitle && (
                        <p className="page-subtitle">{subtitle}</p>
                    )}
                </div>

                {actions && (
                    <div className="page-header-actions">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};