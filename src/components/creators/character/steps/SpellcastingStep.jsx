// src/components/creators/character/steps/SpellcastingStep.jsx - QUICK FIX
import React from 'react';
import { Input, Badge, Button, Card, CardContent } from '../../../ui';
import { AbilityScoreSelector } from '../../../common/DndFormComponents';
import { ABILITY_SCORES } from '../../../../utils/dndConstants';
import { Wand2, BookOpen, Zap, Sparkles, X, Sword } from 'lucide-react';

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
            <div className="space-y-6">
                <div className="form-section">
                    <h4 className="form-section-title">Spellcasting</h4>
                    <p className="form-section-description">
                        Does this class have the ability to cast spells?
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <Sword className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h5 className="font-semibold text-gray-700 mb-2">No Spellcasting</h5>
                            <p className="text-gray-600 mb-4">
                                This class relies on non-magical abilities and features.
                            </p>
                            <p className="text-sm text-gray-500">
                                <strong>Examples:</strong> Fighter, Rogue, Barbarian, Monk
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <Wand2 className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                            <h5 className="font-semibold text-blue-700 mb-2">Enable Spellcasting</h5>
                            <p className="text-gray-600 mb-4">
                                This class can cast spells and has magical abilities.
                            </p>
                            <Button
                                onClick={toggleSpellcasting}
                                className="w-full gap-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                Add Spellcasting
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with disable option */}
            <div className="form-section">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="form-section-title flex items-center gap-2">
                            <Wand2 className="w-5 h-5" />
                            Spellcasting Configuration
                        </h4>
                        <p className="form-section-description">
                            Configure how this class uses magic and arcane abilities.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleSpellcasting}
                        className="gap-2 text-red-600 hover:text-red-700"
                    >
                        <X className="w-4 h-4" />
                        Remove Spellcasting
                    </Button>
                </div>
            </div>

            {/* Basic Configuration */}
            <div className="form-section">
                <h4 className="form-section-title">Basic Configuration</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="form-field">
                        <label className="form-label">Spellcasting Ability</label>
                        <select
                            className="form-select"
                            value={spellcasting.ability}
                            onChange={(e) => updateSpellcasting({ ability: e.target.value })}
                            required
                            style={{
                                width: '100%',
                                padding: '0.5rem 0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                backgroundColor: 'white'
                            }}
                        >
                            <option value="">Choose ability...</option>
                            {ABILITY_SCORES.map(ability => (
                                <option key={ability} value={ability}>{ability}</option>
                            ))}
                        </select>
                        <div className="form-helper">Powers spell attack rolls and save DCs</div>
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
                        helperText="When characters gain spellcasting"
                    />

                    <div className="form-field">
                        <label className="form-label">Caster Type</label>
                        <select
                            className="form-select"
                            value={spellcasting.type}
                            onChange={(e) => updateSpellcasting({ type: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.5rem 0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                backgroundColor: 'white'
                            }}
                        >
                            <option value="full">Full Caster (Wizard-like)</option>
                            <option value="half">Half Caster (Paladin-like)</option>
                            <option value="third">Third Caster (Fighter-like)</option>
                            <option value="warlock">Warlock-style (Pact Magic)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Additional Options */}
            <div className="form-section">
                <h4 className="form-section-title">Additional Options</h4>

                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={spellcasting.ritualCasting || false}
                                onChange={(e) => updateSpellcasting({ ritualCasting: e.target.checked })}
                                className="form-checkbox"
                            />
                            <span className="text-sm font-medium">Ritual Casting</span>
                        </label>
                        <div className="text-sm text-gray-600">
                            Can cast spells with the ritual tag without using spell slots
                        </div>
                    </div>

                    <div className="form-field">
                        <label className="form-label">Spell List</label>
                        <select
                            className="form-select"
                            value={spellcasting.spellList}
                            onChange={(e) => updateSpellcasting({ spellList: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.5rem 0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                backgroundColor: 'white'
                            }}
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
            </div>

            {/* Tips */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h5 className="font-semibold text-indigo-900 mb-2">✨ Spellcasting Tips</h5>
                <ul className="text-sm text-indigo-800 space-y-1">
                    <li>• <strong>Full Casters:</strong> Magic is primary - start at level 1</li>
                    <li>• <strong>Half Casters:</strong> Magic supports other abilities - start at level 2</li>
                    <li>• <strong>Third Casters:</strong> Magic is supplementary - start at level 3</li>
                    <li>• <strong>Balance:</strong> More spellcasting = fewer non-magical features</li>
                </ul>
            </div>
        </div>
    );
}