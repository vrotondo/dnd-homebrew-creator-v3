// src/App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CharacterCreatorPage from './pages/CharacterCreatorPage';
import ClassCreator from './components/creators/character/ClassCreator';
import SubclassCreator from './components/creators/character/SubclassCreator';
import RaceCreator from './components/creators/character/RaceCreator';
import RacesList from './components/creators/character/RacesList';
import RacePreview from './components/creators/character/RacePreview';
import ClassManager from './pages/ClassManager';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app-container">
          <header className="app-header">
            <h1>D&D Homebrew Creator</h1>
            <nav>
              <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/character-creator">Character Creator</Link></li>
                <li><Link to="/class-manager">Manage Classes</Link></li>
                <li><Link to="/character/races">Manage Races</Link></li>
                <li><Link to="/about">About</Link></li>
              </ul>
            </nav>
          </header>

          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/character-creator" element={<CharacterCreatorPage />} />
              <Route path="/character-creator/class/new" element={<ClassCreator />} />
              <Route path="/character-creator/class/:id" element={<ClassCreator />} />
              <Route path="/character-creator/subclass/new" element={<SubclassCreator />} />
              <Route path="/character-creator/subclass/:id" element={<SubclassCreator />} />
              <Route path="/character/races" element={<RacesList />} />
              <Route path="/character/races/create" element={<RaceCreator />} />
              <Route path="/character/races/edit/:id" element={<RaceCreator />} />
              <Route path="/character/races/view/:id" element={<RacePreview />} />
              <Route path="/class-manager" element={<ClassManager />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          <footer className="app-footer">
            <p>&copy; {new Date().getFullYear()} D&D Homebrew Creator</p>
            <p>Not affiliated with Wizards of the Coast. Compatible with 5th Edition SRD.</p>
          </footer>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;