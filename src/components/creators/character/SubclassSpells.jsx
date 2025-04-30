// src/components/creators/character/SubclassSpells.jsx
import { useState } from 'react';
import {
    getSpells,
    formatSpellLevel,
    SPELL_LEVELS
} from '../../../utils/spellData';

function SubclassSpells({ subclassData, updateSubclassData, parentClass }) {
    const [spellsByLevel, setSpellsByLevel] = useState(() => {
        // Initialize with existing spells if available
        if (subclassData.spells && Array.isArray(subclassData.spells)) {
            return subclassData.spells;
        }

        // Otherwise create an empty structure
        const levels = getSubclassSpellLevels(parentClass);
        return levels.map(level => ({
            classLevel: level.classLevel,
            spellLevel: level.spellLevel,
            spells: []
        }));
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [allSpells, setAllSpells] = useState(() => getSpells());
    const [selectedLevel, setSelectedLevel] = useState(0);

    // Get subclass spell levels based on parent class
    function getSubclassSpellLevels(parentClass) {
        if (!parentClass) return [];

        const className = parentClass.name.toLowerCase();

        // Different classes get spells at different levels and of different spell levels
        switch (className) {
            case 'cleric':
                return [
                    { classLevel: 1, spellLevel: 1 },
                    { classLevel: 3, spellLevel: 2 },
                    { classLevel: 5, spellLevel: 3 },
                    { classLevel: 7, spellLevel: 4 },
                    { classLevel: 9, spellLevel: 5 }
                ];
            case 'druid':
                return [
                    { classLevel: 2, spellLevel: 1 },
                    { classLevel: 3, spellLevel: 2 },
                    { classLevel: 5, spellLevel: 3 },
                    { classLevel: 7, spellLevel: 4 },
                    { classLevel: 9, spellLevel: 5 }
                ];
            case 'paladin':
                return [
                    { classLevel: 3, spellLevel: 1 },
                    { classLevel: 5, spellLevel: 2 },
                    { classLevel: 9, spellLevel: 3 },
                    { classLevel: 13, spellLevel: 4 },
                    { classLevel: 17, spellLevel: 5 }
                ];
            case 'ranger':
                return [
                    { classLevel: 3, spellLevel: 1 },
                    { classLevel: 5, spellLevel: 2 },
                    { classLevel: 9, spellLevel: 3 },
                    { classLevel: 13, spellLevel: 4 },
                    { classLevel: 17, spellLevel: 5 }
                ];
            case 'warlock':
                return [
                    { classLevel: 1, spellLevel: 1 },
                    { classLevel: 3, spellLevel: 2 },
                    { classLevel: 5, spellLevel: 3 },
                    { classLevel: 7, spellLevel: 4 },
                    { classLevel: 9, spellLevel: 5 }
                ];
            default:
                return [
                    { classLevel: 1, spellLevel: 1 },
                    { classLevel: 3, spellLevel: 2 },
                    { classLevel: 5, spellLevel: 3 },
                    { classLevel: 7, spellLevel: 4 },
                    { classLevel: 9, spellLevel: 5 }
                ];
        }
    }

    const handleSpellLevelChange = (e) => {
        setSelectedLevel(parseInt(e.target.value));
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSpellToggle = (spellId, levelIndex) => {
        const updatedSpellsByLevel = [...spellsByLevel];
        const levelData = updatedSpellsByLevel[levelIndex];

        if (levelData.spells.includes(spellId)) {
            // Remove spell from list
            levelData.spells = levelData.spells.filter(id => id !== spellId);
        } else {
            // Add spell to list (usually limited to 2 per level for subclasses)
            if (levelData.spells.length < 2) {
                levelData.spells.push(spellId);
            } else {
                alert('Most subclasses are limited to 2 spells per level. Remove a spell before adding a new one.');
                return;
            }
        }

        updatedSpellsByLevel[levelIndex] = levelData;
        setSpellsByLevel(updatedSpellsByLevel);
        updateSubclassData({ spells: updatedSpellsByLevel });
    };

    // Format the expanded class level description
    const formatClassLevel = (level) => {
        if (level === 1) return '1st level';
        if (level === 2) return '2nd level';
        if (level === 3) return '3rd level';
        return `${level}th level`;
    };

    // Get filtered spells of the selected level
    const getFilteredSpells = () => {
        const spellLevel = selectedLevel;

        return allSpells.filter(spell => {
            // Filter by spell level
            if (spell.level !== spellLevel) return false;

            // Filter by search term
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                if (!spell.name.toLowerCase().includes(term) &&
                    !spell.school.toLowerCase().includes(term)) {
                    return false;
                }
            }

            return true;
        });
    };

    // Get the class level that corresponds to a spell level
    const getClassLevelForSpellLevel = (spellLevel) => {
        const levelData = spellsByLevel.find(l => l.spellLevel === spellLevel);
        return levelData ? levelData.classLevel : null;
    };

    // Check if a spell is selected for a specific level
    const isSpellSelected = (spellId, levelIndex) => {
        return spellsByLevel[levelIndex]?.spells.includes(spellId);
    };

    const filteredSpells = getFilteredSpells();

    return (
        <div className="subclass-spells">
            <p className="form-info">
                Add spells that are always prepared for characters of this subclass.
                These don't count against the number of spells a character can prepare each day.
            </p>

            <div className="spell-selection-controls">
                <div className="form-field">
                    <label htmlFor="spellLevel">Spell Level</label>
                    <select
                        id="spellLevel"
                        value={selectedLevel}
                        onChange={handleSpellLevelChange}
                        className="form-control"
                    >
                        {SPELL_LEVELS.filter(level => level.value > 0 && level.value <= 5).map(level => (
                            <option key={level.value} value={level.value}>
                                {level.label}
                                {getClassLevelForSpellLevel(level.value) &&
                                    ` (${formatClassLevel(getClassLevelForSpellLevel(level.value))})`}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-field">
                    <label htmlFor="spellSearch">Search</label>
                    <input
                        type="text"
                        id="spellSearch"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="form-control"
                        placeholder="Search spells..."
                    />
                </div>
            </div>

            {/* Current spell level selections */}
            <div className="current-spell-selections">
                <h4>Selected Spells</h4>

                {spellsByLevel.map((levelData, index) => {
                    const levelSpells = levelData.spells.map(id =>
                        allSpells.find(spell => spell.id === id)
                    ).filter(Boolean);

                    return (
                        <div key={index} className="spell-level-selection">
                            <h5>
                                {formatClassLevel(levelData.classLevel)} ({formatSpellLevel(levelData.spellLevel)})
                            </h5>

                            {levelSpells.length > 0 ? (
                                <div className="selected-spells">
                                    {levelSpells.map(spell => (
                                        <div key={spell.id} className="selected-spell">
                                            <span>{spell.name}</span>
                                            <button
                                                className="button-small button-danger"
                                                onClick={() => handleSpellToggle(spell.id, index)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-selection">No spells selected for this level</div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Available spells for selection */}
            <div className="available-spells">
                <h4>Available {formatSpellLevel(selectedLevel)} Spells</h4>

                {filteredSpells.length > 0 ? (
                    <div className="spell-grid">
                        {filteredSpells.map(spell => {
                            // Find the level index that corresponds to this spell level
                            const levelIndex = spellsByLevel.findIndex(l => l.spellLevel === spell.level);

                            return (
                                <div
                                    key={spell.id}
                                    className={`spell-card ${isSpellSelected(spell.id, levelIndex) ? 'selected' : ''}`}
                                    onClick={() => handleSpellToggle(spell.id, levelIndex)}
                                >
                                    <div className="spell-name">{spell.name}</div>
                                    <div className="spell-school">{spell.school}</div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-state">
                        No {formatSpellLevel(selectedLevel)} spells found matching your search criteria.
                    </div>
                )}
            </div>
        </div>
    );
}

export default SubclassSpells;