// src/components/creators/character/RaceCreator.jsx - ENHANCED VERSION
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { saveRace, getRaceById } from '../../../utils/storageService';
import { ChevronLeft, ChevronRight, Check, Crown } from 'lucide-react';
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
        { id: 1, name: 'Basic Info', shortName: 'Info' },
        { id: 2, name: 'Abilities', shortName: 'Abilities' },
        { id: 3, name: 'Languages', shortName: 'Languages' },
        { id: 4, name: 'Traits', shortName: 'Traits' },
        { id: 5, name: 'Subraces', shortName: 'Subraces' },
        { id: 6, name: 'Preview', shortName: 'Preview' }
    ];

    // Load existing race if editing
    useEffect(() => {
        if (id) {
            console.log('Loading race with ID:', id);
            const existingRace = getRaceById(id);
            console.log('Loaded race:', existingRace);
            if (existingRace) {
                setRaceData(existingRace);
            } else {
                console.error('Race not found with ID:', id);
                alert('Race not found!');
                navigate('/races');
            }
        }
    }, [id, navigate]);

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
        if (currentStep === 1) {
            if (!raceData.name.trim()) return false;
            if (!raceData.description.trim() || raceData.description.length < 20) return false;
            return true;
        }

        if (currentStep === 2) {
            const totalASI = Object.values(raceData.abilityScoreIncreases).reduce((sum, val) => sum + val, 0);
            if (totalASI < 1 || totalASI > 3) return false;
            return true;
        }

        if (currentStep === 3) {
            if (raceData.languages.length === 0) return false;
            return true;
        }

        return true;
    };

    const nextStep = () => {
        if (canProceedToNextStep() && currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
            setErrors({});
        } else {
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
            alert(`Race "${raceData.name}" saved successfully!`);
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
                    <div style={{ padding: '32px' }}>
                        <div style={{ marginBottom: '28px' }}>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '10px', fontSize: '15px', color: '#374151' }}>
                                Race Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={raceData.name}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    border: errors.name ? '2px solid #ef4444' : '2px solid #e5e7eb',
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    transition: 'all 0.2s',
                                    outline: 'none'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                                onBlur={(e) => e.target.style.borderColor = errors.name ? '#ef4444' : '#e5e7eb'}
                                placeholder="e.g., Dragonborn"
                            />
                            {errors.name && (
                                <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '6px', fontWeight: '500' }}>{errors.name}</p>
                            )}
                        </div>

                        <div style={{ marginBottom: '28px' }}>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '10px', fontSize: '15px', color: '#374151' }}>
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={raceData.description}
                                onChange={handleInputChange}
                                rows={5}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    border: errors.description ? '2px solid #ef4444' : '2px solid #e5e7eb',
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    resize: 'vertical',
                                    fontFamily: 'inherit',
                                    lineHeight: '1.6',
                                    transition: 'all 0.2s',
                                    outline: 'none'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                                onBlur={(e) => e.target.style.borderColor = errors.description ? '#ef4444' : '#e5e7eb'}
                                placeholder="Describe the race's appearance, culture, and characteristics..."
                            />
                            {errors.description && (
                                <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '6px', fontWeight: '500' }}>{errors.description}</p>
                            )}
                            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
                                {raceData.description.length}/20 characters minimum
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '10px', fontSize: '15px', color: '#374151' }}>
                                    Size
                                </label>
                                <select
                                    name="size"
                                    value={raceData.size}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '10px',
                                        fontSize: '16px',
                                        backgroundColor: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="Small">Small</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Large">Large</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '10px', fontSize: '15px', color: '#374151' }}>
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
                                        padding: '14px 16px',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '10px',
                                        fontSize: '16px'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '28px' }}>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '10px', fontSize: '15px', color: '#374151' }}>
                                Age & Lifespan
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <input
                                    type="text"
                                    name="age.maturity"
                                    value={raceData.age.maturity}
                                    onChange={handleInputChange}
                                    placeholder="Reaches adulthood at..."
                                    style={{
                                        padding: '14px 16px',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '10px',
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
                                        padding: '14px 16px',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '10px',
                                        fontSize: '16px'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '28px' }}>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '10px', fontSize: '15px', color: '#374151' }}>
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
                                    padding: '14px 16px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '10px',
                                    fontSize: '16px'
                                }}
                            />
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '16px',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '10px',
                            border: '2px solid #e5e7eb'
                        }}>
                            <input
                                type="checkbox"
                                name="vision.darkvision"
                                checked={raceData.vision.darkvision}
                                onChange={handleInputChange}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                            <label style={{ fontWeight: '600', fontSize: '15px', cursor: 'pointer', flex: 1 }}>
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
                                            width: '90px',
                                            padding: '10px',
                                            border: '2px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '15px',
                                            fontWeight: '600'
                                        }}
                                    />
                                    <span style={{ fontSize: '15px', color: '#6b7280', fontWeight: '500' }}>feet</span>
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
                    <div style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px', color: '#111827' }}>
                            Ability Score Increases
                        </h3>
                        <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '28px', lineHeight: '1.6' }}>
                            Most races get +2 to one ability and +1 to another (total: 3), or +1 to two abilities (total: 2).
                        </p>

                        {errors.abilities && (
                            <div style={{
                                padding: '16px',
                                backgroundColor: '#fee2e2',
                                border: '2px solid #ef4444',
                                borderRadius: '12px',
                                marginBottom: '20px',
                                color: '#dc2626',
                                fontWeight: '600'
                            }}>
                                {errors.abilities}
                            </div>
                        )}

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '20px',
                            marginBottom: '28px'
                        }}>
                            {abilities.map(ability => (
                                <div key={ability} style={{
                                    padding: '20px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '14px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    backgroundColor: 'white',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: '700', fontSize: '18px', color: '#111827' }}>{ability}</div>
                                        <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '2px' }}>{abilityNames[ability]}</div>
                                    </div>
                                    <select
                                        value={raceData.abilityScoreIncreases[ability]}
                                        onChange={(e) => handleAbilityChange(ability, e.target.value)}
                                        style={{
                                            width: '75px',
                                            padding: '10px 12px',
                                            border: '2px solid #d1d5db',
                                            borderRadius: '10px',
                                            fontSize: '17px',
                                            fontWeight: '700',
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
                            padding: '20px',
                            backgroundColor: totalASI >= 1 && totalASI <= 3 ? '#d1fae5' : '#fee2e2',
                            borderRadius: '14px',
                            border: `2px solid ${totalASI >= 1 && totalASI <= 3 ? '#10b981' : '#ef4444'}`
                        }}>
                            <p style={{ fontSize: '17px', fontWeight: '700', margin: 0 }}>
                                Total Ability Score Increases: <span style={{ fontSize: '20px' }}>+{totalASI}</span>
                                {totalASI < 1 && <span style={{ color: '#dc2626', marginLeft: '12px' }}>⚠ Too few points</span>}
                                {totalASI > 3 && <span style={{ color: '#dc2626', marginLeft: '12px' }}>⚠ Too many points</span>}
                                {(totalASI >= 1 && totalASI <= 3) && <span style={{ color: '#059669', marginLeft: '12px' }}>✓ Valid</span>}
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
                    <div style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px', color: '#111827' }}>
                            Languages
                        </h3>
                        <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '28px', lineHeight: '1.6' }}>
                            Most races speak Common plus one or more additional languages.
                        </p>

                        {errors.languages && (
                            <div style={{
                                padding: '16px',
                                backgroundColor: '#fee2e2',
                                border: '2px solid #ef4444',
                                borderRadius: '12px',
                                marginBottom: '20px',
                                color: '#dc2626',
                                fontWeight: '600'
                            }}>
                                {errors.languages}
                            </div>
                        )}

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                            gap: '16px',
                            marginBottom: '28px'
                        }}>
                            {languages.map(language => (
                                <label key={language} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '16px',
                                    border: raceData.languages.includes(language) ? '3px solid #8b5cf6' : '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    backgroundColor: raceData.languages.includes(language) ? '#f5f3ff' : 'white',
                                    transition: 'all 0.2s',
                                    boxShadow: raceData.languages.includes(language) ? '0 4px 6px rgba(139, 92, 246, 0.2)' : 'none'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={raceData.languages.includes(language)}
                                        onChange={(e) => handleLanguageChange(language, e.target.checked)}
                                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                    />
                                    <span style={{
                                        fontSize: '15px',
                                        fontWeight: raceData.languages.includes(language) ? '700' : '500',
                                        color: raceData.languages.includes(language) ? '#5b21b6' : '#374151'
                                    }}>
                                        {language}
                                    </span>
                                </label>
                            ))}
                        </div>

                        {raceData.languages.length > 0 && (
                            <div style={{
                                padding: '20px',
                                backgroundColor: '#dbeafe',
                                borderRadius: '14px',
                                border: '2px solid #3b82f6'
                            }}>
                                <p style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>
                                    <strong>Selected ({raceData.languages.length}):</strong> {raceData.languages.join(', ')}
                                </p>
                            </div>
                        )}
                    </div>
                );

            case 4:
                return (
                    <div style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px', color: '#111827' }}>
                            Racial Traits (Optional)
                        </h3>
                        <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '28px', lineHeight: '1.6' }}>
                            Add unique abilities, resistances, or features that define this race.
                        </p>
                        <RacialTraits raceData={raceData} updateRaceData={updateRaceData} />
                    </div>
                );

            case 5:
                return (
                    <div style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px', color: '#111827' }}>
                            Subraces (Optional)
                        </h3>
                        <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '28px', lineHeight: '1.6' }}>
                            Add subraces to provide variants of your main race.
                        </p>
                        <Subraces raceData={raceData} updateRaceData={updateRaceData} />
                    </div>
                );

            case 6:
                return (
                    <div style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                            <h3 style={{ fontSize: '22px', fontWeight: '700', margin: 0, color: '#111827' }}>Race Preview</h3>
                            <button
                                onClick={() => setShowExportModal(true)}
                                style={{
                                    padding: '14px 28px',
                                    backgroundColor: '#6b7280',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontWeight: '600',
                                    fontSize: '15px',
                                    cursor: 'pointer'
                                }}
                            >
                                Export
                            </button>
                        </div>
                        <RacePreview raceData={raceData} />
                        {showExportModal && (
                            <ExportModal classData={raceData} onClose={() => setShowExportModal(false)} />
                        )}
                    </div>
                );

            default:
                return <div>Unknown step</div>;
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            {/* Enhanced Header */}
            <div style={{
                marginBottom: '32px',
                padding: '32px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                borderRadius: '20px',
                boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                    <div style={{
                        padding: '12px',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: '12px'
                    }}>
                        <Crown size={32} style={{ color: 'white' }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', margin: 0 }}>
                            {id ? 'Edit Race' : 'Create New Race'}
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', margin: 0 }}>
                            Design a custom race with unique traits and abilities
                        </p>
                    </div>
                </div>
            </div>

            {/* ENHANCED Step Navigation - Much More Prominent */}
            <div style={{
                marginBottom: '32px',
                padding: '32px',
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '2px solid #e5e7eb'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {steps.map((step, index) => {
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;
                        const canClick = true; // Allow clicking on any step

                        return (
                            <div key={step.id} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                <button
                                    onClick={() => canClick && setCurrentStep(step.id)}
                                    disabled={!canClick}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '10px',
                                        background: 'none',
                                        border: 'none',
                                        cursor: canClick ? 'pointer' : 'not-allowed',
                                        opacity: canClick ? 1 : 0.5,
                                        padding: '8px',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '20px',
                                        fontWeight: '700',
                                        backgroundColor: isActive ? '#8b5cf6' : isCompleted ? '#10b981' : '#e5e7eb',
                                        color: isActive || isCompleted ? 'white' : '#6b7280',
                                        border: isActive ? '4px solid #c4b5fd' : isCompleted ? '4px solid #6ee7b7' : '4px solid transparent',
                                        boxShadow: isActive ? '0 6px 20px rgba(139, 92, 246, 0.4)' : isCompleted ? '0 6px 20px rgba(16, 185, 129, 0.4)' : 'none',
                                        transition: 'all 0.3s',
                                        transform: isActive ? 'scale(1.1)' : 'scale(1)'
                                    }}>
                                        {isCompleted ? '✓' : step.id}
                                    </div>
                                    <span style={{
                                        fontSize: '14px',
                                        fontWeight: isActive ? '700' : '600',
                                        color: isActive ? '#8b5cf6' : isCompleted ? '#10b981' : '#6b7280',
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {step.shortName}
                                    </span>
                                </button>
                                {index < steps.length - 1 && (
                                    <div style={{
                                        width: '60px',
                                        height: '4px',
                                        backgroundColor: isCompleted ? '#10b981' : '#e5e7eb',
                                        margin: '0 -8px',
                                        marginTop: '-30px',
                                        borderRadius: '2px',
                                        transition: 'all 0.3s'
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '2px solid #e5e7eb',
                marginBottom: '32px',
                minHeight: '500px'
            }}>
                {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '24px',
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '2px solid #e5e7eb'
            }}>
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '14px 28px',
                        backgroundColor: currentStep === 1 ? '#f3f4f6' : '#6b7280',
                        color: currentStep === 1 ? '#9ca3af' : 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '600',
                        fontSize: '16px',
                        cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                        opacity: currentStep === 1 ? 0.5 : 1,
                        transition: 'all 0.2s'
                    }}
                >
                    <ChevronLeft size={20} />
                    Previous
                </button>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={onCancel || (() => navigate('/races'))}
                        style={{
                            padding: '14px 28px',
                            border: '2px solid #d1d5db',
                            backgroundColor: 'white',
                            color: '#374151',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
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
                                gap: '10px',
                                padding: '14px 36px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: '700',
                                fontSize: '16px',
                                cursor: 'pointer',
                                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
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
                                gap: '10px',
                                padding: '14px 36px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: '700',
                                fontSize: '16px',
                                cursor: 'pointer',
                                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
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