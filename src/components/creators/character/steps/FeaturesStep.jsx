// src/components/creators/character/steps/FeaturesStep.jsx
import React, { useState } from 'react';
import { Input, Button, Badge, Card, CardContent, Modal } from '../../../ui';
import { Plus, Edit, Trash2, Copy, ChevronDown, ChevronRight, Zap, Crown, Star } from 'lucide-react';

const LEVEL_PROGRESSION = {
    levels: Array.from({ length: 20 }, (_, i) => i + 1),
    proficiencyBonus: [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6]
};

const FEATURE_TEMPLATES = [
    {
        name: 'Ability Score Improvement',
        description: 'When you reach this level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.',
        type: 'improvement',
        applicableLevels: [4, 8, 12, 16, 19]
    },
    {
        name: 'Fighting Style',
        description: 'You adopt a particular style of fighting as your specialty. Choose one of the following options. You can\'t take a Fighting Style option more than once, even if something in the game lets you choose again.',
        type: 'ability',
        applicableLevels: [1, 2]
    },
    {
        name: 'Extra Attack',
        description: 'Beginning at this level, you can attack twice, instead of once, whenever you take the Attack action on your turn.',
        type: 'ability',
        applicableLevels: [5, 6]
    },
    {
        name: 'Unarmored Defense',
        description: 'While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier. You can use a shield and still gain this benefit.',
        type: 'passive',
        applicableLevels: [1]
    }
];

export default function FeaturesStep({
    classData,
    handleFieldChange,
    errors,
    touched
}) {
    const [expandedLevels, setExpandedLevels] = useState({});
    const [showFeatureModal, setShowFeatureModal] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState(1);
    const [editingFeature, setEditingFeature] = useState(null);
    const [showTemplates, setShowTemplates] = useState(false);

    // Initialize features structure
    const features = classData.features || {};

    const updateFeatures = (updatedFeatures) => {
        handleFieldChange('features', {
            ...features,
            ...updatedFeatures
        });
    };

    // Modal functions
    const openFeatureModal = (level, feature = null) => {
        setSelectedLevel(level);
        setEditingFeature(feature);
        setShowFeatureModal(true);
    };

    const closeFeatureModal = () => {
        setShowFeatureModal(false);
        setEditingFeature(null);
        setSelectedLevel(1);
    };

    const saveFeature = (featureData) => {
        const levelFeatures = features[selectedLevel] || [];

        if (editingFeature) {
            // Edit existing feature
            const featureIndex = levelFeatures.findIndex(f => f.id === editingFeature.id);
            const updatedFeatures = levelFeatures.map((f, i) =>
                i === featureIndex ? { ...featureData, id: editingFeature.id } : f
            );
            updateFeatures({ [selectedLevel]: updatedFeatures });
        } else {
            // Add new feature
            const newFeature = {
                ...featureData,
                id: Date.now() + Math.random()
            };
            updateFeatures({
                [selectedLevel]: [...levelFeatures, newFeature]
            });
        }

        closeFeatureModal();
    };

    const deleteFeature = (level, featureId) => {
        const levelFeatures = features[level] || [];
        const updatedFeatures = levelFeatures.filter(f => f.id !== featureId);
        updateFeatures({
            [level]: updatedFeatures.length > 0 ? updatedFeatures : undefined
        });
    };

    const duplicateFeature = (level, feature) => {
        const levelFeatures = features[level] || [];
        const duplicatedFeature = {
            ...feature,
            name: `${feature.name} (Copy)`,
            id: Date.now() + Math.random()
        };
        updateFeatures({
            [level]: [...levelFeatures, duplicatedFeature]
        });
    };

    const addTemplateFeature = (level, template) => {
        const levelFeatures = features[level] || [];
        const newFeature = {
            ...template,
            id: Date.now() + Math.random()
        };
        updateFeatures({
            [level]: [...levelFeatures, newFeature]
        });
        setShowTemplates(false);
    };

    const toggleLevelExpansion = (level) => {
        setExpandedLevels(prev => ({
            ...prev,
            [level]: !prev[level]
        }));
    };

    const getFeatureCount = (level) => {
        return (features[level] || []).length;
    };

    const isImportantLevel = (level) => {
        // Highlight key levels: 1, 3 (subclass), ASI levels, and capstone
        return level === 1 || level === 3 || level === 20 || [4, 8, 12, 16, 19].includes(level);
    };

    const getTotalFeatures = () => {
        return Object.values(features).reduce((total, levelFeatures) => total + levelFeatures.length, 0);
    };

    return (
        <div className="space-y-6">
            {/* Introduction */}
            <div className="form-section">
                <h4 className="form-section-title">Class Features</h4>
                <p className="form-section-description">
                    Define the features characters gain at each level. These are the core abilities that make your class unique and powerful.
                </p>

                <div className="flex items-center gap-4 mt-3">
                    <Badge variant="primary" className="gap-1">
                        <Star className="w-3 h-3" />
                        {getTotalFeatures()} Total Features
                    </Badge>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTemplates(!showTemplates)}
                        className="gap-2"
                    >
                        <Zap className="w-4 h-4" />
                        {showTemplates ? 'Hide' : 'Show'} Templates
                    </Button>
                </div>
            </div>

            {/* Feature Templates */}
            {showTemplates && (
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                    <CardContent className="p-4">
                        <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">🎯 Common Feature Templates</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {FEATURE_TEMPLATES.map((template, index) => (
                                <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded-lg border">
                                    <div className="font-medium text-sm">{template.name}</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        {template.description.substring(0, 60)}...
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="text-xs text-blue-600">
                                            Usually levels: {template.applicableLevels.join(', ')}
                                        </div>
                                        <select
                                            className="text-xs border rounded px-2 py-1"
                                            onChange={(e) => e.target.value && addTemplateFeature(parseInt(e.target.value), template)}
                                            value=""
                                        >
                                            <option value="">Add to level...</option>
                                            {template.applicableLevels.map(level => (
                                                <option key={level} value={level}>Level {level}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Subclass Configuration */}
            <div className="form-section">
                <h4 className="form-section-title flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Subclass Configuration
                </h4>
                <p className="form-section-description">
                    Configure when and how characters choose their subclass specialization.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Subclass Level"
                        type="number"
                        min="1"
                        max="3"
                        value={classData.subclassFeature?.level || 3}
                        onChange={(e) => handleFieldChange('subclassFeature', {
                            ...classData.subclassFeature,
                            level: parseInt(e.target.value) || 3
                        })}
                        helperText="When do characters choose their subclass? (Usually 1, 2, or 3)"
                    />

                    <Input
                        label="Subclass Name"
                        value={classData.subclassFeature?.name || ''}
                        onChange={(e) => handleFieldChange('subclassFeature', {
                            ...classData.subclassFeature,
                            name: e.target.value
                        })}
                        placeholder="e.g., Sacred Oath, Martial Archetype, Circle"
                        helperText="What is the subclass category called?"
                    />
                </div>

                <div className="form-field">
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
                    <div className="form-helper">
                        This will appear in the class description explaining subclass choice
                    </div>
                </div>
            </div>

            {/* Level Progression */}
            <div className="form-section">
                <h4 className="form-section-title">Level Progression (1-20)</h4>
                <p className="form-section-description">
                    Add features for each level. Click on a level to add or edit features.
                </p>

                <div className="level-progression space-y-2">
                    {LEVEL_PROGRESSION.levels.map(level => {
                        const levelFeatures = features[level] || [];
                        const isExpanded = expandedLevels[level];
                        const hasFeatures = levelFeatures.length > 0;
                        const profBonus = LEVEL_PROGRESSION.proficiencyBonus[level - 1];
                        const isSubclassLevel = level === (classData.subclassFeature?.level || 3);

                        return (
                            <div
                                key={level}
                                className={`
                                    level-row border rounded-lg transition-all duration-200
                                    ${isImportantLevel(level) ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-200 dark:border-gray-700'}
                                    ${hasFeatures ? 'border-l-4 border-l-green-500' : ''}
                                    ${isSubclassLevel ? 'border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-900/10' : ''}
                                `}
                            >
                                {/* Level Header */}
                                <div
                                    className={`
                                        level-header p-4 cursor-pointer flex items-center justify-between
                                        ${isExpanded ? 'border-b border-gray-200 dark:border-gray-600' : ''}
                                    `}
                                    onClick={() => toggleLevelExpansion(level)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            {isExpanded ? (
                                                <ChevronDown className="w-4 h-4" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4" />
                                            )}
                                            <span className="font-semibold text-lg">Level {level}</span>
                                            {isSubclassLevel && (
                                                <Badge variant="purple" size="sm" className="gap-1">
                                                    <Crown className="w-3 h-3" />
                                                    Subclass
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                            <span>Prof. Bonus: +{profBonus}</span>
                                            <span>{hasFeatures ? `${levelFeatures.length} feature${levelFeatures.length > 1 ? 's' : ''}` : 'No features'}</span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openFeatureModal(level);
                                        }}
                                        className="gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Feature
                                    </Button>
                                </div>

                                {/* Level Content */}
                                {isExpanded && (
                                    <div className="level-content p-4 pt-0 space-y-3">
                                        {levelFeatures.length > 0 ? (
                                            levelFeatures.map((feature, index) => (
                                                <div key={feature.id} className="feature-card p-3 bg-white dark:bg-gray-800 rounded border">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h5 className="font-medium">{feature.name}</h5>
                                                                <Badge
                                                                    variant={feature.type === 'spellcasting' ? 'blue' : feature.type === 'improvement' ? 'green' : 'gray'}
                                                                    size="sm"
                                                                >
                                                                    {feature.type}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                                                                {feature.description}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center gap-1 ml-3">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => openFeatureModal(level, feature)}
                                                                className="p-1 h-8 w-8"
                                                            >
                                                                <Edit className="w-3 h-3" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => duplicateFeature(level, feature)}
                                                                className="p-1 h-8 w-8"
                                                            >
                                                                <Copy className="w-3 h-3" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => deleteFeature(level, feature.id)}
                                                                className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-6 text-gray-500">
                                                <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                <p>No features for this level yet</p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openFeatureModal(level)}
                                                    className="mt-2 gap-2"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Add Feature
                                                </Button>
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
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
                <h5 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">🎯 Feature Design Tips</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-800 dark:text-amber-200">
                    <ul className="space-y-1">
                        <li>• <strong>Level 1:</strong> Core class identity and basic abilities</li>
                        <li>• <strong>Levels 2-3:</strong> Subclass choice and specialization begins</li>
                        <li>• <strong>Levels 4, 8, 12, 16, 19:</strong> Usually Ability Score Improvements</li>
                        <li>• <strong>Level 5:</strong> Major power spike (Extra Attack, 3rd level spells)</li>
                    </ul>
                    <ul className="space-y-1">
                        <li>• <strong>Mid Levels (6-14):</strong> Steady improvements and new capabilities</li>
                        <li>• <strong>High Levels (15-19):</strong> Powerful, game-changing abilities</li>
                        <li>• <strong>Level 20:</strong> Capstone feature - make it legendary!</li>
                        <li>• <strong>Balance:</strong> Avoid giving too many features at one level</li>
                    </ul>
                </div>
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

    const featureTypes = [
        { value: 'ability', label: 'Ability', description: 'Active ability that can be used' },
        { value: 'passive', label: 'Passive', description: 'Always-on benefit' },
        { value: 'improvement', label: 'Improvement', description: 'Enhances existing abilities' },
        { value: 'spellcasting', label: 'Spellcasting', description: 'Magical ability' },
        { value: 'subclass', label: 'Subclass', description: 'Subclass selection feature' }
    ];

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
                        {featureTypes.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label} - {type.description}
                            </option>
                        ))}
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
                        placeholder="Describe what this feature does, how it works, any limitations, usage restrictions, etc. Be specific about mechanics and include any relevant rules."
                        rows={8}
                        required
                    />
                    <div className="form-helper">
                        Write clear, complete descriptions. Include mechanics, usage limits, and any special rules.
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
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