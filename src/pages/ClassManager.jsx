// src/pages/ClassManager.jsx - Updated with correct routes for new ClassCreator
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    getClasses, deleteClass, duplicateClass,
    getSubclasses, deleteSubclass, duplicateSubclass,
    getClassById
} from '../utils/storageService';
import ExportModal from '../components/export/ExportModal';

function ClassManager() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('classes'); // 'classes' or 'subclasses'
    const [classes, setClasses] = useState([]);
    const [subclasses, setSubclasses] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState({ field: 'updatedAt', direction: 'desc' });
    const [selectedItem, setSelectedItem] = useState(null);
    const [showExportModal, setShowExportModal] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
        classes: {
            hitDice: [],
            primaryAbility: []
        },
        subclasses: {
            parentClass: []
        }
    });

    // Load data on component mount and when tab changes
    useEffect(() => {
        loadData();
    }, [activeTab]);

    // Load classes and subclasses
    const loadData = () => {
        if (activeTab === 'classes') {
            loadClasses();
        } else {
            loadSubclasses();
        }
    };

    // Apply filters and search
    const applyFilters = (items, search, filters, type) => {
        let filtered = items;

        // Apply search filter
        if (search) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
            );
        }

        // Apply type-specific filters
        if (type === 'classes') {
            if (filters.hitDice && filters.hitDice.length > 0) {
                filtered = filtered.filter(item => filters.hitDice.includes(item.hitDice));
            }
            if (filters.primaryAbility && filters.primaryAbility.length > 0) {
                filtered = filtered.filter(item => filters.primaryAbility.includes(item.primaryAbility));
            }
        } else if (type === 'subclasses') {
            if (filters.parentClass && filters.parentClass.length > 0) {
                filtered = filtered.filter(item => filters.parentClass.includes(item.parentClass));
            }
        }

        setFilteredItems(filtered);
    };

    // Load classes
    const loadClasses = () => {
        const allClasses = getClasses({
            sortBy: sortBy
        });
        setClasses(allClasses);
        applyFilters(allClasses, searchTerm, filterOptions.classes, 'classes');

        // Extract filter options
        const hitDiceOptions = [...new Set(allClasses.map(c => c.hitDice))];
        const primaryAbilityOptions = [...new Set(allClasses.map(c => c.primaryAbility).filter(Boolean))];

        setFilterOptions(prev => ({
            ...prev,
            classes: {
                ...prev.classes,
                hitDice: prev.classes.hitDice.filter(h => hitDiceOptions.includes(h)),
                primaryAbility: prev.classes.primaryAbility.filter(p => primaryAbilityOptions.includes(p)),
                hitDiceOptions,
                primaryAbilityOptions
            }
        }));
    };

    // Load subclasses
    const loadSubclasses = () => {
        const allSubclasses = getSubclasses({
            sortBy: sortBy
        });
        setSubclasses(allSubclasses);
        applyFilters(allSubclasses, searchTerm, filterOptions.subclasses, 'subclasses');

        // Extract parent class options
        const parentClassIds = [...new Set(allSubclasses.map(s => s.parentClass).filter(Boolean))];
        const allClasses = getClasses();
        const parentClassOptions = parentClassIds.map(id => {
            const parent = allClasses.find(c => c.id === id);
            return parent ? { id, name: parent.name } : null;
        }).filter(Boolean);

        setFilterOptions(prev => ({
            ...prev,
            subclasses: {
                ...prev.subclasses,
                parentClass: prev.subclasses.parentClass.filter(p => parentClassIds.includes(p)),
                parentClassOptions
            }
        }));
    };

    // Handle search
    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        applyFilters(
            activeTab === 'classes' ? classes : subclasses,
            term,
            activeTab === 'classes' ? filterOptions.classes : filterOptions.subclasses,
            activeTab
        );
    };

    // Handle filter changes
    const handleFilterChange = (filterType, value, checked) => {
        const updatedFilters = { ...filterOptions[activeTab] };

        if (checked) {
            updatedFilters[filterType] = [...updatedFilters[filterType], value];
        } else {
            updatedFilters[filterType] = updatedFilters[filterType].filter(v => v !== value);
        }

        setFilterOptions(prev => ({
            ...prev,
            [activeTab]: updatedFilters
        }));

        applyFilters(
            activeTab === 'classes' ? classes : subclasses,
            searchTerm,
            updatedFilters,
            activeTab
        );
    };

    // Handle sorting
    const handleSort = (field) => {
        const direction = sortBy.field === field && sortBy.direction === 'asc' ? 'desc' : 'asc';
        const newSortBy = { field, direction };
        setSortBy(newSortBy);

        if (activeTab === 'classes') {
            // Re-sort the classes
            const allClasses = getClasses({ sortBy: newSortBy });
            setClasses(allClasses);
            applyFilters(allClasses, searchTerm, filterOptions.classes, 'classes');
        } else {
            // Re-sort the subclasses
            const allSubclasses = getSubclasses({ sortBy: newSortBy });
            setSubclasses(allSubclasses);
            applyFilters(allSubclasses, searchTerm, filterOptions.subclasses, 'subclasses');
        }
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        if (activeTab === 'classes') {
            setFilterOptions(prev => ({
                ...prev,
                classes: {
                    ...prev.classes,
                    hitDice: [],
                    primaryAbility: []
                }
            }));
            applyFilters(classes, '', { hitDice: [], primaryAbility: [] }, 'classes');
        } else {
            setFilterOptions(prev => ({
                ...prev,
                subclasses: {
                    ...prev.subclasses,
                    parentClass: []
                }
            }));
            applyFilters(subclasses, '', { parentClass: [] }, 'subclasses');
        }
    };

    // Handle item actions
    const handleEdit = (item) => {
        if (activeTab === 'classes') {
            // Updated to use new route structure
            navigate(`/classes/${item.id}/edit`);
        } else {
            // Keep subclass routing as-is for now (can be updated later)
            navigate(`/character-creator/subclass/${item.id}`);
        }
    };

    const handleDelete = (item) => {
        if (activeTab === 'classes') {
            if (window.confirm(`Are you sure you want to delete "${item.name}"? This cannot be undone.`)) {
                deleteClass(item.id);
                loadClasses();
            }
        } else {
            if (window.confirm(`Are you sure you want to delete "${item.name}"? This cannot be undone.`)) {
                deleteSubclass(item.id);
                loadSubclasses();
            }
        }
    };

    const handleDuplicate = (item) => {
        if (activeTab === 'classes') {
            duplicateClass(item);
            loadClasses();
        } else {
            duplicateSubclass(item);
            loadSubclasses();
        }
    };

    const handleExport = (item) => {
        setSelectedItem(item);
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

    // Get parent class name
    const getParentClassName = (parentClassId) => {
        if (!parentClassId) return 'Unknown';
        const parent = getClassById(parentClassId);
        return parent ? parent.name : 'Unknown';
    };

    return (
        <div className="class-manager">
            <div className="page-header">
                <h1>Manage Content</h1>
                <div className="header-actions">
                    {activeTab === 'classes' ? (
                        // Updated to use new route structure
                        <Link to="/classes/create" className="button">Create New Class</Link>
                    ) : (
                        // Keep subclass routing as-is for now (can be updated later)
                        <Link to="/character-creator/subclass/new" className="button">Create New Subclass</Link>
                    )}
                </div>
            </div>

            <div className="tab-navigation">
                <button
                    className={`tab-button ${activeTab === 'classes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('classes')}
                >
                    Classes
                </button>
                <button
                    className={`tab-button ${activeTab === 'subclasses' ? 'active' : ''}`}
                    onClick={() => setActiveTab('subclasses')}
                >
                    Subclasses
                </button>
            </div>

            <div className="content-manager">
                {/* Search and Sort Controls */}
                <div className="controls">
                    <div className="search-controls">
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchTerm}
                            onChange={handleSearch}
                            className="search-input"
                        />
                    </div>

                    <div className="sort-controls">
                        <label>Sort by:</label>
                        <select
                            value={`${sortBy.field}-${sortBy.direction}`}
                            onChange={(e) => {
                                const [field, direction] = e.target.value.split('-');
                                handleSort(field);
                            }}
                        >
                            <option value="updatedAt-desc">Recently Updated</option>
                            <option value="updatedAt-asc">Oldest First</option>
                            <option value="name-asc">Name A-Z</option>
                            <option value="name-desc">Name Z-A</option>
                            <option value="createdAt-desc">Recently Created</option>
                            <option value="createdAt-asc">Oldest Created</option>
                        </select>
                    </div>
                </div>

                {/* Filters */}
                <div className="filters">
                    {activeTab === 'classes' ? (
                        <>
                            <div className="filter-group">
                                <h3>Hit Die</h3>
                                {filterOptions.classes.hitDiceOptions?.map(hitDie => (
                                    <div className="filter-option" key={hitDie}>
                                        <input
                                            type="checkbox"
                                            id={`hitdie-${hitDie}`}
                                            checked={filterOptions.classes.hitDice.includes(hitDie)}
                                            onChange={(e) => handleFilterChange('hitDice', hitDie, e.target.checked)}
                                        />
                                        <label htmlFor={`hitdie-${hitDie}`}>{hitDie}</label>
                                    </div>
                                ))}
                            </div>

                            <div className="filter-group">
                                <h3>Primary Ability</h3>
                                {filterOptions.classes.primaryAbilityOptions?.map(ability => (
                                    <div className="filter-option" key={ability}>
                                        <input
                                            type="checkbox"
                                            id={`ability-${ability}`}
                                            checked={filterOptions.classes.primaryAbility.includes(ability)}
                                            onChange={(e) => handleFilterChange('primaryAbility', ability, e.target.checked)}
                                        />
                                        <label htmlFor={`ability-${ability}`}>{formatAbility(ability)}</label>
                                    </div>
                                ))}
                            </div>

                            {(filterOptions.classes.hitDice.length > 0 || filterOptions.classes.primaryAbility.length > 0) && (
                                <button className="button button-secondary clear-filters" onClick={clearFilters}>
                                    Clear Filters
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="filter-group">
                                <h3>Parent Class</h3>
                                {filterOptions.subclasses.parentClassOptions?.map(parent => (
                                    <div className="filter-option" key={parent.id}>
                                        <input
                                            type="checkbox"
                                            id={`parent-${parent.id}`}
                                            checked={filterOptions.subclasses.parentClass.includes(parent.id)}
                                            onChange={(e) => handleFilterChange('parentClass', parent.id, e.target.checked)}
                                        />
                                        <label htmlFor={`parent-${parent.id}`}>{parent.name}</label>
                                    </div>
                                ))}
                            </div>

                            {filterOptions.subclasses.parentClass.length > 0 && (
                                <button className="button button-secondary clear-filters" onClick={clearFilters}>
                                    Clear Filters
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* Items List */}
                <div className="content-list">
                    <div className="list-header">
                        <div className="list-stats">
                            <span>
                                {filteredItems.length} {filteredItems.length === 1 ?
                                    (activeTab === 'classes' ? 'class' : 'subclass') :
                                    (activeTab === 'classes' ? 'classes' : 'subclasses')}
                            </span>
                        </div>
                    </div>

                    {filteredItems.length === 0 ? (
                        <div className="empty-state">
                            <h3>No {activeTab} found</h3>
                            <p>
                                {searchTerm || filterOptions[activeTab].hitDice?.length > 0 || filterOptions[activeTab].primaryAbility?.length > 0 || filterOptions[activeTab].parentClass?.length > 0
                                    ? 'Try adjusting your search or filters.'
                                    : `You haven't created any ${activeTab} yet.`
                                }
                            </p>
                            {activeTab === 'classes' ? (
                                <Link to="/classes/create" className="button">
                                    Create Your First Class
                                </Link>
                            ) : (
                                <Link to="/character-creator/subclass/new" className="button">
                                    Create Your First Subclass
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="items-grid">
                            {filteredItems.map(item => (
                                <div className="item-card" key={item.id}>
                                    <div className="card-header">
                                        <h3 className="card-title">{item.name}</h3>
                                        <div className="card-badges">
                                            {activeTab === 'classes' ? (
                                                <>
                                                    <span className="badge badge-hit-dice">{item.hitDice}</span>
                                                    {item.primaryAbility && (
                                                        <span className="badge badge-ability">{formatAbility(item.primaryAbility)}</span>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="badge badge-parent-class">{getParentClassName(item.parentClass)}</span>
                                            )}
                                        </div>
                                    </div>

                                    <p className="card-description">
                                        {item.description.length > 150
                                            ? `${item.description.substring(0, 150)}...`
                                            : item.description}
                                    </p>

                                    <div className="card-meta">
                                        <div className="card-features-count">
                                            <span>{item.features?.length || 0} features</span>
                                        </div>
                                        <div className="card-updated">
                                            <span>Updated: {formatDate(item.updatedAt)}</span>
                                        </div>
                                    </div>

                                    <div className="card-actions">
                                        <button
                                            className="button-small"
                                            onClick={() => handleEdit(item)}
                                            title="Edit"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="button-small"
                                            onClick={() => handleDuplicate(item)}
                                            title="Duplicate"
                                        >
                                            Duplicate
                                        </button>
                                        <button
                                            className="button-small"
                                            onClick={() => handleExport(item)}
                                            title="Export"
                                        >
                                            Export
                                        </button>
                                        <button
                                            className="button-small button-danger"
                                            onClick={() => handleDelete(item)}
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
            {showExportModal && selectedItem && (
                <ExportModal
                    classData={selectedItem}
                    onClose={() => {
                        setShowExportModal(false);
                        setSelectedItem(null);
                    }}
                />
            )}
        </div>
    );
}

export default ClassManager;