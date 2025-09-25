// src/components/creators/character/steps/SpellcastingStep.jsx
import React from 'react';
import { Input, Badge, Button, Card, CardContent } from '../../../ui';
import { AbilityScoreSelector } from '../../../common/DndFormComponents';
import { ABILITY_SCORES, SPELLCASTING_PROGRESSIONS } from '../../../../utils/dndConstants';
import { Wand2, BookOpen, Zap, Sparkles, X } from 'lucide-react';

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
        spellList: 'custom',
        spellsKnownType: 'known'
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
                startLevel: 1,
                spellsKnownType: 'known'
            });
        }
    };

    const spellcastingTypes = [
        {
            value: 'full',
            label: 'Full Caster',
            description: 'Like Wizard, Sorcerer, Warlock - magic is their primary feature',
            progression: '9th level spells at 17th level',
            examples: 'Wizard, Sorcerer, Bard, Cleric, Druid, Warlock'
        },
        {
            value: 'half',
            label: 'Half Caster',
            description: 'Like Paladin, Ranger - magic supports their main abilities',
            progression: '5th level spells at 17th level',
            examples: 'Paladin, Ranger'
        },
        {
            value: 'third',
            label: 'Third Caster',
            description: 'Like Eldritch Knight - limited magical supplement',
            progression: '4th level spells at 19th level',
            examples: 'Eldritch Knight Fighter, Arcane Trickster Rogue'
        },
        {
            value: 'warlock',
            label: 'Warlock-style (Pact Magic)',
            description: 'Few spell slots that recover on short rest',
            progression: 'Up to 5th level spells, but fewer slots',
            examples: 'Warlock'
        }
    ];

    const focusTypes = [
        { value: '', label: 'No Focus Required' },
        { value: 'spellbook', label: 'Spellbook (like Wizard)' },
        { value: 'component_pouch', label: 'Component Pouch' },
        { value: 'arcane_focus', label: 'Arcane Focus (wand, staff, etc.)' },
        { value: 'druidcraft_focus', label: 'Druidcraft Focus (natural items)' },
        { value: 'holy_symbol', label: 'Holy Symbol' },
        { value: 'instrument', label: 'Musical Instrument' },
        { value: 'custom', label: 'Custom Focus Type' }
    ];

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
                    {/* No Spellcasting Option */}
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

                    {/* Enable Spellcasting Option */}
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

                {/* Benefits of Each Choice */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h5 className="font-semibold mb-4">✨ Spellcasting Considerations</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <strong>Non-Magical Classes:</strong>
                            <ul className="mt-2 space-y-1 text-gray-600">
                                <li>• Focus entirely on unique physical/mental abilities</li>
                                <li>• More frequent feature progression</li>
                                <li>• Simpler to play and balance</li>
                                <li>• Stand out in low-magic settings</li>
                            </ul>
                        </div>
                        <div>
                            <strong>Spellcasting Classes:</strong>
                            <ul className="mt-2 space-y-1 text-gray-600">
                                <li>• Versatile problem-solving with spells</li>
                                <li>• Appeal to players who love magic</li>
                                <li>• More complex but rewarding gameplay</li>
                                <li>• Can supplement class features with spells</li>
                            </ul>
                        </div>
                    </div>
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

            {/* Spellcasting Type */}
            <div className="form-section">
                <h4 className="form-section-title">Caster Type</h4>
                <p className="form-section-description">
                    Choose how much magical power this class has. This affects spell progression and available spell levels.
                </p>

                <div className="grid grid-cols-1 gap-4">
                    {spellcastingTypes.map((type) => (
                        <label key={type.value} className="caster-type-option">
                            <input
                                type="radio"
                                name="spellcastingType"
                                value={type.value}
                                checked={spellcasting.type === type.value}
                                onChange={(e) => updateSpellcasting({ type: e.target.value })}
                                className="sr-only"
                            />
                            <div className={`
                                p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                                ${spellcasting.type === type.value
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                                }
                            `}>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="font-semibold text-lg">{type.label}</div>
                                        <div className="text-gray-600 dark:text-gray-400 mt-1">{type.description}</div>
                                        <div className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                                            <strong>Progression:</strong> {type.progression}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 text-right">
                                        <div><strong>Examples:</strong></div>
                                        <div>{type.examples}</div>
                                    </div>
                                </div>
                            </div>
                        </label>
                    ))}
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
                        <label className="form-label">Spells Known Type</label>
                        <select
                            className="form-select"
                            value={spellcasting.spellsKnownType}
                            onChange={(e) => updateSpellcasting({ spellsKnownType: e.target.value })}
                        >
                            <option value="known">Spells Known (like Sorcerer)</option>
                            <option value="prepared">Spells Prepared (like Wizard)</option>
                            <option value="all">Knows All Spells (like Cleric)</option>
                            <option value="none">No Individual Spells</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Spellcasting Focus */}
            <div className="form-section">
                <h4 className="form-section-title">Spellcasting Focus</h4>
                <p className="form-section-description">
                    What does this class need to cast spells?
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-field">
                        <label className="form-label">Focus Type</label>
                        <select
                            className="form-select"
                            value={spellcasting.focusType}
                            onChange={(e) => updateSpellcasting({ focusType: e.target.value })}
                        >
                            {focusTypes.map(focus => (
                                <option key={focus.value} value={focus.value}>
                                    {focus.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {spellcasting.focusType === 'custom' && (
                        <Input
                            label="Custom Focus Description"
                            value={spellcasting.customFocus || ''}
                            onChange={(e) => updateSpellcasting({ customFocus: e.target.value })}
                            placeholder="e.g., crystal orbs, carved totems, etc."
                        />
                    )}
                </div>

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
            </div>

            {/* Spell Progression */}
            {spellcasting.spellsKnownType !== 'none' && (
                <div className="form-section">
                    <h4 className="form-section-title">Initial Spell Knowledge</h4>
                    <p className="form-section-description">
                        How many spells/cantrips does the class start with? Full progression tables will be auto-generated.
                    </p>

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
                            label="Spells Known at Spellcasting Level"
                            type="number"
                            min="0"
                            max="20"
                            value={spellcasting.spellsKnownStart || 2}
                            onChange={(e) => updateSpellcasting({
                                spellsKnownStart: parseInt(e.target.value) || 2
                            })}
                        />
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>📊 Note:</strong> Detailed progression tables will be auto-generated based on your caster type.
                            You can customize specific values in the class features step or after creation.
                        </p>
                    </div>
                </div>
            )}

            {/* Spell List */}
            <div className="form-section">
                <h4 className="form-section-title">Spell List</h4>
                <p className="form-section-description">
                    What spells can this class learn and cast?
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-field">
                        <label className="form-label">Spell List Type</label>
                        <select
                            className="form-select"
                            value={spellcasting.spellList}
                            onChange={(e) => updateSpellcasting({ spellList: e.target.value })}
                        >
                            <option value="custom">Custom spell list</option>
                            <option value="wizard">Wizard spell list</option>
                            <option value="cleric">Cleric spell list</option>
                            <option value="druid">Druid spell list</option>
                            <option value="sorcerer">Sorcerer spell list</option>
                            <option value="warlock">Warlock spell list</option>
                            <option value="bard">Bard spell list</option>
                            <option value="paladin">Paladin spell list</option>
                            <option value="ranger">Ranger spell list</option>
                            <option value="mixed">Mix of multiple lists</option>
                        </select>
                    </div>

                    {spellcasting.spellList === 'mixed' && (
                        <Input
                            label="Mixed Spell Lists"
                            value={spellcasting.mixedLists || ''}
                            onChange={(e) => updateSpellcasting({ mixedLists: e.target.value })}
                            placeholder="e.g., Wizard + Cleric, Druid + Ranger"
                            helperText="Which spell lists to combine"
                        />
                    )}
                </div>
            </div>

            {/* Custom Description */}
            <div className="form-section">
                <h4 className="form-section-title">Spellcasting Feature Description</h4>
                <p className="form-section-description">
                    Customize how the spellcasting feature is described, or leave blank for auto-generation.
                </p>

                <div className="form-field">
                    <label className="form-label">Custom Description (Optional)</label>
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
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg p-4">
                <h5 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">✨ Spellcasting Design Tips</h5>
                <ul className="text-sm text-indigo-800 dark:text-indigo-200 space-y-1">
                    <li>• <strong>Full Casters:</strong> Magic is their primary feature - start at level 1, high spell progression</li>
                    <li>• <strong>Half Casters:</strong> Magic supports other abilities - start at level 2, moderate progression</li>
                    <li>• <strong>Third Casters:</strong> Magic is supplementary - start at level 3, limited progression</li>
                    <li>• <strong>Balance:</strong> More spellcasting power usually means fewer or weaker non-magical features</li>
                    <li>• <strong>Ability Scores:</strong> INT (academic), WIS (intuitive), CHA (innate) - affects flavor significantly</li>
                </ul>
            </div>

            {/* Quick Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h5 className="font-semibold mb-3">📋 Spellcasting Summary</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <div><strong>Type:</strong> {spellcastingTypes.find(t => t.value === spellcasting.type)?.label || 'Not selected'}</div>
                        <div><strong>Ability:</strong> {spellcasting.ability || 'Not selected'}</div>
                        <div><strong>Starts:</strong> Level {spellcasting.startLevel}</div>
                        <div><strong>Ritual Casting:</strong> {spellcasting.ritualCasting ? 'Yes' : 'No'}</div>
                    </div>
                    <div>
                        <div><strong>Focus:</strong> {focusTypes.find(f => f.value === spellcasting.focusType)?.label || 'None'}</div>
                        <div><strong>Spell List:</strong> {spellcasting.spellList || 'Custom'}</div>
                        <div><strong>Initial Cantrips:</strong> {spellcasting.cantripsKnownStart || 0}</div>
                        <div><strong>Initial Spells:</strong> {spellcasting.spellsKnownStart || 2}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}