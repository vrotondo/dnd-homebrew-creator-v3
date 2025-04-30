// src/components/creators/character/background/SkillsSelector.jsx
import { useState } from 'react';

function SkillsSelector({ selectedSkills = [], onChange, maxSkills = 2 }) {
    const [skills] = useState([
        'Acrobatics',
        'Animal Handling',
        'Arcana',
        'Athletics',
        'Deception',
        'History',
        'Insight',
        'Intimidation',
        'Investigation',
        'Medicine',
        'Nature',
        'Perception',
        'Performance',
        'Persuasion',
        'Religion',
        'Sleight of Hand',
        'Stealth',
        'Survival'
    ]);

    const handleSkillChange = (skill, checked) => {
        let updatedSkills;

        if (checked) {
            // Don't add if max reached
            if (selectedSkills.length >= maxSkills) {
                return;
            }
            updatedSkills = [...selectedSkills, skill];
        } else {
            updatedSkills = selectedSkills.filter(s => s !== skill);
        }

        onChange(updatedSkills);
    };

    return (
        <div className="skills-selector">
            <p className="form-note">Select up to {maxSkills} skills. Most backgrounds provide 2 skills.</p>

            <div className="skills-grid">
                {skills.map(skill => (
                    <div key={skill} className="skill-item checkbox-item">
                        <input
                            type="checkbox"
                            id={`skill-${skill}`}
                            checked={selectedSkills.includes(skill)}
                            onChange={(e) => handleSkillChange(skill, e.target.checked)}
                            disabled={!selectedSkills.includes(skill) && selectedSkills.length >= maxSkills}
                        />
                        <label htmlFor={`skill-${skill}`} className={selectedSkills.includes(skill) ? 'selected' : ''}>
                            {skill}
                        </label>
                    </div>
                ))}
            </div>

            {selectedSkills.length > 0 && (
                <div className="selected-skills">
                    <p>Selected skills: {selectedSkills.join(', ')}</p>
                </div>
            )}
        </div>
    );
}

export default SkillsSelector;