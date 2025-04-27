// src/pages/CharacterCreatorPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClassCreator from '../components/creators/character/ClassCreator';
import { getClasses, deleteClass } from '../utils/storageService';

function CharacterCreatorPage() {
    const [creatorType, setCreatorType] = useState(null);
    const [editingItemId, setEditingItemId] = useState(null);
    const [savedClasses, setSavedClasses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Load saved classes
    useEffect(() => {
        loadSavedClasses();
    }, []);

    const loadSavedClasses = () => {
        const classes = getClasses({
            sortBy: { field: 'updatedAt', direction: 'desc' }
        });
        setSavedClasses(classes);
    };

    // Filter classes based on search term
    const filteredClasses = savedClasses.filter(cls =>
        cls.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = () => {
        // Refresh the list after saving
        loadSavedClasses();
        setCreatorType(null);
        setEditingItemId(null);
    };

    const handleEdit = (id) => {
        setEditingItemId(id);
        setCreatorType('class');
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this class?')) {
            deleteClass(id);
            loadSavedClasses();
        }
    };

    const handleCancel = () => {
        setCreatorType(null);
        setEditingItemId(null);
    };

    const renderCreatorSelection = () => (
        <div>
            <div className="section-header">
                <h2>Character Creator</h2>
                <p>Build custom character classes, subclasses, races, and backgrounds</p>
            </div>

            <div className="creator-selection">
                <h3>What would you like to create?</h3>
                <div className="button-group">
                    <button onClick={() => setCreatorType('class')} className="button">
                        Character Class
                    </button>
                    <button className="button button-secondary" disabled>
                        Subclass (Coming Soon)
                    </button>
                    <button className="button button-secondary" disabled>
                        Race (Coming Soon)
                    </button>
                    <button className="button button-secondary" disabled>
                        Background (Coming Soon)
                    </button>
                </div>
            </div>

            <div className="saved-content">
                <div className="saved-header">
                    <h3>Your Saved Classes</h3>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search classes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-control"
                        />
                    </div>
                </div>

                {filteredClasses.length > 0 ? (
                    <div className="saved-grid">
                        {filteredClasses.map(classItem => (
                            <div key={classItem.id} className="saved-card">
                                <div className="saved-card-header">
                                    <h4>{classItem.name}</h4>
                                    <div className="saved-card-actions">
                                        <button
                                            className="button-small"
                                            onClick={() => handleEdit(classItem.id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="button-small button-danger"
                                            onClick={() => handleDelete(classItem.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <p className="saved-card-description">
                                    {classItem.description.length > 120
                                        ? `${classItem.description.substring(0, 120)}...`
                                        : classItem.description}
                                </p>
                                <div className="saved-card-footer">
                                    <div className="saved-card-meta">
                                        <span>Hit Die: {classItem.hitDice}</span>
                                        <span>Primary: {formatAbility(classItem.primaryAbility)}</span>
                                    </div>
                                    <div className="saved-card-date">
                                        Updated: {formatDate(classItem.updatedAt)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        {searchTerm ? (
                            <p>No classes found matching "{searchTerm}"</p>
                        ) : (
                            <p>No classes created yet. Create your first class to get started!</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    // Helper functions
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

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <div className="page-container">
            {!creatorType ? (
                renderCreatorSelection()
            ) : creatorType === 'class' ? (
                <ClassCreator
                    itemId={editingItemId}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            ) : (
                <div className="coming-soon">
                    <h3>Coming Soon</h3>
                    <p>This creator is under development.</p>
                    <button className="button" onClick={handleCancel}>
                        Back to Selection
                    </button>
                </div>
            )}
        </div>
    );
}

export default CharacterCreatorPage;