import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Page Not Found</h2>
            <p>The spell to conjure this page has failed. Perhaps it was miscast?</p>
            <Link to="/" className="button">Return to Home</Link>
        </div>
    );
}

export default NotFoundPage;