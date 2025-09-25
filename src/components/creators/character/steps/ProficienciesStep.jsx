// src/components/creators/character/steps/ProficienciesStep.jsx
import React from 'react';
import { Input, Badge, Button } from '../../../ui';
import {
    AbilityScoreSelector,
    SkillSelector,
    ProficiencySelector
} from '../../../common/DndFormComponents';
import { ABILITY_SCORES, SKILLS, ARMOR_TYPES, WEAPON_TYPES } from '../../../../utils/dndConstants';
import { Shield, Sword, Wrench, Star } from 'lucide-react';

export default function ProficienciesStep({
    classData,
    handleFieldChange,
    updateClassData,
    errors,
    touched
}) {
    // Handle skill choices structure
    const handleSkillChoicesChange = (field, value) => {
        const updatedSkillChoices = {
            ...classData.skillChoices,
            [field]: value
        };
        handleFieldChange('skillChoices', updatedSkillChoices);
    };

    // Initialize proficiencies if needed
    const proficiencies = classData.proficiencies || {
        armor: [],
        weapons: [],
        tools: [],
        languages: 0
    };

    const updateProficiencies = (field, value) => {
        const updatedProficiencies = {
            ...proficiencies,
            [field]: value
        };
        handleFieldChange('proficiencies', updatedProficiencies);
    };

    const armorOptions = [
        { value: 'light', label: 'Light armor', description: 'Leather, studded leather, padded' },
        { value: 'medium', label: 'Medium armor', description: 'Hide, chain shirt, scale mail, breastplate, half plate' },
        { value: 'heavy', label: 'Heavy armor', description: 'Ring mail, chain mail, splint, plate' },
        { value: 'shields', label: 'Shields', description: 'All shields' }
    ];

    const weaponOptions = [
        { value: 'simple', label: 'Simple weapons', description: 'Clubs, daggers, darts, javelins, etc.' },
        { value: 'martial', label: 'Martial weapons', description: 'Longswords, battleaxes, longbows, etc.' },
        { value: 'specific', label: 'Specific weapons only', description: 'Choose individual weapons below' }
    ];

    return (
        <div className="space-y-6">
            {/* Introduction */}
            <div className="form-section">
                <h4 className="form-section-title">Class Proficiencies</h4>
                <p className="form-section-description">
                    Define what your class is naturally trained in. These represent years of focused study and practice.
                </p>
            </div>

            {/* Saving Throws */}
            <div className="form-section">
                <h4 className="form-section-title flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Saving Throw Proficiencies
                </h4>
                <p className="form-section-description">
                    Choose exactly 2 ability scores for saving throw proficiency. These represent the class's natural resistances.
                </p>

                <AbilityScoreSelector
                    label="Saving Throws"
                    value={classData.savingThrows || []}
                    onChange={(value) => handleFieldChange('savingThrows', value)}
                    multiple={true}
                    max={2}
                    min={2}
                    required
                    error={touched.savingThrows && errors.savingThrows}
                    helperText="Every class gets exactly 2 saving throw proficiencies"
                />

                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h6 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Common Combinations:</h6>
                    <div className="grid grid-cols-1 sm:grid-cols-2 text-sm text-blue-800 dark:text-blue-200">
                        <div><strong>Fighters:</strong> Strength + Constitution</div>
                        <div><strong>Wizards:</strong> Intelligence + Wisdom</div>
                        <div><strong>Rogues:</strong> Dexterity + Intelligence</div>
                        <div><strong>Clerics:</strong> Wisdom + Charisma</div>
                    </div>
                </div>
            </div>

            {/* Skill Proficiencies */}
            <div className="form-section">
                <h4 className="form-section-title">Skill Proficiencies</h4>
                <p className="form-section-description">
                    Define how many skills characters can choose and from which options.
                </p>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Number of Skill Choices"
                            type="number"
                            min="0"
                            max="8"
                            value={classData.skillChoices?.choose || 2}
                            onChange={(e) => handleSkillChoicesChange('choose', parseInt(e.target.value) || 2)}
                            helperText="How many skills can characters choose?"
                        />

                        <div className="form-field">
                            <label className="form-label">Skill Selection Type</label>
                            <select
                                className="form-select"
                                value={classData.skillChoices?.type || 'from_list'}
                                onChange={(e) => handleSkillChoicesChange('type', e.target.value)}
                            >
                                <option value="from_list">Choose from class list</option>
                                <option value="any">Choose any skills</option>
                                <option value="ability_based">Any skills from specific abilities</option>
                            </select>
                        </div>
                    </div>

                    {classData.skillChoices?.type === 'from_list' && (
                        <div className="form-field">
                            <label className="form-label">Available Skills</label>
                            <SkillSelector
                                value={classData.skillChoices?.from || []}
                                onChange={(skills) => handleSkillChoicesChange('from', skills)}
                                multiple={true}
                                helperText="Select which skills characters can choose from"
                            />
                        </div>
                    )}

                    {classData.skillChoices?.type === 'ability_based' && (
                        <div className="form-field">
                            <label className="form-label">Allowed Abilities</label>
                            <AbilityScoreSelector
                                value={classData.skillChoices?.abilities || []}
                                onChange={(abilities) => handleSkillChoicesChange('abilities', abilities)}
                                multiple={true}
                                helperText="Characters can choose skills from these ability scores"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Armor Proficiencies */}
            <div className="form-section">
                <h4 className="form-section-title flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Armor Proficiencies
                </h4>
                <p className="form-section-description">
                    What armor can this class wear effectively?
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {armorOptions.map((option) => (
                        <label key={option.value} className="armor-option">
                            <input
                                type="checkbox"
                                checked={proficiencies.armor?.includes(option.value)}
                                onChange={(e) => {
                                    const current = proficiencies.armor || [];
                                    const updated = e.target.checked
                                        ? [...current, option.value]
                                        : current.filter(item => item !== option.value);
                                    updateProficiencies('armor', updated);
                                }}
                                className="sr-only"
                            />
                            <div className={`
                                p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                                ${proficiencies.armor?.includes(option.value)
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                                }
                            `}>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {option.description}
                                </div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Weapon Proficiencies */}
            <div className="form-section">
                <h4 className="form-section-title flex items-center gap-2">
                    <Sword className="w-5 h-5" />
                    Weapon Proficiencies
                </h4>
                <p className="form-section-description">
                    What weapons can this class use effectively?
                </p>

                <div className="space-y-4">
                    {/* Basic weapon categories */}
                    <div className="space-y-3">
                        {weaponOptions.map((option) => (
                            <label key={option.value} className="weapon-option">
                                <input
                                    type="radio"
                                    name="weaponProficiencyType"
                                    value={option.value}
                                    checked={classData.weaponProficiencyType === option.value}
                                    onChange={(e) => handleFieldChange('weaponProficiencyType', e.target.value)}
                                    className="sr-only"
                                />
                                <div className={`
                                    p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                                    ${classData.weaponProficiencyType === option.value
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                                    }
                                `}>
                                    <div className="font-medium">{option.label}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {option.description}
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>

                    {/* Specific weapons list for 'specific' type */}
                    {classData.weaponProficiencyType === 'specific' && (
                        <div className="form-field">
                            <label className="form-label">Specific Weapons</label>
                            <div className="specific-weapons">
                                <Input
                                    placeholder="e.g., longswords, shortbows, rapiers"
                                    value={proficiencies.specificWeapons || ''}
                                    onChange={(e) => updateProficiencies('specificWeapons', e.target.value)}
                                    helperText="List specific weapons, separated by commas"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tool Proficiencies */}
            <div className="form-section">
                <h4 className="form-section-title flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    Tool Proficiencies
                </h4>
                <p className="form-section-description">
                    What tools, instruments, or kits does this class know how to use?
                </p>

                <div className="space-y-4">
                    <Input
                        label="Tool Proficiencies"
                        value={proficiencies.tools?.join(', ') || ''}
                        onChange={(e) => {
                            const tools = e.target.value.split(',').map(tool => tool.trim()).filter(Boolean);
                            updateProficiencies('tools', tools);
                        }}
                        placeholder="e.g., thieves' tools, herbalism kit, smith's tools"
                        helperText="List tools separated by commas (leave empty if none)"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                            <strong>Common Examples:</strong>
                            <ul className="mt-1 space-y-1 text-gray-600">
                                <li>• Thieves' tools</li>
                                <li>• Herbalism kit</li>
                                <li>• Smith's tools</li>
                                <li>• Musical instrument</li>
                            </ul>
                        </div>
                        <div>
                            <strong>Artisan Tools:</strong>
                            <ul className="mt-1 space-y-1 text-gray-600">
                                <li>• Alchemist's supplies</li>
                                <li>• Carpenter's tools</li>
                                <li>• Leatherworker's tools</li>
                                <li>• Mason's tools</li>
                            </ul>
                        </div>
                        <div>
                            <strong>Other Kits:</strong>
                            <ul className="mt-1 space-y-1 text-gray-600">
                                <li>• Disguise kit</li>
                                <li>• Forgery kit</li>
                                <li>• Navigator's tools</li>
                                <li>• Poisoner's kit</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Language Proficiencies */}
            <div className="form-section">
                <h4 className="form-section-title">Language Proficiencies</h4>
                <p className="form-section-description">
                    How many additional languages does this class learn?
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Number of Languages"
                        type="number"
                        min="0"
                        max="10"
                        value={proficiencies.languages || 0}
                        onChange={(e) => updateProficiencies('languages', parseInt(e.target.value) || 0)}
                        helperText="Most classes get 0-2 additional languages"
                    />

                    <div className="form-field">
                        <label className="form-label">Language Type</label>
                        <select
                            className="form-select"
                            value={classData.languageType || 'any'}
                            onChange={(e) => handleFieldChange('languageType', e.target.value)}
                        >
                            <option value="any">Any languages</option>
                            <option value="specific">Specific languages</option>
                            <option value="choice">Choice from a list</option>
                        </select>
                    </div>
                </div>

                {classData.languageType === 'specific' && (
                    <Input
                        label="Specific Languages"
                        value={classData.specificLanguages || ''}
                        onChange={(e) => handleFieldChange('specificLanguages', e.target.value)}
                        placeholder="e.g., Draconic, Celestial, Abyssal"
                        helperText="Languages automatically granted, separated by commas"
                    />
                )}
            </div>

            {/* Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h5 className="font-semibold mb-3">📋 Proficiencies Summary</h5>
                <div className="space-y-2 text-sm">
                    <div>
                        <strong>Saving Throws:</strong> {classData.savingThrows?.join(', ') || 'None selected'}
                    </div>
                    <div>
                        <strong>Skills:</strong> Choose {classData.skillChoices?.choose || 2}
                        {classData.skillChoices?.type === 'from_list' && classData.skillChoices?.from?.length > 0
                            ? ` from ${classData.skillChoices.from.join(', ')}`
                            : classData.skillChoices?.type === 'any'
                                ? ' from any skills'
                                : ' skills'
                        }
                    </div>
                    <div>
                        <strong>Armor:</strong> {proficiencies.armor?.length > 0
                            ? proficiencies.armor.join(', ')
                            : 'None'
                        }
                    </div>
                    <div>
                        <strong>Weapons:</strong> {
                            classData.weaponProficiencyType === 'simple' ? 'Simple weapons' :
                                classData.weaponProficiencyType === 'martial' ? 'Simple and martial weapons' :
                                    classData.weaponProficiencyType === 'specific' ? proficiencies.specificWeapons || 'None specified' :
                                        'None selected'
                        }
                    </div>
                    <div>
                        <strong>Tools:</strong> {proficiencies.tools?.join(', ') || 'None'}
                    </div>
                    <div>
                        <strong>Languages:</strong> {proficiencies.languages > 0
                            ? `${proficiencies.languages} additional language${proficiencies.languages > 1 ? 's' : ''}`
                            : 'None'
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}