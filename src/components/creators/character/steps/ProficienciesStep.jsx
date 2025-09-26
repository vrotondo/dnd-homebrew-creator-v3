// src/components/creators/character/steps/ProficienciesStep.jsx - QUICK FIX
import React from 'react';
import { Input, Badge, Button, Card, CardContent } from '../../../ui';
import {
    AbilityScoreSelector,
    SkillSelector,
    ProficiencySelector
} from '../../../common/DndFormComponents';
import { ABILITY_SCORES } from '../../../../utils/dndConstants';
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

    return (
        <div className="space-y-6">
            {/* Saving Throws */}
            <div className="form-section">
                <h4 className="form-section-title flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Saving Throw Proficiencies
                </h4>
                <p className="form-section-description">
                    Choose exactly 2 ability scores for saving throw proficiency.
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
                            </select>
                        </div>
                    </div>

                    {classData.skillChoices?.type === 'from_list' && (
                        <div className="form-field">
                            <label className="form-label">Available Skills</label>
                            <SkillSelector
                                value={classData.skillChoices?.from || []}
                                onChange={(skills) => handleSkillChoicesChange('from', skills)}
                                groupByAbility={true}
                                helperText="Select which skills characters can choose from"
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

                <ProficiencySelector
                    label="Armor Proficiencies"
                    type="armor"
                    value={proficiencies.armor || []}
                    onChange={(value) => updateProficiencies('armor', value)}
                    allowCustom={true}
                    helperText="Light armor for agile classes, heavy armor for tanks"
                />
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

                <ProficiencySelector
                    label="Weapon Proficiencies"
                    type="weapons"
                    value={proficiencies.weapons || []}
                    onChange={(value) => updateProficiencies('weapons', value)}
                    allowCustom={true}
                    helperText="Simple weapons for most classes, martial weapons for warriors"
                />
            </div>

            {/* Tool Proficiencies */}
            <div className="form-section">
                <h4 className="form-section-title flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    Tool Proficiencies
                </h4>
                <p className="form-section-description">
                    Optional tool proficiencies that reflect the class's background or training.
                </p>

                <ProficiencySelector
                    label="Tool Proficiencies"
                    type="tools"
                    value={proficiencies.tools || []}
                    onChange={(value) => updateProficiencies('tools', value)}
                    allowCustom={true}
                    helperText="Leave empty if the class doesn't get tool proficiencies"
                />
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
                        </select>
                    </div>
                </div>
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
                        <strong>Weapons:</strong> {proficiencies.weapons?.length > 0
                            ? proficiencies.weapons.join(', ')
                            : 'None'
                        }
                    </div>
                    <div>
                        <strong>Tools:</strong> {proficiencies.tools?.length > 0
                            ? proficiencies.tools.join(', ')
                            : 'None'
                        }
                    </div>
                    <div>
                        <strong>Languages:</strong> {proficiencies.languages > 0
                            ? `${proficiencies.languages} additional`
                            : 'None'
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}