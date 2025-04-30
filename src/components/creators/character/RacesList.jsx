// src/components/creators/character/RacesList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRaces } from '../../../utils/storageService';

function RacesList() {
    const [races, setRaces] = useState([]);

    useEffect(() => {
        // Load races when component mounts
        const loadRaces = () => {
            const savedRaces = getRaces(); // Use getRaces instead of getAllRaces
            setRaces(savedRaces);
        };

        loadRaces();
    }, []);

    const handleCreateNew = () => {
        navigate('/character/races/create');
    };

    const handleEditRace = (id) => {
        navigate(`/character/races/edit/${id}`);
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

            {races.length === 0 ? (
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
                                    onClick={() => navigate(`/character/races/view/${race.id}`)}
                                >
                                    View
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