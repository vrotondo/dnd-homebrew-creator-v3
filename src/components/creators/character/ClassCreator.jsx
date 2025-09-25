// src/components/creators/character/ClassCreator.jsx - Modernized Version
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardContent,
    Button,
    Input,
    Badge,
    LoadingSpinner
} from '../../ui';
import {
    AbilityScoreSelector,
    SkillSelector,
    HitDieSelector,
    ProficiencySelector
} from '../../common/DndFormComponents';
import { PageHeader } from '../../layout/PageHeader';
import { NavigationGuard } from '../../common/NavigationGuard';
import { ConfirmDialog } from '../../common/ConfirmDialog';

// Import hooks and utilities
import { useClasses } from '../../../hooks/useStorage';
import { validateCharacterClass, validateField } from '../../../utils/validation';
import { CharacterClass } from '../../../utils/dataModels';
import { ABILITY_SCORES, HIT_DICE, dndUtils } from '../../../utils/dndConstants';

// Import step components
import BasicInfoStep from './steps/BasicInfoStep';
import ProficienciesStep from './steps/ProficienciesStep';
import EquipmentStep from './steps/EquipmentStep';
import FeaturesStep from './steps/FeaturesStep';
import SpellcastingStep from './steps/SpellcastingStep';
import PreviewStep from './steps/PreviewStep';

import {
    Save,
    ArrowLeft,
    ArrowRight,
    Eye,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';

const STEPS = [
    { id: 1, title: 'Basic Info', description: 'Name, description, and core mechanics' },
    { id: 2, title: 'Proficiencies', description: 'Skills, saves, armor, and weapons' },
    { id: 3, title: 'Equipment', description: 'Starting equipment and options' },
    { id: 4, title: 'Features', description: 'Class features by level' },
    { id: 5, title: 'Spellcasting', description: 'Magical abilities (optional)' },
    { id: 6, title: 'Preview', description: 'Review and finalize' }
];

export default function ClassCreator() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    // Hooks
    const { save, getById } = useClasses();

    // State
    const [currentStep, setCurrentStep] = useState(1);
    const [classData, setClassData] = useState(() => ({ ...CharacterClass }));
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showExitDialog, setShowExitDialog] = useState(false);

    // Load existing class data
    useEffect(() => {
        if (isEditing) {
            const existingClass = getById(id);
            if (existingClass) {
                setClassData(existingClass);
            } else {
                navigate('/classes'); // Class not found
            }
        }
    }, [id, isEditing, getById, navigate]);

    // Track unsaved changes
    useEffect(() => {
        setHasUnsavedChanges(
            JSON.stringify(classData) !== JSON.stringify(CharacterClass)
        );
    }, [classData]);

    // Validation
    const validateCurrentStep = () => {
        const stepFields = getStepFields(currentStep);
        const stepData = {};
        stepFields.forEach(field => {
            stepData[field] = classData[field];
        });

        const validation = validateCharacterClass(stepData);
        const stepErrors = {};

        stepFields.forEach(field => {
            if (validation.errors[field]) {
                stepErrors[field] = validation.errors[field];
            }
        });

        setErrors(stepErrors);
        return Object.keys(stepErrors).length === 0;
    };

    const getStepFields = (step) => {
        switch (step) {
            case 1: return ['name', 'description', 'hitDie', 'primaryAbility'];
            case 2: return ['savingThrows', 'skillChoices'];
            case 3: return ['startingEquipment'];
            case 4: return ['features'];
            case 5: return ['spellcasting'];
            default: return [];
        }
    };

    // Step navigation
    const canMoveToStep = (targetStep) => {
        if (targetStep <= currentStep) return true;

        // Validate all previous steps
        for (let step = 1; step < targetStep; step++) {
            const stepFields = getStepFields(step);
            if (stepFields.length === 0) continue;

            const stepData = {};
            stepFields.forEach(field => {
                stepData[field] = classData[field];
            });

            const validation = validateCharacterClass(stepData);
            if (!validation.isValid) return false;
        }

        return true;
    };

    const nextStep = () => {
        if (validateCurrentStep() && currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const goToStep = (step) => {
        if (canMoveToStep(step)) {
            setCurrentStep(step);
        }
    };

    // Data updates
    const updateClassData = (updates) => {
        setClassData(prev => ({
            ...prev,
            ...updates,
            updatedAt: new Date().toISOString()
        }));

        // Clear errors for updated fields
        const clearedErrors = { ...errors };
        Object.keys(updates).forEach(key => {
            delete clearedErrors[key];
        });
        setErrors(clearedErrors);
    };

    const handleFieldChange = (field, value) => {
        updateClassData({ [field]: value });
        setTouched(prev => ({ ...prev, [field]: true }));

        // Real-time validation
        if (touched[field]) {
            const error = validateField(field, value, classData);
            setErrors(prev => ({
                ...prev,
                [field]: error
            }));
        }
    };

    // Save functionality
    const handleSave = async (shouldNavigate = true) => {
        setSaving(true);

        try {
            const validation = validateCharacterClass(classData);

            if (!validation.isValid) {
                setErrors(validation.errors);
                setCurrentStep(1); // Go to first step with errors
                setSaving(false);
                return;
            }

            const savedId = await save(classData);

            if (savedId) {
                setHasUnsavedChanges(false);
                if (shouldNavigate) {
                    navigate(`/classes/${savedId}`);
                }
            }
        } catch (error) {
            console.error('Failed to save class:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleExit = () => {
        if (hasUnsavedChanges) {
            setShowExitDialog(true);
        } else {
            navigate('/classes');
        }
    };

    const confirmExit = () => {
        setShowExitDialog(false);
        navigate('/classes');
    };

    // Render step content
    const renderStepContent = () => {
        const commonProps = {
            classData,
            updateClassData,
            handleFieldChange,
            errors,
            touched
        };

        switch (currentStep) {
            case 1:
                return <BasicInfoStep {...commonProps} />;
            case 2:
                return <ProficienciesStep {...commonProps} />;
            case 3:
                return <EquipmentStep {...commonProps} />;
            case 4:
                return <FeaturesStep {...commonProps} />;
            case 5:
                return <SpellcastingStep {...commonProps} />;
            case 6:
                return <PreviewStep {...commonProps} />;
            default:
                return null;
        }
    };

    const getStepStatus = (step) => {
        if (step < currentStep) return 'completed';
        if (step === currentStep) return 'current';
        if (canMoveToStep(step)) return 'available';
        return 'disabled';
    };

    if (loading) {
        return <LoadingSpinner message="Loading class data..." />;
    }

    return (
        <NavigationGuard hasUnsavedChanges={hasUnsavedChanges}>
            <div className="class-creator">
                <PageHeader
                    title={isEditing ? `Edit ${classData.name || 'Class'}` : 'Create New Class'}
                    subtitle={isEditing ? 'Modify your homebrew class' : 'Design a custom D&D 5E character class'}
                    actions={
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleExit}
                                disabled={saving}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => handleSave()}
                                loading={saving}
                                disabled={!classData.name || Object.keys(errors).length > 0}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isEditing ? 'Save Changes' : 'Create Class'}
                            </Button>
                        </div>
                    }
                />

                <div className="class-creator-content">
                    {/* Step Navigation */}
                    <Card className="step-navigation">
                        <CardContent className="p-4">
                            <div className="steps-list">
                                {STEPS.map((step) => {
                                    const status = getStepStatus(step.id);

                                    return (
                                        <button
                                            key={step.id}
                                            onClick={() => goToStep(step.id)}
                                            disabled={status === 'disabled'}
                                            className={`step-item step-${status}`}
                                        >
                                            <div className="step-number">
                                                {status === 'completed' ? (
                                                    <CheckCircle className="w-4 h-4" />
                                                ) : status === 'current' ? (
                                                    <div className="step-current-indicator" />
                                                ) : (
                                                    step.id
                                                )}
                                            </div>
                                            <div className="step-info">
                                                <div className="step-title">{step.title}</div>
                                                <div className="step-description">{step.description}</div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Content */}
                    <div className="step-content">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            Step {currentStep}: {STEPS[currentStep - 1].title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {STEPS[currentStep - 1].description}
                                        </p>
                                    </div>

                                    {Object.keys(errors).length > 0 && (
                                        <Badge variant="error">
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            {Object.keys(errors).length} Error(s)
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent>
                                {renderStepContent()}
                            </CardContent>
                        </Card>

                        {/* Step Navigation Buttons */}
                        <div className="step-navigation-buttons">
                            <Button
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Previous
                            </Button>

                            <div className="flex gap-2">
                                {currentStep === STEPS.length ? (
                                    <>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleSave(false)}
                                            disabled={saving}
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            Save Draft
                                        </Button>
                                        <Button
                                            onClick={() => handleSave()}
                                            loading={saving}
                                            disabled={!classData.name || Object.keys(errors).length > 0}
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {isEditing ? 'Save Changes' : 'Create Class'}
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        onClick={nextStep}
                                        disabled={!validateCurrentStep()}
                                    >
                                        Next
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Exit Confirmation */}
                <ConfirmDialog
                    isOpen={showExitDialog}
                    onClose={() => setShowExitDialog(false)}
                    onConfirm={confirmExit}
                    title="Unsaved Changes"
                    message="You have unsaved changes. Are you sure you want to leave? Your changes will be lost."
                    confirmText="Leave"
                    cancelText="Stay"
                    variant="warning"
                />
            </div>
        </NavigationGuard>
    );
}