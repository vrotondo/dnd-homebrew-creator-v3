// src/components/creators/character/RaceCreator.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { saveRace, getRaceById } from '../../../utils/storageService';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import ExportModal from '../../export/ExportModal';
import RacialTraits from './RacialTraits';
import Subraces from './Subraces';
import RacePreview from './RacePreview';

function RaceCreator({ onSave, onCancel }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const [currentStep, setCurrentStep] = useState(1);
    const [raceData, setRaceData] = useState({
        name: '',
        description: '',
        size: 'Medium',
        speed: 30,
        abilityScoreIncreases: {
            STR: 0,
            DEX: 0,
            CON: 0,
            INT: 0,
            WIS: 0,
            CHA: 0
        },
        age: {
            maturity: '',
            lifespan: ''
        },
        alignment: '',
        languages: ['Common'],
        vision: {
            darkvision: false,
            range: 60
        },
        traits: [],
        subraces: []
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [showExportModal, setShowExportModal] = useState(false);

    const steps = [
        { id: 1, name: 'Basic Info' },
        { id: 2, name: 'Abilities' },
        { id: 3, name: 'Languages' },
        { id: 4, name: 'Traits' },
        { id: 5, name: 'Subraces' },
        { id: 6, name: 'Preview' }
    ];

    // Load existing race if editing
    useEffect(() => {
        if (id) {
            const existingRace = getRaceById(id);
            if (existingRace) {
                setRaceData(existingRace);
            }
        }
    }, [id]);

    // Form validation
    useEffect(() => {
        const newErrors = {};

        if (touched.name && !raceData.name) {
            newErrors.name = 'Race name is required';
        }

        if (touched.description && !raceData.description) {
            newErrors.description = 'Description is required';
        } else if (touched.description && raceData.description.length < 20) {
            newErrors.description = 'Description should be at least 20 characters';
        }

        // Validate ability score increases
        const totalASI = Object.values(raceData.abilityScoreIncreases).reduce((sum, val) => sum + val, 0);
        if (touched.abilityScoreIncreases && totalASI < 1) {
            newErrors.abilityScoreIncreases = 'At least one ability score increase is required';
        } else if (touched.abilityScoreIncreases && totalASI > 3) {
            newErrors.abilityScoreIncreases = 'Total ability score increases cannot exceed 3';
        }

        if (touched.languages && raceData.languages.length === 0) {
            newErrors.languages = 'At least one language is required';
        }

        setErrors(newErrors);
    }, [raceData, touched]);

    const updateRaceData = (updates) => {
        setRaceData(prev => ({ ...prev, ...updates }));
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            updateRaceData({
                [parent]: { ...raceData[parent], [child]: type === 'checkbox' ? checked : value }
            });
        } else {
            updateRaceData({ [name]: type === 'checkbox' ? checked : value });
        }

        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleAbilityChange = (ability, value) => {
        const numValue = Math.max(0, Math.min(3, parseInt(value) || 0));
        updateRaceData({
            abilityScoreIncreases: { ...raceData.abilityScoreIncreases, [ability]: numValue }
        });
        setTouched(prev => ({ ...prev, abilityScoreIncreases: true }));
    };

    const handleLanguageChange = (language, checked) => {
        if (checked) {
            updateRaceData({ languages: [...raceData.languages, language] });
        } else {
            updateRaceData({ languages: raceData.languages.filter(l => l !== language) });
        }
        setTouched(prev => ({ ...prev, languages: true }));
    };

    const validateStep = () => {
        const newErrors = {};

        if (currentStep === 1) {
            if (!raceData.name.trim()) newErrors.name = 'Race name is required';
            if (!raceData.description.trim()) newErrors.description = 'Description is required';
            else if (raceData.description.length < 20) newErrors.description = 'Description should be at least 20 characters';
        }

        if (currentStep === 2) {
            const totalASI = Object.values(raceData.abilityScoreIncreases).reduce((sum, val) => sum + val, 0);
            if (totalASI < 1) {
                newErrors.abilityScoreIncreases = 'At least one ability score increase is required';
            } else if (totalASI > 3) {
                newErrors.abilityScoreIncreases = 'Total ability score increases cannot exceed 3';
            }
        }

        if (currentStep === 3) {
            if (raceData.languages.length === 0) {
                newErrors.languages = 'At least one language is required';
            }
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
                const savedId = saveRace(raceData);
                if (onSave) {
                    onSave(savedId);
                } else {
                    navigate('/races');
                }
            } catch (error) {
                console.error('Error saving race:', error);
                alert('Error saving race. Please try again.');
            }
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Basic Info
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Race Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={raceData.name}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="e.g., Dragonborn"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description *</label>
                            <textarea
                                name="description"
                                value={raceData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Describe the race's appearance, culture, and characteristics..."
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Size</label>
                                <select
                                    name="size"
                                    value={raceData.size}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="Small">Small</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Large">Large</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Speed (feet)</label>
                                <input
                                    type="number"
                                    name="speed"
                                    value={raceData.speed}
                                    onChange={handleInputChange}
                                    min="10"
                                    max="60"
                                    step="5"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Age & Lifespan</label>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="age.maturity"
                                    value={raceData.age.maturity}
                                    onChange={handleInputChange}
                                    placeholder="Reaches adulthood at..."
                                    className="px-3 py-2 border border-gray-300 rounded-md"
                                />
                                <input
                                    type="text"
                                    name="age.lifespan"
                                    value={raceData.age.lifespan}
                                    onChange={handleInputChange}
                                    placeholder="Lives about..."
                                    className="px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Alignment</label>
                            <input
                                type="text"
                                name="alignment"
                                value={raceData.alignment}
                                onChange={handleInputChange}
                                placeholder="e.g., Usually chaotic good"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="vision.darkvision"
                                checked={raceData.vision.darkvision}
                                onChange={handleInputChange}
                                className="rounded border-gray-300"
                            />
                            <label className="text-sm font-medium">Has Darkvision</label>
                            {raceData.vision.darkvision && (
                                <input
                                    type="number"
                                    name="vision.range"
                                    value={raceData.vision.range}
                                    onChange={handleInputChange}
                                    min="30"
                                    max="120"
                                    step="30"
                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                            )}
                            {raceData.vision.darkvision && <span className="text-sm text-gray-600">feet</span>}
                        </div>
                    </div>
                );

            case 2: // Abilities
                const abilities = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
                const abilityNames = {
                    STR: 'Strength', DEX: 'Dexterity', CON: 'Constitution',
                    INT: 'Intelligence', WIS: 'Wisdom', CHA: 'Charisma'
                };
                const totalASI = Object.values(raceData.abilityScoreIncreases).reduce((sum, val) => sum + val, 0);

                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Ability Score Increases</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Most races get +2 to one ability and +1 to another (total: 3), or +1 to two abilities (total: 2).
                            </p>

                            {errors.abilityScoreIncreases && (
                                <p className="text-red-500 text-sm mb-4">{errors.abilityScoreIncreases}</p>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {abilities.map(ability => (
                                    <div key={ability} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                        <div>
                                            <div className="font-medium">{ability}</div>
                                            <div className="text-sm text-gray-500">{abilityNames[ability]}</div>
                                        </div>
                                        <select
                                            value={raceData.abilityScoreIncreases[ability]}
                                            onChange={(e) => handleAbilityChange(ability, e.target.value)}
                                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                                        >
                                            <option value={0}>+0</option>
                                            <option value={1}>+1</option>
                                            <option value={2}>+2</option>
                                            <option value={3}>+3</option>
                                        </select>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm">
                                    <strong>Total Ability Score Increases:</strong> +{totalASI}
                                    {totalASI < 1 && <span className="text-red-500 ml-2">Too few points allocated</span>}
                                    {totalASI > 3 && <span className="text-red-500 ml-2">Too many points allocated</span>}
                                    {(totalASI >= 1 && totalASI <= 3) && <span className="text-green-500 ml-2">✓ Valid</span>}
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Languages
                const languages = [
                    'Common', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin',
                    'Halfling', 'Orc', 'Abyssal', 'Celestial', 'Draconic', 'Deep Speech',
                    'Infernal', 'Primordial', 'Sylvan', 'Undercommon'
                ];

                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Languages</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Most races speak Common plus one or more additional languages.
                            </p>

                            {errors.languages && (
                                <p className="text-red-500 text-sm mb-4">{errors.languages}</p>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {languages.map(language => (
                                    <label key={language} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={raceData.languages.includes(language)}
                                            onChange={(e) => handleLanguageChange(language, e.target.checked)}
                                            className="rounded border-gray-300"
                                        />
                                        <span className={`text-sm ${raceData.languages.includes(language) ? 'font-medium text-blue-600' : ''}`}>
                                            {language}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            {raceData.languages.length > 0 && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm"><strong>Selected:</strong> {raceData.languages.join(', ')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 4: // Traits
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Racial Traits</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Add unique abilities, resistances, or features that define this race.
                            </p>

                            <RacialTraits raceData={raceData} updateRaceData={updateRaceData} />
                        </div>
                    </div>
                );

            case 5: // Subraces
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Subraces (Optional)</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Add subraces to provide variants of your main race. Each subrace can have
                                additional ability score increases and traits.
                            </p>

                            <Subraces raceData={raceData} updateRaceData={updateRaceData} />
                        </div>
                    </div>
                );

            case 6: // Preview
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Race Preview</h3>
                            <button
                                onClick={() => setShowExportModal(true)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                            >
                                Export
                            </button>
                        </div>

                        <RacePreview raceData={raceData} />

                        {showExportModal && (
                            <ExportModal
                                classData={raceData}
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
                    {id ? 'Edit Race' : 'Create Race'}
                </h1>
                <p className="text-gray-600">Design a custom race with unique traits and abilities</p>
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
                        onClick={onCancel || (() => navigate('/races'))}
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
                            Save Race
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RaceCreator;