// src/components/creators/character/Subraces.jsx
import { useState, useEffect } from 'react';

function Subraces({ raceData, updateRaceData }) {
    const [currentSubrace, setCurrentSubrace] = useState({
        name: '',
        description: '',
        abilityScoreIncreases: {
            STR: 0,
            DEX: 0,
            CON: 0,
            INT: 0,
            WIS: 0,
            CHA: 0
        },
        traits: []
    });
    const [editingSubraceIndex, setEditingSubraceIndex] = useState(null);
    const [subraceErrors, setSubraceErrors] = useState({});
    const [subraceTouched, setSubraceTouched] = useState({});

    const handleSubraceChange = (e) => {
        const { name, value } = e.target;
        setCurrentSubrace(prev => ({
            ...prev,
            [name]: value
        }));
        setSubraceTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleSubraceAbilityChange = (ability, value) => {
        const numValue = parseInt(value) || 0;
        setCurrentSubrace(prev => ({
            ...prev,
            abilityScoreIncreases: {
                ...prev.abilityScoreIncreases,
                [ability]: numValue
            }
        }));
        setSubraceTouched(prev => ({ ...prev, abilityScoreIncreases: true }));
    };

    const validateSubrace = () => {
        const newErrors = {};

        if (subraceTouched.name && !currentSubrace.name.trim()) {
            newErrors.name = 'Subrace name is required';
        }

        if (subraceTouched.description && !currentSubrace.description.trim()) {
            newErrors.description = 'Description is required';
        }

        // Validate ability score increases
        const totalASI = Object.values(currentSubrace.abilityScoreIncreases).reduce((sum, val) => sum + val, 0);
        if (subraceTouched.abilityScoreIncreases && totalASI > 2) {
            newErrors.abilityScoreIncreases = 'Total ability score increases for a subrace should be at most +2';
        }

        setSubraceErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddSubrace = () => {
        if (validateSubrace()) {
            if (editingSubraceIndex !== null) {
                // Update existing subrace
                const updatedSubraces = [...raceData.subraces];
                updatedSubraces[editingSubraceIndex] = { ...currentSubrace };
                updateRaceData({ subraces: updatedSubraces });
            } else {
                // Add new subrace
                updateRaceData({
                    subraces: [...raceData.subraces, { ...currentSubrace }]
                });
            }

            // Reset form
            setCurrentSubrace({
                name: '',
                description: '',
                abilityScoreIncreases: {
                    STR: 0,
                    DEX: 0,
                    CON: 0,
                    INT: 0,
                    WIS: 0,
                    CHA: 0
                },
                traits: []
            });
            setEditingSubraceIndex(null);
            setSubraceTouched({});
        } else {
            // Mark all subrace fields as touched to show validation errors
            setSubraceTouched({
                name: true,
                description: true,
                abilityScoreIncreases: true
            });
        }
    };

    const handleEditSubrace = (index) => {
        setCurrentSubrace({ ...raceData.subraces[index] });
        setEditingSubraceIndex(index);
        setSubraceTouched({});
    };

    const handleDeleteSubrace = (index) => {
        const updatedSubraces = raceData.subraces.filter((_, i) => i !== index);
        updateRaceData({ subraces: updatedSubraces });

        if (editingSubraceIndex === index) {
            setCurrentSubrace({
                name: '',
                description: '',
                abilityScoreIncreases: {
                    STR: 0,
                    DEX: 0,
                    CON: 0,
                    INT: 0,
                    WIS: 0,
                    CHA: 0
                },
                traits: []
            });
            setEditingSubraceIndex(null);
            setSubraceTouched({});
        }
    };

    const handleCancelSubraceEdit = () => {
        setCurrentSubrace({
            name: '',
            description: '',
            abilityScoreIncreases: {
                STR: 0,
                DEX: 0,
                CON: 0,
                INT: 0,
                WIS: 0,
                CHA: 0
            },
            traits: []
        });
        setEditingSubraceIndex(null);
        setSubraceTouched({});
        setSubraceErrors({});
    };

    // Helper function for ability names
    function getAbilityName(ability) {
        const abilities = {
            'STR': 'Strength',
            'DEX': 'Dexterity',
            'CON': 'Constitution',
            'INT': 'Intelligence',
            'WIS': 'Wisdom',
            'CHA': 'Charisma'
        };
        return abilities[ability] || ability;
    }

    // Validate subrace when inputs change
    useEffect(() => {
        validateSubrace();
    }, [currentSubrace, subraceTouched]);

    return (
        <div className="subraces-container">
            <p className="form-note">
                Add subraces to provide variants of your main race. Each subrace can have
                additional ability score increases and traits.
            </p>

            {/* Subrace Form */}
            <div className="card">
                <h4>{editingSubraceIndex !== null ? 'Edit Subrace' : 'Add New Subrace'}</h4>

                <div className="form-field">
                    <label htmlFor="subraceName">Subrace Name*</label>
                    <input
                        type="text"
                        id="subraceName"
                        name="name"
                        className={`form-control ${subraceErrors.name ? 'error' : ''}`}
                        value={currentSubrace.name}
                        onChange={handleSubraceChange}
                        onBlur={() => setSubraceTouched(prev => ({ ...prev, name: true }))}
                        placeholder="e.g., Mountain Dwarf"
                    />
                    {subraceErrors.name && <div className="error-message">{subraceErrors.name}</div>}
                </div>

                <div className="form-field">
                    <label htmlFor="subraceDescription">Description*</label>
                    <textarea
                        id="subraceDescription"
                        name="description"
                        className={`form-control ${subraceErrors.description ? 'error' : ''}`}
                        value={currentSubrace.description}
                        onChange={handleSubraceChange}
                        onBlur={() => setSubraceTouched(prev => ({ ...prev, description: true }))}
                        rows={4}
                        placeholder="Describe the unique features of this subrace..."
                    />
                    {subraceErrors.description && <div className="error-message">{subraceErrors.description}</div>}
                </div>

                <div className="form-field">
                    <h5>Ability Score Increases</h5>
                    {subraceErrors.abilityScoreIncreases && (
                        <div className="error-message ability-error">{subraceErrors.abilityScoreIncreases}</div>
                    )}

                    <div className="ability-increases">
                        {Object.entries(currentSubrace.abilityScoreIncreases).map(([ability, value]) => (
                            <div key={ability} className="ability-item">
                                <label htmlFor={`subrace-ability-${ability}`}>{getAbilityName(ability)}</label>
                                <select
                                    id={`subrace-ability-${ability}`}
                                    className="form-control"
                                    value={value}
                                    onChange={(e) => handleSubraceAbilityChange(ability, e.target.value)}
                                >
                                    <option value="0">+0</option>
                                    <option value="1">+1</option>
                                    <option value="2">+2</option>
                                </select>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        className="button"
                        onClick={handleAddSubrace}
                    >
                        {editingSubraceIndex !== null ? 'Update Subrace' : 'Add Subrace'}
                    </button>

                    {editingSubraceIndex !== null && (
                        <button
                            className="button button-secondary"
                            onClick={handleCancelSubraceEdit}
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </div>

            {/* Subraces List */}
            <div className="subraces-list">
                <h4>Subraces</h4>

                {raceData.subraces.length === 0 ? (
                    <div className="empty-state">
                        <p>No subraces added yet. Use the form above to add subraces.</p>
                    </div>
                ) : (
                    <div className="subraces-grid">
                        {raceData.subraces.map((subrace, index) => (
                            <div key={index} className="subrace-card">
                                <div className="subrace-header">
                                    <h5>{subrace.name}</h5>
                                    <div className="subrace-actions">
                                        <button
                                            className="button-small"
                                            onClick={() => handleEditSubrace(index)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="button-small button-danger"
                                            onClick={() => handleDeleteSubrace(index)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <p>{subrace.description}</p>
                                <div className="subrace-abilities">
                                    {Object.entries(subrace.abilityScoreIncreases).map(([ability, value]) => (
                                        value > 0 && (
                                            <div key={ability} className="subrace-ability">
                                                {getAbilityName(ability)} +{value}
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Subraces;