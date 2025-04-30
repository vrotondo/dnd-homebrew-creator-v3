// src/components/creators/character/RacialTraits.jsx
import { useState, useEffect } from 'react';

function RacialTraits({ raceData, updateRaceData }) {
    const [currentTrait, setCurrentTrait] = useState({
        name: '',
        description: ''
    });
    const [editingTraitIndex, setEditingTraitIndex] = useState(null);
    const [traitErrors, setTraitErrors] = useState({});
    const [traitTouched, setTraitTouched] = useState({});

    const handleTraitChange = (e) => {
        const { name, value } = e.target;
        setCurrentTrait(prev => ({
            ...prev,
            [name]: value
        }));
        setTraitTouched(prev => ({ ...prev, [name]: true }));
    };

    const validateTrait = () => {
        const newErrors = {};

        if (traitTouched.name && !currentTrait.name.trim()) {
            newErrors.name = 'Trait name is required';
        }

        if (traitTouched.description && !currentTrait.description.trim()) {
            newErrors.description = 'Trait description is required';
        }

        setTraitErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddTrait = () => {
        if (validateTrait()) {
            if (editingTraitIndex !== null) {
                // Update existing trait
                const updatedTraits = [...raceData.traits];
                updatedTraits[editingTraitIndex] = { ...currentTrait };
                updateRaceData({ traits: updatedTraits });
            } else {
                // Add new trait
                updateRaceData({
                    traits: [...raceData.traits, { ...currentTrait }]
                });
            }

            // Reset form
            setCurrentTrait({ name: '', description: '' });
            setEditingTraitIndex(null);
            setTraitTouched({});
        } else {
            // Mark all trait fields as touched to show validation errors
            setTraitTouched({
                name: true,
                description: true
            });
        }
    };

    const handleEditTrait = (index) => {
        setCurrentTrait({ ...raceData.traits[index] });
        setEditingTraitIndex(index);
        setTraitTouched({});
    };

    const handleDeleteTrait = (index) => {
        const updatedTraits = raceData.traits.filter((_, i) => i !== index);
        updateRaceData({ traits: updatedTraits });

        if (editingTraitIndex === index) {
            setCurrentTrait({ name: '', description: '' });
            setEditingTraitIndex(null);
            setTraitTouched({});
        }
    };

    const handleCancelTraitEdit = () => {
        setCurrentTrait({ name: '', description: '' });
        setEditingTraitIndex(null);
        setTraitTouched({});
        setTraitErrors({});
    };

    // Validate trait when inputs change
    useEffect(() => {
        validateTrait();
    }, [currentTrait, traitTouched]);

    return (
        <div className="traits-container">
            <p className="form-note">
                Add traits that define your race's special abilities. These are innate capabilities
                that all members of this race possess.
            </p>

            {/* Trait Form */}
            <div className="card">
                <h4>{editingTraitIndex !== null ? 'Edit Trait' : 'Add New Trait'}</h4>

                <div className="form-field">
                    <label htmlFor="traitName">Trait Name*</label>
                    <input
                        type="text"
                        id="traitName"
                        name="name"
                        className={`form-control ${traitErrors.name ? 'error' : ''}`}
                        value={currentTrait.name}
                        onChange={handleTraitChange}
                        onBlur={() => setTraitTouched(prev => ({ ...prev, name: true }))}
                        placeholder="e.g., Darkvision"
                    />
                    {traitErrors.name && <div className="error-message">{traitErrors.name}</div>}
                </div>

                <div className="form-field">
                    <label htmlFor="traitDescription">Description*</label>
                    <textarea
                        id="traitDescription"
                        name="description"
                        className={`form-control ${traitErrors.description ? 'error' : ''}`}
                        value={currentTrait.description}
                        onChange={handleTraitChange}
                        onBlur={() => setTraitTouched(prev => ({ ...prev, description: true }))}
                        rows={4}
                        placeholder="Describe what this trait does..."
                    />
                    {traitErrors.description && <div className="error-message">{traitErrors.description}</div>}
                </div>

                <div className="form-actions">
                    <button
                        className="button"
                        onClick={handleAddTrait}
                    >
                        {editingTraitIndex !== null ? 'Update Trait' : 'Add Trait'}
                    </button>

                    {editingTraitIndex !== null && (
                        <button
                            className="button button-secondary"
                            onClick={handleCancelTraitEdit}
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </div>

            {/* Traits List */}
            <div className="traits-list">
                <h4>Race Traits</h4>

                {raceData.traits.length === 0 ? (
                    <div className="empty-state">
                        <p>No traits added yet. Use the form above to add racial traits.</p>
                    </div>
                ) : (
                    <div className="traits-grid">
                        {raceData.traits.map((trait, index) => (
                            <div key={index} className="trait-card">
                                <div className="trait-header">
                                    <h5>{trait.name}</h5>
                                    <div className="trait-actions">
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
                )}
            </div>
        </div>
    );
}

export default RacialTraits;