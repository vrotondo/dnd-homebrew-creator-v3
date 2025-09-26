// src/components/creators/character/ClassCreator.jsx - FIXED to work with existing UI system
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

// Constants
const ABILITY_SCORES = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];
const HIT_DICE = [6, 8, 10, 12];
const SKILLS = [
    'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History',
    'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception',
    'Performance', 'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival'
];

const ARMOR_TYPES = ['Light armor', 'Medium armor', 'Heavy armor', 'Shields', 'Padded', 'Leather', 'Studded leather'];
const WEAPON_TYPES = ['Simple weapons', 'Martial weapons', 'Shortswords', 'Longswords', 'Crossbows', 'Longbows'];

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

// STEP COMPONENTS

const BasicInfoStep = ({ classData, handleFieldChange, errors, touched }) => (
    <div className="creator-step">
        <div className="step-header">
            <div className="step-icon">
                <Brain className="icon-large" />
            </div>
            <div className="step-title">
                <h2>Class Identity</h2>
                <p>Every great class starts with a compelling identity. Give your class a unique name and description that captures its essence and role in the world.</p>
            </div>
        </div>

        <div className="creator-content">
            <Card>
                <CardHeader>
                    <h3>Basic Information</h3>
                    <p>Define the core identity of your class</p>
                </CardHeader>
                <CardContent>
                    <div className="form-grid">
                        <Input
                            label="Class Name"
                            value={classData.name || ''}
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                            placeholder="e.g., Mystic Knight, Soul Weaver, Storm Caller"
                            required
                            error={touched.name && errors.name}
                            helperText="Choose a memorable name that reflects the class's unique abilities and theme"
                        />

                        <div className="form-field">
                            <label className="form-label">
                                Class Description
                                <span className="form-required">*</span>
                            </label>
                            <textarea
                                value={classData.description || ''}
                                onChange={(e) => handleFieldChange('description', e.target.value)}
                                placeholder="Describe the class's role, abilities, thematic elements, and what makes it unique in your world..."
                                rows={5}
                                className={`form-input form-textarea ${touched.description && errors.description ? 'form-input-error' : ''}`}
                            />
                            {touched.description && errors.description && (
                                <p className="form-error">
                                    <AlertCircle className="form-error-icon" />
                                    {errors.description}
                                </p>
                            )}
                            <p className="form-helper">Describe the class's role, background, and what makes it special</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="creator-grid">
                <Card>
                    <CardHeader>
                        <h3><Heart className="inline-icon" /> Hit Die</h3>
                        <p>Determines how much health your class gains per level</p>
                    </CardHeader>
                    <CardContent>
                        <div className="selection-grid">
                            {HIT_DICE.map(die => (
                                <div
                                    key={die}
                                    className={`selection-option ${classData.hitDie === die ? 'selected' : ''}`}
                                    onClick={() => handleFieldChange('hitDie', die)}
                                >
                                    <Heart className="option-icon" />
                                    <div className="option-label">d{die}</div>
                                    <div className="option-description">
                                        {die === 6 && 'Fragile'}
                                        {die === 8 && 'Average'}
                                        {die === 10 && 'Hardy'}
                                        {die === 12 && 'Tough'}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {touched.hitDie && errors.hitDie && (
                            <p className="form-error">
                                <AlertCircle className="form-error-icon" />
                                {errors.hitDie}
                            </p>
                        )}
                        <p className="form-helper">Higher hit dice = more HP per level. Consider your class's intended role.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h3><Brain className="inline-icon" /> Primary Abilities</h3>
                        <p>Choose 1-2 abilities most important for this class</p>
                    </CardHeader>
                    <CardContent>
                        <div className="checkbox-grid">
                            {ABILITY_SCORES.map(ability => {
                                const isSelected = classData.primaryAbility?.includes(ability);
                                const canSelect = !isSelected && (classData.primaryAbility?.length || 0) < 2;

                                return (
                                    <div
                                        key={ability}
                                        className={`checkbox-option ${isSelected ? 'selected' : ''} ${!isSelected && !canSelect ? 'disabled' : ''}`}
                                        onClick={() => {
                                            if (isSelected || canSelect) {
                                                const current = classData.primaryAbility || [];
                                                const updated = isSelected
                                                    ? current.filter(a => a !== ability)
                                                    : [...current, ability];
                                                handleFieldChange('primaryAbility', updated);
                                            }
                                        }}
                                    >
                                        <div className="checkbox-input">
                                            {isSelected && <CheckCircle className="checkbox-icon" />}
                                        </div>
                                        <div className="checkbox-label">{ability}</div>
                                    </div>
                                );
                            })}
                        </div>
                        {touched.primaryAbility && errors.primaryAbility && (
                            <p className="form-error">
                                <AlertCircle className="form-error-icon" />
                                {errors.primaryAbility}
                            </p>
                        )}
                        <p className="form-helper">Selected: {classData.primaryAbility?.length || 0}/2 abilities</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
);

const ProficienciesStep = ({ classData, handleFieldChange, errors, touched }) => (
    <div className="creator-step">
        <div className="step-header">
            <div className="step-icon">
                <Shield className="icon-large" />
            </div>
            <div className="step-title">
                <h2>Proficiencies & Skills</h2>
                <p>Define what your class is trained in - saving throws, skills, armor, and weapons that reflect their background and abilities.</p>
            </div>
        </div>

        <div className="creator-content">
            <Card>
                <CardHeader>
                    <h3><Star className="inline-icon" /> Saving Throw Proficiencies</h3>
                    <p>Choose exactly 2 ability scores for saving throw proficiency</p>
                </CardHeader>
                <CardContent>
                    <div className="checkbox-grid">
                        {ABILITY_SCORES.map(ability => {
                            const isSelected = classData.savingThrows?.includes(ability);
                            const canSelect = !isSelected && (classData.savingThrows?.length || 0) < 2;

                            return (
                                <div
                                    key={ability}
                                    className={`checkbox-option ${isSelected ? 'selected' : ''} ${!isSelected && !canSelect ? 'disabled' : ''}`}
                                    onClick={() => {
                                        if (isSelected || canSelect) {
                                            const current = classData.savingThrows || [];
                                            const updated = isSelected
                                                ? current.filter(a => a !== ability)
                                                : [...current, ability];
                                            handleFieldChange('savingThrows', updated);
                                        }
                                    }}
                                >
                                    <div className="checkbox-input">
                                        {isSelected && <CheckCircle className="checkbox-icon" />}
                                    </div>
                                    <div className="checkbox-label">{ability}</div>
                                    <div className="checkbox-description">{ability.slice(0, 3).toUpperCase()}</div>
                                </div>
                            );
                        })}
                    </div>
                    {touched.savingThrows && errors.savingThrows && (
                        <p className="form-error">
                            <AlertCircle className="form-error-icon" />
                            {errors.savingThrows}
                        </p>
                    )}
                    <p className="form-helper">Selected: {classData.savingThrows?.length || 0}/2 saving throws</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <h3>Skill Proficiencies</h3>
                    <p>Define how many skills characters can choose and from which options</p>
                </CardHeader>
                <CardContent>
                    <div className="form-grid">
                        <div className="form-field">
                            <label className="form-label">Number of Skills</label>
                            <select
                                value={classData.skillChoices?.count || 2}
                                onChange={(e) => handleFieldChange('skillChoices', {
                                    ...classData.skillChoices,
                                    count: parseInt(e.target.value) || 0
                                })}
                                className="form-input form-select"
                            >
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                    <option key={num} value={num}>{num} {num === 1 ? 'skill' : 'skills'}</option>
                                ))}
                            </select>
                            <p className="form-helper">How many skills can players choose?</p>
                        </div>
                    </div>

                    <div className="form-field">
                        <label className="form-label">Available Skills</label>
                        <div className="skills-grid">
                            {SKILLS.map(skill => {
                                const isSelected = classData.skillChoices?.options?.includes(skill);
                                return (
                                    <div
                                        key={skill}
                                        className={`skill-option ${isSelected ? 'selected' : ''}`}
                                        onClick={() => {
                                            const current = classData.skillChoices?.options || [];
                                            const updated = isSelected
                                                ? current.filter(s => s !== skill)
                                                : [...current, skill];
                                            handleFieldChange('skillChoices', {
                                                ...classData.skillChoices,
                                                options: updated
                                            });
                                        }}
                                    >
                                        <div className="skill-checkbox">
                                            {isSelected && <CheckCircle className="skill-icon" />}
                                        </div>
                                        <span className="skill-name">{skill}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="form-helper">Selected: {classData.skillChoices?.options?.length || 0} skills available for players to choose from</p>
                    </div>
                </CardContent>
            </Card>

            <div className="creator-grid">
                <Card>
                    <CardHeader>
                        <h3><Shield className="inline-icon" /> Armor Proficiencies</h3>
                        <p>What armor can this class use?</p>
                    </CardHeader>
                    <CardContent>
                        <div className="proficiency-list">
                            {ARMOR_TYPES.map(armor => {
                                const current = classData.proficiencies?.armor || [];
                                const isSelected = current.includes(armor);
                                return (
                                    <div
                                        key={armor}
                                        className={`proficiency-item ${isSelected ? 'selected' : ''}`}
                                        onClick={() => {
                                            const updated = isSelected
                                                ? current.filter(a => a !== armor)
                                                : [...current, armor];
                                            handleFieldChange('proficiencies', {
                                                ...classData.proficiencies,
                                                armor: updated
                                            });
                                        }}
                                    >
                                        <div className="proficiency-checkbox">
                                            {isSelected && <CheckCircle className="proficiency-icon" />}
                                        </div>
                                        <span className="proficiency-name">{armor}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h3><Sword className="inline-icon" /> Weapon Proficiencies</h3>
                        <p>What weapons can this class use?</p>
                    </CardHeader>
                    <CardContent>
                        <div className="proficiency-list">
                            {WEAPON_TYPES.map(weapon => {
                                const current = classData.proficiencies?.weapons || [];
                                const isSelected = current.includes(weapon);
                                return (
                                    <div
                                        key={weapon}
                                        className={`proficiency-item ${isSelected ? 'selected' : ''}`}
                                        onClick={() => {
                                            const updated = isSelected
                                                ? current.filter(w => w !== weapon)
                                                : [...current, weapon];
                                            handleFieldChange('proficiencies', {
                                                ...classData.proficiencies,
                                                weapons: updated
                                            });
                                        }}
                                    >
                                        <div className="proficiency-checkbox">
                                            {isSelected && <CheckCircle className="proficiency-icon" />}
                                        </div>
                                        <span className="proficiency-name">{weapon}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
);

// COMPLETE STEP IMPLEMENTATIONS (using your existing code)

const EquipmentStep = ({ classData, handleFieldChange, errors, touched }) => {
    const [newStandardItem, setNewStandardItem] = useState('');
    const [newOptionA, setNewOptionA] = useState('');
    const [newOptionB, setNewOptionB] = useState('');

    const equipment = classData.startingEquipment || {
        standard: [],
        options: [],
        startingGold: '',
        alternateRule: ''
    };

    const updateEquipment = (updates) => {
        handleFieldChange('startingEquipment', {
            ...equipment,
            ...updates
        });
    };

    const addStandardItem = () => {
        if (newStandardItem.trim()) {
            const updated = [...(equipment.standard || []), newStandardItem.trim()];
            updateEquipment({ standard: updated });
            setNewStandardItem('');
        }
    };

    const removeStandardItem = (index) => {
        const updated = equipment.standard.filter((_, i) => i !== index);
        updateEquipment({ standard: updated });
    };

    const addEquipmentOption = () => {
        if (newOptionA.trim() && newOptionB.trim()) {
            const newOption = {
                id: Date.now(),
                optionA: newOptionA.trim(),
                optionB: newOptionB.trim()
            };
            const updated = [...(equipment.options || []), newOption];
            updateEquipment({ options: updated });
            setNewOptionA('');
            setNewOptionB('');
        }
    };

    const removeEquipmentOption = (index) => {
        const updated = equipment.options.filter((_, i) => i !== index);
        updateEquipment({ options: updated });
    };

    const equipmentSuggestions = {
        weapons: ['a simple weapon of your choice', 'a martial weapon of your choice', 'a light crossbow and 20 bolts', 'a shortbow and a quiver of 20 arrows'],
        armor: ['leather armor', 'studded leather armor', 'chain mail', 'scale mail'],
        equipment: ['a dungeoneer\'s pack', 'an explorer\'s pack', 'a scholar\'s pack', 'thieves\' tools']
    };

    return (
        <div className="creator-step">
            <div className="step-header">
                <div className="step-icon">
                    <Package className="icon-large" />
                </div>
                <div className="step-title">
                    <h2>Starting Equipment</h2>
                    <p>Define what equipment characters get when they choose this class at 1st level.</p>
                </div>
            </div>

            <div className="creator-content">
                <Card>
                    <CardHeader>
                        <h3><Package className="inline-icon" /> Guaranteed Equipment</h3>
                        <p>Items that every character of this class automatically receives.</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {equipment.standard?.length > 0 && (
                                <div className="space-y-2">
                                    {equipment.standard.map((item, index) => (
                                        <div key={index} className="proficiency-item selected">
                                            <span className="proficiency-name">{item}</span>
                                            <button
                                                className="button-small button-danger"
                                                onClick={() => removeStandardItem(index)}
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <input
                                    placeholder="e.g., leather armor, a dagger, explorer's pack"
                                    value={newStandardItem}
                                    onChange={(e) => setNewStandardItem(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addStandardItem()}
                                    className="form-input flex-1"
                                />
                                <button
                                    onClick={addStandardItem}
                                    disabled={!newStandardItem.trim()}
                                    className="btn btn-primary"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mt-4">
                                {Object.entries(equipmentSuggestions).map(([category, items]) => (
                                    <Card key={category}>
                                        <CardContent className="p-4">
                                            <h6 className="font-medium mb-2 capitalize">{category}</h6>
                                            <div className="space-y-1">
                                                {items.slice(0, 4).map((item, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setNewStandardItem(item)}
                                                        className="text-xs text-blue-600 hover:text-blue-700 block text-left w-full"
                                                    >
                                                        {item}
                                                    </button>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h3>Equipment Choices</h3>
                        <p>Give players choices between different equipment options.</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {equipment.options?.length > 0 && (
                                <div className="space-y-3">
                                    {equipment.options.map((option, index) => (
                                        <div key={option.id || index} className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <h5 className="font-medium">Choice {index + 1}</h5>
                                                <button
                                                    onClick={() => removeEquipmentOption(index)}
                                                    className="button-small button-danger"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="p-3 bg-white rounded border">
                                                    <strong>Option A:</strong> {option.optionA}
                                                </div>
                                                <div className="p-3 bg-white rounded border">
                                                    <strong>Option B:</strong> {option.optionB}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                <h5 className="font-medium mb-3">Add New Choice</h5>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <input
                                        placeholder="Option A (e.g., scale mail)"
                                        value={newOptionA}
                                        onChange={(e) => setNewOptionA(e.target.value)}
                                        className="form-input"
                                    />
                                    <input
                                        placeholder="Option B (e.g., leather armor and shield)"
                                        value={newOptionB}
                                        onChange={(e) => setNewOptionB(e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <button
                                    onClick={addEquipmentOption}
                                    disabled={!newOptionA.trim() || !newOptionB.trim()}
                                    className="btn btn-primary"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Choice
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const FeaturesStep = ({ classData, handleFieldChange, errors, touched }) => {
    const [selectedLevel, setSelectedLevel] = useState(1);
    const [newFeatureName, setNewFeatureName] = useState('');
    const [newFeatureDescription, setNewFeatureDescription] = useState('');

    const features = classData.features || {};
    const levels = Array.from({ length: 20 }, (_, i) => i + 1);

    const addFeature = () => {
        if (newFeatureName.trim() && newFeatureDescription.trim()) {
            const levelFeatures = features[selectedLevel] || [];
            const newFeature = {
                id: Date.now(),
                name: newFeatureName.trim(),
                description: newFeatureDescription.trim()
            };

            handleFieldChange('features', {
                ...features,
                [selectedLevel]: [...levelFeatures, newFeature]
            });

            setNewFeatureName('');
            setNewFeatureDescription('');
        }
    };

    const removeFeature = (level, featureId) => {
        const levelFeatures = features[level] || [];
        const updated = levelFeatures.filter(f => f.id !== featureId);

        if (updated.length === 0) {
            const newFeatures = { ...features };
            delete newFeatures[level];
            handleFieldChange('features', newFeatures);
        } else {
            handleFieldChange('features', {
                ...features,
                [level]: updated
            });
        }
    };

    return (
        <div className="creator-step">
            <div className="step-header">
                <div className="step-icon">
                    <Zap className="icon-large" />
                </div>
                <div className="step-title">
                    <h2>Class Features</h2>
                    <p>Design the unique abilities and features that characters gain as they advance in this class.</p>
                </div>
            </div>

            <div className="creator-content">
                <div className="creator-grid">
                    <Card>
                        <CardHeader>
                            <h3>Select Level</h3>
                            <p>Choose which level to add features to</p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-4 gap-2">
                                {levels.map(level => {
                                    const hasFeatures = features[level]?.length > 0;
                                    return (
                                        <button
                                            key={level}
                                            onClick={() => setSelectedLevel(level)}
                                            className={`p-3 rounded border text-center transition-all relative ${selectedLevel === level
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="font-bold">{level}</div>
                                            {hasFeatures && (
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <h3>Level {selectedLevel} Features</h3>
                            <p>Features gained at level {selectedLevel}</p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {features[selectedLevel]?.map(feature => (
                                    <div key={feature.id} className="p-4 bg-gray-50 rounded-lg border">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h5 className="font-semibold mb-2">{feature.name}</h5>
                                                <p className="text-sm text-gray-600">{feature.description}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFeature(selectedLevel, feature.id)}
                                                className="button-small button-danger ml-3"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                    <h5 className="font-medium mb-3">Add New Feature</h5>
                                    <div className="space-y-3">
                                        <input
                                            placeholder="Feature name (e.g., Fighting Style, Spellcasting)"
                                            value={newFeatureName}
                                            onChange={(e) => setNewFeatureName(e.target.value)}
                                            className="form-input"
                                        />
                                        <textarea
                                            placeholder="Feature description and mechanics..."
                                            value={newFeatureDescription}
                                            onChange={(e) => setNewFeatureDescription(e.target.value)}
                                            rows={3}
                                            className="form-input form-textarea"
                                        />
                                        <button
                                            onClick={addFeature}
                                            disabled={!newFeatureName.trim() || !newFeatureDescription.trim()}
                                            className="btn btn-primary"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Feature
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const SpellcastingStep = ({ classData, handleFieldChange, errors, touched }) => {
    const spellcasting = classData.spellcasting || {
        enabled: false,
        ability: '',
        type: 'full',
        startLevel: 1,
        focusType: '',
        ritualCasting: false,
        spellList: 'custom'
    };

    const updateSpellcasting = (updates) => {
        handleFieldChange('spellcasting', {
            ...spellcasting,
            ...updates
        });
    };

    const toggleSpellcasting = () => {
        if (spellcasting.enabled) {
            handleFieldChange('spellcasting', { enabled: false });
        } else {
            updateSpellcasting({
                enabled: true,
                ability: 'Intelligence',
                type: 'full',
                startLevel: 1
            });
        }
    };

    if (!spellcasting.enabled) {
        return (
            <div className="creator-step">
                <div className="step-header">
                    <div className="step-icon">
                        <Wand2 className="icon-large" />
                    </div>
                    <div className="step-title">
                        <h2>Spellcasting</h2>
                        <p>Does this class have magical abilities? Configure spellcasting mechanics and magical focus.</p>
                    </div>
                </div>

                <div className="creator-content">
                    <div className="grid grid-cols-2 gap-6">
                        <Card className="cursor-pointer border-2 hover:border-gray-400" onClick={() => { }}>
                            <CardContent className="text-center py-8">
                                <Sword className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h5 className="text-xl font-semibold text-gray-700 mb-3">No Spellcasting</h5>
                                <p className="text-gray-600">This class relies on non-magical abilities and features.</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    <strong>Examples:</strong> Fighter, Rogue, Barbarian, Monk
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="cursor-pointer border-2 border-blue-300 bg-blue-50" onClick={toggleSpellcasting}>
                            <CardContent className="text-center py-8">
                                <Wand2 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                                <h5 className="text-xl font-semibold text-blue-700 mb-3">Enable Spellcasting</h5>
                                <p className="text-gray-600">This class can cast spells and has magical abilities.</p>
                                <button className="btn btn-primary mt-4">
                                    <Zap className="w-4 h-4 mr-2" />
                                    Add Spellcasting
                                </button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="creator-step">
            <div className="step-header">
                <div className="step-icon">
                    <Wand2 className="icon-large" />
                </div>
                <div className="step-title">
                    <h2>Spellcasting Configuration</h2>
                    <p>Configure how this class uses magic and arcane abilities.</p>
                </div>
            </div>

            <div className="creator-content">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <h3><Wand2 className="inline-icon" /> Spellcasting Configuration</h3>
                                <p>Configure magical abilities and spell mechanics</p>
                            </div>
                            <button
                                onClick={toggleSpellcasting}
                                className="button-small button-danger"
                            >
                                <X className="w-4 h-4 mr-1" />
                                Remove Spellcasting
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-field">
                                <label className="form-label">Spellcasting Ability</label>
                                <select
                                    value={spellcasting.ability || 'Intelligence'}
                                    onChange={(e) => updateSpellcasting({ ability: e.target.value })}
                                    className="form-input form-select"
                                >
                                    {ABILITY_SCORES.map(ability => (
                                        <option key={ability} value={ability}>{ability}</option>
                                    ))}
                                </select>
                                <p className="form-helper">Powers spell attack rolls and save DCs</p>
                            </div>

                            <div className="form-field">
                                <label className="form-label">Caster Type</label>
                                <select
                                    value={spellcasting.type || 'full'}
                                    onChange={(e) => updateSpellcasting({ type: e.target.value })}
                                    className="form-input form-select"
                                >
                                    <option value="full">Full Caster (Wizard-like)</option>
                                    <option value="half">Half Caster (Paladin-like)</option>
                                    <option value="third">Third Caster (Fighter-like)</option>
                                    <option value="warlock">Warlock-style (Pact Magic)</option>
                                </select>
                            </div>

                            <div className="form-field">
                                <label className="form-label">Starts at Level</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={spellcasting.startLevel || 1}
                                    onChange={(e) => updateSpellcasting({ startLevel: parseInt(e.target.value) || 1 })}
                                    className="form-input"
                                />
                                <p className="form-helper">When characters gain spellcasting</p>
                            </div>

                            <div className="form-field">
                                <label className="form-label">Spell List</label>
                                <select
                                    value={spellcasting.spellList || 'custom'}
                                    onChange={(e) => updateSpellcasting({ spellList: e.target.value })}
                                    className="form-input form-select"
                                >
                                    <option value="custom">Custom spell list</option>
                                    <option value="wizard">Wizard spell list</option>
                                    <option value="cleric">Cleric spell list</option>
                                    <option value="druid">Druid spell list</option>
                                    <option value="sorcerer">Sorcerer spell list</option>
                                    <option value="warlock">Warlock spell list</option>
                                    <option value="bard">Bard spell list</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={spellcasting.ritualCasting || false}
                                    onChange={(e) => updateSpellcasting({ ritualCasting: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                                <div>
                                    <span className="font-medium">Ritual Casting</span>
                                    <p className="text-sm text-gray-500">Can cast spells with the ritual tag without using spell slots</p>
                                </div>
                            </label>
                        </div>

                        <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                            <h5 className="font-semibold text-indigo-900 mb-2">✨ Spellcasting Tips</h5>
                            <ul className="text-sm text-indigo-800 space-y-1">
                                <li>• <strong>Full Casters:</strong> Magic is primary - start at level 1</li>
                                <li>• <strong>Half Casters:</strong> Magic supports other abilities - start at level 2</li>
                                <li>• <strong>Third Casters:</strong> Magic is supplementary - start at level 3</li>
                                <li>• <strong>Balance:</strong> More spellcasting = fewer non-magical features</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const PreviewStep = ({ classData }) => {
    const validation = validateClassData(classData);

    return (
        <div className="creator-step">
            <div className="step-header">
                <div className="step-icon">
                    <Eye className="icon-large" />
                </div>
                <div className="step-title">
                    <h1>{classData.name || 'Unnamed Class'}</h1>
                    <p>{classData.description || 'No description provided'}</p>
                </div>
            </div>

            <div className="creator-content">
                <div className="preview-stats">
                    <Card>
                        <CardContent>
                            <div className="stat-item">
                                <Heart className="stat-icon" />
                                <div className="stat-value">d{classData.hitDie || '?'}</div>
                                <div className="stat-label">Hit Die</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <div className="stat-item">
                                <Brain className="stat-icon" />
                                <div className="stat-value">{classData.primaryAbility?.join(', ') || 'None'}</div>
                                <div className="stat-label">Primary Abilities</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <div className="stat-item">
                                <Shield className="stat-icon" />
                                <div className="stat-value">{classData.savingThrows?.join(', ') || 'None'}</div>
                                <div className="stat-label">Saving Throws</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <div className="stat-item">
                                <Star className="stat-icon" />
                                <div className="stat-value">{classData.skillChoices?.count || 0}</div>
                                <div className="stat-label">Skill Choices</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <h4>Validation Status</h4>
                    </CardHeader>
                    <CardContent>
                        {validation.isValid ? (
                            <div className="validation-success">
                                <CheckCircle className="validation-icon" />
                                <div className="validation-content">
                                    <div className="validation-title">Class is ready to save!</div>
                                    <div className="validation-description">All required fields are complete and valid.</div>
                                </div>
                            </div>
                        ) : (
                            <div className="validation-errors">
                                <div className="validation-header">
                                    <AlertCircle className="validation-icon error" />
                                    <div className="validation-title error">Please fix the following issues:</div>
                                </div>
                                <div className="validation-list">
                                    {Object.entries(validation.errors).map(([field, error]) => (
                                        <div key={field} className="validation-error">
                                            <div className="error-bullet"></div>
                                            <span>{error}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// Main ClassCreator component
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
                                                        <CheckCircle className="step-icon" />
                                                    ) : (
                                                        <IconComponent className="step-icon" />
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

                    {/* Main Content Area */}
                    <div className="creator-body">
                        <Card className="creator-main-card">
                            <CardContent>
                                {renderStepContent()}
                            </CardContent>
                        </Card>

                        {/* Navigation Buttons */}
                        <div className="creator-nav-buttons">
                            <Button
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                            >
                                <ArrowLeft className="btn-icon" />
                                Previous
                            </Button>

                            {currentStep < steps.length ? (
                                <Button onClick={nextStep}>
                                    Next
                                    <ArrowRight className="btn-icon" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSave}
                                    disabled={saving || !validateClassData(classData).isValid}
                                    variant="primary"
                                    loading={saving}
                                >
                                    <Save className="btn-icon" />
                                    {saving ? 'Saving...' : 'Save Class'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}