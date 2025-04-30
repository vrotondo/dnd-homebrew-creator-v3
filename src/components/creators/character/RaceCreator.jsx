// src/components/creators/character/RaceCreator.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { saveRace, getRaceById } from '../../../utils/storageService';
import ExportModal from '../../export/ExportModal';

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
        if (touched.abilityScoreIncreases && totalASI !== 2 && totalASI !== 3) {
            newErrors.abilityScoreIncreases = 'Total ability score increases should equal 2 or 3';
        }

        // Validate languages
        if (touched.languages && (!raceData.languages || raceData.languages.length === 0)) {
            newErrors.languages = 'At least one language is required';
        }

        setErrors(newErrors);
    }, [raceData, touched]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRaceData(prev => ({ ...prev, [name]: value }));
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleAbilityChange = (ability, value) => {
        const numValue = parseInt(value) || 0;
        setRaceData(prev => ({
            ...prev,
            abilityScoreIncreases: {
                ...prev.abilityScoreIncreases,
                [ability]: numValue
            }
        }));
        setTouched(prev => ({ ...prev, abilityScoreIncreases: true }));
    };

    const handleVisionChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRaceData(prev => ({
            ...prev,
            vision: {
                ...prev.vision,
                [name]: type === 'checkbox' ? checked : (parseInt(value) || 0)
            }
        }));
    };

    const handleLanguageChange = (language, checked) => {
        if (checked) {
            setRaceData(prev => ({
                ...prev,
                languages: [...prev.languages, language]
            }));
        } else {
            setRaceData(prev => ({
                ...prev,
                languages: prev.languages.filter(l => l !== language)
            }));
        }
        setTouched(prev => ({ ...prev, languages: true }));
    };

    const updateRaceData = (newData) => {
        setRaceData(prev => ({ ...prev, ...newData }));
    };

    // Check if current step is valid
    const isStepValid = (step) => {
        switch (step) {
            case 1: // Basic info
                return raceData.name &&
                    raceData.description &&
                    raceData.description.length >= 20;
            case 2: // Ability scores
                const totalASI = Object.values(raceData.abilityScoreIncreases).reduce((sum, val) => sum + val, 0);
                return totalASI === 2 || totalASI === 3;
            case 3: // Languages & Proficiencies
                return raceData.languages && raceData.languages.length > 0;
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

        // Validate ability scores
        if (!isStepValid(2)) {
            setCurrentStep(2);
            setTouched(prev => ({ ...prev, abilityScoreIncreases: true }));
            return;
        }

        // Validate languages
        if (!isStepValid(3)) {
            setCurrentStep(3);
            setTouched(prev => ({ ...prev, languages: true }));
            return;
        }

        // Save race
        const savedId = saveRace(raceData);

        if (savedId) {
            alert('Race saved successfully!');
            if (typeof onSave === 'function') {
                onSave();
            }
        } else {
            alert('Failed to save race. Please try again.');
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
                setTouched(prev => ({ ...prev, abilityScoreIncreases: true }));
            } else if (currentStep === 3) {
                setTouched(prev => ({ ...prev, languages: true }));
            }
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const steps = [
        { id: 1, name: 'Basic Info' },
        { id: 2, name: 'Abilities & Traits' },
        { id: 3, name: 'Languages' },
        { id: 4, name: 'Racial Traits' },
        { id: 5, name: 'Subraces' },
        { id: 6, name: 'Preview' }
    ];

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Basic info
                return (
                    <div className="form-group">
                        <div className="form-field">
                            <label htmlFor="name">Race Name*</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className={`form-control ${errors.name ? 'error' : ''}`}
                                value={raceData.name}
                                onChange={handleInputChange}
                                onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                                placeholder="e.g., Mountain Folk"
                            />
                            {errors.name && <div className="error-message">{errors.name}</div>}
                        </div>

                        <div className="form-field">
                            <label htmlFor="description">Description*</label>
                            <textarea
                                id="description"
                                name="description"
                                className={`form-control ${errors.description ? 'error' : ''}`}
                                value={raceData.description}
                                onChange={handleInputChange}
                                onBlur={() => setTouched(prev => ({ ...prev, description: true }))}
                                rows={4}
                                placeholder="Describe your race's appearance, culture, and history..."
                            />
                            {errors.description && <div className="error-message">{errors.description}</div>}
                        </div>

                        <div className="form-field">
                            <label htmlFor="size">Size</label>
                            <select
                                id="size"
                                name="size"
                                className="form-control"
                                value={raceData.size}
                                onChange={handleInputChange}
                            >
                                <option value="Tiny">Tiny</option>
                                <option value="Small">Small</option>
                                <option value="Medium">Medium</option>
                                <option value="Large">Large</option>
                            </select>
                            <p className="form-help">Most playable races are Small or Medium size.</p>
                        </div>

                        <div className="form-field">
                            <label htmlFor="speed">Base Speed (feet)</label>
                            <input
                                type="number"
                                id="speed"
                                name="speed"
                                className="form-control small-input"
                                value={raceData.speed}
                                onChange={handleInputChange}
                                min="20"
                                max="50"
                                step="5"
                            />
                            <p className="form-help">30 feet is the standard walking speed for most races.</p>
                        </div>

                        <div className="form-field">
                            <label htmlFor="alignment">Typical Alignment (Optional)</label>
                            <textarea
                                id="alignment"
                                name="alignment"
                                className="form-control"
                                value={raceData.alignment}
                                onChange={handleInputChange}
                                rows={2}
                                placeholder="Describe typical alignment tendencies of this race..."
                            />
                            <p className="form-help">This is for flavor - individual characters can be any alignment.</p>
                        </div>

                        <div className="form-field">
                            <label htmlFor="maturity">Age - Maturity</label>
                            <input
                                type="text"
                                id="maturity"
                                name="maturity"
                                className="form-control"
                                value={raceData.age.maturity}
                                onChange={(e) => setRaceData(prev => ({
                                    ...prev,
                                    age: { ...prev.age, maturity: e.target.value }
                                }))}
                                placeholder="e.g., Reach adulthood at 20 years"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="lifespan">Age - Lifespan</label>
                            <input
                                type="text"
                                id="lifespan"
                                name="lifespan"
                                className="form-control"
                                value={raceData.age.lifespan}
                                onChange={(e) => setRaceData(prev => ({
                                    ...prev,
                                    age: { ...prev.age, lifespan: e.target.value }
                                }))}
                                placeholder="e.g., Live to be around 100 years old"
                            />
                        </div>

                        <p className="form-note">* Required fields</p>
                    </div>
                );

            case 2: // Abilities & Traits
                return (
                    <div className="form-group">
                        <h3>Ability Score Increases</h3>
                        <p className="form-info">
                            Most races provide a total of +2 or +3 to ability scores. Select which abilities
                            are increased for this race.
                        </p>

                        {errors.abilityScoreIncreases && (
                            <div className="error-message ability-error">{errors.abilityScoreIncreases}</div>
                        )}

                        <div className="ability-increases">
                            {Object.entries(raceData.abilityScoreIncreases).map(([ability, value]) => (
                                <div key={ability} className="ability-item">
                                    <label htmlFor={`ability-${ability}`}>{getAbilityName(ability)}</label>
                                    <select
                                        id={`ability-${ability}`}
                                        className="form-control"
                                        value={value}
                                        onChange={(e) => handleAbilityChange(ability, e.target.value)}
                                    >
                                        <option value="0">+0</option>
                                        <option value="1">+1</option>
                                        <option value="2">+2</option>
                                    </select>
                                </div>
                            ))}
                        </div>

                        <div className="form-field vision-field">
                            <h3>Vision</h3>
                            <div className="checkbox-item">
                                <input
                                    type="checkbox"
                                    id="darkvision"
                                    name="darkvision"
                                    checked={raceData.vision.darkvision}
                                    onChange={handleVisionChange}
                                />
                                <label htmlFor="darkvision">Darkvision</label>
                            </div>

                            {raceData.vision.darkvision && (
                                <div className="vision-range">
                                    <label htmlFor="vision-range">Range (feet):</label>
                                    <select
                                        id="vision-range"
                                        name="range"
                                        className="form-control small-input"
                                        value={raceData.vision.range}
                                        onChange={handleVisionChange}
                                    >
                                        <option value="30">30 ft.</option>
                                        <option value="60">60 ft.</option>
                                        <option value="90">90 ft.</option>
                                        <option value="120">120 ft.</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 3: // Languages
                return (
                    <div className="form-group">
                        <h3>Languages</h3>
                        <p className="form-info">
                            Select which languages members of this race speak. Most races speak Common
                            plus one or more additional languages.
                        </p>

                        {errors.languages && (
                            <div className="error-message">{errors.languages}</div>
                        )}

                        <div className="languages-grid">
                            {getLanguages().map(language => (
                                <div key={language} className="language-item checkbox-item">
                                    <input
                                        type="checkbox"
                                        id={`lang-${language}`}
                                        checked={raceData.languages.includes(language)}
                                        onChange={(e) => handleLanguageChange(language, e.target.checked)}
                                    />
                                    <label htmlFor={`lang-${language}`}>{language}</label>
                                </div>
                            ))}
                        </div>

                        <div className="form-field">
                            <label htmlFor="extraLanguages">Additional Language Options (Optional)</label>
                            <textarea
                                id="extraLanguages"
                                name="extraLanguages"
                                className="form-control"
                                value={raceData.extraLanguages || ''}
                                onChange={handleInputChange}
                                rows={2}
                                placeholder="e.g., You can speak, read, and write one extra language of your choice."
                            />
                        </div>
                    </div>
                );

            case 4: // Racial Traits
                return (
                    <div className="form-group">
                        <h3>Racial Traits</h3>
                        <RacialTraits
                            raceData={raceData}
                            updateRaceData={updateRaceData}
                        />
                    </div>
                );

            case 5: // Subraces
                return (
                    <div className="form-group">
                        <h3>Subraces (Optional)</h3>
                        <Subraces
                            raceData={raceData}
                            updateRaceData={updateRaceData}
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

                        <div className="card race-preview">
                            <RacePreview raceData={raceData} />
                        </div>

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

    // Helper function for ability names
    function getAbilityName(ability) {
        const abilities = {
            'STR': 'Strength',
            'DEX': 'Dexterity',
            'CON': 'Constitution',
            'INT': 'Intelligence',
            'WIS': 'Wisdom',
            'CHA': 'Charisma'
        };
        return abilities[ability] || ability;
    }

    // Helper function for languages
    function getLanguages() {
        return [
            'Common',
            'Dwarvish',
            'Elvish',
            'Giant',
            'Gnomish',
            'Goblin',
            'Halfling',
            'Orc',
            'Abyssal',
            'Celestial',
            'Draconic',
            'Deep Speech',
            'Infernal',
            'Primordial',
            'Sylvan',
            'Undercommon'
        ];
    }

    return (
        <div className="form-container">
            <h2>Create a Race</h2>

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
                        Save Race
                    </button>
                )}

                <button
                    className="button button-secondary"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default RaceCreator;