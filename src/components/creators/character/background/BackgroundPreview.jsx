// src/components/creators/character/background/BackgroundPreview.jsx
import React from 'react';

function BackgroundPreview({ backgroundData }) {
    if (!backgroundData) {
        return <div className="loading">No background data available</div>;
    }

    const {
        name,
        description,
        skillProficiencies,
        toolProficiencies,
        languages,
        equipment,
        feature,
        suggestedCharacteristics,
        suggestedNames
    } = backgroundData;

    // Helper function to render a list of items
    const renderList = (items, emptyText = "None") => {
        if (!items || items.length === 0) {
            return <p className="empty-list">{emptyText}</p>;
        }

        return (
            <ul className="preview-list">
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        );
    };

    // Helper function to render personality traits, ideals, bonds, and flaws
    const renderCharacteristicTable = (type, items, title) => {
        if (!items || items.length === 0) {
            return null;
        }

        return (
            <div className="characteristic-table">
                <h4>{title}</h4>
                <table>
                    <thead>
                        <tr>
                            <th>d{items.length}</th>
                            <th>{title}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="background-preview">
            <header className="background-header">
                <h2>{name || "Unnamed Background"}</h2>
            </header>

            <section className="background-description">
                <p>{description || "No description provided."}</p>
            </section>

            <section className="background-proficiencies">
                <h3>Proficiencies</h3>

                <div className="proficiency-group">
                    <h4>Skill Proficiencies</h4>
                    {renderList(skillProficiencies)}
                </div>

                {(toolProficiencies && toolProficiencies.length > 0) && (
                    <div className="proficiency-group">
                        <h4>Tool Proficiencies</h4>
                        {renderList(toolProficiencies)}
                    </div>
                )}

                {(languages && languages.length > 0) && (
                    <div className="proficiency-group">
                        <h4>Languages</h4>
                        {renderList(languages)}
                    </div>
                )}
            </section>

            {(equipment && equipment.length > 0) && (
                <section className="background-equipment">
                    <h3>Equipment</h3>
                    <p>You start with the following equipment, in addition to the equipment granted by your class:</p>
                    {renderList(equipment)}
                </section>
            )}

            {(feature && feature.name) && (
                <section className="background-feature">
                    <h3>Feature: {feature.name}</h3>
                    <p>{feature.description || "No feature description provided."}</p>
                </section>
            )}

            {suggestedCharacteristics && (
                <section className="background-characteristics">
                    <h3>Suggested Characteristics</h3>

                    {renderCharacteristicTable('personalityTraits', suggestedCharacteristics.personalityTraits, 'Personality Traits')}
                    {renderCharacteristicTable('ideals', suggestedCharacteristics.ideals, 'Ideals')}
                    {renderCharacteristicTable('bonds', suggestedCharacteristics.bonds, 'Bonds')}
                    {renderCharacteristicTable('flaws', suggestedCharacteristics.flaws, 'Flaws')}
                </section>
            )}

            {(suggestedNames && suggestedNames.length > 0) && (
                <section className="background-names">
                    <h3>Suggested Names</h3>
                    {renderList(suggestedNames)}
                </section>
            )}
        </div>
    );
}

export default BackgroundPreview;