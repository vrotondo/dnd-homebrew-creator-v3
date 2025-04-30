// src/components/creators/character/RacesList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRaces, deleteRace, duplicateRace } from '../../../utils/storageService';

function RacesList() {
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Load races when component mounts
        loadRaces();
    }, []);

    const loadRaces = () => {
        setLoading(true);
        // Use getRaces instead of getAllRaces
        const savedRaces = getRaces();
        setRaces(savedRaces);
        setLoading(false);
    };

    const handleCreateNew = () => {
        navigate('/character/races/create');
    };

    const handleEditRace = (id) => {
        navigate(`/character/races/edit/${id}`);
    };

    const handleViewRace = (id) => {
        navigate(`/character/races/view/${id}`);
    };

    const handleDeleteRace = (id) => {
        if (window.confirm('Are you sure you want to delete this race?')) {
            const success = deleteRace(id);
            if (success) {
                loadRaces(); // Refresh the list
            } else {
                alert('Failed to delete race');
            }
        }
    };

    const handleDuplicateRace = (id) => {
        const race = races.find(r => r.id === id);
        if (race) {
            const newId = duplicateRace(race);
            if (newId) {
                loadRaces(); // Refresh the list
                alert(`Race ${race.name} duplicated successfully`);
            } else {
                alert('Failed to duplicate race');
            }
        }
    };

    return (
        <div className="races-list-container">
            <div className="races-header">
                <h2>Your Custom Races</h2>
                <button
                    className="button"
                    onClick={handleCreateNew}
                >
                    Create New Race
                </button>
            </div>

            {loading ? (
                <div className="loading">Loading races...</div>
            ) : races.length === 0 ? (
                <div className="empty-state">
                    <p>You haven't created any custom races yet.</p>
                    <button
                        className="button"
                        onClick={handleCreateNew}
                    >
                        Create Your First Race
                    </button>
                </div>
            ) : (
                <div className="races-grid">
                    {races.map(race => (
                        <div key={race.id} className="race-card">
                            <h3>{race.name}</h3>
                            <p className="race-description">
                                {race.description.length > 100
                                    ? `${race.description.substring(0, 100)}...`
                                    : race.description}
                            </p>
                            <div className="race-traits">
                                <span><strong>Size:</strong> {race.size}</span>
                                <span><strong>Speed:</strong> {race.speed}ft</span>
                            </div>
                            <div className="race-card-actions">
                                <button
                                    className="button"
                                    onClick={() => handleEditRace(race.id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="button button-secondary"
                                    onClick={() => handleViewRace(race.id)}
                                >
                                    View
                                </button>
                                <button
                                    className="button button-secondary"
                                    onClick={() => handleDuplicateRace(race.id)}
                                >
                                    Duplicate
                                </button>
                                <button
                                    className="button button-danger"
                                    onClick={() => handleDeleteRace(race.id)}
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

export default RacesList;