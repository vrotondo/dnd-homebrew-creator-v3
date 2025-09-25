// src/components/creators/character/steps/BasicInfoStep.jsx
import React from 'react';
import { Input } from '../../../ui';
import {
    AbilityScoreSelector,
    HitDieSelector
} from '../../../common/DndFormComponents';
import { ABILITY_SCORES } from '../../../../utils/dndConstants';

export default function BasicInfoStep({
    classData,
    handleFieldChange,
    errors,
    touched
}) {
    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <div className="form-section">
                <h4 className="form-section-title">Basic Information</h4>
                <p className="form-section-description">
                    Start with the fundamental details of your class.
                </p>

                <div className="space-y-4">
                    <Input
                        label="Class Name"
                        type="text"
                        value={classData.name || ''}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        placeholder="e.g. Mystic Warrior"
                        required
                        error={touched.name && errors.name}
                        helperText="Choose a unique and evocative name for your class"
                    />

                    <div className="form-field">
                        <label className="form-label">
                            Description
                            <span className="form-required">*</span>
                        </label>
                        <textarea
                            className="form-textarea"
                            value={classData.description || ''}
                            onChange={(e) => handleFieldChange('description', e.target.value)}
                            placeholder="Describe your class's theme, role, and what makes it unique..."
                            rows={4}
                        />
                        {touched.description && errors.description && (
                            <div className="form-error">{errors.description}</div>
                        )}
                        <div className="form-helper">
                            Explain what this class represents, its role in combat and exploration,
                            and what makes it different from existing classes.
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Mechanics */}
            <div className="form-section">
                <h4 className="form-section-title">Core Mechanics</h4>
                <p className="form-section-description">
                    Define the fundamental mechanical aspects of your class.
                </p>

                <div className="space-y-6">
                    <HitDieSelector
                        value={classData.hitDie}
                        onChange={(value) => handleFieldChange('hitDie', value)}
                        required
                        error={touched.hitDie && errors.hitDie}
                        helperText="Determines how much health characters gain per level"
                    />

                    <AbilityScoreSelector
                        label="Primary Abilities"
                        value={classData.primaryAbility || []}
                        onChange={(value) => handleFieldChange('primaryAbility', value)}
                        multiple={true}
                        max={3}
                        required
                        error={touched.primaryAbility && errors.primaryAbility}
                        helperText="The most important ability scores for this class (1-3 abilities)"
                    />
                </div>
            </div>

            {/* Class Flavor */}
            <div className="form-section">
                <h4 className="form-section-title">Class Flavor</h4>
                <p className="form-section-description">
                    Optional details that help define the class's identity and role in the world.
                </p>

                <div className="space-y-4">
                    <Input
                        label="Role"
                        type="text"
                        value={classData.role || ''}
                        onChange={(e) => handleFieldChange('role', e.target.value)}
                        placeholder="e.g. Controller, Striker, Defender, Support"
                        helperText="What role does this class typically fill in a party?"
                    />

                    <div className="form-field">
                        <label className="form-label">Author Notes</label>
                        <textarea
                            className="form-textarea"
                            value={classData.authorNotes || ''}
                            onChange={(e) => handleFieldChange('authorNotes', e.target.value)}
                            placeholder="Design notes, inspiration, or implementation details..."
                            rows={3}
                        />
                        <div className="form-helper">
                            Private notes about your design process, balance considerations, or inspiration.
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="srdCompliant"
                            checked={classData.srdCompliant !== false}
                            onChange={(e) => handleFieldChange('srdCompliant', e.target.checked)}
                            className="form-checkbox"
                        />
                        <label htmlFor="srdCompliant" className="form-label mb-0">
                            SRD Compliant
                        </label>
                        <div className="form-helper">
                            Check if this class only uses SRD content and can be shared freely.
                        </div>
                    </div>
                </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-900 mb-2">💡 Design Tips</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Name:</strong> Make it memorable and thematic</li>
                    <li>• <strong>Hit Die:</strong> d6 for fragile casters, d8 for most classes, d10+ for warriors</li>
                    <li>• <strong>Primary Abilities:</strong> Usually 1-2 abilities, rarely 3</li>
                    <li>• <strong>Description:</strong> Focus on theme and role, not mechanical details</li>
                </ul>
            </div>
        </div>
    );
}