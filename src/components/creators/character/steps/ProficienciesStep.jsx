// src/components/creators/character/steps/ProficienciesStep.jsx
import React from 'react';
import { Input } from '../../../ui';
import {
    AbilityScoreSelector,
    SkillSelector,
    ProficiencySelector
} from '../../../common/DndFormComponents';
import { ABILITY_SCORES } from '../../../../utils/dndConstants';

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

    return (
        <div className="space-y-6">
            {/* Saving Throws */}
            <div className="form-section">
                <h4 className="form-section-title">Saving Throw Proficiencies</h4>
                <p className="form-section-description">
                    Choose exactly 2 ability scores for saving throw proficiency.
                </p>

                <AbilityScoreSelector
                    label="Saving Throws"
                    value={classData.savingThrows || []}
                    onChange={(value) => handleFieldChange('savingThrows', value)}
                    multiple={true}
                    max={2}
                    required
                    error={touched.savingThrows && errors.savingThrows}
                    helperText="These determine which saving throws the class is naturally good at"
                />
            </div>

            {/* Skill Proficiencies */}
            <div className="form-section">
                <h4 className="form-section-title">Skill Proficiencies</h4>
                <p className="form-section-description">
                    Define how many skills characters can choose and from which options.
                </p>

                <div className="space-y-4">
                    <Input
                        label="Number of Skill Choices"
                        type="number"
                        min="0"
                        max="8"
                        value={classData.skillChoices?.choose || 2}
                        onChange={(e) => handleSkillChoicesChange('choose', parseInt(e.target.value) || 2)}
                        helperText="How many skills can characters choose? (Usually 2-4)"
                    />

                    <SkillSelector
                        label="Available Skills"
                        value={classData.skillChoices?.from || []}
                        onChange={(value) => handleSkillChoicesChange('from', value)}
                        groupByAbility={true}
                        helperText={`Choose ${classData.skillChoices?.choose || 2} skills from this list when creating a character`}
                        error={touched.skillChoices && errors.skillChoices}
                    />
                </div>
            </div>

            {/* Armor Proficiencies */}
            <div className="form-section">
                <h4 className="form-section-title">Armor Proficiencies</h4>
                <p className="form-section-description">
                    What types of armor can this class use effectively?
                </p>

                <ProficiencySelector
                    label="Armor Proficiencies"
                    type="armor"
                    value={classData.armorProficiencies || []}
                    onChange={(value) => handleFieldChange('armorProficiencies', value)}
                    allowCustom={true}
                    helperText="Light armor for agile classes, heavy armor for tanks"
                />
            </div>

            {/* Weapon Proficiencies */}
            <div className="form-section">
                <h4 className="form-section-title">Weapon Proficiencies</h4>
                <p className="form-section-description">
                    What weapons can this class wield effectively?
                </p>

                <ProficiencySelector
                    label="Weapon Proficiencies"
                    type="weapons"
                    value={classData.weaponProficiencies || []}
                    onChange={(value) => handleFieldChange('weaponProficiencies', value)}
                    allowCustom={true}
                    helperText="Simple weapons for most classes, martial weapons for warriors"
                />
            </div>

            {/* Tool Proficiencies */}
            <div className="form-section">
                <h4 className="form-section-title">Tool Proficiencies</h4>
                <p className="form-section-description">
                    Optional tool proficiencies that reflect the class's background or training.
                </p>

                <ProficiencySelector
                    label="Tool Proficiencies"
                    type="tools"
                    value={classData.toolProficiencies || []}
                    onChange={(value) => handleFieldChange('toolProficiencies', value)}
                    allowCustom={true}
                    helperText="Tools that make sense for the class theme (thieves' tools for rogues, etc.)"
                />
            </div>

            {/* Languages */}
            <div className="form-section">
                <h4 className="form-section-title">Languages</h4>
                <p className="form-section-description">
                    Languages known by default (separate from racial or background languages).
                </p>

                <ProficiencySelector
                    label="Languages"
                    type="languages"
                    value={classData.languages || []}
                    onChange={(value) => handleFieldChange('languages', value)}
                    allowCustom={true}
                    helperText="Most classes don't grant languages - usually handled by race/background"
                />
            </div>

            {/* Multiclassing Prerequisites */}
            <div className="form-section">
                <h4 className="form-section-title">Multiclassing (Optional)</h4>
                <p className="form-section-description">
                    Define requirements and benefits for multiclassing with this class.
                </p>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {ABILITY_SCORES.map(ability => (
                            <Input
                                key={ability}
                                label={`${ability} Requirement`}
                                type="number"
                                min="8"
                                max="20"
                                value={classData.multiclassing?.prerequisites?.[ability.toLowerCase()] || ''}
                                onChange={(e) => {
                                    const value = e.target.value ? parseInt(e.target.value) : null;
                                    const updatedMulticlassing = {
                                        ...classData.multiclassing,
                                        prerequisites: {
                                            ...classData.multiclassing?.prerequisites,
                                            [ability.toLowerCase()]: value
                                        }
                                    };
                                    handleFieldChange('multiclassing', updatedMulticlassing);
                                }}
                                placeholder="13"
                                helperText={`Minimum ${ability} to multiclass`}
                            />
                        ))}
                    </div>

                    <div className="form-field">
                        <label className="form-label">Multiclass Proficiencies</label>
                        <textarea
                            className="form-textarea"
                            value={classData.multiclassing?.proficiencies?.join(', ') || ''}
                            onChange={(e) => {
                                const proficiencies = e.target.value
                                    .split(',')
                                    .map(p => p.trim())
                                    .filter(p => p);
                                const updatedMulticlassing = {
                                    ...classData.multiclassing,
                                    proficiencies
                                };
                                handleFieldChange('multiclassing', updatedMulticlassing);
                            }}
                            placeholder="Light armor, shields, simple weapons"
                            rows={2}
                        />
                        <div className="form-helper">
                            Comma-separated list of proficiencies gained when multiclassing into this class
                        </div>
                    </div>
                </div>
            </div>

            {/* Tips */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-semibold text-green-900 mb-2">⚖️ Balance Guidelines</h5>
                <ul className="text-sm text-green-800 space-y-1">
                    <li>• <strong>Saving Throws:</strong> Usually one "strong" save (Dex/Con/Wis) and one "weak" save</li>
                    <li>• <strong>Skills:</strong> 2 skills for most classes, 4+ for skill-focused classes like Bard/Rogue</li>
                    <li>• <strong>Armor:</strong> Light for casters, medium for hybrids, heavy for tanks</li>
                    <li>• <strong>Weapons:</strong> Simple for casters, martial for warriors</li>
                    <li>• <strong>Tools:</strong> Optional and thematic - don't overload</li>
                </ul>
            </div>
        </div>
    );
}