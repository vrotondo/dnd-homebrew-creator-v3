// ============================================================================
// src/components/common/LoadingScreen.jsx - Full screen loading
// ============================================================================

import React from 'react';
import { Loader2, Scroll } from 'lucide-react';

export const LoadingScreen = ({ message = "Loading...", showLogo = true }) => {
    return (
        <div className="loading-screen">
            <div className="loading-content">
                {showLogo && (
                    <div className="loading-logo">
                        <div className="logo-container">
                            <Scroll className="logo-icon" />
                        </div>
                        <h2 className="logo-text">D&D Homebrew Creator</h2>
                    </div>
                )}

                <div className="loading-spinner-container">
                    <Loader2 className="loading-spinner-large" />
                    <p className="loading-message">{message}</p>
                </div>
            </div>
        </div>
    );
};