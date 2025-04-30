// src/components/creators/character/RacePreview.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRaceById } from '../../../utils/storageService';

function RacePreview({ raceData: propRaceData }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [raceData, setRaceData] = useState(propRaceData || null);
    const [loading, setLoading] = useState(!propRaceData);

    useEffect(() => {
        // If no props were provided, try to load by ID
        if (!propRaceData && id) {
            setLoading(true);
            const race = getRaceById(id);
            if (race) {
                setRaceData(race);
            } else {
                // Race not found
                alert('Race not found');
                navigate('/character/races');
            }
            setLoading(false);
        }
    }, [id, propRaceData, navigate]);

    if (loading) {
        return <div className="loading">Loading race...</div>;
    }

    if (!raceData) {
        return <div className="error">Race not found</div>;
    }

    // Helper function for ability names
    function getAbilityName(ability) {
        const abilities = {
            'STR': 'Strength',
            'DEX': 'Dexterity',
            'CON': 'Constitution',
            'INT': 'Intelligence',
            'WIS': 'Wisdom',
            'CHA': 'Charisma'
        };
        return abilities[ability] || ability;
    }

    return (
        <div className="race-preview-container">
            <div className="preview-header">
                <h2>{raceData.name}</h2>
                <button
                    className="button button-secondary"
                    onClick={() => navigate('/character/races')}
                >
                    Back to Races
                </button>
            </div>

            <div className="race-details">
                <div className="race-description">
                    <h3>Description</h3>
                    <p>{raceData.description}</p>
                </div>

                <div className="race-basics">
                    <h3>Basic Traits</h3>
                    <div className="trait-grid">
                        <div className="trait">
                            <span className="trait-label">Size:</span>
                            <span className="trait-value">{raceData.size}</span>
                        </div>
                        <div className="trait">
                            <span className="trait-label">Speed:</span>
                            <span className="trait-value">{raceData.speed} ft.</span>
                        </div>
                        {raceData.vision && raceData.vision.darkvision && (
                            <div className="trait">
                                <span className="trait-label">Darkvision:</span>
                                <span className="trait-value">{raceData.vision.range} ft.</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="race-ability-scores">
                    <h3>Ability Score Increases</h3>
                    <div className="ability-grid">
                        {Object.entries(raceData.abilityScoreIncreases).map(([ability, value]) => (
                            value > 0 && (
                                <div key={ability} className="ability">
                                    <span className="ability-name">{getAbilityName(ability)}:</span>
                                    <span className="ability-value">+{value}</span>
                                </div>
                            )
                        ))}
                    </div>
                </div>

                <div className="race-languages">
                    <h3>Languages</h3>
                    <p>{raceData.languages.join(', ')}</p>
                    {raceData.extraLanguages && (
                        <p className="extra-languages">{raceData.extraLanguages}</p>
                    )}
                </div>

                {raceData.traits && raceData.traits.length > 0 && (
                    <div className="race-racial-traits">
                        <h3>Racial Traits</h3>
                        <div className="traits-list">
                            {raceData.traits.map((trait, index) => (
                                <div key={index} className="trait-card">
                                    <h4>{trait.name}</h4>
                                    <p>{trait.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {raceData.subraces && raceData.subraces.length > 0 && (
                    <div className="race-subraces">
                        <h3>Subraces</h3>
                        <div className="subraces-list">
                            {raceData.subraces.map((subrace, index) => (
                                <div key={index} className="subrace-card">
                                    <h4>{subrace.name}</h4>
                                    <p>{subrace.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RacePreview;