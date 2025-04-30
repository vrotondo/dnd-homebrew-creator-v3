// src/components/creators/character/background/EquipmentSelector.jsx
import { useState } from 'react';

function EquipmentSelector({ equipment = [], onChange }) {
    const [newItem, setNewItem] = useState('');

    const handleAddItem = () => {
        if (newItem.trim() === '') return;

        // Add the new item if it doesn't already exist
        if (!equipment.includes(newItem.trim())) {
            onChange([...equipment, newItem.trim()]);
        }

        setNewItem('');
    };

    const handleRemoveItem = (item) => {
        const updatedEquipment = equipment.filter(i => i !== item);
        onChange(updatedEquipment);
    };

    const handleKeyDown = (e) => {
        // Add item when pressing Enter
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddItem();
        }
    };

    const handleMoveItem = (index, direction) => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === equipment.length - 1)
        ) {
            return; // Can't move further
        }

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        const newEquipment = [...equipment];

        // Swap items
        [newEquipment[index], newEquipment[newIndex]] = [newEquipment[newIndex], newEquipment[index]];

        onChange(newEquipment);
    };

    const commonEquipmentSets = [
        {
            name: "Scholar's Pack",
            items: [
                "A backpack",
                "A book of lore",
                "A bottle of ink",
                "An ink pen",
                "10 sheets of parchment",
                "A little bag of sand",
                "A small knife"
            ]
        },
        {
            name: "Diplomat's Pack",
            items: [
                "A chest",
                "2 cases for maps and scrolls",
                "Fine clothes",
                "A bottle of ink",
                "An ink pen",
                "A lamp",
                "2 flasks of oil",
                "5 sheets of paper",
                "A vial of perfume",
                "Sealing wax",
                "Soap"
            ]
        },
        {
            name: "Entertainer's Pack",
            items: [
                "A backpack",
                "A bedroll",
                "2 costumes",
                "5 candles",
                "5 days of rations",
                "A waterskin",
                "A disguise kit"
            ]
        },
        {
            name: "Explorer's Pack",
            items: [
                "A backpack",
                "A bedroll",
                "A mess kit",
                "A tinderbox",
                "10 torches",
                "10 days of rations",
                "A waterskin",
                "50 feet of hempen rope"
            ]
        }
    ];

    const handleAddEquipmentSet = (set) => {
        // Add all items from the set that aren't already in the equipment list
        const newItems = set.items.filter(item => !equipment.includes(item));
        if (newItems.length > 0) {
            onChange([...equipment, ...newItems]);
        }
    };

    return (
        <div className="equipment-selector">
            <div className="equipment-input">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add equipment item (e.g., 'A set of fine clothes')"
                    className="form-control"
                />
                <button
                    className="button"
                    onClick={handleAddItem}
                    disabled={newItem.trim() === ''}
                >
                    Add
                </button>
            </div>

            <div className="equipment-sets">
                <h5>Common Equipment Sets</h5>
                <div className="equipment-sets-grid">
                    {commonEquipmentSets.map((set, index) => (
                        <div key={index} className="equipment-set-card">
                            <h6>{set.name}</h6>
                            <ul className="equipment-set-items">
                                {set.items.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                            <button
                                className="button button-small"
                                onClick={() => handleAddEquipmentSet(set)}
                            >
                                Add Set
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="equipment-list">
                <h5>Background Equipment</h5>
                {equipment.length === 0 ? (
                    <p className="empty-message">No equipment added yet. Use the input above to add items.</p>
                ) : (
                    <ul className="sortable-equipment-list">
                        {equipment.map((item, index) => (
                            <li key={index} className="equipment-item">
                                <div className="item-content">
                                    <span>{item}</span>
                                    <div className="item-actions">
                                        <button
                                            className="button-icon"
                                            onClick={() => handleMoveItem(index, 'up')}
                                            disabled={index === 0}
                                        >
                                            ↑
                                        </button>
                                        <button
                                            className="button-icon"
                                            onClick={() => handleMoveItem(index, 'down')}
                                            disabled={index === equipment.length - 1}
                                        >
                                            ↓
                                        </button>
                                        <button
                                            className="button-small button-danger"
                                            onClick={() => handleRemoveItem(item)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default EquipmentSelector;