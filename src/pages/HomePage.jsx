function HomePage() {
    return (
        <div>
            <h2>Welcome to D&D Homebrew Creator</h2>
            <p>Create, manage, and export your own D&D 5E homebrew content while ensuring SRD compliance.</p>

            <div className="card">
                <h3 className="card-title">Getting Started</h3>
                <p>Choose one of the creator tools to begin crafting your homebrew content. All your creations
                    will be saved locally in your browser and can be exported in various formats.</p>
            </div>

            <h3>Available Creators</h3>
            <div className="grid">
                <div className="card">
                    <h3 className="card-title">Character Creator</h3>
                    <p>Build custom character classes, subclasses, races, and backgrounds</p>
                    <a href="/character-creator" className="button">Go to Character Creator</a>
                </div>

                <div className="card">
                    <h3 className="card-title">More Coming Soon</h3>
                    <p>We're working on additional creators for monsters, items, spells, and more!</p>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
