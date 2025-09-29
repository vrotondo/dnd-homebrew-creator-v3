// src/components/creators/character/BackgroundCreator.jsx - FIXED VERSION
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { saveBackground, getBackgroundById } from '../../../utils/storageService';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import ExportModal from '../../export/ExportModal';
import SkillsSelector from './background/SkillsSelector';
import ToolsSelector from './background/ToolsSelector';
import LanguagesSelector from './background/LanguagesSelector';
import EquipmentSelector from './background/EquipmentSelector';
import BackgroundFeatures from './background/BackgroundFeatures';
import BackgroundPreview from './background/BackgroundPreview';

function BackgroundCreator({ onSave, onCancel }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const [currentStep, setCurrentStep] = useState(1);
    const [backgroundData, setBackgroundData] = useState({
        name: '',
        description: '',
        skillProficiencies: [],
        toolProficiencies: [],
        languages: [],
        equipment: [],
        feature: {
            name: '',
            description: ''
        },
        suggestedCharacteristics: {
            personalityTraits: [],
            ideals: [],
            bonds: [],
            flaws: []
        },
        suggestedNames: []
    });

    const [errors, setErrors] = useState({});
    const [showExportModal, setShowExportModal] = useState(false);

    const steps = [
        { id: 1, name: 'Basic Info' },
        { id: 2, name: 'Proficiencies' },
        { id: 3, name: 'Feature' },
        { id: 4, name: 'Equipment' },
        { id: 5, name: 'Characteristics' },
        { id: 6, name: 'Preview' }
    ];

    useEffect(() => {
        if (id) {
            const existingBackground = getBackgroundById(id);
            if (existingBackground) {
                setBackgroundData(existingBackground);
            }
        }
    }, [id]);

    const updateBackgroundData = (updates) => {
        setBackgroundData(prev => ({ ...prev, ...updates }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            updateBackgroundData({
                [parent]: { ...backgroundData[parent], [child]: value }
            });
        } else {
            updateBackgroundData({ [name]: value });
        }
    };

    const handleFeatureChange = (e) => {
        const { name, value } = e.target;
        updateBackgroundData({
            feature: { ...backgroundData.feature, [name]: value }
        });
    };

    const canProceedToNextStep = () => {
        // Step 1: Basic Info
        if (currentStep === 1) {
            if (!backgroundData.name.trim()) return false;
            if (!backgroundData.description.trim() || backgroundData.description.length < 20) return false;
            return true;
        }

        // Step 2: Proficiencies
        if (currentStep === 2) {
            if (backgroundData.skillProficiencies.length === 0) return false;
            return true;
        }

        // Step 3: Feature
        if (currentStep === 3) {
            if (!backgroundData.feature.name.trim()) return false;
            if (!backgroundData.feature.description.trim()) return false;
            return true;
        }

        // Steps 4, 5, 6 are optional
        return true;
    };

    const nextStep = () => {
        console.log('Next clicked, current step:', currentStep);
        console.log('Can proceed:', canProceedToNextStep());

        if (canProceedToNextStep() && currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
            setErrors({});
        } else {
            const newErrors = {};
            if (currentStep === 1) {
                if (!backgroundData.name.trim()) newErrors.name = 'Background name is required';
                if (!backgroundData.description.trim()) newErrors.description = 'Description is required';
                else if (backgroundData.description.length < 20) newErrors.description = 'Description must be at least 20 characters';
            }
            if (currentStep === 2) {
                if (backgroundData.skillProficiencies.length === 0) newErrors.skills = 'You must select at least one skill proficiency';
            }
            if (currentStep === 3) {
                if (!backgroundData.feature.name.trim()) newErrors.featureName = 'Feature name is required';
                if (!backgroundData.feature.description.trim()) newErrors.featureDescription = 'Feature description is required';
            }
            setErrors(newErrors);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setErrors({});
        }
    };

    const handleSave = () => {
        try {
            const savedId = saveBackground(backgroundData);
            if (onSave) {
                onSave(savedId);
            } else {
                navigate('/backgrounds');
            }
        } catch (error) {
            console.error('Error saving background:', error);
            alert('Error saving background. Please try again.');
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Basic Info
                return (
                    <div style={{ padding: '24px' }}>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>
                                Background Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={backgroundData.name}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: errors.name ? '2px solid #ef4444' : '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '16px'
                                }}
                                placeholder="e.g., Guild Artisan"
                            />
                            {errors.name && (
                                <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.name}</p>
                            )}
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={backgroundData.description}
                                onChange={handleInputChange}
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: errors.description ? '2px solid #ef4444' : '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    resize: 'vertical'
                                }}
                                placeholder="Describe the background's theme, profession, and what kind of life the character led..."
                            />
                            {errors.description && (
                                <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.description}</p>
                            )}
                            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                {backgroundData.description.length}/20 characters minimum
                            </p>
                        </div>
                    </div>
                );

            case 2: // Proficiencies
                return (
                    <div style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
                            Proficiencies
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                            Choose skills, tools, and languages that characters with this background would know.
                            Most backgrounds provide 2 skill proficiencies.
                        </p>

                        {errors.skills && (
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#fee2e2',
                                border: '1px solid #ef4444',
                                borderRadius: '8px',
                                marginBottom: '16px',
                                color: '#dc2626'
                            }}>
                                {errors.skills}
                            </div>
                        )}

                        <div style={{ marginBottom: '32px' }}>
                            <h4 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '16px' }}>
                                Skill Proficiencies *
                            </h4>
                            <SkillsSelector
                                selectedSkills={backgroundData.skillProficiencies}
                                onChange={(skills) => updateBackgroundData({ skillProficiencies: skills })}
                                maxSkills={2}
                            />
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <h4 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '16px' }}>
                                Tool Proficiencies (Optional)
                            </h4>
                            <ToolsSelector
                                selectedTools={backgroundData.toolProficiencies}
                                onChange={(tools) => updateBackgroundData({ toolProficiencies: tools })}
                            />
                        </div>

                        <div>
                            <h4 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '16px' }}>
                                Languages (Optional)
                            </h4>
                            <LanguagesSelector
                                selectedLanguages={backgroundData.languages}
                                onChange={(languages) => updateBackgroundData({ languages: languages })}
                            />
                        </div>
                    </div>
                );

            case 3: // Feature
                return (
                    <div style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
                            Background Feature *
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                            Every background provides a unique feature. This can be a special
                            ability, connection, or resource that members of this background have.
                        </p>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>
                                Feature Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={backgroundData.feature.name}
                                onChange={handleFeatureChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: errors.featureName ? '2px solid #ef4444' : '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '16px'
                                }}
                                placeholder="e.g., Guild Membership"
                            />
                            {errors.featureName && (
                                <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.featureName}</p>
                            )}
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>
                                Feature Description *
                            </label>
                            <textarea
                                name="description"
                                value={backgroundData.feature.description}
                                onChange={handleFeatureChange}
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: errors.featureDescription ? '2px solid #ef4444' : '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    resize: 'vertical'
                                }}
                                placeholder="Describe what this feature provides to the character..."
                            />
                            {errors.featureDescription && (
                                <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.featureDescription}</p>
                            )}
                        </div>
                    </div>
                );

            case 4: // Equipment
                return (
                    <div style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
                            Starting Equipment (Optional)
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                            Backgrounds typically provide a set of equipment related to the
                            background's theme and profession.
                        </p>

                        <EquipmentSelector
                            equipment={backgroundData.equipment}
                            onChange={(equipment) => updateBackgroundData({ equipment: equipment })}
                        />
                    </div>
                );

            case 5: // Characteristics
                return (
                    <div style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
                            Suggested Characteristics (Optional)
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                            Provide suggested personality traits, ideals, bonds, and flaws for this background.
                            These are optional but help players roleplay characters with this background.
                        </p>

                        <BackgroundFeatures
                            characteristics={backgroundData.suggestedCharacteristics}
                            suggestedNames={backgroundData.suggestedNames}
                            onChange={(newData) => updateBackgroundData(newData)}
                        />
                    </div>
                );

            case 6: // Preview
                return (
                    <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
                                Background Preview
                            </h3>
                            <button
                                onClick={() => setShowExportModal(true)}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: '#6b7280',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >
                                Export
                            </button>
                        </div>

                        <BackgroundPreview backgroundData={backgroundData} />

                        {showExportModal && (
                            <ExportModal
                                data={backgroundData}
                                type="background"
                                onClose={() => setShowExportModal(false)}
                            />
                        )}
                    </div>
                );

            default:
                return <div>Unknown step</div>;
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                    {id ? 'Edit Background' : 'Create Background'}
                </h1>
                <p style={{ color: '#6b7280', fontSize: '16px' }}>
                    Design a custom background with skills, equipment, and features
                </p>
            </div>

            {/* Step Navigation */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '32px',
                padding: '24px',
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
            }}>
                {steps.map((step, index) => (
                    <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: '600',
                            backgroundColor: currentStep === step.id ? '#3b82f6' : currentStep > step.id ? '#10b981' : '#e5e7eb',
                            color: currentStep >= step.id ? 'white' : '#6b7280',
                            border: currentStep === step.id ? '3px solid #93c5fd' : 'none'
                        }}>
                            {currentStep > step.id ? '✓' : step.id}
                        </div>
                        <span style={{
                            marginLeft: '12px',
                            fontSize: '14px',
                            fontWeight: currentStep === step.id ? '600' : '400',
                            color: currentStep === step.id ? '#1e40af' : '#6b7280'
                        }}>
                            {step.name}
                        </span>
                        {index < steps.length - 1 && (
                            <div style={{
                                flex: 1,
                                height: '2px',
                                backgroundColor: currentStep > step.id ? '#10b981' : '#e5e7eb',
                                margin: '0 16px'
                            }} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                marginBottom: '24px',
                minHeight: '400px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        backgroundColor: currentStep === 1 ? '#f3f4f6' : '#6b7280',
                        color: currentStep === 1 ? '#9ca3af' : 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '500',
                        fontSize: '16px',
                        cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                        opacity: currentStep === 1 ? 0.5 : 1
                    }}
                >
                    <ChevronLeft size={20} />
                    Previous
                </button>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={onCancel || (() => navigate('/backgrounds'))}
                        style={{
                            padding: '12px 24px',
                            border: '2px solid #d1d5db',
                            backgroundColor: 'white',
                            color: '#374151',
                            borderRadius: '8px',
                            fontWeight: '500',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>

                    {currentStep < steps.length ? (
                        <button
                            onClick={nextStep}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 32px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                fontSize: '16px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
                            }}
                        >
                            Next
                            <ChevronRight size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 32px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                fontSize: '16px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)'
                            }}
                        >
                            <Check size={20} />
                            Save Background
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BackgroundCreator;