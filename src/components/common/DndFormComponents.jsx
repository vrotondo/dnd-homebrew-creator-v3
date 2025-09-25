// src/components/common/DndFormComponents.jsx - Specialized D&D Form Components

import React, { useState } from 'react';
import { Input, Button, Badge } from '../ui';
import {
    ABILITY_SCORES,
    SKILLS,
    SKILL_NAMES,
    ALL_LANGUAGES,
    ALL_TOOLS,
    ARMOR_TYPES,
    WEAPON_CATEGORIES,
    SIZES,
    HIT_DICE,
    dndUtils
} from '../../utils/dndConstants';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';

// ===================
// ABILITY SCORE SELECTOR
// ===================

export const AbilityScoreSelector = ({
    label = "Ability Scores",
    value = [],
    onChange,
    multiple = true,
    max = null,
    required = false,
    error = null,
    helperText = null
}) => {
    const handleToggle = (ability) => {
        if (multiple) {
            const newValue = value.includes(ability)
                ? value.filter(a => a !== ability)
                : max && value.length >= max
                    ? value
                    : [...value, ability];
            onChange(newValue);
        } else {
            onChange(value === ability ? null : ability);
        }
    };

    return (
        <div className="form-field">
            <label className="form-label">
                {label}
                {required && <span className="form-required">*</span>}
            </label>

            <div className="ability-score-grid">
                {ABILITY_SCORES.map(ability => {
                    const isSelected = multiple ? value.includes(ability) : value === ability;
                    const isDisabled = max && value.length >= max && !isSelected;

                    return (
                        <button
                            key={ability}
                            type="button"
                            className={`ability-score-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                            onClick={() => !isDisabled && handleToggle(ability)}
                            disabled={isDisabled}
                        >
                            <div className="ability-name">{ability}</div>
                            <div className="ability-short">{ability.substring(0, 3).toUpperCase()}</div>
                        </button>
                    );
                })}
            </div>

            {max && (
                <div className="form-helper">
                    {value.length}/{max} selected
                </div>
            )}

            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}

            {helperText && !error && (
                <div className="form-helper">
                    {helperText}
                </div>
            )}
        </div>
    );
};

// ===================
// SKILL SELECTOR
// ===================

export const SkillSelector = ({
    label = "Skills",
    value = [],
    onChange,
    max = null,
    groupByAbility = true,
    required = false,
    error = null,
    helperText = null
}) => {
    const [expandedGroups, setExpandedGroups] = useState({});

    const toggleGroup = (ability) => {
        setExpandedGroups(prev => ({
            ...prev,
            [ability]: !prev[ability]
        }));
    };

    const handleToggle = (skill) => {
        const newValue = value.includes(skill)
            ? value.filter(s => s !== skill)
            : max && value.length >= max
                ? value
                : [...value, skill];
        onChange(newValue);
    };

    const renderSkillsByAbility = () => {
        const skillsByAbility = ABILITY_SCORES.reduce((acc, ability) => {
            acc[ability] = SKILLS.filter(skill => skill.ability === ability);
            return acc;
        }, {});

        return ABILITY_SCORES.map(ability => {
            const skills = skillsByAbility[ability];
            const isExpanded = expandedGroups[ability];
            const selectedInGroup = skills.filter(skill => value.includes(skill.name)).length;

            return (
                <div key={ability} className="skill-group">
                    <button
                        type="button"
                        className="skill-group-header"
                        onClick={() => toggleGroup(ability)}
                    >
                        <div className="skill-group-info">
                            <span className="skill-group-name">{ability}</span>
                            {selectedInGroup > 0 && (
                                <Badge variant="primary" size="sm">
                                    {selectedInGroup}
                                </Badge>
                            )}
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isExpanded && (
                        <div className="skill-group-content">
                            {skills.map(skill => {
                                const isSelected = value.includes(skill.name);
                                const isDisabled = max && value.length >= max && !isSelected;

                                return (
                                    <label
                                        key={skill.name}
                                        className={`skill-option ${isDisabled ? 'disabled' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => !isDisabled && handleToggle(skill.name)}
                                            disabled={isDisabled}
                                        />
                                        <span className="skill-name">{skill.name}</span>
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>
            );
        });
    };

    const renderSkillsList = () => {
        return (
            <div className="skills-list">
                {SKILL_NAMES.map(skill => {
                    const isSelected = value.includes(skill);
                    const isDisabled = max && value.length >= max && !isSelected;
                    const skillInfo = SKILLS.find(s => s.name === skill);

                    return (
                        <label key={skill} className={`skill-option ${isDisabled ? 'disabled' : ''}`}>
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => !isDisabled && handleToggle(skill)}
                                disabled={isDisabled}
                            />
                            <span className="skill-name">{skill}</span>
                            <span className="skill-ability">({skillInfo.ability.substring(0, 3)})</span>
                        </label>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="form-field">
            <label className="form-label">
                {label}
                {required && <span className="form-required">*</span>}
            </label>

            <div className="skill-selector">
                {groupByAbility ? renderSkillsByAbility() : renderSkillsList()}
            </div>

            {max && (
                <div className="form-helper">
                    {value.length}/{max} selected
                </div>
            )}

            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}

            {helperText && !error && (
                <div className="form-helper">
                    {helperText}
                </div>
            )}
        </div>
    );
};

// ===================
// PROFICIENCY SELECTOR
// ===================

export const ProficiencySelector = ({
    label,
    type = 'tools', // 'tools', 'languages', 'armor', 'weapons'
    value = [],
    onChange,
    max = null,
    allowCustom = false,
    required = false,
    error = null,
    helperText = null
}) => {
    const [customInput, setCustomInput] = useState('');

    const getOptions = () => {
        switch (type) {
            case 'languages':
                return ALL_LANGUAGES;
            case 'tools':
                return ALL_TOOLS;
            case 'armor':
                return ARMOR_TYPES;
            case 'weapons':
                return WEAPON_CATEGORIES;
            default:
                return [];
        }
    };

    const options = getOptions();

    const handleToggle = (option) => {
        const newValue = value.includes(option)
            ? value.filter(v => v !== option)
            : max && value.length >= max
                ? value
                : [...value, option];
        onChange(newValue);
    };

    const handleAddCustom = () => {
        if (customInput.trim() && !value.includes(customInput.trim())) {
            const newValue = max && value.length >= max
                ? value
                : [...value, customInput.trim()];
            onChange(newValue);
            setCustomInput('');
        }
    };

    const handleRemove = (item) => {
        onChange(value.filter(v => v !== item));
    };

    return (
        <div className="form-field">
            <label className="form-label">
                {label}
                {required && <span className="form-required">*</span>}
            </label>

            {/* Selected items */}
            {value.length > 0 && (
                <div className="selected-proficiencies">
                    {value.map(item => (
                        <Badge
                            key={item}
                            variant="outline"
                            className="selected-proficiency"
                        >
                            {item}
                            <button
                                type="button"
                                onClick={() => handleRemove(item)}
                                className="remove-proficiency"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            {/* Options */}
            <div className="proficiency-options">
                {options.map(option => {
                    const isSelected = value.includes(option);
                    const isDisabled = max && value.length >= max && !isSelected;

                    return (
                        <label key={option} className={`proficiency-option ${isDisabled ? 'disabled' : ''}`}>
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => !isDisabled && handleToggle(option)}
                                disabled={isDisabled}
                            />
                            <span>{option}</span>
                        </label>
                    );
                })}
            </div>

            {/* Custom input */}
            {allowCustom && (
                <div className="custom-proficiency-input">
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            placeholder={`Custom ${type.slice(0, -1)}...`}
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustom())}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddCustom}
                            disabled={!customInput.trim() || (max && value.length >= max)}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {max && (
                <div className="form-helper">
                    {value.length}/{max} selected
                </div>
            )}

            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}

            {helperText && !error && (
                <div className="form-helper">
                    {helperText}
                </div>
            )}
        </div>
    );
};

// ===================
// HIT DIE SELECTOR
// ===================

export const HitDieSelector = ({
    label = "Hit Die",
    value,
    onChange,
    required = false,
    error = null,
    helperText = null
}) => {
    return (
        <div className="form-field">
            <label className="form-label">
                {label}
                {required && <span className="form-required">*</span>}
            </label>

            <div className="hit-die-options">
                {HIT_DICE.map(die => (
                    <label key={die.value} className="hit-die-option">
                        <input
                            type="radio"
                            name="hitDie"
                            value={die.value}
                            checked={value === die.value}
                            onChange={(e) => onChange(parseInt(e.target.value))}
                        />
                        <div className="hit-die-content">
                            <div className="hit-die-label">{die.label}</div>
                            <div className="hit-die-description">{die.description}</div>
                        </div>
                    </label>
                ))}
            </div>

            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}

            {helperText && !error && (
                <div className="form-helper">
                    {helperText}
                </div>
            )}
        </div>
    );
};

// ===================
// SIZE SELECTOR
// ===================

export const SizeSelector = ({
    label = "Size",
    value,
    onChange,
    required = false,
    error = null,
    helperText = null
}) => {
    return (
        <div className="form-field">
            <label className="form-label">
                {label}
                {required && <span className="form-required">*</span>}
            </label>

            <select
                className="form-select"
                value={value || ''}
                onChange={(e) => onChange(e.target.value || null)}
            >
                <option value="">Select size...</option>
                {SIZES.map(size => (
                    <option key={size} value={size}>{size}</option>
                ))}
            </select>

            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}

            {helperText && !error && (
                <div className="form-helper">
                    {helperText}
                </div>
            )}
        </div>
    );
};

// ===================
// ABILITY SCORE INCREASE EDITOR
// ===================

export const AbilityScoreIncreaseEditor = ({
    label = "Ability Score Increases",
    value = {},
    onChange,
    maxTotal = 3,
    maxPerAbility = 2,
    required = false,
    error = null,
    helperText = null
}) => {
    const handleAbilityChange = (ability, increase) => {
        const newValue = { ...value };
        if (increase === 0) {
            delete newValue[ability];
        } else {
            newValue[ability] = increase;
        }
        onChange(newValue);
    };

    const getTotalIncrease = () => {
        return Object.values(value).reduce((sum, increase) => sum + increase, 0);
    };

    const canIncrease = (ability) => {
        const currentIncrease = value[ability] || 0;
        return currentIncrease < maxPerAbility && getTotalIncrease() < maxTotal;
    };

    return (
        <div className="form-field">
            <label className="form-label">
                {label}
                {required && <span className="form-required">*</span>}
            </label>

            <div className="ability-increase-editor">
                {ABILITY_SCORES.map(ability => {
                    const currentIncrease = value[ability] || 0;

                    return (
                        <div key={ability} className="ability-increase-row">
                            <div className="ability-name">{ability}</div>
                            <div className="ability-increase-controls">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline"
                                    onClick={() => handleAbilityChange(ability, Math.max(0, currentIncrease - 1))}
                                    disabled={currentIncrease === 0}
                                >
                                    -
                                </button>
                                <span className="ability-increase-value">+{currentIncrease}</span>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline"
                                    onClick={() => handleAbilityChange(ability, currentIncrease + 1)}
                                    disabled={!canIncrease(ability)}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="form-helper">
                Total increase: {getTotalIncrease()}/{maxTotal}
            </div>

            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}

            {helperText && !error && (
                <div className="form-helper">
                    {helperText}
                </div>
            )}
        </div>
    );
};

// ===================
// FEATURE EDITOR
// ===================

export const FeatureEditor = ({
    label = "Feature",
    value = { name: '', description: '' },
    onChange,
    required = false,
    error = null,
    helperText = null
}) => {
    const handleChange = (field, newValue) => {
        onChange({
            ...value,
            [field]: newValue
        });
    };

    return (
        <div className="form-field">
            <label className="form-label">
                {label}
                {required && <span className="form-required">*</span>}
            </label>

            <div className="feature-editor">
                <Input
                    type="text"
                    placeholder="Feature name..."
                    value={value.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                />

                <textarea
                    className="form-textarea"
                    placeholder="Feature description..."
                    value={value.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                />
            </div>

            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}

            {helperText && !error && (
                <div className="form-helper">
                    {helperText}
                </div>
            )}
        </div>
    );
};