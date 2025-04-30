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
    const [currentTrait, setCurrentTrait] = useState({
        name: '',
        description: ''
    });

    const [editingSubraceIndex, setEditingSubraceIndex] = useState(null);
    const [editingTraitIndex, setEditingTraitIndex] = useState(null);
    const [selectedSubrace, setSelectedSubrace] = useState(null);

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleSubraceChange = (e) => {
        const { name, value } = e.target;
        setCurrentSubrace(prev => ({
            ...prev,
            [name]: value
        }));
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleAbilityChange = (ability, value) => {
        const numValue = parseInt(value) || 0;
        setCurrentSubrace(prev => ({
            ...prev,
            abilityScoreIncreases: {
                ...prev.abilityScoreIncreases,
                [ability]: numValue
            }
        }));
        setTouched(prev => ({ ...prev, abilityScoreIncreases: true }));
    };

    const handleTraitChange = (e) => {
        const { name, value } = e.target;
        setCurrentTrait(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateSubrace = () => {
        const newErrors = {};

        if (touched.name && !currentSubrace.name.trim()) {
            newErrors.name = 'Subrace name is required';
        }

        if (touched.description && !currentSubrace.description.trim()) {
            newErrors.description = 'Description is required';
        }

        // Validate ability score increases
        const totalASI = Object.values(currentSubrace.abilityScoreIncreases).reduce((sum, val) => sum + val, 0);
        if (touched.abilityScoreIncreases && totalASI !== 1) {
            newErrors.abilityScoreIncreases = 'Subraces typically provide +1 to a single ability score';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Validate when inputs change
    useEffect(() => {
        validateSubrace();
    }, [currentSubrace, touched]);

    // Add Subrace
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
            setTouched({});
        } else {
            // Mark fields as touched to show validation errors
            setTouched({
                name: true,
                description: true,
                abilityScoreIncreases: true
            });
        }
    };

    // Edit Subrace
    const handleEditSubrace = (index) => {
        setCurrentSubrace({ ...raceData.subraces[index] });
        setEditingSubraceIndex(index);
        setSelectedSubrace(null);
        setTouched({});
    };

    // Delete Subrace
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
            setTouched({});
        }

        if (selectedSubrace === index) {
            setSelectedSubrace(null);
        }
    };

    // Add Trait to Subrace
    const handleAddTrait = () => {
        if (!currentTrait.name || !currentTrait.description) return;

        if (editingTraitIndex !== null) {
            // Update existing trait
            const updatedTraits = [...currentSubrace.traits];
            updatedTraits[editingTraitIndex] = { ...currentTrait };
            setCurrentSubrace(prev => ({
                ...prev,
                traits: updatedTraits
            }));
        } else {
            // Add new trait
            setCurrentSubrace(prev => ({
                ...prev,
                traits: [...prev.traits, { ...currentTrait }]
            }));
        }

        // Reset trait form
        setCurrentTrait({ name: '', description: '' });
        setEditingTraitIndex(null);
    };

    // Edit Trait in Subrace
    const handleEditTrait = (index) => {
        setCurrentTrait({ ...currentSubrace.traits[index] });
        setEditingTraitIndex(index);
    };

    // Delete Trait from Subrace
    const handleDeleteTrait = (index) => {
        const updatedTraits = currentSubrace.traits.filter((_, i) => i !== index);
        setCurrentSubrace(prev => ({
            ...prev,
            traits: updatedTraits
        }));

        if (editingTraitIndex === index) {
            setCurrentTrait({ name: '', description: '' });
            setEditingTraitIndex(null);
        }
    };

    // Select Subrace for viewing details
    const handleSelectSubrace = (index) => {
        setSelectedSubrace(index);
        setEditingSubraceIndex(null);
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

    return (
        <div className="subraces-container">
            <p className="form-info">
                Subraces represent distinct variations within a race. Examples include High Elves and Wood Elves
                as subraces of Elves. Each subrace typically adds a +1 ability score increase and unique traits.
            </p>

            <div className="subraces-layout">
                {/* Subraces List */}
                <div className="subraces-list">
                    <h4>Subraces</h4>

                    {raceData.subraces.length > 0 ? (
                        <ul className="subraces-nav">
                            {raceData.subraces.map((subrace, index) => (
                                <li
                                    key={index}
                                    className={selectedSubrace === index ? 'active' : ''}
                                    onClick={() => handleSelectSubrace(index)}
                                >
                                    <span>{subrace.name}</span>
                                    <div className="subrace-actions">
                                        <button
                                            className="button-icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditSubrace(index);
                                            }}
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="button-icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteSubrace(index);
                                            }}
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="empty-state">
                            No subraces added yet.
                        </div>
                    )}

                    <button
                        className="button mt-4"
                        onClick={() => {
                            setEditingSubraceIndex(null);
                            setSelectedSubrace(null);
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
                        }}
                    >
                        Create New Subrace
                    </button>
                </div>

                {/* Subrace Editor */}
                {!selectedSubrace && (
                    <div className="subrace-editor">
                        <h4>{editingSubraceIndex !== null ? 'Edit Subrace' : 'Create Subrace'}</h4>

                        <div className="form-field">
                            <label htmlFor="subraceName">Subrace Name*</label>
                            <input
                                type="text"
                                id="subraceName"
                                name="name"
                                className={`form-control ${errors.name ? 'error' : ''}`}
                                value={currentSubrace.name}
                                onChange={handleSubraceChange}
                                onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                                placeholder="e.g., Mountain Dwarf"
                            />
                            {errors.name && <div className="error-message">{errors.name}</div>}
                        </div>

                        <div className="form-field">
                            <label htmlFor="subraceDescription">Description*</label>
                            <textarea
                                id="subraceDescription"
                                name="description"
                                className={`form-control ${errors.description ? 'error' : ''}`}
                                value={currentSubrace.description}
                                onChange={handleSubraceChange}
                                onBlur={() => setTouched(prev => ({ ...prev, description: true }))}
                                rows={3}
                                placeholder="Describe this subrace's distinctive features..."
                            />
                            {errors.description && <div className="error-message">{errors.description}</div>}
                        </div>

                        <div className="form-field">
                            <h5>Ability Score Increase</h5>
                            {errors.abilityScoreIncreases && (
                                <div className="error-message">{errors.abilityScoreIncreases}</div>
                            )}

                            <div className="ability-increases subrace-abilities">
                                {Object.entries(currentSubrace.abilityScoreIncreases).map(([ability, value]) => (
                                    <div key={ability} className="ability-item">
                                        <label htmlFor={`subrace-ability-${ability}`}>{getAbilityName(ability)}</label>
                                        <select
                                            id={`subrace-ability-${ability}`}
                                            className="form-control"
                                            value={value}
                                            onChange={(e) => handleAbilityChange(ability, e.target.value)}
                                            onBlur={() => setTouched(prev => ({ ...prev, abilityScoreIncreases: true }))}
                                        >
                                            <option value="0">+0</option>
                                            <option value="1">+1</option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-field">
                            <h5>Subrace Traits</h5>

                            <div className="card">
                                <div className="form-field">
                                    <label htmlFor="traitName">Trait Name</label>
                                    <input
                                        type="text"
                                        id="traitName"
                                        name="name"
                                        className="form-control"
                                        value={currentTrait.name}
                                        onChange={handleTraitChange}
                                        placeholder="e.g., Dwarven Armor Training"
                                    />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="traitDescription">Description</label>
                                    <textarea
                                        id="traitDescription"
                                        name="description"
                                        className="form-control"
                                        value={currentTrait.description}
                                        onChange={handleTraitChange}
                                        rows={3}
                                        placeholder="Describe what this trait does..."
                                    />
                                </div>

                                <button
                                    className="button"
                                    onClick={handleAddTrait}
                                    disabled={!currentTrait.name || !currentTrait.description}
                                >
                                    {editingTraitIndex !== null ? 'Update Trait' : 'Add Trait'}
                                </button>
                            </div>

                            {currentSubrace.traits.length > 0 ? (
                                <div className="traits-list">
                                    {currentSubrace.traits.map((trait, index) => (
                                        <div key={index} className="trait-item">
                                            <div className="trait-item-header">
                                                <h6>{trait.name}</h6>
                                                <div className="trait-item-actions">
                                                    <button
                                                        className="button-small"
                                                        onClick={() => handleEditTrait(index)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="button-small button-danger"
                                                        onClick={() => handleDeleteTrait(index)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                            <p>{trait.description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state mt-4">
                                    No traits added to this subrace yet.
                                </div>
                            )}
                        </div>

                        <div className="form-actions">
                            <button
                                className="button"
                                onClick={handleAddSubrace}
                            >
                                {editingSubraceIndex !== null ? 'Update Subrace' : 'Create Subrace'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Subrace Viewer */}
                {selectedSubrace !== null && (
                    <div className="subrace-viewer">
                        <h4>{raceData.subraces[selectedSubrace].name}</h4>
                        <p className="subrace-description">{raceData.subraces[selectedSubrace].description}</p>

                        <div className="subrace-details">
                            <div className="subrace-abilities-view">
                                <h5>Ability Score Increases</h5>
                                <ul>
                                    {Object.entries(raceData.subraces[selectedSubrace].abilityScoreIncreases)
                                        .filter(([_, value]) => value > 0)
                                        .map(([ability, value]) => (
                                            <li key={ability}>{getAbilityName(ability)} +{value}</li>
                                        ))}
                                </ul>
                            </div>

                            <div className="subrace-traits-view">
                                <h5>Traits</h5>
                                {raceData.subraces[selectedSubrace].traits.length > 0 ? (
                                    <div>
                                        {raceData.subraces[selectedSubrace].traits.map((trait, index) => (
                                            <div key={index} className="subrace-trait">
                                                <h6>{trait.name}</h6>
                                                <p>{trait.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No traits for this subrace.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Subraces;