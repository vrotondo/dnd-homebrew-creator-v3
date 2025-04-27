import { useState } from 'react';
import ClassCreator from '../components/creators/character/ClassCreator';

function CharacterCreatorPage() {
    const [creatorType, setCreatorType] = useState(null);

    return (
        <div>
            <h2>Character Creator</h2>
            <p>Build custom character classes, subclasses, races, and backgrounds</p>

            {!creatorType ? (
                <div className="card">
                    <h3 className="card-title">What would you like to create?</h3>
                    <div className="button-group">
                        <button onClick={() => setCreatorType('class')} className="button">Character Class</button>
                        <button className="button button-secondary" disabled>Subclass (Coming Soon)</button>
                        <button className="button button-secondary" disabled>Race (Coming Soon)</button>
                        <button className="button button-secondary" disabled>Background (Coming Soon)</button>
                    </div>
                </div>
            ) : creatorType === 'class' ? (
                <ClassCreator onCancel={() => setCreatorType(null)} />
            ) : (
                <div>Feature coming soon!</div>
            )}
        </div>
    );
}

export default CharacterCreatorPage;