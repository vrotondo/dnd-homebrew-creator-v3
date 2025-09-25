// src/components/creators/character/steps/SpellcastingStep.jsx
import React from 'react';
import { Input, Badge } from '../../../ui';
import { AbilityScoreSelector } from '../../../common/DndFormComponents';
import { ABILITY_SCORES, SPELLCASTING_PROGRESSIONS } from '../../../../utils/dndConstants';
import { Wand2, BookOpen, Zap } from 'lucide-react';

export default function SpellcastingStep({
    classData,
    handleFieldChange,
    errors,
    touched
}) {
    // Initialize spellcasting structure if needed
    const spellcasting = classData.spellcasting || {
        enabled: false,
        ability: '',
        type: 'full',
        startLevel: 1,
        focusType: '',
        ritualCasting: false,
        spellsKnownProgression: [],
        cantripsKnownProgression: [],
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
            // Disable spellcasting
            handleFieldChange('spellcasting', { enabled: false });
        } else {
            // Enable with defaults
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
            <div className="space-y-6">
                <div className="form-section">
                    <h4 className="form-section-title">Spellcasting</h4>
                    <p className="form-section-description">
                        Does this class have the ability to cast spells?
                    </p>
                </div>

                <div className="spellcasting-toggle">
                    <div className="spellcasting-option disabled">
                        <Wand2 className="w-12 h-12 text-gray-400 mb-4" />
                        <h5 className="font-semibold text-gray-700 mb-2">No Spellcasting</h5>
                        <p className="text-gray-600 mb-4">
                            This class relies on non-magical abilities and features.
                        </p>
                        <button
                            type="button"
                            onClick={toggleSpellcasting}
                            className="btn btn-outline"
                        >
                            Add Spellcasting
                        </button>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="font-semibold text-blue-900 mb-2">💡 When to Add Spellcasting</h5>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• <strong>Full Casters:</strong> Magic is the primary class feature (Wizard, Sorcerer)</li>
                        <li>• <strong>Half Casters:</strong> Blend martial and magical abilities (Paladin, Ranger)</li>
                        <li>• <strong>Third Casters:</strong> Limited magic to supplement martial skills</li>
                        <li>• <strong>Warlock-style:</strong> Few spells that refresh on short rests</li>
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Spellcasting Header */}
            <div className="form-section">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="form-section-title">Spellcasting Configuration</h4>
                        <p className="form-section-description">
                            Configure how this class casts spells and manages magical abilities.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={toggleSpellcasting}
                        className="btn btn-outline btn-sm"
                    >
                        Remove Spellcasting
                    </button>
                </div>
            </div>

            {/* Basic Spellcasting Setup */}
            <div className="form-section">
                <h4 className="form-section-title">Basic Configuration</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AbilityScoreSelector
                        label="Spellcasting Ability"
                        value={spellcasting.ability}
                        onChange={(ability) => updateSpellcasting({ ability })}
                        multiple={false}
                        required
                        helperText="Which ability score powers spells?"
                    />

                    <div className="form-field">
                        <label className="form-label">Caster Type</label>
                        <select
                            className="form-select"
                            value={spellcasting.type}
                            onChange={(e) => updateSpellcasting({ type: e.target.value })}
                        >
                            <option value="full">Full Caster (Wizard-like)</option>
                            <option value="half">Half Caster (Paladin-like)</option>
                            <option value="third">Third Caster (Eldritch Knight-like)</option>
                            <option value="warlock">Warlock-style (Pact Magic)</option>
                            <option value="custom">Custom Progression</option>
                        </select>
                        <div className="form-helper">
                            Determines spell slot progression and spells known
                        </div>
                    </div>

                    <Input
                        label="Spellcasting Starts At Level"
                        type="number"
                        min="1"
                        max="20"
                        value={spellcasting.startLevel}
                        onChange={(e) => updateSpellcasting({
                            startLevel: parseInt(e.target.value) || 1
                        })}
                        helperText="When do characters gain spellcasting?"
                    />

                    <div className="form-field">
                        <label className="form-label">Spellcasting Focus</label>
                        <select
                            className="form-select"
                            value={spellcasting.focusType || ''}
                            onChange={(e) => updateSpellcasting({ focusType: e.target.value })}
                        >
                            <option value="">None required</option>
                            <option value="arcane">Arcane Focus</option>
                            <option value="druidcraft">Druidcraft Focus</option>
                            <option value="holy">Holy Symbol</option>
                            <option value="component">Component Pouch</option>
                            <option value="instrument">Musical Instrument</option>
                            <option value="custom">Custom Focus</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="ritualCasting"
                            checked={spellcasting.ritualCasting || false}
                            onChange={(e) => updateSpellcasting({
                                ritualCasting: e.target.checked
                            })}
                            className="form-checkbox"
                        />
                        <label htmlFor="ritualCasting" className="form-label mb-0">
                            Ritual Casting
                        </label>
                        <div className="form-helper">
                            Can cast spells with ritual tag without using spell slots
                        </div>
                    </div>

                    <div className="form-field">
                        <label className="form-label">Spell List</label>
                        <select
                            className="form-select"
                            value={spellcasting.spellList || 'custom'}
                            onChange={(e) => updateSpellcasting({ spellList: e.target.value })}
                        >
                            <option value="wizard">Wizard Spell List</option>
                            <option value="cleric">Cleric Spell List</option>
                            <option value="druid">Druid Spell List</option>
                            <option value="sorcerer">Sorcerer Spell List</option>
                            <option value="warlock">Warlock Spell List</option>
                            <option value="bard">Bard Spell List</option>
                            <option value="paladin">Paladin Spell List</option>
                            <option value="ranger">Ranger Spell List</option>
                            <option value="custom">Custom Spell List</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Spell Progression */}
            <div className="form-section">
                <h4 className="form-section-title">Spell Progression</h4>
                <p className="form-section-description">
                    Configure how many spells and cantrips characters learn as they level up.
                </p>

                {spellcasting.type !== 'custom' ? (
                    <div className="progression-preview">
                        <div className="progression-type-info">
                            <div className="flex items-center gap-3 mb-3">
                                <Badge variant="primary">
                                    {SPELLCASTING_PROGRESSIONS[spellcasting.type]?.name || 'Standard Progression'}
                                </Badge>
                                <span className="text-sm text-gray-600">
                                    {SPELLCASTING_PROGRESSIONS[spellcasting.type]?.description || 'Uses standard D&D progression'}
                                </span>
                            </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <p className="text-sm text-gray-700 mb-2">
                                <strong>Automatic Progression:</strong> This class will use the standard {spellcasting.type} caster progression for spell slots.
                            </p>
                            <p className="text-sm text-gray-600">
                                You can still customize spells known and cantrips known below, or switch to "Custom Progression" for full control.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="custom-progression">
                        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-3 mb-4">
                            <strong>Custom Progression:</strong> You'll need to define spell slot progression manually.
                            This is advanced - consider using a standard progression unless you have specific needs.
                        </p>

                        <div className="progression-table">
                            <div className="table-header">
                                <div>Level</div>
                                <div>1st</div>
                                <div>2nd</div>
                                <div>3rd</div>
                                <div>4th</div>
                                <div>5th</div>
                                <div>6th</div>
                                <div>7th</div>
                                <div>8th</div>
                                <div>9th</div>
                            </div>

                            {/* This would need a full table implementation for custom progressions */}
                            <div className="text-sm text-gray-600 p-4">
                                Custom spell slot progression editor would go here...
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Spells Known */}
            <div className="form-section">
                <h4 className="form-section-title">Spells & Cantrips Known</h4>
                <p className="form-section-description">
                    Configure how many spells and cantrips characters can know at each level.
                </p>

                <div className="space-y-4">
                    <div className="form-field">
                        <label className="form-label">Spells Known Type</label>
                        <select
                            className="form-select"
                            value={spellcasting.spellsKnownType || 'fixed'}
                            onChange={(e) => updateSpellcasting({
                                spellsKnownType: e.target.value
                            })}
                        >
                            <option value="fixed">Fixed Number (Sorcerer-style)</option>
                            <option value="prepared">Prepared Spells (Wizard-style)</option>
                            <option value="all">Know All (Cleric-style)</option>
                            <option value="none">No Spells Known</option>
                        </select>
                        <div className="form-helper">
                            How does the class learn and manage spells?
                        </div>
                    </div>

                    {spellcasting.spellsKnownType !== 'none' && (
                        <div className="spells-known-config">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Cantrips Known at Level 1"
                                    type="number"
                                    min="0"
                                    max="10"
                                    value={spellcasting.cantripsKnownStart || 0}
                                    onChange={(e) => updateSpellcasting({
                                        cantripsKnownStart: parseInt(e.target.value) || 0
                                    })}
                                />

                                <Input
                                    label="Spells Known at Level 1"
                                    type="number"
                                    min="0"
                                    max="20"
                                    value={spellcasting.spellsKnownStart || 0}
                                    onChange={(e) => updateSpellcasting({
                                        spellsKnownStart: parseInt(e.target.value) || 0
                                    })}
                                />
                            </div>

                            <div className="progression-note">
                                <p className="text-sm text-gray-600">
                                    <strong>Note:</strong> Detailed progression tables will be auto-generated based on caster type.
                                    You can customize specific values after the initial class creation.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Spellcasting Feature Description */}
            <div className="form-section">
                <h4 className="form-section-title">Spellcasting Feature Text</h4>
                <p className="form-section-description">
                    Customize the spellcasting feature description or use the auto-generated version.
                </p>

                <div className="form-field">
                    <label className="form-label">Custom Description</label>
                    <textarea
                        className="form-textarea"
                        value={spellcasting.customDescription || ''}
                        onChange={(e) => updateSpellcasting({
                            customDescription: e.target.value
                        })}
                        placeholder="Leave blank to auto-generate based on your configuration..."
                        rows={6}
                    />
                    <div className="form-helper">
                        If left blank, we'll generate appropriate spellcasting feature text based on your selections.
                    </div>
                </div>
            </div>

            {/* Tips */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h5 className="font-semibold text-indigo-900 mb-2">✨ Spellcasting Tips</h5>
                <ul className="text-sm text-indigo-800 space-y-1">
                    <li>• <strong>Full Casters:</strong> Start spellcasting at level 1, use Intelligence/Wisdom/Charisma</li>
                    <li>• <strong>Half Casters:</strong> Start at level 2, usually Wisdom or Charisma based</li>
                    <li>• <strong>Third Casters:</strong> Start at level 3, limited spell progression</li>
                    <li>• <strong>Balance:</strong> More spellcasting usually means fewer non-magical features</li>
                </ul>
            </div>
        </div>
    );
}