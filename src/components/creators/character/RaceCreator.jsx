// src/components/creators/character/RaceCreator.jsx - FIXED VERSION
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
    };

    const handleAbilityChange = (ability, value) => {
        const numValue = Math.max(0, Math.min(3, parseInt(value) || 0));
        updateRaceData({
            abilityScoreIncreases: { ...raceData.abilityScoreIncreases, [ability]: numValue }
        });
    };

    const handleLanguageChange = (language, checked) => {
        if (checked) {
            updateRaceData({ languages: [...raceData.languages, language] });
        } else {
            updateRaceData({ languages: raceData.languages.filter(l => l !== language) });
        }
    };

    const canProceedToNextStep = () => {
        // Step 1: Basic Info - requires name and description
        if (currentStep === 1) {
            if (!raceData.name.trim()) return false;
            if (!raceData.description.trim() || raceData.description.length < 20) return false;
            return true;
        }

        // Step 2: Abilities - requires at least 1 point, max 3
        if (currentStep === 2) {
            const totalASI = Object.values(raceData.abilityScoreIncreases).reduce((sum, val) => sum + val, 0);
            if (totalASI < 1 || totalASI > 3) return false;
            return true;
        }

        // Step 3: Languages - requires at least one
        if (currentStep === 3) {
            if (raceData.languages.length === 0) return false;
            return true;
        }

        // Steps 4, 5, 6 are optional - always can proceed
        return true;
    };

    const nextStep = () => {
        console.log('Next clicked, current step:', currentStep);
        console.log('Can proceed:', canProceedToNextStep());
        console.log('Race data:', raceData);

        if (canProceedToNextStep() && currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
            setErrors({});
        } else {
            // Show validation errors
            const newErrors = {};
            if (currentStep === 1) {
                if (!raceData.name.trim()) newErrors.name = 'Race name is required';
                if (!raceData.description.trim()) newErrors.description = 'Description is required';
                else if (raceData.description.length < 20) newErrors.description = 'Description must be at least 20 characters';
            }
            if (currentStep === 2) {
                const totalASI = Object.values(raceData.abilityScoreIncreases).reduce((sum, val) => sum + val, 0);
                if (totalASI < 1) newErrors.abilities = 'You must allocate at least 1 ability score increase';
                if (totalASI > 3) newErrors.abilities = 'Total ability score increases cannot exceed 3';
            }
            if (currentStep === 3) {
                if (raceData.languages.length === 0) newErrors.languages = 'You must select at least one language';
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
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Basic Info
                return (
                    <div style={{ padding: '24px' }}>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>
                                Race Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={raceData.name}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: errors.name ? '2px solid #ef4444' : '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '16px'
                                }}
                                placeholder="e.g., Dragonborn"
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
                                value={raceData.description}
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
                                placeholder="Describe the race's appearance, culture, and characteristics..."
                            />
                            {errors.description && (
                                <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.description}</p>
                            )}
                            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                {raceData.description.length}/20 characters minimum
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>
                                    Size
                                </label>
                                <select
                                    name="size"
                                    value={raceData.size}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        backgroundColor: 'white'
                                    }}
                                >
                                    <option value="Small">Small</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Large">Large</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>
                                    Speed (feet)
                                </label>
                                <input
                                    type="number"
                                    name="speed"
                                    value={raceData.speed}
                                    onChange={handleInputChange}
                                    min="10"
                                    max="60"
                                    step="5"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '16px'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>
                                Age & Lifespan
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <input
                                    type="text"
                                    name="age.maturity"
                                    value={raceData.age.maturity}
                                    onChange={handleInputChange}
                                    placeholder="Reaches adulthood at..."
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '16px'
                                    }}
                                />
                                <input
                                    type="text"
                                    name="age.lifespan"
                                    value={raceData.age.lifespan}
                                    onChange={handleInputChange}
                                    placeholder="Lives about..."
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '16px'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>
                                Alignment
                            </label>
                            <input
                                type="text"
                                name="alignment"
                                value={raceData.alignment}
                                onChange={handleInputChange}
                                placeholder="e.g., Usually chaotic good"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '16px'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <input
                                type="checkbox"
                                name="vision.darkvision"
                                checked={raceData.vision.darkvision}
                                onChange={handleInputChange}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label style={{ fontWeight: '500', fontSize: '14px', cursor: 'pointer' }}>
                                Has Darkvision
                            </label>
                            {raceData.vision.darkvision && (
                                <>
                                    <input
                                        type="number"
                                        name="vision.range"
                                        value={raceData.vision.range}
                                        onChange={handleInputChange}
                                        min="30"
                                        max="120"
                                        step="30"
                                        style={{
                                            width: '80px',
                                            padding: '8px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px'
                                        }}
                                    />
                                    <span style={{ fontSize: '14px', color: '#6b7280' }}>feet</span>
                                </>
                            )}
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
                    <div style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
                            Ability Score Increases
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                            Most races get +2 to one ability and +1 to another (total: 3), or +1 to two abilities (total: 2).
                        </p>

                        {errors.abilities && (
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#fee2e2',
                                border: '1px solid #ef4444',
                                borderRadius: '8px',
                                marginBottom: '16px',
                                color: '#dc2626'
                            }}>
                                {errors.abilities}
                            </div>
                        )}

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '16px',
                            marginBottom: '24px'
                        }}>
                            {abilities.map(ability => (
                                <div key={ability} style={{
                                    padding: '16px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    backgroundColor: 'white'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '16px' }}>{ability}</div>
                                        <div style={{ fontSize: '14px', color: '#6b7280' }}>{abilityNames[ability]}</div>
                                    </div>
                                    <select
                                        value={raceData.abilityScoreIncreases[ability]}
                                        onChange={(e) => handleAbilityChange(ability, e.target.value)}
                                        style={{
                                            width: '70px',
                                            padding: '8px',
                                            border: '2px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            textAlign: 'center',
                                            backgroundColor: 'white',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value={0}>+0</option>
                                        <option value={1}>+1</option>
                                        <option value={2}>+2</option>
                                        <option value={3}>+3</option>
                                    </select>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            padding: '16px',
                            backgroundColor: totalASI >= 1 && totalASI <= 3 ? '#d1fae5' : '#fee2e2',
                            borderRadius: '12px',
                            border: `2px solid ${totalASI >= 1 && totalASI <= 3 ? '#10b981' : '#ef4444'}`
                        }}>
                            <p style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
                                Total Ability Score Increases: +{totalASI}
                                {totalASI < 1 && <span style={{ color: '#dc2626', marginLeft: '8px' }}>⚠ Too few points</span>}
                                {totalASI > 3 && <span style={{ color: '#dc2626', marginLeft: '8px' }}>⚠ Too many points</span>}
                                {(totalASI >= 1 && totalASI <= 3) && <span style={{ color: '#059669', marginLeft: '8px' }}>✓ Valid</span>}
                            </p>
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
                    <div style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
                            Languages
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                            Most races speak Common plus one or more additional languages.
                        </p>

                        {errors.languages && (
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#fee2e2',
                                border: '1px solid #ef4444',
                                borderRadius: '8px',
                                marginBottom: '16px',
                                color: '#dc2626'
                            }}>
                                {errors.languages}
                            </div>
                        )}

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                            gap: '12px',
                            marginBottom: '24px'
                        }}>
                            {languages.map(language => (
                                <label key={language} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '12px',
                                    border: raceData.languages.includes(language) ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    backgroundColor: raceData.languages.includes(language) ? '#eff6ff' : 'white',
                                    transition: 'all 0.2s'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={raceData.languages.includes(language)}
                                        onChange={(e) => handleLanguageChange(language, e.target.checked)}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <span style={{
                                        fontSize: '14px',
                                        fontWeight: raceData.languages.includes(language) ? '600' : '400',
                                        color: raceData.languages.includes(language) ? '#1e40af' : '#374151'
                                    }}>
                                        {language}
                                    </span>
                                </label>
                            ))}
                        </div>

                        {raceData.languages.length > 0 && (
                            <div style={{
                                padding: '16px',
                                backgroundColor: '#dbeafe',
                                borderRadius: '12px',
                                border: '2px solid #3b82f6'
                            }}>
                                <p style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>
                                    <strong>Selected:</strong> {raceData.languages.join(', ')}
                                </p>
                            </div>
                        )}
                    </div>
                );

            case 4: // Traits
                return (
                    <div style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
                            Racial Traits (Optional)
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                            Add unique abilities, resistances, or features that define this race. This step is optional.
                        </p>

                        <RacialTraits raceData={raceData} updateRaceData={updateRaceData} />
                    </div>
                );

            case 5: // Subraces
                return (
                    <div style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
                            Subraces (Optional)
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                            Add subraces to provide variants of your main race.
                        </p>

                        <Subraces raceData={raceData} updateRaceData={updateRaceData} />
                    </div>
                );

            case 6: // Preview
                return (
                    <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Race Preview</h3>
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
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                    {id ? 'Edit Race' : 'Create Race'}
                </h1>
                <p style={{ color: '#6b7280', fontSize: '16px' }}>
                    Design a custom race with unique traits and abilities
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
                        onClick={onCancel || (() => navigate('/races'))}
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
                            Save Race
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RaceCreator;