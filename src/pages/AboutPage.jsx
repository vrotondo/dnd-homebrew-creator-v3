function AboutPage() {
    return (
        <div>
            <h2>About D&D Homebrew Creator</h2>

            <div className="card">
                <h3 className="card-title">What is D&D Homebrew Creator?</h3>
                <p>D&D Homebrew Creator is a free tool that helps Dungeon Masters and players create, manage,
                    and export their own custom content for Dungeons & Dragons 5th Edition.</p>
            </div>

            <div className="card">
                <h3 className="card-title">SRD Compliance</h3>
                <p>This tool is designed to help ensure your homebrew content complies with the Systems Reference Document (SRD)
                    guidelines, allowing you to safely share your creations without infringing on copyrighted material.</p>
            </div>

            <div className="card">
                <h3 className="card-title">Privacy & Data</h3>
                <p>All your creations are stored locally in your browser. We don't collect any personal data or
                    track your usage. You can export your data at any time for backup purposes.</p>
            </div>
        </div>
    );
}

export default AboutPage;