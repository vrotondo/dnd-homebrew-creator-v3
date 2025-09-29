// src/components/creators/character/BackgroundCreator.jsx - COMPLETE SIMPLIFIED VERSION
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { saveBackground, getBackgroundById } from '../../../utils/storageService';
import { ChevronLeft, ChevronRight, Check, BookOpen, AlertCircle } from 'lucide-react';

// Simplified D&D 5e Skills
const DND_SKILLS = [
    'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception',
    'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine',
    'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion',
    'Sleight of Hand', 'Stealth', 'Survival'
];

const DND_TOOLS = [
    'Alchemist\'s Supplies', 'Brewer\'s Supplies', 'Calligrapher\'s Supplies',
    'Carpenter\'s Tools', 'Cartographer\'s Tools', 'Cobbler\'s Tools',
    'Cook\'s Utensils', 'Glassblower\'s Tools', 'Jeweler\'s Tools',
    'Leatherworker\'s Tools', 'Mason\'s Tools', 'Painter\'s Supplies',
    'Potter\'s Tools', 'Smith\'s Tools', 'Tinker\'s Tools', 'Weaver\'s Tools',
    'Woodcarver\'s Tools', 'Disguise Kit', 'Forgery Kit', 'Gaming Set',
    'Herbalism Kit', 'Musical Instrument', 'Navigator\'s Tools', 'Poisoner\'s Kit',
    'Thieves\' Tools', 'Vehicles (Land)', 'Vehicles (Water)'
];

const DND_LANGUAGES = [
    'Common', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin',
    'Halfling', 'Orc', 'Abyssal', 'Celestial', 'Draconic', 'Deep Speech',
    'Infernal', 'Primordial', 'Sylvan', 'Undercommon'
];

function BackgroundCreator({ onSave, onCancel }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const [currentStep, setCurrentStep] = useState(1);
    const [backgroundData, setBackgroundData] = useState({
        name: '',
        description: '',
        skillProficiencies: [],
        toolProficiencies: [],
        languages: ['Common'],
        equipment: [],
        feature: {
            name: '',
            description: ''
        }
    });

    const [errors, setErrors] = useState({});

    const steps = [
        { id: 1, name: 'Basic Info' },
        { id: 2, name: 'Proficiencies' },
        { id: 3, name: 'Feature' },
        { id: 4, name: 'Equipment' },
        { id: 5, name: 'Preview' }
    ];

    useEffect(() => {
        if (id) {
            const existingBackground = getBackgroundById(id);
            if (existingBackground) {
                setBackgroundData(existingBackground);
            }
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBackgroundData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSkillToggle = (skill) => {
        setBackgroundData(prev => {
            const skills = prev.skillProficiencies.includes(skill)
                ? prev.skillProficiencies.filter(s => s !== skill)
                : [...prev.skillProficiencies, skill];
            return { ...prev, skillProficiencies: skills };
        });
    };

    const handleToolToggle = (tool) => {
        setBackgroundData(prev => {
            const tools = prev.toolProficiencies.includes(tool)
                ? prev.toolProficiencies.filter(t => t !== tool)
                : [...prev.toolProficiencies, tool];
            return { ...prev, toolProficiencies: tools };
        });
    };

    const handleEquipmentChange = (index, value) => {
        setBackgroundData(prev => {
            const equipment = [...prev.equipment];
            equipment[index] = value;
            return { ...prev, equipment };
        });
    };

    const addEquipment = () => {
        setBackgroundData(prev => ({
            ...prev,
            equipment: [...prev.equipment, '']
        }));
    };

    const removeEquipment = (index) => {
        setBackgroundData(prev => ({
            ...prev,
            equipment: prev.equipment.filter((_, i) => i !== index)
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (currentStep === 1) {
            if (!backgroundData.name.trim()) newErrors.name = 'Name is required';
            if (!backgroundData.description.trim()) newErrors.description = 'Description is required';
            else if (backgroundData.description.length < 20) newErrors.description = 'Description must be at least 20 characters';
        }

        if (currentStep === 2) {
            if (backgroundData.skillProficiencies.length === 0) newErrors.skills = 'Select at least one skill proficiency';
        }

        if (currentStep === 3) {
            if (!backgroundData.feature.name.trim()) newErrors.featureName = 'Feature name is required';
            if (!backgroundData.feature.description.trim()) newErrors.featureDescription = 'Feature description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validate()) {
            setCurrentStep(currentStep + 1);
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
                    <div style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#111827' }}>
                            Basic Information
                        </h3>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
                                Background Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={backgroundData.name}
                                onChange={handleInputChange}
                                placeholder="e.g., Guild Artisan, Folk Hero, Sage"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: errors.name ? '2px solid #ef4444' : '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    transition: 'all 0.2s'
                                }}
                                onFocus={(e) => {
                                    if (!errors.name) {
                                        e.target.style.borderColor = '#3b82f6';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                    }
                                }}
                                onBlur={(e) => {
                                    if (!errors.name) {
                                        e.target.style.borderColor = '#d1d5db';
                                        e.target.style.boxShadow = 'none';
                                    }
                                }}
                            />
                            {errors.name && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                    <AlertCircle size={14} style={{ color: '#ef4444' }} />
                                    <p style={{ color: '#ef4444', fontSize: '14px', margin: 0 }}>{errors.name}</p>
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={backgroundData.description}
                                onChange={handleInputChange}
                                placeholder="Describe the background's history, typical members, and their place in society..."
                                rows={6}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: errors.description ? '2px solid #ef4444' : '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                    transition: 'all 0.2s'
                                }}
                                onFocus={(e) => {
                                    if (!errors.description) {
                                        e.target.style.borderColor = '#3b82f6';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                    }
                                }}
                                onBlur={(e) => {
                                    if (!errors.description) {
                                        e.target.style.borderColor = '#d1d5db';
                                        e.target.style.boxShadow = 'none';
                                    }
                                }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                {errors.description ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <AlertCircle size={14} style={{ color: '#ef4444' }} />
                                        <p style={{ color: '#ef4444', fontSize: '14px', margin: 0 }}>{errors.description}</p>
                                    </div>
                                ) : (
                                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                                        Minimum 20 characters
                                    </p>
                                )}
                                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                                    {backgroundData.description.length} characters
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Proficiencies
                return (
                    <div style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#111827' }}>
                            Proficiencies & Languages
                        </h3>

                        {/* Skill Proficiencies */}
                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '12px', fontSize: '16px', color: '#374151' }}>
                                Skill Proficiencies *
                            </label>
                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                                Select 2 skill proficiencies for this background
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                                {DND_SKILLS.map(skill => (
                                    <div
                                        key={skill}
                                        onClick={() => handleSkillToggle(skill)}
                                        style={{
                                            padding: '12px 16px',
                                            border: backgroundData.skillProficiencies.includes(skill) ? '2px solid #3b82f6' : '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            background: backgroundData.skillProficiencies.includes(skill) ? '#eff6ff' : 'white',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '4px',
                                            border: '2px solid ' + (backgroundData.skillProficiencies.includes(skill) ? '#3b82f6' : '#d1d5db'),
                                            background: backgroundData.skillProficiencies.includes(skill) ? '#3b82f6' : 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '12px'
                                        }}>
                                            {backgroundData.skillProficiencies.includes(skill) && '✓'}
                                        </div>
                                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>{skill}</span>
                                    </div>
                                ))}
                            </div>
                            {errors.skills && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                                    <AlertCircle size={14} style={{ color: '#ef4444' }} />
                                    <p style={{ color: '#ef4444', fontSize: '14px', margin: 0 }}>{errors.skills}</p>
                                </div>
                            )}
                        </div>

                        {/* Tool Proficiencies */}
                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '12px', fontSize: '16px', color: '#374151' }}>
                                Tool Proficiencies (Optional)
                            </label>
                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                                Select any tool proficiencies this background provides
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                                {DND_TOOLS.map(tool => (
                                    <div
                                        key={tool}
                                        onClick={() => handleToolToggle(tool)}
                                        style={{
                                            padding: '12px 16px',
                                            border: backgroundData.toolProficiencies.includes(tool) ? '2px solid #10b981' : '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            background: backgroundData.toolProficiencies.includes(tool) ? '#d1fae5' : 'white',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '4px',
                                            border: '2px solid ' + (backgroundData.toolProficiencies.includes(tool) ? '#10b981' : '#d1d5db'),
                                            background: backgroundData.toolProficiencies.includes(tool) ? '#10b981' : 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '12px',
                                            flexShrink: 0
                                        }}>
                                            {backgroundData.toolProficiencies.includes(tool) && '✓'}
                                        </div>
                                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>{tool}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Languages */}
                        <div>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '12px', fontSize: '16px', color: '#374151' }}>
                                Languages
                            </label>
                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                                Characters with this background can speak these languages. Common is included by default.
                            </p>

                            {/* Language Selection Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                                {DND_LANGUAGES.map(lang => {
                                    const isSelected = backgroundData.languages.includes(lang);
                                    return (
                                        <div
                                            key={lang}
                                            onClick={() => {
                                                if (lang === 'Common') return; // Can't deselect Common
                                                if (isSelected) {
                                                    setBackgroundData(prev => ({
                                                        ...prev,
                                                        languages: prev.languages.filter(l => l !== lang)
                                                    }));
                                                } else {
                                                    setBackgroundData(prev => ({
                                                        ...prev,
                                                        languages: [...prev.languages, lang]
                                                    }));
                                                }
                                            }}
                                            style={{
                                                padding: '10px 14px',
                                                border: isSelected ? '2px solid #8b5cf6' : '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                cursor: lang === 'Common' ? 'not-allowed' : 'pointer',
                                                background: isSelected ? '#f3e8ff' : 'white',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                opacity: lang === 'Common' ? 0.7 : 1
                                            }}
                                            onMouseOver={(e) => {
                                                if (lang !== 'Common') {
                                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                                }
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <div style={{
                                                width: '18px',
                                                height: '18px',
                                                borderRadius: '4px',
                                                border: '2px solid ' + (isSelected ? '#8b5cf6' : '#d1d5db'),
                                                background: isSelected ? '#8b5cf6' : 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '10px',
                                                flexShrink: 0
                                            }}>
                                                {isSelected && '✓'}
                                            </div>
                                            <span style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>{lang}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Custom Language Input */}
                            <div style={{
                                padding: '16px',
                                background: '#f9fafb',
                                borderRadius: '8px',
                                border: '1px dashed #d1d5db'
                            }}>
                                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
                                    Or add a custom language
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="text"
                                        placeholder="e.g., Ancient Draconic, Thieves' Cant"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && e.target.value.trim()) {
                                                const newLang = e.target.value.trim();
                                                if (!backgroundData.languages.includes(newLang)) {
                                                    setBackgroundData(prev => ({
                                                        ...prev,
                                                        languages: [...prev.languages, newLang]
                                                    }));
                                                }
                                                e.target.value = '';
                                            }
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: '10px 12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px'
                                        }}
                                    />
                                    <button
                                        onClick={(e) => {
                                            const input = e.target.parentElement.querySelector('input');
                                            if (input.value.trim()) {
                                                const newLang = input.value.trim();
                                                if (!backgroundData.languages.includes(newLang)) {
                                                    setBackgroundData(prev => ({
                                                        ...prev,
                                                        languages: [...prev.languages, newLang]
                                                    }));
                                                }
                                                input.value = '';
                                            }
                                        }}
                                        style={{
                                            padding: '10px 20px',
                                            background: '#8b5cf6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            fontSize: '14px'
                                        }}
                                    >
                                        Add
                                    </button>
                                </div>
                                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                                    Press Enter or click Add to include custom languages
                                </p>
                            </div>

                            {/* Selected Languages Display */}
                            {backgroundData.languages.length > 1 && (
                                <div style={{ marginTop: '16px' }}>
                                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                        Selected Languages ({backgroundData.languages.length}):
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {backgroundData.languages.map((lang, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    padding: '6px 12px',
                                                    background: '#f3e8ff',
                                                    color: '#6d28d9',
                                                    borderRadius: '9999px',
                                                    fontSize: '13px',
                                                    fontWeight: '500',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}
                                            >
                                                {lang}
                                                {lang !== 'Common' && (
                                                    <button
                                                        onClick={() => {
                                                            setBackgroundData(prev => ({
                                                                ...prev,
                                                                languages: prev.languages.filter(l => l !== lang)
                                                            }));
                                                        }}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: '#6d28d9',
                                                            cursor: 'pointer',
                                                            fontSize: '16px',
                                                            lineHeight: 1,
                                                            padding: '0 2px'
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 3: // Feature
                return (
                    <div style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#111827' }}>
                            Background Feature
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                            Every background provides a unique feature that gives special abilities or benefits in specific situations.
                        </p>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
                                Feature Name *
                            </label>
                            <input
                                type="text"
                                value={backgroundData.feature.name}
                                onChange={(e) => setBackgroundData(prev => ({
                                    ...prev,
                                    feature: { ...prev.feature, name: e.target.value }
                                }))}
                                placeholder="e.g., Guild Membership, By Popular Demand"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: errors.featureName ? '2px solid #ef4444' : '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    outline: 'none'
                                }}
                            />
                            {errors.featureName && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                    <AlertCircle size={14} style={{ color: '#ef4444' }} />
                                    <p style={{ color: '#ef4444', fontSize: '14px', margin: 0 }}>{errors.featureName}</p>
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
                                Feature Description *
                            </label>
                            <textarea
                                value={backgroundData.feature.description}
                                onChange={(e) => setBackgroundData(prev => ({
                                    ...prev,
                                    feature: { ...prev.feature, description: e.target.value }
                                }))}
                                placeholder="Describe what this feature does and how it benefits the character..."
                                rows={8}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: errors.featureDescription ? '2px solid #ef4444' : '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                    resize: 'vertical'
                                }}
                            />
                            {errors.featureDescription && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                    <AlertCircle size={14} style={{ color: '#ef4444' }} />
                                    <p style={{ color: '#ef4444', fontSize: '14px', margin: 0 }}>{errors.featureDescription}</p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 4: // Equipment
                return (
                    <div style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#111827' }}>
                            Starting Equipment
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                            Define the equipment a character with this background starts with (optional).
                        </p>

                        {backgroundData.equipment.length === 0 ? (
                            <div style={{
                                padding: '48px',
                                border: '2px dashed #d1d5db',
                                borderRadius: '12px',
                                textAlign: 'center'
                            }}>
                                <p style={{ color: '#6b7280', marginBottom: '16px' }}>No equipment added yet</p>
                                <button
                                    onClick={addEquipment}
                                    style={{
                                        padding: '12px 24px',
                                        background: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    + Add Equipment Item
                                </button>
                            </div>
                        ) : (
                            <>
                                {backgroundData.equipment.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => handleEquipmentChange(index, e.target.value)}
                                            placeholder="e.g., A set of artisan's tools, A letter of introduction from your guild"
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        />
                                        <button
                                            onClick={() => removeEquipment(index)}
                                            style={{
                                                padding: '12px 16px',
                                                background: '#ef4444',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontWeight: '500'
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={addEquipment}
                                    style={{
                                        padding: '12px 24px',
                                        background: '#f3f4f6',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        color: '#374151',
                                        marginTop: '8px'
                                    }}
                                >
                                    + Add Another Item
                                </button>
                            </>
                        )}
                    </div>
                );

            case 5: // Preview
                return (
                    <div style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#111827' }}>
                            Background Preview
                        </h3>

                        {/* Preview Card */}
                        <div style={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                            borderRadius: '16px',
                            padding: '32px',
                            color: 'white',
                            marginBottom: '24px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                <BookOpen size={40} />
                                <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>{backgroundData.name}</h2>
                            </div>
                            <p style={{ fontSize: '16px', lineHeight: '1.6', opacity: 0.9 }}>{backgroundData.description}</p>
                        </div>

                        {/* Details Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                            {/* Skills */}
                            <div style={{
                                background: '#f9fafb',
                                padding: '24px',
                                borderRadius: '12px',
                                border: '1px solid #e5e7eb'
                            }}>
                                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>
                                    Skill Proficiencies
                                </h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {backgroundData.skillProficiencies.map((skill, i) => (
                                        <span
                                            key={i}
                                            style={{
                                                padding: '6px 12px',
                                                background: '#dbeafe',
                                                color: '#1e40af',
                                                borderRadius: '9999px',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Tools */}
                            {backgroundData.toolProficiencies.length > 0 && (
                                <div style={{
                                    background: '#f9fafb',
                                    padding: '24px',
                                    borderRadius: '12px',
                                    border: '1px solid #e5e7eb'
                                }}>
                                    <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>
                                        Tool Proficiencies
                                    </h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {backgroundData.toolProficiencies.map((tool, i) => (
                                            <span
                                                key={i}
                                                style={{
                                                    padding: '6px 12px',
                                                    background: '#d1fae5',
                                                    color: '#065f46',
                                                    borderRadius: '9999px',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Feature */}
                        <div style={{
                            background: '#fef3c7',
                            padding: '24px',
                            borderRadius: '12px',
                            border: '2px solid #fbbf24',
                            marginBottom: '24px'
                        }}>
                            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#92400e' }}>
                                Feature: {backgroundData.feature.name}
                            </h4>
                            <p style={{ fontSize: '14px', color: '#78350f', lineHeight: '1.6' }}>
                                {backgroundData.feature.description}
                            </p>
                        </div>

                        {/* Equipment */}
                        {backgroundData.equipment.length > 0 && (
                            <div style={{
                                background: '#f9fafb',
                                padding: '24px',
                                borderRadius: '12px',
                                border: '1px solid #e5e7eb'
                            }}>
                                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>
                                    Starting Equipment
                                </h4>
                                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                    {backgroundData.equipment.map((item, i) => (
                                        <li key={i} style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
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
                background: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                overflowX: 'auto'
            }}>
                {steps.map((step, index) => (
                    <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: '600',
                                background: currentStep === step.id ? '#3b82f6' : currentStep > step.id ? '#10b981' : '#e5e7eb',
                                color: currentStep >= step.id ? 'white' : '#6b7280',
                                border: currentStep === step.id ? '3px solid #93c5fd' : 'none'
                            }}>
                                {currentStep > step.id ? '✓' : step.id}
                            </div>
                            <span style={{
                                fontSize: '14px',
                                fontWeight: currentStep === step.id ? '600' : '400',
                                color: currentStep === step.id ? '#1e40af' : '#6b7280',
                                whiteSpace: 'nowrap'
                            }}>
                                {step.name}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div style={{
                                flex: 1,
                                height: '2px',
                                background: currentStep > step.id ? '#10b981' : '#e5e7eb',
                                margin: '0 16px',
                                minWidth: '20px'
                            }} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div style={{
                background: 'white',
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
                        background: currentStep === 1 ? '#f3f4f6' : '#6b7280',
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
                            background: 'white',
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
                                background: '#3b82f6',
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
                                background: '#10b981',
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