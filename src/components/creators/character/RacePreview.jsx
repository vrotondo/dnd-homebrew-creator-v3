// src/components/creators/character/RacePreview.jsx
function RacePreview({ raceData }) {
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

    // Format ability score increases
    const formatAbilityScoreIncreases = (increases) => {
        if (!increases) return 'None';

        const increaseText = Object.entries(increases)
            .filter(([_, value]) => value > 0)
            .map(([ability, value]) => `${getAbilityName(ability)} +${value}`)
            .join(', ');

        return increaseText || 'None';
    };

    return (
        <div className="race-preview-content">
            <h3 className="race-title">{raceData.name}</h3>

            <div className="race-description">
                {raceData.description}
            </div>

            <div className="race-traits-summary">
                <div className="trait-summary">
                    <h4>Ability Score Increase</h4>
                    <p>{formatAbilityScoreIncreases(raceData.abilityScoreIncreases)}</p>
                </div>

                <div className="trait-summary">
                    <h4>Age</h4>
                    <p>
                        {raceData.age.maturity && <span>{raceData.age.maturity}. </span>}
                        {raceData.age.lifespan && <span>{raceData.age.lifespan}</span>}
                    </p>
                </div>

                <div className="trait-summary">
                    <h4>Alignment</h4>
                    <p>{raceData.alignment || 'No particular alignment tendency.'}</p>
                </div>

                <div className="trait-summary">
                    <h4>Size</h4>
                    <p>{raceData.size}</p>
                </div>

                <div className="trait-summary">
                    <h4>Speed</h4>
                    <p>Your base walking speed is {raceData.speed} feet.</p>
                </div>

                <div className="trait-summary">
                    <h4>Languages</h4>
                    <p>You can speak, read, and write {raceData.languages.join(', ')}.
                        {raceData.extraLanguages && <span> {raceData.extraLanguages}</span>}
                    </p>
                </div>

                <div className="trait-summary">
                    <h4>Vision</h4>
                    <p>
                        {raceData.vision.darkvision
                            ? `You have darkvision with a range of ${raceData.vision.range} feet.`
                            : 'You have normal vision.'}
                    </p>
                </div>
            </div>

            {raceData.traits.length > 0 && (
                <div className="race-traits">
                    <h4>Traits</h4>

                    {raceData.traits.map((trait, index) => (
                        <div key={index} className="race-trait">
                            <h5>{trait.name}</h5>
                            <p>{trait.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {raceData.subraces.length > 0 && (
                <div className="race-subraces">
                    <h4>Subraces</h4>

                    <p>The following subraces are available to {raceData.name}s:</p>

                    {raceData.subraces.map((subrace, index) => (
                        <div key={index} className="subrace">
                            <h5>{subrace.name}</h5>
                            <p>{subrace.description}</p>

                            <div className="subrace-details">
                                <p><strong>Ability Score Increase:</strong> {formatAbilityScoreIncreases(subrace.abilityScoreIncreases)}</p>

                                {subrace.traits.length > 0 && (
                                    <div className="subrace-traits">
                                        {subrace.traits.map((trait, traitIndex) => (
                                            <div key={traitIndex} className="subrace-trait">
                                                <h6>{trait.name}</h6>
                                                <p>{trait.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default RacePreview;