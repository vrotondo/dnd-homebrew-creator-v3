// src/components/creators/character/background/BackgroundFeatures.jsx
import { useState } from 'react';

function BackgroundFeatures({ characteristics = {}, suggestedNames = [], onChange }) {
    const defaultCharacteristics = {
        personalityTraits: [],
        ideals: [],
        bonds: [],
        flaws: []
    };

    // Use provided values or defaults
    const currentCharacteristics = {
        ...defaultCharacteristics,
        ...characteristics
    };

    const [newTrait, setNewTrait] = useState('');
    const [newIdeal, setNewIdeal] = useState('');
    const [newBond, setNewBond] = useState('');
    const [newFlaw, setNewFlaw] = useState('');
    const [newName, setNewName] = useState('');

    // Helper function to add item to characteristics array
    const addItem = (type, value) => {
        if (value.trim() === '') return;

        const updatedCharacteristics = {
            ...currentCharacteristics,
            [type]: [...currentCharacteristics[type], value.trim()]
        };

        onChange({ suggestedCharacteristics: updatedCharacteristics });

        // Reset input field
        switch (type) {
            case 'personalityTraits':
                setNewTrait('');
                break;
            case 'ideals':
                setNewIdeal('');
                break;
            case 'bonds':
                setNewBond('');
                break;
            case 'flaws':
                setNewFlaw('');
                break;
            default:
                break;
        }
    };

    // Helper function to remove item from characteristics array
    const removeItem = (type, index) => {
        const updatedItems = [...currentCharacteristics[type]];
        updatedItems.splice(index, 1);

        const updatedCharacteristics = {
            ...currentCharacteristics,
            [type]: updatedItems
        };

        onChange({ suggestedCharacteristics: updatedCharacteristics });
    };

    // Handle key press events for inputs
    const handleKeyDown = (e, type, value, setter) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addItem(type, value);
        }
    };

    // Handle name suggestions
    const addName = () => {
        if (newName.trim() === '') return;

        const updatedNames = [...suggestedNames, newName.trim()];
        onChange({ suggestedNames: updatedNames });
        setNewName('');
    };

    const removeName = (index) => {
        const updatedNames = [...suggestedNames];
        updatedNames.splice(index, 1);
        onChange({ suggestedNames: updatedNames });
    };

    return (
        <div className="background-features">
            <div className="characteristics-section">
                <div className="characteristic-group">
                    <h4>Personality Traits</h4>
                    <p className="form-note">
                        Personality traits are small, simple ways to help differentiate characters with this background.
                    </p>

                    <div className="input-with-button">
                        <input
                            type="text"
                            value={newTrait}
                            onChange={(e) => setNewTrait(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, 'personalityTraits', newTrait, setNewTrait)}
                            placeholder="Add a personality trait suggestion"
                            className="form-control"
                        />
                        <button
                            className="button"
                            onClick={() => addItem('personalityTraits', newTrait)}
                            disabled={newTrait.trim() === ''}
                        >
                            Add
                        </button>
                    </div>

                    <ul className="characteristics-list">
                        {currentCharacteristics.personalityTraits.map((trait, index) => (
                            <li key={index} className="characteristic-item">
                                <span>{trait}</span>
                                <button
                                    className="button-small button-danger"
                                    onClick={() => removeItem('personalityTraits', index)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="characteristic-group">
                    <h4>Ideals</h4>
                    <p className="form-note">
                        Ideals are the principles that drive a character. They can be connected to alignment.
                    </p>

                    <div className="input-with-button">
                        <input
                            type="text"
                            value={newIdeal}
                            onChange={(e) => setNewIdeal(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, 'ideals', newIdeal, setNewIdeal)}
                            placeholder="Add an ideal suggestion"
                            className="form-control"
                        />
                        <button
                            className="button"
                            onClick={() => addItem('ideals', newIdeal)}
                            disabled={newIdeal.trim() === ''}
                        >
                            Add
                        </button>
                    </div>

                    <ul className="characteristics-list">
                        {currentCharacteristics.ideals.map((ideal, index) => (
                            <li key={index} className="characteristic-item">
                                <span>{ideal}</span>
                                <button
                                    className="button-small button-danger"
                                    onClick={() => removeItem('ideals', index)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="characteristic-group">
                    <h4>Bonds</h4>
                    <p className="form-note">
                        Bonds represent a character's connections to people, places, or events in the world.
                    </p>

                    <div className="input-with-button">
                        <input
                            type="text"
                            value={newBond}
                            onChange={(e) => setNewBond(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, 'bonds', newBond, setNewBond)}
                            placeholder="Add a bond suggestion"
                            className="form-control"
                        />
                        <button
                            className="button"
                            onClick={() => addItem('bonds', newBond)}
                            disabled={newBond.trim() === ''}
                        >
                            Add
                        </button>
                    </div>

                    <ul className="characteristics-list">
                        {currentCharacteristics.bonds.map((bond, index) => (
                            <li key={index} className="characteristic-item">
                                <span>{bond}</span>
                                <button
                                    className="button-small button-danger"
                                    onClick={() => removeItem('bonds', index)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="characteristic-group">
                    <h4>Flaws</h4>
                    <p className="form-note">
                        Flaws represent a character's vices, compulsions, fears, or weaknesses.
                    </p>

                    <div className="input-with-button">
                        <input
                            type="text"
                            value={newFlaw}
                            onChange={(e) => setNewFlaw(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, 'flaws', newFlaw, setNewFlaw)}
                            placeholder="Add a flaw suggestion"
                            className="form-control"
                        />
                        <button
                            className="button"
                            onClick={() => addItem('flaws', newFlaw)}
                            disabled={newFlaw.trim() === ''}
                        >
                            Add
                        </button>
                    </div>

                    <ul className="characteristics-list">
                        {currentCharacteristics.flaws.map((flaw, index) => (
                            <li key={index} className="characteristic-item">
                                <span>{flaw}</span>
                                <button
                                    className="button-small button-danger"
                                    onClick={() => removeItem('flaws', index)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="suggested-names-section">
                <h4>Suggested Names (Optional)</h4>
                <p className="form-note">
                    You can provide suggested names for characters with this background.
                    This is especially useful for backgrounds tied to specific cultures or groups.
                </p>

                <div className="input-with-button">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addName();
                            }
                        }}
                        placeholder="Add a suggested name"
                        className="form-control"
                    />
                    <button
                        className="button"
                        onClick={addName}
                        disabled={newName.trim() === ''}
                    >
                        Add
                    </button>
                </div>

                <ul className="names-list">
                    {suggestedNames.map((name, index) => (
                        <li key={index} className="name-item">
                            <span>{name}</span>
                            <button
                                className="button-small button-danger"
                                onClick={() => removeName(index)}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default BackgroundFeatures;