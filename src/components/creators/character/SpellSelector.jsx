// src/components/creators/character/SpellSelector.jsx
import { useState, useEffect } from 'react';
import {
    getSpells,
    SCHOOLS_OF_MAGIC,
    SPELL_LEVELS,
    formatSpellLevel,
    formatSchool
} from '../../../utils/spellData';

function SpellSelector({ selectedSpells = [], onChange, spellcastingType = 'full' }) {
    const [spells, setSpells] = useState([]);
    const [filteredSpells, setFilteredSpells] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        level: null,
        school: '',
        ritual: null
    });

    // Load spells on component mount
    useEffect(() => {
        const allSpells = getSpells();
        setSpells(allSpells);
        setFilteredSpells(allSpells);
    }, []);

    // Apply filters when they change
    useEffect(() => {
        applyFilters();
    }, [searchTerm, filters, spells]);

    const applyFilters = () => {
        let result = [...spells];

        // Apply search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(spell =>
                spell.name.toLowerCase().includes(term) ||
                spell.school.toLowerCase().includes(term)
            );
        }

        // Apply level filter
        if (filters.level !== null) {
            result = result.filter(spell => spell.level === filters.level);
        }

        // Apply school filter
        if (filters.school) {
            result = result.filter(spell => spell.school === filters.school);
        }

        // Apply ritual filter
        if (filters.ritual !== null) {
            result = result.filter(spell => spell.ritual === filters.ritual);
        }

        setFilteredSpells(result);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const toggleSpellSelection = (spellId) => {
        const updatedSelection = selectedSpells.includes(spellId)
            ? selectedSpells.filter(id => id !== spellId)
            : [...selectedSpells, spellId];

        if (typeof onChange === 'function') {
            onChange(updatedSelection);
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            level: null,
            school: '',
            ritual: null
        });
    };

    // Group spells by level for display
    const spellsByLevel = filteredSpells.reduce((acc, spell) => {
        if (!acc[spell.level]) {
            acc[spell.level] = [];
        }
        acc[spell.level].push(spell);
        return acc;
    }, {});

    // Determine max spell level based on spellcasting type
    const getMaxSpellLevel = () => {
        switch (spellcastingType) {
            case 'full': return 9;    // Full casters get 9th level spells
            case 'half': return 5;    // Half casters get 5th level spells
            case 'third': return 4;   // Third casters get 4th level spells
            case 'pact': return 5;    // Warlocks get 5th level spells (via Mystic Arcanum)
            default: return 9;        // Default to full caster
        }
    };

    return (
        <div className="spell-selector">
            <div className="spell-selector-controls">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search spells..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="form-control search-input"
                    />
                    {searchTerm && (
                        <button
                            className="search-clear"
                            onClick={() => setSearchTerm('')}
                        >
                            ×
                        </button>
                    )}
                </div>

                <div className="filter-controls">
                    <div className="filter-group">
                        <label>Level</label>
                        <select
                            value={filters.level !== null ? filters.level : ''}
                            onChange={e => handleFilterChange('level', e.target.value === '' ? null : parseInt(e.target.value))}
                            className="form-control"
                        >
                            <option value="">All Levels</option>
                            {SPELL_LEVELS.map(level => (
                                <option key={level.value} value={level.value}>
                                    {level.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>School</label>
                        <select
                            value={filters.school}
                            onChange={e => handleFilterChange('school', e.target.value)}
                            className="form-control"
                        >
                            <option value="">All Schools</option>
                            {SCHOOLS_OF_MAGIC.map(school => (
                                <option key={school.id} value={school.id}>
                                    {school.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Ritual</label>
                        <select
                            value={filters.ritual !== null ? filters.ritual.toString() : ''}
                            onChange={e => handleFilterChange('ritual', e.target.value === '' ? null : e.target.value === 'true')}
                            className="form-control"
                        >
                            <option value="">Any</option>
                            <option value="true">Ritual Only</option>
                            <option value="false">Non-Ritual Only</option>
                        </select>
                    </div>

                    <button
                        className="button button-secondary"
                        onClick={clearFilters}
                    >
                        Clear
                    </button>
                </div>
            </div>

            <div className="spell-list">
                {filteredSpells.length === 0 ? (
                    <div className="empty-state">
                        <p>No spells found matching your criteria.</p>
                        {(searchTerm || filters.level !== null || filters.school || filters.ritual !== null) && (
                            <button className="button button-secondary" onClick={clearFilters}>
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="spell-levels">
                        {Object.keys(spellsByLevel)
                            .sort((a, b) => parseInt(a) - parseInt(b))
                            .map(level => (
                                <div key={level} className="spell-level-group">
                                    <h3>{formatSpellLevel(parseInt(level))}</h3>
                                    <div className="spells-grid">
                                        {spellsByLevel[level].map(spell => (
                                            <div
                                                key={spell.id}
                                                className={`spell-card ${selectedSpells.includes(spell.id) ? 'selected' : ''}`}
                                                onClick={() => toggleSpellSelection(spell.id)}
                                            >
                                                <div className="spell-header">
                                                    <div className="spell-name">{spell.name}</div>
                                                    <div className="spell-school">{formatSchool(spell.school)}</div>
                                                </div>
                                                <div className="spell-meta">
                                                    <div className="spell-casting-time">{spell.castingTime}</div>
                                                    <div className="spell-range">{spell.range}</div>
                                                    {spell.ritual && <div className="spell-ritual">Ritual</div>}
                                                </div>
                                                <div className="spell-selection-indicator"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>

            <div className="spell-selection-summary">
                <div className="selection-count">
                    {selectedSpells.length} spell{selectedSpells.length !== 1 ? 's' : ''} selected
                </div>
            </div>
        </div>
    );
}

export default SpellSelector;