// ============================================================================
// src/components/common/ConfirmDialog.jsx - Reusable confirmation dialog
// ============================================================================

import React from 'react';
import { Modal, Button } from '../ui';
import { AlertTriangle, Trash2, Copy, Download } from 'lucide-react';

export const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
    icon = null
}) => {
    const getIcon = () => {
        if (icon) return icon;

        switch (variant) {
            case 'danger':
                return <AlertTriangle className="w-12 h-12 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="w-12 h-12 text-yellow-500" />;
            default:
                return <AlertTriangle className="w-12 h-12 text-blue-500" />;
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
        >
            <div className="text-center p-4">
                <div className="mb-4">
                    {getIcon()}
                </div>

                <p className="text-gray-600 mb-6">
                    {message}
                </p>

                <div className="flex space-x-3 justify-center">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
