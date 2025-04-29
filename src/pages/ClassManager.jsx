// src/pages/ClassManager.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getClasses, deleteClass, duplicateClass } from '../utils/storageService';
import ExportModal from '../components/export/ExportModal';

function ClassManager() {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState({ field: 'updatedAt', direction: 'desc' });
    const [selectedClass, setSelectedClass] = useState(null);
    const [showExportModal, setShowExportModal] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
        hitDice: [],
        primaryAbility: []
    });

    // Load classes on component mount
    useEffect(() => {
        loadClasses();
    }, []);

    // Load classes from storage
    const loadClasses = () => {
        const allClasses = getClasses({
            sortBy: sortBy
        });
        setClasses(allClasses);
        applyFilters(allClasses, searchTerm, filterOptions);

        // Extract filter options
        const hitDiceOptions = [...new Set(allClasses.map(c => c.hitDice))];
        const primaryAbilityOptions = [...new Set(allClasses.map(c => c.primaryAbility).filter(Boolean))];

        setFilterOptions(prev => ({
            ...prev,
            hitDice: prev.hitDice.filter(h => hitDiceOptions.includes(h)),
            primaryAbility: prev.primaryAbility.filter(p => primaryAbilityOptions.includes(p)),
            hitDiceOptions,
            primaryAbilityOptions
        }));
    };

    // Apply filters and search
    const applyFilters = (classes, search, filters) => {
        let result = [...classes];

        // Apply search term
        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(cls =>
                cls.name.toLowerCase().includes(searchLower) ||
                cls.description.toLowerCase().includes(searchLower)
            );
        }

        // Apply hit dice filter
        if (filters.hitDice && filters.hitDice.length > 0) {
            result = result.filter(cls => filters.hitDice.includes(cls.hitDice));
        }

        // Apply primary ability filter
        if (filters.primaryAbility && filters.primaryAbility.length > 0) {
            result = result.filter(cls => filters.primaryAbility.includes(cls.primaryAbility));
        }

        setFilteredClasses(result);
    };

    // Handle search input
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        applyFilters(classes, value, filterOptions);
    };

    // Handle filter changes
    const handleFilterChange = (type, value, checked) => {
        const updatedFilters = { ...filterOptions };

        if (checked) {
            if (!updatedFilters[type].includes(value)) {
                updatedFilters[type] = [...updatedFilters[type], value];
            }
        } else {
            updatedFilters[type] = updatedFilters[type].filter(v => v !== value);
        }

        setFilterOptions(updatedFilters);
        applyFilters(classes, searchTerm, updatedFilters);
    };

    // Handle sorting
    const handleSort = (field) => {
        const direction = sortBy.field === field && sortBy.direction === 'asc' ? 'desc' : 'asc';
        const newSortBy = { field, direction };
        setSortBy(newSortBy);

        // Re-sort the classes
        const allClasses = getClasses({ sortBy: newSortBy });
        setClasses(allClasses);
        applyFilters(allClasses, searchTerm, filterOptions);
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setFilterOptions({
            hitDice: [],
            primaryAbility: []
        });
        applyFilters(classes, '', { hitDice: [], primaryAbility: [] });
    };

    // Handle class actions
    const handleEdit = (cls) => {
        navigate(`/character-creator/class/${cls.id}`);
    };

    const handleDelete = (cls) => {
        if (window.confirm(`Are you sure you want to delete "${cls.name}"? This cannot be undone.`)) {
            deleteClass(cls.id);
            loadClasses();
        }
    };

    const handleDuplicate = (cls) => {
        const duplicate = {
            ...cls,
            id: null, // Will be generated on save
            name: `${cls.name} (Copy)`,
            createdAt: null, // Will be set on save
            updatedAt: null // Will be set on save
        };

        const savedId = duplicateClass(duplicate);
        if (savedId) {
            loadClasses();
        }
    };

    const handleExport = (cls) => {
        setSelectedClass(cls);
        setShowExportModal(true);
    };

    // Format ability name
    const formatAbility = (ability) => {
        const abilities = {
            'STR': 'Strength',
            'DEX': 'Dexterity',
            'CON': 'Constitution',
            'INT': 'Intelligence',
            'WIS': 'Wisdom',
            'CHA': 'Charisma'
        };
        return abilities[ability] || ability;
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="class-manager">
            <div className="page-header">
                <h1>Manage Classes</h1>
                <Link to="/character-creator/class/new" className="button">Create New Class</Link>
            </div>

            <div className="manager-container">
                {/* Filters Panel */}
                <div className="filters-panel">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search classes..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="form-control search-input"
                        />
                        {searchTerm && (
                            <button
                                className="search-clear"
                                onClick={() => {
                                    setSearchTerm('');
                                    applyFilters(classes, '', filterOptions);
                                }}
                            >
                                ×
                            </button>
                        )}
                    </div>

                    <div className="filter-group">
                        <h3>Hit Dice</h3>
                        {filterOptions.hitDiceOptions?.map(hitDie => (
                            <div className="filter-option" key={hitDie}>
                                <input
                                    type="checkbox"
                                    id={`hit-dice-${hitDie}`}
                                    checked={filterOptions.hitDice.includes(hitDie)}
                                    onChange={(e) => handleFilterChange('hitDice', hitDie, e.target.checked)}
                                />
                                <label htmlFor={`hit-dice-${hitDie}`}>{hitDie}</label>
                            </div>
                        ))}
                    </div>

                    <div className="filter-group">
                        <h3>Primary Ability</h3>
                        {filterOptions.primaryAbilityOptions?.map(ability => (
                            <div className="filter-option" key={ability}>
                                <input
                                    type="checkbox"
                                    id={`ability-${ability}`}
                                    checked={filterOptions.primaryAbility.includes(ability)}
                                    onChange={(e) => handleFilterChange('primaryAbility', ability, e.target.checked)}
                                />
                                <label htmlFor={`ability-${ability}`}>{formatAbility(ability)}</label>
                            </div>
                        ))}
                    </div>

                    {(filterOptions.hitDice.length > 0 || filterOptions.primaryAbility.length > 0) && (
                        <button className="button button-secondary clear-filters" onClick={clearFilters}>
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Classes List */}
                <div className="classes-list">
                    <div className="list-header">
                        <div className="list-stats">
                            <span>{filteredClasses.length} {filteredClasses.length === 1 ? 'class' : 'classes'} found</span>
                        </div>

                        <div className="sort-controls">
                            <span>Sort by:</span>
                            <button
                                className={`sort-button ${sortBy.field === 'name' ? `sorted-${sortBy.direction}` : ''}`}
                                onClick={() => handleSort('name')}
                            >
                                Name
                            </button>
                            <button
                                className={`sort-button ${sortBy.field === 'updatedAt' ? `sorted-${sortBy.direction}` : ''}`}
                                onClick={() => handleSort('updatedAt')}
                            >
                                Last Updated
                            </button>
                        </div>
                    </div>

                    {filteredClasses.length === 0 ? (
                        <div className="empty-state">
                            <p>No classes found matching your criteria.</p>
                            {(searchTerm || filterOptions.hitDice.length > 0 || filterOptions.primaryAbility.length > 0) && (
                                <button className="button button-secondary" onClick={clearFilters}>
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="class-cards">
                            {filteredClasses.map(cls => (
                                <div className="class-card" key={cls.id}>
                                    <div className="class-card-header">
                                        <h3>{cls.name}</h3>
                                        <div className="card-badges">
                                            <span className="badge badge-hit-dice">{cls.hitDice}</span>
                                            {cls.primaryAbility && (
                                                <span className="badge badge-ability">{formatAbility(cls.primaryAbility)}</span>
                                            )}
                                        </div>
                                    </div>

                                    <p className="class-description">
                                        {cls.description.length > 150
                                            ? `${cls.description.substring(0, 150)}...`
                                            : cls.description}
                                    </p>

                                    <div className="class-meta">
                                        <div className="class-features-count">
                                            <span>{cls.features?.length || 0} features</span>
                                        </div>
                                        <div className="class-updated">
                                            <span>Updated: {formatDate(cls.updatedAt)}</span>
                                        </div>
                                    </div>

                                    <div className="class-actions">
                                        <button
                                            className="button-small"
                                            onClick={() => handleEdit(cls)}
                                            title="Edit"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="button-small"
                                            onClick={() => handleDuplicate(cls)}
                                            title="Duplicate"
                                        >
                                            Duplicate
                                        </button>
                                        <button
                                            className="button-small"
                                            onClick={() => handleExport(cls)}
                                            title="Export"
                                        >
                                            Export
                                        </button>
                                        <button
                                            className="button-small button-danger"
                                            onClick={() => handleDelete(cls)}
                                            title="Delete"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Export Modal */}
            {showExportModal && selectedClass && (
                <ExportModal
                    classData={selectedClass}
                    onClose={() => {
                        setShowExportModal(false);
                        setSelectedClass(null);
                    }}
                />
            )}
        </div>
    );
}

export default ClassManager;