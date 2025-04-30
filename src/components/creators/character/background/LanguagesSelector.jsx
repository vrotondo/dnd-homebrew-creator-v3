// src/components/creators/character/background/LanguagesSelector.jsx
import { useState } from 'react';

function LanguagesSelector({ selectedLanguages = [], onChange }) {
    const [customLanguage, setCustomLanguage] = useState('');
    const [standardLanguages] = useState([
        'Common',
        'Dwarvish',
        'Elvish',
        'Giant',
        'Gnomish',
        'Goblin',
        'Halfling',
        'Orc',
        'Abyssal',
        'Celestial',
        'Draconic',
        'Deep Speech',
        'Infernal',
        'Primordial',
        'Sylvan',
        'Undercommon'
    ]);

    const [additionalOptions] = useState([
        'One language of your choice',
        'Two languages of your choice',
        'Any language'
    ]);

    const handleLanguageChange = (language, checked) => {
        let updatedLanguages;

        if (checked) {
            updatedLanguages = [...selectedLanguages, language];
        } else {
            updatedLanguages = selectedLanguages.filter(l => l !== language);
        }

        onChange(updatedLanguages);
    };

    const handleAddCustomLanguage = () => {
        if (customLanguage.trim() === '') return;

        // Add the custom language if it doesn't already exist
        if (!selectedLanguages.includes(customLanguage.trim())) {
            onChange([...selectedLanguages, customLanguage.trim()]);
        }

        setCustomLanguage('');
    };

    const handleRemoveLanguage = (language) => {
        const updatedLanguages = selectedLanguages.filter(l => l !== language);
        onChange(updatedLanguages);
    };

    return (
        <div className="languages-selector">
            <p className="form-note">Select languages provided by this background.</p>

            <div className="language-section">
                <h5>Standard Languages</h5>
                <div className="languages-grid">
                    {standardLanguages.map(language => (
                        <div key={language} className="language-item checkbox-item">
                            <input
                                type="checkbox"
                                id={`lang-${language}`}
                                checked={selectedLanguages.includes(language)}
                                onChange={(e) => handleLanguageChange(language, e.target.checked)}
                            />
                            <label htmlFor={`lang-${language}`} className={selectedLanguages.includes(language) ? 'selected' : ''}>
                                {language}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="language-section">
                <h5>Common Background Options</h5>
                <div className="languages-grid">
                    {additionalOptions.map(option => (
                        <div key={option} className="language-item checkbox-item">
                            <input
                                type="checkbox"
                                id={`lang-option-${option}`}
                                checked={selectedLanguages.includes(option)}
                                onChange={(e) => handleLanguageChange(option, e.target.checked)}
                            />
                            <label htmlFor={`lang-option-${option}`} className={selectedLanguages.includes(option) ? 'selected' : ''}>
                                {option}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="custom-language-section">
                <h5>Add Custom Language</h5>
                <div className="custom-language-input">
                    <input
                        type="text"
                        value={customLanguage}
                        onChange={(e) => setCustomLanguage(e.target.value)}
                        placeholder="Enter a custom language"
                        className="form-control"
                    />
                    <button
                        className="button"
                        onClick={handleAddCustomLanguage}
                        disabled={customLanguage.trim() === ''}
                    >
                        Add
                    </button>
                </div>
            </div>

            {selectedLanguages.length > 0 && (
                <div className="selected-languages">
                    <h5>Selected Languages</h5>
                    <ul className="selected-languages-list">
                        {selectedLanguages.map(language => (
                            <li key={language} className="selected-language-item">
                                {language}
                                <button
                                    className="button-small button-danger"
                                    onClick={() => handleRemoveLanguage(language)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default LanguagesSelector;