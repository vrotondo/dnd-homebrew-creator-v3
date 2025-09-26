// src/components/creators/character/ClassCreator.jsx - Complete Modernized Version
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
import { CharacterClass } from '../../../utils/dataModels';
import { ABILITY_SCORES, HIT_DICE, dndUtils } from '../../../utils/dndConstants';

// Simple validation function
const validateCharacterClass = (classData) => {
    const errors = {};
    let isValid = true;

    if (!classData.name || classData.name.trim() === '') {
        errors.name = 'Class name is required';
        isValid = false;
    }

    if (!classData.description || classData.description.trim() === '') {
        errors.description = 'Class description is required';
        isValid = false;
    }

    if (!classData.hitDie) {
        errors.hitDie = 'Hit die is required';
        isValid = false;
    }

    if (!classData.primaryAbility || !Array.isArray(classData.primaryAbility) || classData.primaryAbility.length === 0) {
        errors.primaryAbility = 'At least one primary ability is required';
        isValid = false;
    }

    if (!classData.savingThrows || !Array.isArray(classData.savingThrows) || classData.savingThrows.length !== 2) {
        errors.savingThrows = 'Exactly 2 saving throw proficiencies are required';
        isValid = false;
    }

    return { isValid, errors };
};

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
    CheckCircle,
    X
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

        // Real-time validation - simplified for now
        if (touched[field]) {
            // Simple field-level validation
            let error = null;
            if (field === 'name' && (!value || value.trim() === '')) {
                error = 'Class name is required';
            } else if (field === 'description' && (!value || value.trim() === '')) {
                error = 'Class description is required';
            } else if (field === 'hitDie' && !value) {
                error = 'Hit die is required';
            } else if (field === 'primaryAbility' && (!value || !Array.isArray(value) || value.length === 0)) {
                error = 'At least one primary ability is required';
            } else if (field === 'savingThrows' && (!value || !Array.isArray(value) || value.length !== 2)) {
                error = 'Exactly 2 saving throw proficiencies are required';
            }

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

    const getStepIcon = (step, status) => {
        if (status === 'completed') return <CheckCircle className="w-5 h-5" />;
        if (status === 'current') return <div className="w-2 h-2 bg-blue-600 rounded-full" />;
        return <div className="w-2 h-2 bg-gray-300 rounded-full" />;
    };

    if (loading) {
        return <LoadingSpinner message="Loading class data..." />;
    }

    return (
        <NavigationGuard hasUnsavedChanges={hasUnsavedChanges}>
            <div className="class-creator min-h-screen bg-gray-50 dark:bg-gray-900">
                <PageHeader
                    title={isEditing ? `Edit ${classData.name || 'Class'}` : 'Create New Class'}
                    subtitle={isEditing
                        ? 'Modify your existing character class'
                        : 'Design a new D&D character class with unique abilities and features'
                    }
                    actionButton={
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExit}
                            className="gap-2"
                        >
                            <X className="w-4 h-4" />
                            Exit
                        </Button>
                    }
                />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Steps Sidebar */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-6">
                                <CardHeader>
                                    <h3 className="text-lg font-semibold">Progress</h3>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {STEPS.map((step) => {
                                        const status = getStepStatus(step.id);
                                        return (
                                            <button
                                                key={step.id}
                                                onClick={() => goToStep(step.id)}
                                                disabled={status === 'disabled'}
                                                className={`
                                                    w-full text-left p-3 rounded-lg border transition-all duration-200
                                                    ${status === 'current'
                                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                                                        : status === 'completed'
                                                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30'
                                                            : status === 'available'
                                                                ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                                : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-600 opacity-50 cursor-not-allowed'
                                                    }
                                                `}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {getStepIcon(step.id, status)}
                                                    <div className="min-w-0 flex-1">
                                                        <div className={`text-sm font-medium ${status === 'current' ? 'text-blue-900 dark:text-blue-100' :
                                                                status === 'completed' ? 'text-green-900 dark:text-green-100' :
                                                                    status === 'available' ? 'text-gray-900 dark:text-gray-100' :
                                                                        'text-gray-500 dark:text-gray-400'
                                                            }`}>
                                                            {step.title}
                                                        </div>
                                                        <div className={`text-xs mt-1 ${status === 'current' ? 'text-blue-600 dark:text-blue-300' :
                                                                status === 'completed' ? 'text-green-600 dark:text-green-300' :
                                                                    status === 'available' ? 'text-gray-500 dark:text-gray-400' :
                                                                        'text-gray-400 dark:text-gray-500'
                                                            }`}>
                                                            {step.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}

                                    {/* Progress Indicator */}
                                    <div className="pt-4 border-t">
                                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            <span>Progress</span>
                                            <span>{Math.round((currentStep / STEPS.length) * 100)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <Card>
                                <CardHeader className="border-b">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold">
                                                Step {currentStep}: {STEPS[currentStep - 1].title}
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                {STEPS[currentStep - 1].description}
                                            </p>
                                        </div>

                                        {hasUnsavedChanges && (
                                            <Badge variant="warning" className="gap-1">
                                                <AlertTriangle className="w-3 h-3" />
                                                Unsaved Changes
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6">
                                    {renderStepContent()}
                                </CardContent>

                                {/* Navigation Footer */}
                                <div className="border-t bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <Button
                                            variant="outline"
                                            onClick={prevStep}
                                            disabled={currentStep === 1}
                                            className="gap-2"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Previous
                                        </Button>

                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleSave(false)}
                                                disabled={saving}
                                                className="gap-2"
                                            >
                                                <Save className="w-4 h-4" />
                                                {saving ? 'Saving...' : 'Save Draft'}
                                            </Button>

                                            {currentStep < STEPS.length ? (
                                                <Button
                                                    onClick={nextStep}
                                                    className="gap-2"
                                                >
                                                    Next
                                                    <ArrowRight className="w-4 h-4" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => handleSave(true)}
                                                    disabled={saving}
                                                    className="gap-2"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    {saving ? 'Saving...' : 'Save & Finish'}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Exit Confirmation Dialog */}
                <ConfirmDialog
                    isOpen={showExitDialog}
                    onClose={() => setShowExitDialog(false)}
                    onConfirm={confirmExit}
                    title="Unsaved Changes"
                    message="You have unsaved changes. Are you sure you want to exit? Your progress will be lost."
                    confirmText="Exit Without Saving"
                    confirmVariant="danger"
                />
            </div>
        </NavigationGuard>
    );
}