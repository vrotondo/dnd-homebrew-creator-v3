// ============================================================================
// src/components/common/NavigationGuard.jsx  
// ============================================================================

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, Button } from '../ui';
import { AlertTriangle } from 'lucide-react';

export const NavigationGuard = ({
    hasUnsavedChanges,
    message = "You have unsaved changes. Are you sure you want to leave?",
    children
}) => {
    const [showModal, setShowModal] = React.useState(false);
    const [pendingNavigation, setPendingNavigation] = React.useState(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!hasUnsavedChanges) return;

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = message;
            return message;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges, message]);

    const handleNavigation = (path) => {
        if (hasUnsavedChanges) {
            setPendingNavigation(path);
            setShowModal(true);
        } else {
            navigate(path);
        }
    };

    const confirmNavigation = () => {
        if (pendingNavigation) {
            navigate(pendingNavigation);
        }
        setShowModal(false);
        setPendingNavigation(null);
    };

    const cancelNavigation = () => {
        setShowModal(false);
        setPendingNavigation(null);
    };

    return (
        <>
            {React.cloneElement(children, { onNavigate: handleNavigation })}

            <Modal
                isOpen={showModal}
                onClose={cancelNavigation}
                title="Unsaved Changes"
                size="sm"
            >
                <div className="text-center p-4">
                    <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-600 mb-6">{message}</p>
                    <div className="flex space-x-3 justify-center">
                        <Button
                            variant="outline"
                            onClick={cancelNavigation}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={confirmNavigation}
                        >
                            Leave Page
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};