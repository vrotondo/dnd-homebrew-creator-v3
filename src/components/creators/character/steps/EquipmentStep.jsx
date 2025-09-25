// src/components/creators/character/steps/EquipmentStep.jsx
import React, { useState } from 'react';
import { Button, Input, Badge } from '../../../ui';
import { Plus, X, Package } from 'lucide-react';
import { EQUIPMENT_PACKAGES } from '../../../../utils/dndConstants';

export default function EquipmentStep({
    classData,
    handleFieldChange,
    errors,
    touched
}) {
    const [newEquipmentItem, setNewEquipmentItem] = useState('');
    const [newOptionA, setNewOptionA] = useState('');
    const [newOptionB, setNewOptionB] = useState('');

    // Initialize equipment structure if needed
    const equipment = classData.startingEquipment || {
        standard: [],
        options: [],
        startingGold: null
    };

    const updateEquipment = (updates) => {
        handleFieldChange('startingEquipment', {
            ...equipment,
            ...updates
        });
    };

    // Standard Equipment
    const addStandardItem = () => {
        if (newEquipmentItem.trim()) {
            updateEquipment({
                standard: [...equipment.standard, newEquipmentItem.trim()]
            });
            setNewEquipmentItem('');
        }
    };

    const removeStandardItem = (index) => {
        updateEquipment({
            standard: equipment.standard.filter((_, i) => i !== index)
        });
    };

    // Equipment Options
    const addEquipmentOption = () => {
        if (newOptionA.trim() && newOptionB.trim()) {
            updateEquipment({
                options: [
                    ...equipment.options,
                    {
                        optionA: newOptionA.trim(),
                        optionB: newOptionB.trim()
                    }
                ]
            });
            setNewOptionA('');
            setNewOptionB('');
        }
    };

    const removeEquipmentOption = (index) => {
        updateEquipment({
            options: equipment.options.filter((_, i) => i !== index)
        });
    };

    // Quick add from packages
    const addEquipmentPackage = (packageName) => {
        const equipmentPackage = EQUIPMENT_PACKAGES[packageName];
        if (equipmentPackage) {
            updateEquipment({
                standard: [...equipment.standard, ...equipmentPackage.items]
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Starting Equipment Overview */}
            <div className="form-section">
                <h4 className="form-section-title">Starting Equipment</h4>
                <p className="form-section-description">
                    Define what equipment characters start with. You can provide standard equipment
                    for all characters, offer choices between alternatives, or use starting gold instead.
                </p>
            </div>

            {/* Equipment Mode Toggle */}
            <div className="form-section">
                <h4 className="form-section-title">Equipment Method</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`equipment-method ${!equipment.startingGold ? 'selected' : ''}`}>
                        <input
                            type="radio"
                            id="equipment-items"
                            name="equipmentMethod"
                            checked={!equipment.startingGold}
                            onChange={() => updateEquipment({ startingGold: null })}
                        />
                        <label htmlFor="equipment-items" className="equipment-method-label">
                            <Package className="w-5 h-5 text-blue-600" />
                            <div>
                                <div className="font-semibold">Standard Equipment</div>
                                <div className="text-sm text-gray-600">Provide specific items and choices</div>
                            </div>
                        </label>
                    </div>

                    <div className={`equipment-method ${equipment.startingGold ? 'selected' : ''}`}>
                        <input
                            type="radio"
                            id="starting-gold"
                            name="equipmentMethod"
                            checked={Boolean(equipment.startingGold)}
                            onChange={() => updateEquipment({ startingGold: 0 })}
                        />
                        <label htmlFor="starting-gold" className="equipment-method-label">
                            <div className="w-5 h-5 text-yellow-600 font-bold">💰</div>
                            <div>
                                <div className="font-semibold">Starting Gold</div>
                                <div className="text-sm text-gray-600">Let players buy their own equipment</div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {equipment.startingGold !== null ? (
                // Starting Gold Section
                <div className="form-section">
                    <h4 className="form-section-title">Starting Wealth</h4>
                    <div className="space-y-4">
                        <Input
                            label="Starting Gold (GP)"
                            type="text"
                            value={equipment.startingGold || ''}
                            onChange={(e) => updateEquipment({ startingGold: e.target.value })}
                            placeholder="4d4 × 10 gp"
                            helperText="Use dice notation (e.g., '4d4 × 10') or a fixed amount (e.g., '100')"
                        />

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h5 className="font-semibold text-yellow-900 mb-2">💡 Starting Gold Guidelines</h5>
                            <ul className="text-sm text-yellow-800 space-y-1">
                                <li>• <strong>Low wealth:</strong> 2d4 × 10 gp (50 gp average) - Monks, Sorcerers</li>
                                <li>• <strong>Medium wealth:</strong> 4d4 × 10 gp (100 gp average) - Most classes</li>
                                <li>• <strong>High wealth:</strong> 5d4 × 10 gp (125 gp average) - Fighters, Paladins</li>
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                // Standard Equipment Sections
                <>
                    {/* Equipment Packages */}
                    <div className="form-section">
                        <h4 className="form-section-title">Quick Add Equipment Packages</h4>
                        <p className="form-section-description">
                            Add standard D&D equipment packages to quickly populate your starting equipment.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {Object.entries(EQUIPMENT_PACKAGES).map(([key, pkg]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => addEquipmentPackage(key)}
                                    className="equipment-package-button"
                                >
                                    <div className="font-semibold">{pkg.name}</div>
                                    <div className="text-xs text-gray-600">
                                        {pkg.items.length} items
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Standard Equipment */}
                    <div className="form-section">
                        <h4 className="form-section-title">Standard Equipment</h4>
                        <p className="form-section-description">
                            Items that all characters of this class start with.
                        </p>

                        <div className="space-y-4">
                            {/* Add new item */}
                            <div className="flex gap-2">
                                <Input
                                    placeholder="e.g., Leather armor, shortsword, thieves' tools"
                                    value={newEquipmentItem}
                                    onChange={(e) => setNewEquipmentItem(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addStandardItem()}
                                />
                                <Button
                                    type="button"
                                    onClick={addStandardItem}
                                    disabled={!newEquipmentItem.trim()}
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Equipment list */}
                            {equipment.standard.length > 0 ? (
                                <div className="equipment-list">
                                    {equipment.standard.map((item, index) => (
                                        <div key={index} className="equipment-item">
                                            <span>{item}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeStandardItem(index)}
                                                className="remove-item-button"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-equipment">
                                    No standard equipment added yet. Add items above or use equipment packages.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Equipment Options */}
                    <div className="form-section">
                        <h4 className="form-section-title">Equipment Choices</h4>
                        <p className="form-section-description">
                            Provide alternative equipment options for players to choose from.
                        </p>

                        <div className="space-y-4">
                            {/* Add new option */}
                            <div className="equipment-option-form">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Input
                                        label="Option A"
                                        placeholder="e.g., Scale mail"
                                        value={newOptionA}
                                        onChange={(e) => setNewOptionA(e.target.value)}
                                    />
                                    <Input
                                        label="Option B"
                                        placeholder="e.g., Leather armor, explorer's pack"
                                        value={newOptionB}
                                        onChange={(e) => setNewOptionB(e.target.value)}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    onClick={addEquipmentOption}
                                    disabled={!newOptionA.trim() || !newOptionB.trim()}
                                    className="mt-2"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Choice
                                </Button>
                            </div>

                            {/* Options list */}
                            {equipment.options.length > 0 ? (
                                <div className="equipment-options-list">
                                    {equipment.options.map((option, index) => (
                                        <div key={index} className="equipment-option-item">
                                            <div className="option-content">
                                                <div className="option-choice">
                                                    <Badge variant="outline">A</Badge>
                                                    <span>{option.optionA}</span>
                                                </div>
                                                <div className="option-divider">OR</div>
                                                <div className="option-choice">
                                                    <Badge variant="outline">B</Badge>
                                                    <span>{option.optionB}</span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeEquipmentOption(index)}
                                                className="remove-item-button"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-equipment">
                                    No equipment choices added yet.
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Tips */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h5 className="font-semibold text-purple-900 mb-2">🎒 Equipment Tips</h5>
                <ul className="text-sm text-purple-800 space-y-1">
                    <li>• <strong>Standard:</strong> Include armor, main weapon, and basic adventuring gear</li>
                    <li>• <strong>Choices:</strong> Offer alternatives between offensive vs. defensive gear</li>
                    <li>• <strong>Packages:</strong> Use existing packages (explorer's, dungeoneer's, etc.) when possible</li>
                    <li>• <strong>Balance:</strong> Total starting equipment value should be around 100-200 gp</li>
                </ul>
            </div>
        </div>
    );
}