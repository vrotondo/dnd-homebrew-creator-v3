// src/components/creators/character/SubclassPreview.jsx
import { getSpellById, formatSpellLevel } from '../../../utils/spellData';

function SubclassPreview({ subclassData, parentClass }) {
    if (!subclassData || !parentClass) {
        return <div className="empty-state">Please complete the previous steps to preview your subclass.</div>;
    }

    // Get the subclass type name based on parent class
    const getSubclassTypeName = () => {
        const className = parentClass.name.toLowerCase();

        switch (className) {
            case 'barbarian': return 'Primal Path';
            case 'bard': return 'Bard College';
            case 'cleric': return 'Divine Domain';
            case 'druid': return 'Druid Circle';
            case 'fighter': return 'Martial Archetype';
            case 'monk': return 'Monastic Tradition';
            case 'paladin': return 'Sacred Oath';
            case 'ranger': return 'Ranger Archetype';
            case 'rogue': return 'Roguish Archetype';
            case 'sorcerer': return 'Sorcerous Origin';
            case 'warlock': return 'Otherworldly Patron';
            case 'wizard': return 'Arcane Tradition';
            default: return 'Subclass';
        }
    };

    // Group features by level
    const featuresByLevel = {};
    subclassData.features.forEach(feature => {
        if (!featuresByLevel[feature.level]) {
            featuresByLevel[feature.level] = [];
        }
        featuresByLevel[feature.level].push(feature);
    });

    // Get formatted subclass spells
    const getFormattedSpells = () => {
        if (!subclassData.spells || !Array.isArray(subclassData.spells)) return null;

        return subclassData.spells.map((levelData, index) => {
            const spellObjects = levelData.spells
                .map(id => getSpellById(id))
                .filter(Boolean);

            if (spellObjects.length === 0) return null;

            return {
                classLevel: levelData.classLevel,
                spellLevel: levelData.spellLevel,
                spells: spellObjects
            };
        }).filter(Boolean);
    };

    const spellsByLevel = getFormattedSpells();

    return (
        <div className="subclass-preview">
            <h3 className="subclass-title">{subclassData.name}</h3>
            <p className="subclass-type">({getSubclassTypeName()})</p>

            <div className="subclass-description">
                {subclassData.description}
            </div>

            {subclassData.flavorText && (
                <div className="subclass-flavor">
                    <em>{subclassData.flavorText}</em>
                </div>
            )}

            {/* Subclass Spells */}
            {spellsByLevel && spellsByLevel.length > 0 && (
                <div className="subclass-spells-preview">
                    <h4>{subclassData.name} Spells</h4>
                    <p>
                        You gain access to the following spells at the listed {parentClass.name} levels.
                        Once you gain access to a spell, it is always prepared and doesn't count against
                        the number of spells you can prepare each day.
                    </p>

                    <table className="spells-table">
                        <thead>
                            <tr>
                                <th>{parentClass.name} Level</th>
                                <th>Spells</th>
                            </tr>
                        </thead>
                        <tbody>
                            {spellsByLevel.map((levelData, index) => (
                                <tr key={index}>
                                    <td>{levelData.classLevel}</td>
                                    <td>
                                        {levelData.spells.map(spell => spell.name).join(', ')}
                                        {' '}
                                        <span className="spell-level-note">
                                            ({formatSpellLevel(levelData.spellLevel)})
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Subclass Features */}
            <div className="subclass-features-preview">
                <h4>Subclass Features</h4>

                {Object.keys(featuresByLevel)
                    .sort((a, b) => parseInt(a) - parseInt(b))
                    .map(level => (
                        <div key={level} className="feature-level">
                            <h5>Level {level}</h5>

                            {featuresByLevel[level].map((feature, index) => (
                                <div key={index} className="feature">
                                    <h6>{feature.name}</h6>
                                    <p>{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default SubclassPreview;