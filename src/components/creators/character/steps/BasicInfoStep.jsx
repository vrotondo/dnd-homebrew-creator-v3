// src/components/creators/character/steps/BasicInfoStep.jsx
import React from 'react';
import { Input, Badge } from '../../../ui';
import { AbilityScoreSelector, HitDieSelector } from '../../../common/DndFormComponents';
import { ABILITY_SCORES, HIT_DICE } from '../../../../utils/dndConstants';
import { Sword, Heart, Brain, Zap } from 'lucide-react';

export default function BasicInfoStep({
    classData,
    handleFieldChange,
    errors,
    touched
}) {
    const hitDieOptions = [
        { value: 'd6', label: 'd6 (Weak, like Wizards)', icon: '🎲', description: '3.5 average HP per level' },
        { value: 'd8', label: 'd8 (Moderate, like Rogues)', icon: '🎲', description: '4.5 average HP per level' },
        { value: 'd10', label: 'd10 (Strong, like Fighters)', icon: '🎲', description: '5.5 average HP per level' },
        { value: 'd12', label: 'd12 (Very Strong, like Barbarians)', icon: '🎲', description: '6.5 average HP per level' }
    ];

    return (
        <div className="space-y-6">
            {/* Class Name and Description */}
            <div className="form-section">
                <h4 className="form-section-title">Class Identity</h4>
                <p className="form-section-description">
                    Give your class a unique name and compelling description that captures its essence.
                </p>

                <div className="space-y-4">
                    <Input
                        label="Class Name"
                        value={classData.name || ''}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        placeholder="e.g., Mystic Knight, Soul Weaver, Storm Caller"
                        required
                        error={touched.name && errors.name}
                        helperText="Choose a memorable name that reflects the class's unique abilities"
                    />

                    <div className="form-field">
                        <label className="form-label">
                            Class Description
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <textarea
                            className={`form-textarea ${touched.description && errors.description ? 'border-red-300' : ''}`}
                            value={classData.description || ''}
                            onChange={(e) => handleFieldChange('description', e.target.value)}
                            placeholder="A master of both sword and spell, the Mystic Knight blends martial prowess with arcane magic..."
                            rows={4}
                            required
                        />
                        {touched.description && errors.description && (
                            <div className="form-error">{errors.description}</div>
                        )}
                        <div className="form-helper">
                            Describe the class's role, flavor, and what makes it unique (2-3 sentences recommended)
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Mechanics */}
            <div className="form-section">
                <h4 className="form-section-title">Core Mechanics</h4>
                <p className="form-section-description">
                    Define the fundamental mechanical aspects that determine your class's durability and key ability.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Hit Die */}
                    <div className="form-field">
                        <label className="form-label">
                            Hit Die
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="space-y-3">
                            {hitDieOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleFieldChange('hitDie', option.value)}
                                    className={`
                                        w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                                        ${classData.hitDie === option.value
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                        }
                                    `}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="text-2xl">{option.icon}</div>
                                            <div>
                                                <div className="font-medium">{option.label}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {option.description}
                                                </div>
                                            </div>
                                        </div>
                                        {classData.hitDie === option.value && (
                                            <div className="text-blue-500">
                                                <Zap className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                        {touched.hitDie && errors.hitDie && (
                            <div className="form-error">{errors.hitDie}</div>
                        )}
                        <div className="form-helper">
                            Higher hit dice = more HP per level. Consider your class's intended role.
                        </div>
                    </div>

                    {/* Primary Ability */}
                    <div className="form-field">
                        <label className="form-label">
                            Primary Ability Scores
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="space-y-4">
                            <AbilityScoreSelector
                                value={classData.primaryAbility || []}
                                onChange={(value) => handleFieldChange('primaryAbility', value)}
                                multiple={true}
                                max={2}
                                required
                                error={touched.primaryAbility && errors.primaryAbility}
                                helperText="1-2 abilities that are most important for this class"
                            />

                            {/* Quick Reference */}
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                <h6 className="font-medium mb-3 flex items-center gap-2">
                                    <Brain className="w-4 h-4" />
                                    Quick Reference
                                </h6>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    <div><strong>STR:</strong> Melee attacks, heavy armor</div>
                                    <div><strong>DEX:</strong> Ranged attacks, AC, stealth</div>
                                    <div><strong>CON:</strong> HP, concentration saves</div>
                                    <div><strong>INT:</strong> Investigation, knowledge skills</div>
                                    <div><strong>WIS:</strong> Perception, insight, survival</div>
                                    <div><strong>CHA:</strong> Social skills, some spellcasting</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Class Archetype */}
            <div className="form-section">
                <h4 className="form-section-title">Class Archetype (Optional)</h4>
                <p className="form-section-description">
                    Help players understand your class's role and playstyle.
                </p>

                <div className="form-field">
                    <label className="form-label">Class Role/Archetype</label>
                    <select
                        className="form-select"
                        value={classData.archetype || ''}
                        onChange={(e) => handleFieldChange('archetype', e.target.value)}
                    >
                        <option value="">Select a role (optional)</option>
                        <option value="frontline">Frontline Fighter - Tank/Damage dealer</option>
                        <option value="striker">Striker - High damage, moderate survivability</option>
                        <option value="support">Support - Buffs allies, controls battlefield</option>
                        <option value="controller">Controller - Crowd control, area effects</option>
                        <option value="scout">Scout/Utility - Exploration, skills, versatility</option>
                        <option value="spellcaster">Primary Spellcaster - Magic-focused</option>
                        <option value="hybrid">Hybrid - Combines multiple roles</option>
                        <option value="custom">Custom/Unique</option>
                    </select>
                    <div className="form-helper">
                        This helps players understand how the class fits into a party composition
                    </div>
                </div>
            </div>

            {/* Design Notes */}
            <div className="form-section">
                <h4 className="form-section-title">Design Notes (Optional)</h4>
                <p className="form-section-description">
                    Internal notes about your design goals, inspirations, or balance considerations.
                </p>

                <div className="form-field">
                    <label className="form-label">Designer Notes</label>
                    <textarea
                        className="form-textarea"
                        value={classData.designNotes || ''}
                        onChange={(e) => handleFieldChange('designNotes', e.target.value)}
                        placeholder="e.g., Inspired by anime battle mages, balanced around short rest resources..."
                        rows={3}
                    />
                    <div className="form-helper">
                        These notes are for you and won't be included in the final class document
                    </div>
                </div>
            </div>

            {/* Tips Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-900 mb-2">💡 Design Tips</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Name:</strong> Make it evocative but not too complex - players need to remember it!</li>
                    <li>• <strong>Description:</strong> Focus on the unique fantasy this class fulfills</li>
                    <li>• <strong>Hit Die:</strong> d6 = fragile casters, d8 = balanced, d10+ = tough frontliners</li>
                    <li>• <strong>Primary Ability:</strong> Choose 1-2 stats that define the class's identity</li>
                </ul>
            </div>
        </div>
    );
}