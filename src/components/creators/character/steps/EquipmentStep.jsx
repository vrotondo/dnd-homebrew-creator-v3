// src/components/creators/character/steps/EquipmentStep.jsx
import React, { useState } from 'react';
import { Input, Button, Badge, Card, CardContent } from '../../../ui';
import { Plus, X, Shield, Sword, Package, Coins } from 'lucide-react';

export default function EquipmentStep({
    classData,
    handleFieldChange,
    errors,
    touched
}) {
    const [newStandardItem, setNewStandardItem] = useState('');
    const [newOptionA, setNewOptionA] = useState('');
    const [newOptionB, setNewOptionB] = useState('');

    // Initialize equipment structure
    const equipment = classData.startingEquipment || {
        standard: [],
        options: [],
        startingGold: '',
        alternateRule: ''
    };

    const updateEquipment = (updates) => {
        handleFieldChange('startingEquipment', {
            ...equipment,
            ...updates
        });
    };

    // Standard Equipment Management
    const addStandardItem = () => {
        if (newStandardItem.trim()) {
            const updated = [...(equipment.standard || []), newStandardItem.trim()];
            updateEquipment({ standard: updated });
            setNewStandardItem('');
        }
    };

    const removeStandardItem = (index) => {
        const updated = equipment.standard.filter((_, i) => i !== index);
        updateEquipment({ standard: updated });
    };

    // Equipment Options Management
    const addEquipmentOption = () => {
        if (newOptionA.trim() && newOptionB.trim()) {
            const newOption = {
                id: Date.now(),
                optionA: newOptionA.trim(),
                optionB: newOptionB.trim()
            };
            const updated = [...(equipment.options || []), newOption];
            updateEquipment({ options: updated });
            setNewOptionA('');
            setNewOptionB('');
        }
    };

    const removeEquipmentOption = (index) => {
        const updated = equipment.options.filter((_, i) => i !== index);
        updateEquipment({ options: updated });
    };

    const updateEquipmentOption = (index, field, value) => {
        const updated = equipment.options.map((option, i) =>
            i === index ? { ...option, [field]: value } : option
        );
        updateEquipment({ options: updated });
    };

    // Common equipment suggestions
    const equipmentSuggestions = {
        weapons: [
            'a simple weapon of your choice',
            'a martial weapon of your choice',
            'a light crossbow and 20 bolts',
            'a shortbow and a quiver of 20 arrows',
            'a handaxe',
            'two daggers',
            'a rapier',
            'a shortsword'
        ],
        armor: [
            'leather armor',
            'studded leather armor',
            'chain mail',
            'scale mail',
            'a shield',
            'padded armor'
        ],
        equipment: [
            'a dungeoneer\'s pack',
            'an explorer\'s pack',
            'a scholar\'s pack',
            'an entertainer\'s pack',
            'thieves\' tools',
            'a holy symbol',
            'a spellbook',
            'a component pouch',
            'a musical instrument of your choice'
        ]
    };

    return (
        <div className="space-y-6">
            {/* Introduction */}
            <div className="form-section">
                <h4 className="form-section-title">Starting Equipment</h4>
                <p className="form-section-description">
                    Define what equipment characters get when they choose this class at 1st level.
                    You can provide guaranteed items and choices between alternatives.
                </p>
            </div>

            {/* Standard Equipment */}
            <div className="form-section">
                <h4 className="form-section-title flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Guaranteed Equipment
                </h4>
                <p className="form-section-description">
                    Items that every character of this class automatically receives.
                </p>

                <div className="space-y-4">
                    {/* Current Standard Items */}
                    {equipment.standard?.length > 0 && (
                        <div className="space-y-2">
                            {equipment.standard.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex-1 text-sm">
                                        {item}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeStandardItem(index)}
                                        className="gap-1 text-red-600 hover:text-red-700"
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add New Standard Item */}
                    <div className="flex gap-3">
                        <Input
                            placeholder="e.g., leather armor, a dagger, explorer's pack"
                            value={newStandardItem}
                            onChange={(e) => setNewStandardItem(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addStandardItem()}
                            className="flex-1"
                        />
                        <Button
                            onClick={addStandardItem}
                            disabled={!newStandardItem.trim()}
                            className="gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add
                        </Button>
                    </div>

                    {/* Equipment Suggestions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <Card>
                            <CardContent className="p-4">
                                <h6 className="font-medium mb-2 flex items-center gap-2">
                                    <Sword className="w-4 h-4" />
                                    Weapons
                                </h6>
                                <div className="space-y-1">
                                    {equipmentSuggestions.weapons.slice(0, 4).map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setNewStandardItem(item)}
                                            className="text-xs text-blue-600 hover:text-blue-700 block text-left"
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <h6 className="font-medium mb-2 flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Armor
                                </h6>
                                <div className="space-y-1">
                                    {equipmentSuggestions.armor.map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setNewStandardItem(item)}
                                            className="text-xs text-blue-600 hover:text-blue-700 block text-left"
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <h6 className="font-medium mb-2 flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Equipment
                                </h6>
                                <div className="space-y-1">
                                    {equipmentSuggestions.equipment.slice(0, 4).map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setNewStandardItem(item)}
                                            className="text-xs text-blue-600 hover:text-blue-700 block text-left"
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Equipment Options */}
            <div className="form-section">
                <h4 className="form-section-title">Equipment Choices</h4>
                <p className="form-section-description">
                    Give players choices between different equipment options. Format: "(a) X or (b) Y"
                </p>

                <div className="space-y-4">
                    {/* Current Options */}
                    {equipment.options?.length > 0 && (
                        <div className="space-y-3">
                            {equipment.options.map((option, index) => (
                                <div key={option.id || index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <Input
                                            label="Option A"
                                            value={option.optionA}
                                            onChange={(e) => updateEquipmentOption(index, 'optionA', e.target.value)}
                                            placeholder="e.g., scale mail"
                                        />
                                        <Input
                                            label="Option B"
                                            value={option.optionB}
                                            onChange={(e) => updateEquipmentOption(index, 'optionB', e.target.value)}
                                            placeholder="e.g., leather armor"
                                        />
                                    </div>
                                    <div className="mt-3 flex justify-between items-center">
                                        <div className="text-sm text-gray-600">
                                            <strong>Preview:</strong> ({String.fromCharCode(97 + index)}) {option.optionA} or ({String.fromCharCode(98 + index)}) {option.optionB}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeEquipmentOption(index)}
                                            className="text-red-600 hover:text-red-700 gap-1"
                                        >
                                            <X className="w-3 h-3" />
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add New Option */}
                    <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                                label="Option A"
                                placeholder="e.g., a martial weapon"
                                value={newOptionA}
                                onChange={(e) => setNewOptionA(e.target.value)}
                            />
                            <Input
                                label="Option B"
                                placeholder="e.g., a shield and simple weapon"
                                value={newOptionB}
                                onChange={(e) => setNewOptionB(e.target.value)}
                            />
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                                Preview: (a) {newOptionA || '[Option A]'} or (b) {newOptionB || '[Option B]'}
                            </div>
                            <Button
                                onClick={addEquipmentOption}
                                disabled={!newOptionA.trim() || !newOptionB.trim()}
                                className="gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Choice
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Starting Gold */}
            <div className="form-section">
                <h4 className="form-section-title flex items-center gap-2">
                    <Coins className="w-5 h-5" />
                    Starting Gold
                </h4>
                <p className="form-section-description">
                    Additional gold pieces that characters start with.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Starting Gold (GP)"
                        type="text"
                        value={equipment.startingGold || ''}
                        onChange={(e) => updateEquipment({ startingGold: e.target.value })}
                        placeholder="e.g., 2d4 × 10 gp, 100 gp, or 4d4 × 10 gp"
                        helperText="Can use dice notation (2d4 × 10) or fixed amounts (50)"
                    />

                    <div className="form-field">
                        <label className="form-label">Typical Starting Gold by Class</label>
                        <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                            <div><strong>Low:</strong> 2d4 × 10 gp (50 gp average)</div>
                            <div><strong>Medium:</strong> 3d4 × 10 gp (75 gp average)</div>
                            <div><strong>High:</strong> 4d4 × 10 gp (100 gp average)</div>
                            <div><strong>Very High:</strong> 5d4 × 10 gp (125 gp average)</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alternative Equipment Rule */}
            <div className="form-section">
                <h4 className="form-section-title">Alternative Equipment Rule</h4>
                <p className="form-section-description">
                    Instead of starting equipment, players can buy gear with gold (PHB variant rule).
                </p>

                <div className="form-field">
                    <label className="form-label">Alternative Starting Gold</label>
                    <Input
                        value={equipment.alternateRule || ''}
                        onChange={(e) => updateEquipment({ alternateRule: e.target.value })}
                        placeholder="e.g., 4d4 × 10 gp"
                        helperText="Gold amount for players who choose to buy their own equipment instead"
                    />
                </div>
            </div>

            {/* Preview */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-semibold text-green-900 mb-3">📋 Equipment Summary</h5>
                <div className="text-sm text-green-800">
                    <div><strong>You start with the following equipment:</strong></div>
                    <ul className="mt-2 space-y-1 ml-4">
                        {equipment.standard?.map((item, i) => (
                            <li key={i}>• {item}</li>
                        )) || <li>• <em>No guaranteed equipment yet</em></li>}

                        {equipment.options?.map((option, i) => (
                            <li key={i}>• ({String.fromCharCode(97 + i)}) {option.optionA} or ({String.fromCharCode(98 + i)}) {option.optionB}</li>
                        ))}

                        {equipment.startingGold && (
                            <li>• {equipment.startingGold} gp</li>
                        )}
                    </ul>

                    {equipment.alternateRule && (
                        <div className="mt-3 pt-3 border-t border-green-300">
                            <strong>Alternatively,</strong> you can ignore the equipment here and start with {equipment.alternateRule} gp to buy your gear.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}