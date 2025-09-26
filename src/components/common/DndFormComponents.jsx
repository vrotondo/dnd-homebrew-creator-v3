// src/components/common/DndFormComponents.jsx - Complete D&D Form Components
import React, { useState } from 'react';
import { Input, Button, Badge } from '../ui';
import { ABILITY_SCORES, SKILLS, SKILL_NAMES } from '../../utils/dndConstants';
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
    min = null,
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
        const skillsByAbility = SKILLS.reduce((groups, skill) => {
            if (!groups[skill.ability]) {
                groups[skill.ability] = [];
            }
            groups[skill.ability].push(skill);
            return groups;
        }, {});

        return Object.entries(skillsByAbility).map(([ability, skills]) => {
            const isExpanded = expandedGroups[ability] !== false; // Default to expanded

            return (
                <div key={ability} className="skill-group">
                    <button
                        type="button"
                        className="skill-group-header"
                        onClick={() => toggleGroup(ability)}
                    >
                        <span className="skill-group-title">{ability}</span>
                        {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </button>

                    {isExpanded && (
                        <div className="skill-group-content">
                            {skills.map(skill => {
                                const isSelected = value.includes(skill.name);
                                const isDisabled = max && value.length >= max && !isSelected;

                                return (
                                    <label
                                        key={skill.name}
                                        className={`skill-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
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
            <div className="skills-grid">
                {SKILL_NAMES.map(skillName => {
                    const isSelected = value.includes(skillName);
                    const isDisabled = max && value.length >= max && !isSelected;

                    return (
                        <label
                            key={skillName}
                            className={`skill-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => !isDisabled && handleToggle(skillName)}
                                disabled={isDisabled}
                            />
                            <span className="skill-name">{skillName}</span>
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
    const hitDiceOptions = [
        { value: 6, label: 'd6', description: 'Weak (Wizard-like)', avgHP: '3.5' },
        { value: 8, label: 'd8', description: 'Moderate (Rogue-like)', avgHP: '4.5' },
        { value: 10, label: 'd10', description: 'Strong (Fighter-like)', avgHP: '5.5' },
        { value: 12, label: 'd12', description: 'Very Strong (Barbarian-like)', avgHP: '6.5' }
    ];

    return (
        <div className="form-field">
            <label className="form-label">
                {label}
                {required && <span className="form-required">*</span>}
            </label>

            <div className="hit-die-grid">
                {hitDiceOptions.map(option => (
                    <button
                        key={option.value}
                        type="button"
                        className={`hit-die-option ${value === option.value ? 'selected' : ''}`}
                        onClick={() => onChange(option.value)}
                    >
                        <div className="hit-die-label">{option.label}</div>
                        <div className="hit-die-description">{option.description}</div>
                        <div className="hit-die-avg">Avg: {option.avgHP} HP/level</div>
                    </button>
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
            case 'armor':
                return ['Light armor', 'Medium armor', 'Heavy armor', 'Shields'];
            case 'weapons':
                return ['Simple weapons', 'Martial weapons'];
            case 'tools':
                return ['Thieves\' tools', 'Artisan\'s tools', 'Musical instruments', 'Gaming sets'];
            case 'languages':
                return ['Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc', 'Abyssal', 'Celestial', 'Draconic'];
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

    const handleRemove = (option) => {
        onChange(value.filter(v => v !== option));
    };

    return (
        <div className="form-field">
            <label className="form-label">
                {label}
                {required && <span className="form-required">*</span>}
            </label>

            {/* Display selected values */}
            {value.length > 0 && (
                <div className="selected-proficiencies">
                    {value.map(prof => (
                        <Badge key={prof} variant="secondary" className="proficiency-badge">
                            {prof}
                            <button
                                type="button"
                                onClick={() => handleRemove(prof)}
                                className="badge-remove"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            {/* Standard options */}
            {options.length > 0 && (
                <div className="proficiency-options">
                    <div className="proficiency-grid">
                        {options.map(option => {
                            const isSelected = value.includes(option);
                            const isDisabled = max && value.length >= max && !isSelected;

                            return (
                                <button
                                    key={option}
                                    type="button"
                                    className={`proficiency-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                                    onClick={() => !isDisabled && handleToggle(option)}
                                    disabled={isDisabled}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Custom input */}
            {allowCustom && (
                <div className="custom-proficiency-input">
                    <div className="flex gap-2">
                        <Input
                            placeholder={`Add custom ${type.slice(0, -1)}...`}
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
                        />
                        <Button
                            type="button"
                            onClick={handleAddCustom}
                            disabled={!customInput.trim() || (max && value.length >= max)}
                            size="sm"
                        >
                            Add
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