// src/components/creators/character/RacialTraits.jsx
import { useState } from 'react';
import { Edit, X, Plus } from 'lucide-react';

function RacialTraits({ raceData, updateRaceData }) {
    const [currentTrait, setCurrentTrait] = useState({ name: '', description: '' });
    const [editingIndex, setEditingIndex] = useState(null);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleTraitChange = (e) => {
        const { name, value } = e.target;
        setCurrentTrait(prev => ({ ...prev, [name]: value }));
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const validateTrait = () => {
        const newErrors = {};

        if (touched.name && !currentTrait.name.trim()) {
            newErrors.name = 'Trait name is required';
        }

        if (touched.description && !currentTrait.description.trim()) {
            newErrors.description = 'Trait description is required';
        } else if (touched.description && currentTrait.description.length < 10) {
            newErrors.description = 'Description should be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddTrait = () => {
        // Mark all fields as touched to show validation errors
        setTouched({ name: true, description: true });

        if (!validateTrait()) {
            return;
        }

        const newTraits = [...raceData.traits];
        if (editingIndex !== null) {
            newTraits[editingIndex] = { ...currentTrait };
            setEditingIndex(null);
        } else {
            newTraits.push({ ...currentTrait });
        }

        updateRaceData({ traits: newTraits });
        setCurrentTrait({ name: '', description: '' });
        setErrors({});
        setTouched({});
    };

    const handleEditTrait = (index) => {
        setCurrentTrait({ ...raceData.traits[index] });
        setEditingIndex(index);
        setErrors({});
        setTouched({});
    };

    const handleDeleteTrait = (index) => {
        const newTraits = raceData.traits.filter((_, i) => i !== index);
        updateRaceData({ traits: newTraits });

        // Reset form if we're editing the deleted trait
        if (editingIndex === index) {
            setCurrentTrait({ name: '', description: '' });
            setEditingIndex(null);
            setErrors({});
            setTouched({});
        }
    };

    const handleCancelEdit = () => {
        setCurrentTrait({ name: '', description: '' });
        setEditingIndex(null);
        setErrors({});
        setTouched({});
    };

    return (
        <div className="space-y-6">
            {/* Trait Form */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-4">
                    {editingIndex !== null ? 'Edit Racial Trait' : 'Add Racial Trait'}
                </h4>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Trait Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={currentTrait.name}
                            onChange={handleTraitChange}
                            onBlur={validateTrait}
                            className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="e.g., Darkvision, Draconic Ancestry"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description *</label>
                        <textarea
                            name="description"
                            value={currentTrait.description}
                            onChange={handleTraitChange}
                            onBlur={validateTrait}
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Describe what this trait does..."
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleAddTrait}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {editingIndex !== null ? 'Update Trait' : 'Add Trait'}
                        </button>

                        {editingIndex !== null && (
                            <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Traits List */}
            <div className="space-y-3">
                <h4 className="font-medium">Current Racial Traits</h4>

                {raceData.traits.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Plus className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No traits yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by adding your first racial trait above.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {raceData.traits.map((trait, index) => (
                            <div key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-medium text-lg">{trait.name}</h5>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditTrait(index)}
                                            className="text-blue-600 hover:text-blue-700 p-1"
                                            title="Edit trait"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTrait(index)}
                                            className="text-red-600 hover:text-red-700 p-1"
                                            title="Delete trait"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                    {trait.description}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Helpful Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Trait Design Tips</h5>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Keep traits balanced - they should provide utility without being overpowered</li>
                    <li>• Consider both combat and roleplay applications</li>
                    <li>• Look at existing D&D races for inspiration and balance guidance</li>
                    <li>• Most races have 2-4 distinct traits beyond ability score increases</li>
                </ul>
            </div>
        </div>
    );
}

export default RacialTraits;