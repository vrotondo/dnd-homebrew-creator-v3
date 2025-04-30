// src/components/creators/character/BackgroundCreator.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { saveBackground, getBackgroundById } from '../../../utils/storageService';
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
    const [touched, setTouched] = useState({});
    const [showExportModal, setShowExportModal] = useState(false);

    // Load existing background if editing
    useEffect(() => {
        if (id) {
            const existingBackground = getBackgroundById(id);
            if (existingBackground) {
                setBackgroundData(existingBackground);
            }
        }
    }, [id]);

    // Form validation
    useEffect(() => {
        const newErrors = {};

        if (touched.name && !backgroundData.name) {
            newErrors.name = 'Background name is required';
        }

        if (touched.description && !backgroundData.description) {
            newErrors.description = 'Description is required';
        } else if (touched.description && backgroundData.description.length < 20) {
            newErrors.description = 'Description should be at least 20 characters';
        }

        // Validate skill proficiencies
        if (touched.skillProficiencies && (!backgroundData.skillProficiencies || backgroundData.skillProficiencies.length === 0)) {
            newErrors.skillProficiencies = 'At least one skill proficiency is required';
        } else if (touched.skillProficiencies && backgroundData.skillProficiencies.length > 2) {
            newErrors.skillProficiencies = 'Backgrounds typically provide 2 skill proficiencies';
        }

        // Validate feature
        if (touched.feature && (!backgroundData.feature.name || !backgroundData.feature.description)) {
            newErrors.feature = 'Background feature name and description are required';
        }

        setErrors(newErrors);
    }, [backgroundData, touched]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBackgroundData(prev => ({ ...prev, [name]: value }));
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleFeatureChange = (e) => {
        const { name, value } = e.target;
        setBackgroundData(prev => ({
            ...prev,
            feature: {
                ...prev.feature,
                [name]: value
            }
        }));
        setTouched(prev => ({ ...prev, feature: true }));
    };

    const updateBackgroundData = (newData) => {
        setBackgroundData(prev => ({ ...prev, ...newData }));
    };

    // Check if current step is valid
    const isStepValid = (step) => {
        switch (step) {
            case 1: // Basic info
                return backgroundData.name &&
                    backgroundData.description &&
                    backgroundData.description.length >= 20;
            case 2: // Proficiencies
                return backgroundData.skillProficiencies &&
                    backgroundData.skillProficiencies.length > 0 &&
                    backgroundData.skillProficiencies.length <= 2;
            case 3: // Feature
                return backgroundData.feature &&
                    backgroundData.feature.name &&
                    backgroundData.feature.description;
            default:
                return true;
        }
    };

    const handleSave = () => {
        // Validate basic info
        if (!isStepValid(1)) {
            setCurrentStep(1);
            setTouched({
                name: true,
                description: true
            });
            return;
        }

        // Validate proficiencies
        if (!isStepValid(2)) {
            setCurrentStep(2);
            setTouched(prev => ({ ...prev, skillProficiencies: true }));
            return;
        }

        // Validate feature
        if (!isStepValid(3)) {
            setCurrentStep(3);
            setTouched(prev => ({ ...prev, feature: true }));
            return;
        }

        // Save background
        const savedId = saveBackground(backgroundData);

        if (savedId) {
            alert('Background saved successfully!');
            if (typeof onSave === 'function') {
                onSave();
            } else {
                navigate('/character/backgrounds');
            }
        } else {
            alert('Failed to save background. Please try again.');
        }
    };

    const nextStep = () => {
        if (isStepValid(currentStep)) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Mark fields as touched to show validation errors
            if (currentStep === 1) {
                setTouched({
                    name: true,
                    description: true
                });
            } else if (currentStep === 2) {
                setTouched(prev => ({ ...prev, skillProficiencies: true }));
            } else if (currentStep === 3) {
                setTouched(prev => ({ ...prev, feature: true }));
            }
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const steps = [
        { id: 1, name: 'Basic Info' },
        { id: 2, name: 'Proficiencies' },
        { id: 3, name: 'Feature' },
        { id: 4, name: 'Equipment' },
        { id: 5, name: 'Characteristics' },
        { id: 6, name: 'Preview' }
    ];

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Basic info
                return (
                    <div className="form-group">
                        <div className="form-field">
                            <label htmlFor="name">Background Name*</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className={`form-control ${errors.name ? 'error' : ''}`}
                                value={backgroundData.name}
                                onChange={handleInputChange}
                                onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                                placeholder="e.g., Guild Artisan"
                            />
                            {errors.name && <div className="error-message">{errors.name}</div>}
                        </div>

                        <div className="form-field">
                            <label htmlFor="description">Description*</label>
                            <textarea
                                id="description"
                                name="description"
                                className={`form-control ${errors.description ? 'error' : ''}`}
                                value={backgroundData.description}
                                onChange={handleInputChange}
                                onBlur={() => setTouched(prev => ({ ...prev, description: true }))}
                                rows={4}
                                placeholder="Describe this background's place in the world and its typical members..."
                            />
                            {errors.description && <div className="error-message">{errors.description}</div>}
                        </div>

                        <p className="form-note">* Required fields</p>
                    </div>
                );

            case 2: // Proficiencies
                return (
                    <div className="form-group">
                        <h3>Proficiencies</h3>
                        <p className="form-info">
                            Select the proficiencies that this background provides.
                            Most backgrounds provide 2 skill proficiencies.
                        </p>

                        <div className="form-field">
                            <h4>Skill Proficiencies*</h4>
                            {errors.skillProficiencies && (
                                <div className="error-message">{errors.skillProficiencies}</div>
                            )}
                            <SkillsSelector
                                selectedSkills={backgroundData.skillProficiencies}
                                onChange={(skills) => {
                                    updateBackgroundData({ skillProficiencies: skills });
                                    setTouched(prev => ({ ...prev, skillProficiencies: true }));
                                }}
                            />
                        </div>

                        <div className="form-field">
                            <h4>Tool Proficiencies</h4>
                            <ToolsSelector
                                selectedTools={backgroundData.toolProficiencies}
                                onChange={(tools) => updateBackgroundData({ toolProficiencies: tools })}
                            />
                        </div>

                        <div className="form-field">
                            <h4>Languages</h4>
                            <LanguagesSelector
                                selectedLanguages={backgroundData.languages}
                                onChange={(languages) => updateBackgroundData({ languages: languages })}
                            />
                        </div>

                        <p className="form-note">* Required fields</p>
                    </div>
                );

            case 3: // Feature
                return (
                    <div className="form-group">
                        <h3>Background Feature*</h3>
                        <p className="form-info">
                            Every background provides a unique feature. This can be a special
                            ability, connection, or resource that members of this background have.
                        </p>

                        {errors.feature && (
                            <div className="error-message">{errors.feature}</div>
                        )}

                        <div className="form-field">
                            <label htmlFor="featureName">Feature Name*</label>
                            <input
                                type="text"
                                id="featureName"
                                name="name"
                                className={`form-control ${errors.feature && !backgroundData.feature.name ? 'error' : ''}`}
                                value={backgroundData.feature.name}
                                onChange={handleFeatureChange}
                                onBlur={() => setTouched(prev => ({ ...prev, feature: true }))}
                                placeholder="e.g., Guild Membership"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="featureDescription">Feature Description*</label>
                            <textarea
                                id="featureDescription"
                                name="description"
                                className={`form-control ${errors.feature && !backgroundData.feature.description ? 'error' : ''}`}
                                value={backgroundData.feature.description}
                                onChange={handleFeatureChange}
                                onBlur={() => setTouched(prev => ({ ...prev, feature: true }))}
                                rows={6}
                                placeholder="Describe what this feature provides to the character..."
                            />
                        </div>

                        <p className="form-note">* Required fields</p>
                    </div>
                );

            case 4: // Equipment
                return (
                    <div className="form-group">
                        <h3>Starting Equipment</h3>
                        <p className="form-info">
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
                    <div className="form-group">
                        <h3>Suggested Characteristics</h3>
                        <p className="form-info">
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
                    <div className="preview-container">
                        <div className="preview-header">
                            <h3>Preview</h3>
                            <button
                                className="button"
                                onClick={() => setShowExportModal(true)}
                            >
                                Export
                            </button>
                        </div>

                        <div className="card background-preview">
                            <BackgroundPreview backgroundData={backgroundData} />
                        </div>

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
        <div className="form-container">
            <h2>{id ? 'Edit Background' : 'Create a Background'}</h2>

            <div className="step-navigation">
                {steps.map(step => (
                    <button
                        key={step.id}
                        className={`step-button ${currentStep === step.id ? 'active' : ''}`}
                        onClick={() => setCurrentStep(step.id)}
                    >
                        {step.name}
                    </button>
                ))}
            </div>

            <div className="step-content">
                {renderStepContent()}
            </div>

            <div className="form-actions">
                {currentStep > 1 && (
                    <button
                        className="button button-secondary"
                        onClick={prevStep}
                    >
                        Previous
                    </button>
                )}

                {currentStep < steps.length ? (
                    <button
                        className="button"
                        onClick={nextStep}
                    >
                        Next
                    </button>
                ) : (
                    <button
                        className="button"
                        onClick={handleSave}
                        disabled={!isStepValid(1) || !isStepValid(2) || !isStepValid(3)}
                    >
                        Save Background
                    </button>
                )}

                <button
                    className="button button-secondary"
                    onClick={() => {
                        if (typeof onCancel === 'function') {
                            onCancel();
                        } else {
                            navigate('/character/backgrounds');
                        }
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default BackgroundCreator;