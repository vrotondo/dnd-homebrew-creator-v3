// src/components/creators/character/BackgroundCreator.jsx
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
    const [touched, setTouched] = useState({});
    const [showExportModal, setShowExportModal] = useState(false);

    const steps = [
        { id: 1, name: 'Basic Info' },
        { id: 2, name: 'Proficiencies' },
        { id: 3, name: 'Feature' },
        { id: 4, name: 'Equipment' },
        { id: 5, name: 'Characteristics' },
        { id: 6, name: 'Preview' }
    ];

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

        if (touched.skillProficiencies && backgroundData.skillProficiencies.length === 0) {
            newErrors.skillProficiencies = 'At least one skill proficiency is required';
        }

        if (touched.feature && (!backgroundData.feature.name || !backgroundData.feature.description)) {
            newErrors.feature = 'Feature name and description are required';
        }

        setErrors(newErrors);
    }, [backgroundData, touched]);

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

        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleFeatureChange = (e) => {
        const { name, value } = e.target;
        updateBackgroundData({
            feature: { ...backgroundData.feature, [name]: value }
        });
        setTouched(prev => ({ ...prev, feature: true }));
    };

    const validateStep = () => {
        const newErrors = {};

        if (currentStep === 1) {
            if (!backgroundData.name.trim()) newErrors.name = 'Background name is required';
            if (!backgroundData.description.trim()) newErrors.description = 'Description is required';
            else if (backgroundData.description.length < 20) newErrors.description = 'Description should be at least 20 characters';
        }

        if (currentStep === 2) {
            if (backgroundData.skillProficiencies.length === 0) {
                newErrors.skillProficiencies = 'At least one skill proficiency is required';
            }
        }

        if (currentStep === 3) {
            if (!backgroundData.feature.name.trim()) newErrors.featureName = 'Feature name is required';
            if (!backgroundData.feature.description.trim()) newErrors.featureDescription = 'Feature description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep() && currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSave = () => {
        if (validateStep()) {
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
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Basic Info
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Background Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={backgroundData.name}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="e.g., Guild Artisan"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description *</label>
                            <textarea
                                name="description"
                                value={backgroundData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Describe the background's theme, profession, and what kind of life the character led..."
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        </div>
                    </div>
                );

            case 2: // Proficiencies
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Proficiencies</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Choose skills, tools, and languages that characters with this background would know.
                                Most backgrounds provide 2 skill proficiencies.
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-medium mb-2">Skill Proficiencies *</h4>
                                    {errors.skillProficiencies && (
                                        <p className="text-red-500 text-sm mb-2">{errors.skillProficiencies}</p>
                                    )}
                                    <SkillsSelector
                                        selectedSkills={backgroundData.skillProficiencies}
                                        onChange={(skills) => {
                                            updateBackgroundData({ skillProficiencies: skills });
                                            setTouched(prev => ({ ...prev, skillProficiencies: true }));
                                        }}
                                        maxSkills={2}
                                    />
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Tool Proficiencies</h4>
                                    <ToolsSelector
                                        selectedTools={backgroundData.toolProficiencies}
                                        onChange={(tools) => updateBackgroundData({ toolProficiencies: tools })}
                                    />
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Languages</h4>
                                    <LanguagesSelector
                                        selectedLanguages={backgroundData.languages}
                                        onChange={(languages) => updateBackgroundData({ languages: languages })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Feature
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Background Feature *</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Every background provides a unique feature. This can be a special
                                ability, connection, or resource that members of this background have.
                            </p>

                            {errors.feature && (
                                <div className="text-red-500 text-sm mb-4">{errors.feature}</div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Feature Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={backgroundData.feature.name}
                                        onChange={handleFeatureChange}
                                        className={`w-full px-3 py-2 border rounded-md ${errors.featureName ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="e.g., Guild Membership"
                                    />
                                    {errors.featureName && <p className="text-red-500 text-sm mt-1">{errors.featureName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Feature Description *</label>
                                    <textarea
                                        name="description"
                                        value={backgroundData.feature.description}
                                        onChange={handleFeatureChange}
                                        rows={4}
                                        className={`w-full px-3 py-2 border rounded-md ${errors.featureDescription ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Describe what this feature provides to the character..."
                                    />
                                    {errors.featureDescription && <p className="text-red-500 text-sm mt-1">{errors.featureDescription}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4: // Equipment
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Starting Equipment</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Backgrounds typically provide a set of equipment related to the
                                background's theme and profession.
                            </p>

                            <EquipmentSelector
                                equipment={backgroundData.equipment}
                                onChange={(equipment) => updateBackgroundData({ equipment: equipment })}
                            />
                        </div>
                    </div>
                );

            case 5: // Characteristics
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Suggested Characteristics</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Provide suggested personality traits, ideals, bonds, and flaws for this background.
                                These are optional but help players roleplay characters with this background.
                            </p>

                            <BackgroundFeatures
                                characteristics={backgroundData.suggestedCharacteristics}
                                suggestedNames={backgroundData.suggestedNames}
                                onChange={(newData) => updateBackgroundData(newData)}
                            />
                        </div>
                    </div>
                );

            case 6: // Preview
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Background Preview</h3>
                            <button
                                onClick={() => setShowExportModal(true)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
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
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {id ? 'Edit Background' : 'Create Background'}
                </h1>
                <p className="text-gray-600">Design a custom background with skills, equipment, and features</p>
            </div>

            {/* Step Navigation */}
            <div className="flex items-center justify-between mb-8 overflow-x-auto">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center min-w-0">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === step.id
                                    ? 'bg-blue-600 text-white'
                                    : currentStep > step.id
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                }`}
                        >
                            {currentStep > step.id ? <Check size={16} /> : step.id}
                        </div>
                        <span className={`ml-2 text-sm whitespace-nowrap ${currentStep === step.id ? 'font-medium text-blue-600' : 'text-gray-600'}`}>
                            {step.name}
                        </span>
                        {index < steps.length - 1 && (
                            <div className="w-8 h-px bg-gray-300 mx-4 flex-shrink-0"></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`flex items-center px-4 py-2 rounded-md ${currentStep === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-600 text-white hover:bg-gray-700'
                        }`}
                >
                    <ChevronLeft size={16} className="mr-1" />
                    Previous
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={onCancel || (() => navigate('/backgrounds'))}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    {currentStep < steps.length ? (
                        <button
                            onClick={nextStep}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Next
                            <ChevronRight size={16} className="ml-1" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            <Check size={16} className="mr-1" />
                            Save Background
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BackgroundCreator;