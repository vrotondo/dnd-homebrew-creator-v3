// src/components/creators/character/steps/BasicInfoStep.jsx - QUICK FIX
import React from 'react';
import { Input, Badge } from '../../../ui';
import { AbilityScoreSelector, HitDieSelector } from '../../../common/DndFormComponents';
import { ABILITY_SCORES } from '../../../../utils/dndConstants';
import { Sword, Heart, Brain, Zap } from 'lucide-react';

export default function BasicInfoStep({
    classData,
    handleFieldChange,
    errors,
    touched
}) {
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
                            style={{
                                width: '100%',
                                padding: '0.5rem 0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                resize: 'vertical'
                            }}
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
                    <HitDieSelector
                        label="Hit Die"
                        value={classData.hitDie}
                        onChange={(value) => handleFieldChange('hitDie', value)}
                        required
                        error={touched.hitDie && errors.hitDie}
                        helperText="Higher hit dice = more HP per level. Consider your class's intended role."
                    />

                    {/* Primary Ability */}
                    <AbilityScoreSelector
                        label="Primary Ability Scores"
                        value={classData.primaryAbility || []}
                        onChange={(value) => handleFieldChange('primaryAbility', value)}
                        multiple={true}
                        max={2}
                        required
                        error={touched.primaryAbility && errors.primaryAbility}
                        helperText="1-2 abilities that are most important for this class"
                    />
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
                        style={{
                            width: '100%',
                            padding: '0.5rem 0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            backgroundColor: 'white'
                        }}
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