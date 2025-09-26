// src/components/creators/character/background/LanguagesSelector.jsx
import { useState } from 'react';

function LanguagesSelector({ selectedLanguages = [], onChange }) {
    const [languageCount, setLanguageCount] = useState(selectedLanguages.length || 0);
    const [customLanguage, setCustomLanguage] = useState('');

    const standardLanguages = [
        'Common', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin',
        'Halfling', 'Orc', 'Abyssal', 'Celestial', 'Draconic', 'Deep Speech',
        'Infernal', 'Primordial', 'Sylvan', 'Undercommon'
    ];

    const handleLanguageCountChange = (count) => {
        setLanguageCount(count);

        // Create array of generic language entries
        const newLanguages = Array(count).fill('Any language of your choice');
        onChange(newLanguages);
    };

    const handleSpecificLanguageToggle = (language) => {
        if (selectedLanguages.includes(language)) {
            onChange(selectedLanguages.filter(l => l !== language));
        } else {
            onChange([...selectedLanguages, language]);
        }
    };

    const handleAddCustomLanguage = () => {
        if (customLanguage.trim() && !selectedLanguages.includes(customLanguage.trim())) {
            onChange([...selectedLanguages, customLanguage.trim()]);
            setCustomLanguage('');
        }
    };

    const handleRemoveLanguage = (language) => {
        onChange(selectedLanguages.filter(l => l !== language));
    };

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium mb-2">Language Count</label>
                    <p className="text-sm text-gray-600 mb-2">
                        How many additional languages does this background provide?
                    </p>
                    <select
                        value={languageCount}
                        onChange={(e) => handleLanguageCountChange(parseInt(e.target.value))}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md"
                    >
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                    </select>
                </div>

                {languageCount > 0 && (
                    <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-700">
                            <strong>Current setting:</strong> {languageCount} additional language{languageCount !== 1 ? 's' : ''} of the player's choice
                        </p>
                    </div>
                )}
            </div>

            <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Or specify exact languages:</h4>
                <p className="text-sm text-gray-600 mb-3">
                    Instead of letting players choose, you can specify which languages this background provides.
                </p>

                <div className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {standardLanguages.map(language => (
                            <label key={language} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedLanguages.includes(language)}
                                    onChange={() => handleSpecificLanguageToggle(language)}
                                    className="rounded border-gray-300"
                                />
                                <span className={`text-sm ${selectedLanguages.includes(language) ? 'font-medium text-blue-600' : ''}`}>
                                    {language}
                                </span>
                            </label>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={customLanguage}
                            onChange={(e) => setCustomLanguage(e.target.value)}
                            placeholder="Add custom language..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCustomLanguage()}
                        />
                        <button
                            onClick={handleAddCustomLanguage}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>

            {selectedLanguages.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h5 className="font-medium text-green-900 mb-2">Selected Languages:</h5>
                    <div className="flex flex-wrap gap-2">
                        {selectedLanguages.map((language, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-sm rounded"
                            >
                                {language}
                                <button
                                    onClick={() => handleRemoveLanguage(language)}
                                    className="text-green-600 hover:text-green-800"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h5 className="font-medium text-blue-900 mb-1">💡 Language Guidelines</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Most backgrounds provide 0-2 additional languages</li>
                    <li>• Scholar backgrounds often provide more languages</li>
                    <li>• Consider the background's theme when choosing languages</li>
                    <li>• "Any language" gives players flexibility in character creation</li>
                </ul>
            </div>
        </div>
    );
}

export default LanguagesSelector;