// src/components/creators/character/ClassCreator.jsx - CLEAN FIX - Remove inline components, use existing step files
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardContent,
    Button,
    Input,
    Badge
} from '../../ui';
import {
    Save,
    ArrowLeft,
    ArrowRight,
    Eye,
    CheckCircle,
    X,
    Sword,
    Shield,
    Star,
    Plus,
    Trash2,
    Package,
    Wand2,
    Heart,
    Brain,
    Zap,
    AlertCircle,
    Info
} from 'lucide-react';

// Import your existing step components
import BasicInfoStep from './steps/BasicInfoStep';
import ProficienciesStep from './steps/ProficienciesStep';
import EquipmentStep from './steps/EquipmentStep';
import FeaturesStep from './steps/FeaturesStep';
import SpellcastingStep from './steps/SpellcastingStep';
import PreviewStep from './steps/PreviewStep';

// Constants
const ABILITY_SCORES = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];

// Default class data
const defaultClassData = {
    id: null,
    name: '',
    description: '',
    hitDie: null,
    primaryAbility: [],
    savingThrows: [],
    skillChoices: { count: 2, options: [] },
    proficiencies: {
        armor: [],
        weapons: [],
        tools: [],
        languages: 0
    },
    startingEquipment: {
        standard: [],
        options: [],
        startingGold: '',
        alternateRule: ''
    },
    features: {},
    spellcasting: {
        enabled: false,
        ability: '',
        type: 'full',
        startLevel: 1,
        focusType: '',
        ritualCasting: false,
        spellList: 'custom'
    },
    createdAt: null,
    updatedAt: null
};

// Storage functions (using localStorage like your existing system)
const getStoredClasses = () => {
    try {
        return JSON.parse(localStorage.getItem('dnd-homebrew-classes') || '[]');
    } catch {
        return [];
    }
};

const saveClass = (classData) => {
    try {
        const classes = getStoredClasses();
        const id = classData.id || Date.now().toString();
        const now = new Date().toISOString();

        const newClass = {
            ...classData,
            id,
            createdAt: classData.createdAt || now,
            updatedAt: now
        };

        const existingIndex = classes.findIndex(c => c.id === id);
        if (existingIndex >= 0) {
            classes[existingIndex] = newClass;
        } else {
            classes.push(newClass);
        }

        localStorage.setItem('dnd-homebrew-classes', JSON.stringify(classes));
        return id;
    } catch (error) {
        console.error('Failed to save class:', error);
        return null;
    }
};

const getClassById = (id) => {
    const classes = getStoredClasses();
    return classes.find(c => c.id === id);
};

// Validation function
const validateClassData = (classData, step = null) => {
    const errors = {};
    let isValid = true;

    if (!step || step === 1) {
        if (!classData.name?.trim()) {
            errors.name = 'Class name is required';
            isValid = false;
        }
        if (!classData.description?.trim()) {
            errors.description = 'Class description is required';
            isValid = false;
        }
        if (!classData.hitDie) {
            errors.hitDie = 'Hit die selection is required';
            isValid = false;
        }
        if (!classData.primaryAbility?.length) {
            errors.primaryAbility = 'At least one primary ability is required';
            isValid = false;
        }
    }

    if (!step || step === 2) {
        if (classData.savingThrows?.length !== 2) {
            errors.savingThrows = 'Exactly 2 saving throw proficiencies are required';
            isValid = false;
        }
    }

    return { isValid, errors };
};

export default function ClassCreator() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    const [currentStep, setCurrentStep] = useState(1);
    const [classData, setClassData] = useState(defaultClassData);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [saving, setSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const steps = [
        { id: 1, title: 'Basic Info', description: 'Name, description, and core mechanics', icon: Brain },
        { id: 2, title: 'Proficiencies', description: 'Skills, saves, armor, and weapons', icon: Shield },
        { id: 3, title: 'Equipment', description: 'Starting equipment and options', icon: Package },
        { id: 4, title: 'Features', description: 'Class features by level', icon: Zap },
        { id: 5, title: 'Spellcasting', description: 'Magical abilities (optional)', icon: Wand2 },
        { id: 6, title: 'Preview', description: 'Review and finalize', icon: Eye }
    ];

    useEffect(() => {
        if (isEditing) {
            const existingClass = getClassById(id);
            if (existingClass) {
                setClassData(existingClass);
            } else {
                navigate('/character-creator');
            }
        }
    }, [id, isEditing, navigate]);

    useEffect(() => {
        setHasUnsavedChanges(
            JSON.stringify(classData) !== JSON.stringify(defaultClassData)
        );
    }, [classData]);

    const handleFieldChange = (field, value) => {
        setClassData(prev => ({ ...prev, [field]: value }));
        setTouched(prev => ({ ...prev, [field]: true }));
        if (errors[field]) {
            setErrors(prev => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }
    };

    const validateCurrentStep = () => {
        const validation = validateClassData(classData, currentStep);
        setErrors(validation.errors);
        return validation.isValid;
    };

    const nextStep = () => {
        if (currentStep < steps.length) {
            if (currentStep <= 2) {
                if (validateCurrentStep()) {
                    setCurrentStep(currentStep + 1);
                }
            } else {
                setCurrentStep(currentStep + 1);
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const goToStep = (step) => {
        setCurrentStep(step);
    };

    const handleSave = async () => {
        setSaving(true);

        try {
            const validation = validateClassData(classData);
            if (!validation.isValid) {
                setErrors(validation.errors);
                setCurrentStep(1);
                setSaving(false);
                return;
            }

            const savedId = saveClass(classData);

            if (savedId) {
                setHasUnsavedChanges(false);
                alert(`Class "${classData.name}" saved successfully!`);
                navigate('/classes');
            } else {
                alert('Failed to save class. Please try again.');
            }
        } catch (error) {
            console.error('Failed to save class:', error);
            alert('An error occurred while saving. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleExit = () => {
        if (hasUnsavedChanges) {
            if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
                navigate('/character-creator');
            }
        } else {
            navigate('/character-creator');
        }
    };

    const renderStepContent = () => {
        const commonProps = { classData, handleFieldChange, errors, touched };

        switch (currentStep) {
            case 1: return <BasicInfoStep {...commonProps} />;
            case 2: return <ProficienciesStep {...commonProps} />;
            case 3: return <EquipmentStep {...commonProps} />;
            case 4: return <FeaturesStep {...commonProps} />;
            case 5: return <SpellcastingStep {...commonProps} />;
            case 6: return <PreviewStep {...commonProps} />;
            default: return null;
        }
    };

    const getStepStatus = (step) => {
        if (step < currentStep) return 'completed';
        if (step === currentStep) return 'current';
        return 'available';
    };

    return (
        <div className="class-creator">
            {/* Header */}
            <div className="creator-header">
                <div className="creator-header-content">
                    <div className="creator-header-left">
                        <Button variant="outline" onClick={handleExit}>
                            <ArrowLeft className="btn-icon" />
                            Back to Hub
                        </Button>
                        <div className="creator-title">
                            <h1>{isEditing ? `Edit ${classData.name || 'Class'}` : 'Create New Class'}</h1>
                            <p>Step {currentStep} of {steps.length}</p>
                        </div>
                    </div>
                    <Button onClick={handleSave} loading={saving}>
                        <Save className="btn-icon" />
                        {saving ? 'Saving...' : 'Save Class'}
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="creator-main">
                <div className="creator-layout">
                    {/* Sidebar Navigation */}
                    <div className="creator-sidebar">
                        <Card>
                            <CardHeader>
                                <h3>Progress</h3>
                                <p>Track your class creation progress</p>
                            </CardHeader>
                            <CardContent>
                                <nav className="creator-nav">
                                    {steps.map((step) => {
                                        const status = getStepStatus(step.id);
                                        const IconComponent = step.icon;
                                        return (
                                            <button
                                                key={step.id}
                                                onClick={() => goToStep(step.id)}
                                                className={`nav-step ${status}`}
                                            >
                                                <div className="nav-step-icon">
                                                    {status === 'completed' ? (
                                                        <CheckCircle className="icon" />
                                                    ) : (
                                                        <IconComponent className="icon" />
                                                    )}
                                                </div>
                                                <div className="nav-step-content">
                                                    <div className="nav-step-title">{step.title}</div>
                                                    <div className="nav-step-description">{step.description}</div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Step Content */}
                    <div className="creator-content">
                        <Card>
                            <CardContent>
                                {renderStepContent()}
                            </CardContent>
                        </Card>

                        {/* Navigation Footer */}
                        <div className="creator-footer">
                            <Card>
                                <CardContent>
                                    <div className="footer-nav">
                                        <Button
                                            variant="outline"
                                            onClick={prevStep}
                                            disabled={currentStep === 1}
                                        >
                                            <ArrowLeft className="btn-icon" />
                                            Previous
                                        </Button>

                                        <div className="footer-progress">
                                            <span>Step {currentStep} of {steps.length}</span>
                                        </div>

                                        {currentStep < steps.length ? (
                                            <Button onClick={nextStep}>
                                                Next
                                                <ArrowRight className="btn-icon" />
                                            </Button>
                                        ) : (
                                            <Button onClick={handleSave} loading={saving}>
                                                <Save className="btn-icon" />
                                                {saving ? 'Saving...' : 'Save Class'}
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}