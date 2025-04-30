// src/components/creators/character/BackgroundsList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBackgrounds, deleteBackground } from '../../../utils/storageService';

function BackgroundsList() {
    const [backgrounds, setBackgrounds] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Load backgrounds when component mounts
        loadBackgrounds();
    }, []);

    const loadBackgrounds = () => {
        setLoading(true);
        const savedBackgrounds = getBackgrounds();
        setBackgrounds(savedBackgrounds);
        setLoading(false);
    };

    const handleCreateNew = () => {
        navigate('/character/backgrounds/create');
    };

    const handleEditBackground = (id) => {
        navigate(`/character/backgrounds/edit/${id}`);
    };

    const handleViewBackground = (id) => {
        navigate(`/character/backgrounds/view/${id}`);
    };

    const handleDeleteBackground = (id) => {
        if (window.confirm('Are you sure you want to delete this background?')) {
            const success = deleteBackground(id);
            if (success) {
                loadBackgrounds(); // Refresh the list
            } else {
                alert('Failed to delete background');
            }
        }
    };

    const getSkillsString = (skills) => {
        if (!skills || skills.length === 0) return 'None';
        return skills.join(', ');
    };

    return (
        <div className="backgrounds-list-container">
            <div className="backgrounds-header">
                <h2>Your Custom Backgrounds</h2>
                <button
                    className="button"
                    onClick={handleCreateNew}
                >
                    Create New Background
                </button>
            </div>

            {loading ? (
                <div className="loading">Loading backgrounds...</div>
            ) : backgrounds.length === 0 ? (
                <div className="empty-state">
                    <p>You haven't created any custom backgrounds yet.</p>
                    <button
                        className="button"
                        onClick={handleCreateNew}
                    >
                        Create Your First Background
                    </button>
                </div>
            ) : (
                <div className="backgrounds-grid">
                    {backgrounds.map(background => (
                        <div key={background.id} className="background-card">
                            <h3>{background.name}</h3>
                            <p className="background-description">
                                {background.description.length > 100
                                    ? `${background.description.substring(0, 100)}...`
                                    : background.description}
                            </p>
                            <div className="background-details">
                                <div className="detail-item">
                                    <span className="label">Skills:</span>
                                    <span className="value">{getSkillsString(background.skillProficiencies)}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Feature:</span>
                                    <span className="value">{background.feature?.name || 'None'}</span>
                                </div>
                            </div>
                            <div className="background-card-actions">
                                <button
                                    className="button"
                                    onClick={() => handleEditBackground(background.id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="button button-secondary"
                                    onClick={() => handleViewBackground(background.id)}
                                >
                                    View
                                </button>
                                <button
                                    className="button button-danger"
                                    onClick={() => handleDeleteBackground(background.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BackgroundsList;