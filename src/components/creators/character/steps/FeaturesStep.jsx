// src/components/creators/character/steps/FeaturesStep.jsx
import React, { useState } from 'react';
import { Button, Input, Badge, Modal } from '../../../ui';
import { FeatureEditor } from '../../../common/DndFormComponents';
import { Plus, Edit, Trash2, Copy, ChevronDown, ChevronRight } from 'lucide-react';
import { LEVEL_PROGRESSION } from '../../../../utils/dndConstants';

export default function FeaturesStep({
    classData,
    handleFieldChange,
    errors,
    touched
}) {
    const [selectedLevel, setSelectedLevel] = useState(1);
    const [showFeatureModal, setShowFeatureModal] = useState(false);
    const [editingFeature, setEditingFeature] = useState(null);
    const [expandedLevels, setExpandedLevels] = useState({ 1: true, 3: true, 20: true });

    // Initialize features structure if needed
    const features = classData.features || {};

    const updateFeatures = (levelFeatures) => {
        handleFieldChange('features', {
            ...features,
            ...levelFeatures
        });
    };

    // Feature modal handlers
    const openFeatureModal = (level, feature = null) => {
        setSelectedLevel(level);
        setEditingFeature(feature);
        setShowFeatureModal(true);
    };

    const closeFeatureModal = () => {
        setShowFeatureModal(false);
        setEditingFeature(null);
    };

    const saveFeature = (featureData) => {
        const levelFeatures = features[selectedLevel] || [];

        if (editingFeature) {
            // Update existing feature
            const updatedFeatures = levelFeatures.map(f =>
                f === editingFeature ? featureData : f
            );
            updateFeatures({ [selectedLevel]: updatedFeatures });
        } else {
            // Add new feature
            updateFeatures({
                [selectedLevel]: [...levelFeatures, featureData]
            });
        }

        closeFeatureModal();
    };

    const deleteFeature = (level, featureIndex) => {
        const levelFeatures = features[level] || [];
        const updatedFeatures = levelFeatures.filter((_, i) => i !== featureIndex);
        updateFeatures({
            [level]: updatedFeatures.length > 0 ? updatedFeatures : undefined
        });
    };

    const duplicateFeature = (level, feature) => {
        const levelFeatures = features[level] || [];
        const duplicatedFeature = {
            ...feature,
            name: `${feature.name} (Copy)`
        };
        updateFeatures({
            [level]: [...levelFeatures, duplicatedFeature]
        });
    };

    const toggleLevelExpansion = (level) => {
        setExpandedLevels(prev => ({
            ...prev,
            [level]: !prev[level]
        }));
    };

    // Get feature count for a level
    const getFeatureCount = (level) => {
        return (features[level] || []).length;
    };

    // Check if level has important features that should be highlighted
    const isImportantLevel = (level) => {
        return level === 1 || level === 20 || level % 4 === 3; // 3, 7, 11, 15, 19 are subclass levels
    };

    return (
        <div className="space-y-6">
            {/* Introduction */}
            <div className="form-section">
                <h4 className="form-section-title">Class Features</h4>
                <p className="form-section-description">
                    Define the features characters gain at each level. These are the core abilities
                    that make your class unique and powerful.
                </p>
            </div>

            {/* Subclass Configuration */}
            <div className="form-section">
                <h4 className="form-section-title">Subclass Configuration</h4>
                <p className="form-section-description">
                    Configure when and how characters choose their subclass specialization.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Subclass Level"
                        type="number"
                        min="1"
                        max="3"
                        value={classData.subclassFeature?.level || 1}
                        onChange={(e) => handleFieldChange('subclassFeature', {
                            ...classData.subclassFeature,
                            level: parseInt(e.target.value) || 1
                        })}
                        helperText="When do characters choose their subclass? (Usually 1, 2, or 3)"
                    />

                    <Input
                        label="Subclass Name"
                        type="text"
                        value={classData.subclassFeature?.name || ''}
                        onChange={(e) => handleFieldChange('subclassFeature', {
                            ...classData.subclassFeature,
                            name: e.target.value
                        })}
                        placeholder="e.g., Sacred Oath, Martial Archetype"
                        helperText="What is the subclass category called?"
                    />
                </div>

                <div className="mt-4">
                    <label className="form-label">Subclass Description</label>
                    <textarea
                        className="form-textarea"
                        value={classData.subclassFeature?.description || ''}
                        onChange={(e) => handleFieldChange('subclassFeature', {
                            ...classData.subclassFeature,
                            description: e.target.value
                        })}
                        placeholder="Explain how subclasses work for this class..."
                        rows={3}
                    />
                </div>
            </div>

            {/* Level Progression */}
            <div className="form-section">
                <h4 className="form-section-title">Level Progression</h4>
                <p className="form-section-description">
                    Add features for each level. Click on a level to add or edit features.
                </p>

                <div className="level-progression">
                    {LEVEL_PROGRESSION.levels.map(level => {
                        const levelFeatures = features[level] || [];
                        const isExpanded = expandedLevels[level];
                        const hasFeatures = levelFeatures.length > 0;
                        const profBonus = LEVEL_PROGRESSION.proficiencyBonus[level - 1];

                        return (
                            <div
                                key={level}
                                className={`level-row ${isImportantLevel(level) ? 'important-level' : ''} ${hasFeatures ? 'has-features' : ''}`}
                            >
                                {/* Level Header */}
                                <div className="level-header">
                                    <button
                                        type="button"
                                        onClick={() => toggleLevelExpansion(level)}
                                        className="level-toggle"
                                    >
                                        {isExpanded ?
                                            <ChevronDown className="w-4 h-4" /> :
                                            <ChevronRight className="w-4 h-4" />
                                        }
                                    </button>

                                    <div className="level-info">
                                        <div className="level-number">Level {level}</div>
                                        <div className="level-details">
                                            <span>Prof. Bonus: +{profBonus}</span>
                                            {hasFeatures && (
                                                <Badge variant="primary" size="sm">
                                                    {levelFeatures.length} Feature{levelFeatures.length !== 1 ? 's' : ''}
                                                </Badge>
                                            )}
                                            {level === classData.subclassFeature?.level && (
                                                <Badge variant="warning" size="sm">
                                                    Subclass
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openFeatureModal(level)}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* Level Content */}
                                {isExpanded && (
                                    <div className="level-content">
                                        {levelFeatures.length > 0 ? (
                                            <div className="features-list">
                                                {levelFeatures.map((feature, index) => (
                                                    <div key={index} className="feature-item">
                                                        <div className="feature-content">
                                                            <div className="feature-name">{feature.name}</div>
                                                            <div className="feature-description">
                                                                {feature.description.length > 100
                                                                    ? `${feature.description.substring(0, 100)}...`
                                                                    : feature.description
                                                                }
                                                            </div>
                                                        </div>

                                                        <div className="feature-actions">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => openFeatureModal(level, feature)}
                                                                title="Edit"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => duplicateFeature(level, feature)}
                                                                title="Duplicate"
                                                            >
                                                                <Copy className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => deleteFeature(level, index)}
                                                                title="Delete"
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="empty-level">
                                                No features for this level.
                                                <button
                                                    type="button"
                                                    onClick={() => openFeatureModal(level)}
                                                    className="text-blue-600 hover:text-blue-800 ml-1"
                                                >
                                                    Add one now
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Feature Modal */}
            <FeatureModal
                isOpen={showFeatureModal}
                onClose={closeFeatureModal}
                onSave={saveFeature}
                level={selectedLevel}
                feature={editingFeature}
            />

            {/* Tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h5 className="font-semibold text-amber-900 mb-2">🎯 Feature Design Tips</h5>
                <ul className="text-sm text-amber-800 space-y-1">
                    <li>• <strong>Level 1:</strong> Core class identity and basic abilities</li>
                    <li>• <strong>Subclass Level:</strong> Major decision point and specialization</li>
                    <li>• <strong>Mid Levels:</strong> Improvements and new capabilities</li>
                    <li>• <strong>High Levels:</strong> Powerful, game-changing abilities</li>
                    <li>• <strong>Level 20:</strong> Capstone feature - make it amazing!</li>
                </ul>
            </div>
        </div>
    );
}

// Feature Modal Component
function FeatureModal({ isOpen, onClose, onSave, level, feature }) {
    const [featureData, setFeatureData] = useState(() =>
        feature || { name: '', description: '', type: 'ability' }
    );

    React.useEffect(() => {
        if (feature) {
            setFeatureData(feature);
        } else {
            setFeatureData({ name: '', description: '', type: 'ability' });
        }
    }, [feature]);

    const handleSave = () => {
        if (featureData.name.trim() && featureData.description.trim()) {
            onSave(featureData);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${feature ? 'Edit' : 'Add'} Level ${level} Feature`}
            size="lg"
        >
            <div className="space-y-4">
                <Input
                    label="Feature Name"
                    value={featureData.name}
                    onChange={(e) => setFeatureData(prev => ({
                        ...prev,
                        name: e.target.value
                    }))}
                    placeholder="e.g., Rage, Spellcasting, Action Surge"
                    required
                />

                <div className="form-field">
                    <label className="form-label">Feature Type</label>
                    <select
                        className="form-select"
                        value={featureData.type || 'ability'}
                        onChange={(e) => setFeatureData(prev => ({
                            ...prev,
                            type: e.target.value
                        }))}
                    >
                        <option value="ability">Ability</option>
                        <option value="improvement">Improvement</option>
                        <option value="passive">Passive</option>
                        <option value="spellcasting">Spellcasting</option>
                        <option value="subclass">Subclass</option>
                    </select>
                </div>

                <div className="form-field">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-textarea"
                        value={featureData.description}
                        onChange={(e) => setFeatureData(prev => ({
                            ...prev,
                            description: e.target.value
                        }))}
                        placeholder="Describe what this feature does, how it works, and any limitations..."
                        rows={6}
                        required
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!featureData.name.trim() || !featureData.description.trim()}
                    >
                        {feature ? 'Update' : 'Add'} Feature
                    </Button>
                </div>
            </div>
        </Modal>
    );
}