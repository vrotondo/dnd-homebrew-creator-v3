// src/components/creators/character/SubclassFeatures.jsx
import { useState, useEffect } from 'react';

function SubclassFeatures({ subclassData, updateSubclassData, featureLevels }) {
    const [currentFeature, setCurrentFeature] = useState({
        name: '',
        level: featureLevels[0] || 3,
        description: ''
    });
    const [editingFeatureIndex, setEditingFeatureIndex] = useState(null);
    const [featureErrors, setFeatureErrors] = useState({});
    const [featureTouched, setFeatureTouched] = useState({});

    // Update level options when featureLevels changes
    useEffect(() => {
        if (featureLevels.length > 0) {
            setCurrentFeature(prev => ({
                ...prev,
                level: featureLevels[0]
            }));
        }
    }, [featureLevels]);

    const handleFeatureChange = (e) => {
        const { name, value } = e.target;
        setCurrentFeature(prev => ({
            ...prev,
            [name]: name === 'level' ? parseInt(value, 10) : value
        }));
        setFeatureTouched(prev => ({ ...prev, [name]: true }));
    };

    const validateFeature = () => {
        const newErrors = {};

        if (featureTouched.name && !currentFeature.name.trim()) {
            newErrors.name = 'Feature name is required';
        }

        if (featureTouched.description && !currentFeature.description.trim()) {
            newErrors.description = 'Feature description is required';
        }

        setFeatureErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddFeature = () => {
        if (validateFeature()) {
            if (editingFeatureIndex !== null) {
                // Update existing feature
                const updatedFeatures = [...subclassData.features];
                updatedFeatures[editingFeatureIndex] = { ...currentFeature };
                updateSubclassData({ features: updatedFeatures });
            } else {
                // Add new feature
                updateSubclassData({
                    features: [...subclassData.features, { ...currentFeature }]
                });
            }

            // Reset form
            setCurrentFeature({
                name: '',
                level: featureLevels[0] || 3,
                description: ''
            });
            setEditingFeatureIndex(null);
            setFeatureTouched({});
        } else {
            // Mark all feature fields as touched to show validation errors
            setFeatureTouched({
                name: true,
                level: true,
                description: true
            });
        }
    };

    const handleEditFeature = (index) => {
        setCurrentFeature({ ...subclassData.features[index] });
        setEditingFeatureIndex(index);
        setFeatureTouched({});
    };

    const handleDeleteFeature = (index) => {
        const updatedFeatures = subclassData.features.filter((_, i) => i !== index);
        updateSubclassData({ features: updatedFeatures });

        if (editingFeatureIndex === index) {
            setCurrentFeature({
                name: '',
                level: featureLevels[0] || 3,
                description: ''
            });
            setEditingFeatureIndex(null);
            setFeatureTouched({});
        }
    };

    const handleCancelFeatureEdit = () => {
        setCurrentFeature({
            name: '',
            level: featureLevels[0] || 3,
            description: ''
        });
        setEditingFeatureIndex(null);
        setFeatureTouched({});
        setFeatureErrors({});
    };

    // Validate feature when inputs change
    useEffect(() => {
        validateFeature();
    }, [currentFeature, featureTouched]);

    return (
        <div className="features-container">
            <p className="form-note">
                Add features that define your subclass's abilities. These typically unlock at specific levels
                based on the parent class's progression.
            </p>

            {/* Feature Form */}
            <div className="card">
                <h4>{editingFeatureIndex !== null ? 'Edit Feature' : 'Add New Feature'}</h4>

                <div className="form-field">
                    <label htmlFor="featureName">Feature Name*</label>
                    <input
                        type="text"
                        id="featureName"
                        name="name"
                        className={`form-control ${featureErrors.name ? 'error' : ''}`}
                        value={currentFeature.name}
                        onChange={handleFeatureChange}
                        onBlur={() => setFeatureTouched(prev => ({ ...prev, name: true }))}
                        placeholder="e.g., Arcane Deflection"
                    />
                    {featureErrors.name && <div className="error-message">{featureErrors.name}</div>}
                </div>

                <div className="form-field">
                    <label htmlFor="featureLevel">Level*</label>
                    <select
                        id="featureLevel"
                        name="level"
                        className="form-control"
                        value={currentFeature.level}
                        onChange={handleFeatureChange}
                    >
                        {featureLevels.map(level => (
                            <option key={level} value={level}>Level {level}</option>
                        ))}
                    </select>
                </div>

                <div className="form-field">
                    <label htmlFor="featureDescription">Description*</label>
                    <textarea
                        id="featureDescription"
                        name="description"
                        className={`form-control ${featureErrors.description ? 'error' : ''}`}
                        value={currentFeature.description}
                        onChange={handleFeatureChange}
                        onBlur={() => setFeatureTouched(prev => ({ ...prev, description: true }))}
                        rows={4}
                        placeholder="Describe what this feature does..."
                    />
                    {featureErrors.description && <div className="error-message">{featureErrors.description}</div>}
                </div>

                <div className="form-actions">
                    <button
                        className="button"
                        onClick={handleAddFeature}
                    >
                        {editingFeatureIndex !== null ? 'Update Feature' : 'Add Feature'}
                    </button>

                    {editingFeatureIndex !== null && (
                        <button
                            className="button button-secondary"
                            onClick={handleCancelFeatureEdit}
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </div>

            {/* Features List */}
            <div className="features-list">
                <h4>Subclass Features</h4>

                {subclassData.features.length === 0 ? (
                    <div className="empty-state">
                        <p>No features added yet. Use the form above to add subclass features.</p>
                    </div>
                ) : (
                    <div>
                        {/* Group features by level */}
                        {featureLevels.filter(level =>
                            subclassData.features.some(feature => feature.level === level)
                        ).map(level => (
                            <div key={level} className="feature-level-group">
                                <h5>Level {level}</h5>

                                {subclassData.features
                                    .filter(feature => feature.level === level)
                                    .map((feature, index) => {
                                        // Find the actual index in the overall features array
                                        const actualIndex = subclassData.features.findIndex(
                                            f => f.name === feature.name && f.level === feature.level
                                        );

                                        return (
                                            <div key={index} className="feature-card">
                                                <div className="feature-header">
                                                    <h6>{feature.name}</h6>
                                                    <div className="feature-actions">
                                                        <button
                                                            className="button-small"
                                                            onClick={() => handleEditFeature(actualIndex)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="button-small button-danger"
                                                            onClick={() => handleDeleteFeature(actualIndex)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                                <p>{feature.description}</p>
                                            </div>
                                        );
                                    })}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SubclassFeatures;