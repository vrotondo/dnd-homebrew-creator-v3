// src/components/creators/character/RaceCreator.jsx - FINAL POLISHED VERSION
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { saveRace, getRaceById } from '../../../utils/storageService';
import { ChevronLeft, ChevronRight, Check, Crown, AlertCircle } from 'lucide-react';
import ExportModal from '../../export/ExportModal';
import RacialTraits from './RacialTraits';
import Subraces from './Subraces';
import RacePreview from './RacePreview';

function RaceCreator({ onSave, onCancel }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [raceData, setRaceData] = useState({
        name: '',
        description: '',
        size: 'Medium',
        speed: 30,
        abilityScoreIncreases: { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
        age: { maturity: '', lifespan: '' },
        alignment: '',
        languages: ['Common'],
        vision: { darkvision: false, range: 60 },
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
            setIsLoading(true);
            try {
                console.log('Loading race with ID:', id);
                const existingRace = getRaceById(id);

                if (existingRace) {
                    console.log('Race found:', existingRace);
                    setRaceData(existingRace);
                } else {
                    console.error('Race not found with ID:', id);
                    alert(`Race not found! ID: ${id}`);
                    navigate('/races');
                }
            } catch (error) {
                console.error('Error loading race:', error);
                alert('Error loading race!');
                navigate('/races');
            } finally {
                setIsLoading(false);
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
            updateRaceData({ [parent]: { ...raceData[parent], [child]: type === 'checkbox' ? checked : value } });
        } else {
            updateRaceData({ [name]: type === 'checkbox' ? checked : value });
        }
    };

    const handleAbilityChange = (ability, value) => {
        const numValue = Math.max(0, Math.min(3, parseInt(value) || 0));
        updateRaceData({ abilityScoreIncreases: { ...raceData.abilityScoreIncreases, [ability]: numValue } });
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
            return raceData.name.trim() && raceData.description.trim() && raceData.description.length >= 20;
        }
        if (currentStep === 2) {
            const total = Object.values(raceData.abilityScoreIncreases).reduce((sum, val) => sum + val, 0);
            return total >= 1 && total <= 3;
        }
        if (currentStep === 3) {
            return raceData.languages.length > 0;
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
                else if (raceData.description.length < 20) newErrors.description = 'Minimum 20 characters';
            }
            if (currentStep === 2) {
                const total = Object.values(raceData.abilityScoreIncreases).reduce((sum, val) => sum + val, 0);
                if (total < 1) newErrors.abilities = 'At least 1 point required';
                if (total > 3) newErrors.abilities = 'Maximum 3 points allowed';
            }
            if (currentStep === 3) {
                if (raceData.languages.length === 0) newErrors.languages = 'At least one language required';
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
            alert(`✅ Race "${raceData.name}" saved successfully!`);
            navigate('/races');
        } catch (error) {
            console.error('Error saving race:', error);
            alert('❌ Error saving race!');
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                    <p style={{ fontSize: '16px', color: '#6b7280' }}>Loading race...</p>
                </div>
            </div>
        );
    }

    const renderStepContent = () => {
        const inputStyle = {
            width: '100%',
            padding: '14px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '10px',
            fontSize: '16px',
            transition: 'all 0.2s',
            outline: 'none',
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        };

        const labelStyle = {
            display: 'block',
            fontWeight: '600',
            marginBottom: '10px',
            fontSize: '15px',
            color: '#374151'
        };

        switch (currentStep) {
            case 1:
                return (
                    <div style={{ padding: '40px' }}>
                        <div style={{ marginBottom: '28px' }}>
                            <label style={labelStyle}>Race Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={raceData.name}
                                onChange={handleInputChange}
                                style={{
                                    ...inputStyle,
                                    borderColor: errors.name ? '#ef4444' : '#e5e7eb'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                                onBlur={(e) => e.target.style.borderColor = errors.name ? '#ef4444' : '#e5e7eb'}
                                placeholder="e.g., Dragonborn, High Elf, Mountain Dwarf"
                            />
                            {errors.name && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', color: '#ef4444', fontSize: '14px' }}>
                                    <AlertCircle size={16} />
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '28px' }}>
                            <label style={labelStyle}>Description *</label>
                            <textarea
                                name="description"
                                value={raceData.description}
                                onChange={handleInputChange}
                                rows={5}
                                style={{
                                    ...inputStyle,
                                    borderColor: errors.description ? '#ef4444' : '#e5e7eb',
                                    fontFamily: 'inherit',
                                    lineHeight: '1.6',
                                    resize: 'vertical'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                                onBlur={(e) => e.target.style.borderColor = errors.description ? '#ef4444' : '#e5e7eb'}
                                placeholder="Describe the race's appearance, culture, characteristics, and place in the world..."
                            />
                            {errors.description && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', color: '#ef4444', fontSize: '14px' }}>
                                    <AlertCircle size={16} />
                                    {errors.description}
                                </div>
                            )}
                            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280' }}>
                                <span>{raceData.description.length}/20 characters minimum</span>
                                <span style={{ color: raceData.description.length >= 20 ? '#10b981' : '#ef4444' }}>
                                    {raceData.description.length >= 20 ? '✓ Good' : '⚠ Too short'}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
                            <div>
                                <label style={labelStyle}>Size</label>
                                <select
                                    name="size"
                                    value={raceData.size}
                                    onChange={handleInputChange}
                                    style={{ ...inputStyle, cursor: 'pointer' }}
                                >
                                    <option value="Small">Small (3-4 feet)</option>
                                    <option value="Medium">Medium (4-8 feet)</option>
                                    <option value="Large">Large (8+ feet)</option>
                                </select>
                            </div>

                            <div>
                                <label style={labelStyle}>Speed (feet per turn)</label>
                                <input
                                    type="number"
                                    name="speed"
                                    value={raceData.speed}
                                    onChange={handleInputChange}
                                    min="10"
                                    max="60"
                                    step="5"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '28px' }}>
                            <label style={labelStyle}>Age & Lifespan</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <input
                                    type="text"
                                    name="age.maturity"
                                    value={raceData.age.maturity}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Matures at age 18"
                                    style={inputStyle}
                                />
                                <input
                                    type="text"
                                    name="age.lifespan"
                                    value={raceData.age.lifespan}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Lives about 80 years"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '28px' }}>
                            <label style={labelStyle}>Alignment (Optional)</label>
                            <input
                                type="text"
                                name="alignment"
                                value={raceData.alignment}
                                onChange={handleInputChange}
                                placeholder="e.g., Usually chaotic good, tends toward neutrality"
                                style={inputStyle}
                            />
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '20px',
                            backgroundColor: '#f9fafb',
                            borderRadius: '12px',
                            border: '2px solid #e5e7eb'
                        }}>
                            <input
                                type="checkbox"
                                name="vision.darkvision"
                                checked={raceData.vision.darkvision}
                                onChange={handleInputChange}
                                style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#8b5cf6' }}
                                id="darkvision-check"
                            />
                            <label htmlFor="darkvision-check" style={{ fontWeight: '600', fontSize: '15px', cursor: 'pointer', flex: 1 }}>
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
                                            width: '100px',
                                            padding: '10px',
                                            border: '2px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '15px',
                                            fontWeight: '600',
                                            textAlign: 'center'
                                        }}
                                    />
                                    <span style={{ fontSize: '15px', color: '#6b7280', fontWeight: '500' }}>feet</span>
                                </>
                            )}
                        </div>
                    </div>
                );

            case 2:
                const abilities = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
                const abilityNames = {
                    STR: 'Strength', DEX: 'Dexterity', CON: 'Constitution',
                    INT: 'Intelligence', WIS: 'Wisdom', CHA: 'Charisma'
                };
                const total = Object.values(raceData.abilityScoreIncreases).reduce((sum, val) => sum + val, 0);

                return (
                    <div style={{ padding: '40px' }}>
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
                                marginBottom: '24px',
                                color: '#dc2626',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <AlertCircle size={20} />
                                {errors.abilities}
                            </div>
                        )}

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '20px',
                            marginBottom: '28px'
                        }}>
                            {abilities.map(ability => (
                                <div key={ability} style={{
                                    padding: '20px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '14px',
                                    backgroundColor: 'white',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    transition: 'all 0.2s'
                                }}>
                                    <div style={{ marginBottom: '12px' }}>
                                        <div style={{ fontWeight: '700', fontSize: '18px', color: '#111827' }}>{ability}</div>
                                        <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '2px' }}>{abilityNames[ability]}</div>
                                    </div>
                                    <select
                                        value={raceData.abilityScoreIncreases[ability]}
                                        onChange={(e) => handleAbilityChange(ability, e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '2px solid #d1d5db',
                                            borderRadius: '10px',
                                            fontSize: '17px',
                                            fontWeight: '700',
                                            textAlign: 'center',
                                            backgroundColor: 'white',
                                            cursor: 'pointer',
                                            accentColor: '#8b5cf6'
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
                            padding: '24px',
                            backgroundColor: total >= 1 && total <= 3 ? '#d1fae5' : '#fee2e2',
                            borderRadius: '14px',
                            border: `3px solid ${total >= 1 && total <= 3 ? '#10b981' : '#ef4444'}`
                        }}>
                            <p style={{ fontSize: '18px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span>Total Ability Score Increases: <span style={{ fontSize: '22px' }}>+{total}</span></span>
                                {total < 1 && <span style={{ color: '#dc2626' }}>⚠ Too few points</span>}
                                {total > 3 && <span style={{ color: '#dc2626' }}>⚠ Too many points</span>}
                                {(total >= 1 && total <= 3) && <span style={{ color: '#059669' }}>✓ Perfect!</span>}
                            </p>
                        </div>
                    </div>
                );

            case 3:
                const languages = [
                    'Common', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin',
                    'Halfling', 'Orc', 'Abyssal', 'Celestial', 'Draconic', 'Deep Speech',
                    'Infernal', 'Primordial', 'Sylvan', 'Undercommon'
                ];

                return (
                    <div style={{ padding: '40px' }}>
                        <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px', color: '#111827' }}>
                            Languages
                        </h3>
                        <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '28px', lineHeight: '1.6' }}>
                            Select which languages members of this race can speak, read, and write.
                        </p>

                        {errors.languages && (
                            <div style={{
                                padding: '16px',
                                backgroundColor: '#fee2e2',
                                border: '2px solid #ef4444',
                                borderRadius: '12px',
                                marginBottom: '24px',
                                color: '#dc2626',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <AlertCircle size={20} />
                                {errors.languages}
                            </div>
                        )}

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
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
                                    boxShadow: raceData.languages.includes(language) ? '0 4px 6px rgba(139, 92, 246, 0.2)' : '0 1px 3px rgba(0,0,0,0.05)'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={raceData.languages.includes(language)}
                                        onChange={(e) => handleLanguageChange(language, e.target.checked)}
                                        style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#8b5cf6' }}
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
                                padding: '24px',
                                backgroundColor: '#dbeafe',
                                borderRadius: '14px',
                                border: '3px solid #3b82f6'
                            }}>
                                <p style={{ fontSize: '17px', fontWeight: '700', margin: 0 }}>
                                    Selected ({raceData.languages.length}): {raceData.languages.join(', ')}
                                </p>
                            </div>
                        )}
                    </div>
                );

            case 4:
                return (
                    <div style={{ padding: '40px' }}>
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
                    <div style={{ padding: '40px' }}>
                        <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px', color: '#111827' }}>
                            Subraces (Optional)
                        </h3>
                        <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '28px', lineHeight: '1.6' }}>
                            Add subraces to provide variants of your main race with additional features.
                        </p>
                        <Subraces raceData={raceData} updateRaceData={updateRaceData} />
                    </div>
                );

            case 6:
                return (
                    <div style={{ padding: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                            <h3 style={{ fontSize: '22px', fontWeight: '700', margin: 0, color: '#111827' }}>
                                Race Preview
                            </h3>
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
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
                return null;
        }
    };

    return (
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '24px',
            backgroundColor: '#f9fafb',
            minHeight: '100vh'
        }}>
            {/* Header */}
            <div style={{
                marginBottom: '32px',
                padding: '32px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                borderRadius: '20px',
                boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)',
                color: 'white'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        padding: '12px',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <Crown size={40} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: 0 }}>
                            {id ? 'Edit Race' : 'Create New Race'}
                        </h1>
                        <p style={{ fontSize: '16px', margin: 0, opacity: 0.9 }}>
                            Design a custom race with unique traits and abilities
                        </p>
                    </div>
                </div>
            </div>

            {/* Step Navigation */}
            <div style={{
                marginBottom: '32px',
                padding: '40px',
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '2px solid #e5e7eb'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {steps.map((step, index) => {
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;
                        return (
                            <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                <button
                                    onClick={() => setCurrentStep(step.id)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '12px',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '8px',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '24px',
                                        fontWeight: '700',
                                        backgroundColor: isActive ? '#8b5cf6' : isCompleted ? '#10b981' : '#e5e7eb',
                                        color: isActive || isCompleted ? 'white' : '#6b7280',
                                        border: isActive ? '5px solid #c4b5fd' : '5px solid transparent',
                                        boxShadow: isActive ? '0 8px 25px rgba(139, 92, 246, 0.5)' : isCompleted ? '0 8px 25px rgba(16, 185, 129, 0.5)' : 'none',
                                        transform: isActive ? 'scale(1.15)' : 'scale(1)',
                                        transition: 'all 0.3s'
                                    }}>
                                        {isCompleted ? '✓' : step.id}
                                    </div>
                                    <span style={{
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        color: isActive ? '#8b5cf6' : isCompleted ? '#10b981' : '#6b7280',
                                        textAlign: 'center'
                                    }}>
                                        {step.name}
                                    </span>
                                </button>
                                {index < steps.length - 1 && (
                                    <div style={{
                                        flex: 1,
                                        height: '5px',
                                        backgroundColor: isCompleted ? '#10b981' : '#e5e7eb',
                                        borderRadius: '3px',
                                        marginTop: '-30px',
                                        transition: 'all 0.3s'
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
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
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '16px 32px',
                        backgroundColor: currentStep === 1 ? '#f3f4f6' : '#6b7280',
                        color: currentStep === 1 ? '#9ca3af' : 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '700',
                        fontSize: '16px',
                        cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                        boxShadow: currentStep === 1 ? 'none' : '0 4px 6px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                        if (currentStep !== 1) e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                        if (currentStep !== 1) e.target.style.transform = 'translateY(0)';
                    }}
                >
                    <ChevronLeft size={20} />
                    Previous
                </button>

                {currentStep < steps.length ? (
                    <button
                        onClick={nextStep}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '16px 40px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: '700',
                            fontSize: '18px',
                            cursor: 'pointer',
                            boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 12px 25px rgba(59, 130, 246, 0.5)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
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
                            gap: '10px',
                            padding: '16px 40px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: '700',
                            fontSize: '18px',
                            cursor: 'pointer',
                            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 12px 25px rgba(16, 185, 129, 0.5)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
                        }}
                    >
                        <Check size={20} />
                        Save Race
                    </button>
                )}
            </div>
        </div>
    );
}

export default RaceCreator;