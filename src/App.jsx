// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Sword,
  BookOpen,
  Menu,
  X,
  Moon,
  Sun,
  Shield,
  Crown
} from 'lucide-react';

import './App.css';
import './styles/foundation.css';
import './styles/dnd-components.css';
import './styles/class-creator.css';

import HomePage from './pages/HomePage';
import CharacterCreatorPage from './pages/CharacterCreatorPage';
import AboutPage from './pages/AboutPage';
import ClassManager from './pages/ClassManager';
import RaceManager from './pages/RaceManager';
import BackgroundManager from './pages/BackgroundManager';
import WorldManager from './pages/WorldManager';

import ClassCreator from './components/creators/character/ClassCreator';
import RaceCreator from './components/creators/character/RaceCreator';
import BackgroundCreator from './components/creators/character/BackgroundCreator';
import WorldCreator from './components/creators/character/WorldCreator';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('dnd-homebrew-darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('dnd-homebrew-darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Character Creator', href: '/character-creator', icon: Users },
    { name: 'Manage Classes', href: '/classes', icon: Sword },
    { name: 'Manage Races', href: '/races', icon: Crown },
    { name: 'Manage Backgrounds', href: '/backgrounds', icon: BookOpen },
    { name: 'About', href: '/about', icon: Shield },
  ];

  return (
    <Router>
      <div className={`min-h-screen transition-all duration-300 ${darkMode
        ? 'bg-gray-900 text-gray-100'
        : 'bg-gradient-to-br text-gray-900'
        }`} style={{
          background: darkMode
            ? '#111827'
            : 'linear-gradient(135deg, #faf5ff 0%, #eff6ff 50%, #eef2ff 100%)'
        }}>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 transition-opacity"
            style={{
              backgroundColor: 'rgba(75, 85, 99, 0.75)',
              opacity: sidebarOpen ? 1 : 0
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} w-80`}
          style={{ width: '280px' }}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                D
              </div>
              <div>
                <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  D&D Creator
                </h2>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Homebrew Tools v3.0
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`p-2 rounded-lg transition-colors ${darkMode
                ? 'hover:bg-gray-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-500'
                }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-6 px-3">
            <div className="space-y-1">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${darkMode
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="absolute bottom-6 left-3 right-3">
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {darkMode ? <Sun className="w-4 h-4 mr-3" /> : <Moon className="w-4 h-4 mr-3" />}
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>

        <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-280' : 'ml-0'}`}>
          <header
            className={`sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b ${darkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
              }`}
            style={{
              backdropFilter: 'blur(8px)',
              backgroundColor: darkMode
                ? 'rgba(31, 41, 55, 0.9)'
                : 'rgba(255, 255, 255, 0.9)'
            }}
          >
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg transition-colors ${darkMode
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
                }`}
            >
              <Menu className="w-5 h-5" />
            </button>

            <PageTitle darkMode={darkMode} />

            <div className="flex items-center space-x-3">
              <div
                className={`hidden sm:block px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'text-green-300' : 'text-green-800'
                  }`}
                style={{
                  backgroundColor: darkMode ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7'
                }}
              >
                v3.0 Beta
              </div>
            </div>
          </header>

          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              <Routes>
                {/* Main Pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/character-creator" element={<CharacterCreatorPage />} />
                <Route path="/about" element={<AboutPage />} />

                {/* Class Routes */}
                <Route path="/classes" element={<ClassManager />} />
                <Route path="/classes/create" element={<ClassCreator />} />
                <Route path="/classes/:id/edit" element={<ClassCreator />} />
                <Route path="/character-creator/class/new" element={<ClassCreator />} />
                <Route path="/character-creator/class/:id/edit" element={<ClassCreator />} />

                {/* Race Routes - CLEANED UP */}
                <Route path="/races" element={<RaceManager />} />
                <Route path="/races/create" element={<RaceCreator />} />
                <Route path="/races/:id/edit" element={<RaceCreator />} />

                {/* Background Routes - CLEANED UP */}
                <Route path="/backgrounds" element={<BackgroundManager />} />
                <Route path="/backgrounds/create" element={<BackgroundCreator />} />
                <Route path="/backgrounds/:id/edit" element={<BackgroundCreator />} />

                {/* World Routes */}
                <Route path="/worlds" element={<WorldManager />} />
                <Route path="/worlds/create" element={<WorldCreator />} />
                <Route path="/worlds/:id/edit" element={<WorldCreator />} />

                {/* Placeholder Routes */}
                <Route path="/character-creator/subclass/new" element={<PlaceholderPage title="Subclass Creator (Coming Soon)" />} />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </main>

          <footer
            className={`mt-12 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
          >
            <div className="max-w-7xl mx-auto py-6 px-6">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  © 2024 D&D Homebrew Creator. Built for the community.
                </div>
                <div className="flex items-center space-x-6">
                  <Link
                    to="/about"
                    className={`text-sm transition-colors ${darkMode
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-600 hover:text-gray-700'
                      }`}
                  >
                    About
                  </Link>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm transition-colors ${darkMode
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-600 hover:text-gray-700'
                      }`}
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </Router>
  );
}

function PageTitle({ darkMode }) {
  const location = useLocation();

  const getTitleFromPath = (pathname) => {
    if (pathname === '/') return 'Home';
    if (pathname === '/character-creator') return 'Character Creator';
    if (pathname === '/classes') return 'Class Manager';
    if (pathname === '/classes/create' || pathname === '/character-creator/class/new') return 'Create Class';
    if (pathname === '/races') return 'Race Manager';
    if (pathname === '/races/create') return 'Create Race';
    if (pathname === '/backgrounds') return 'Background Manager';
    if (pathname === '/backgrounds/create') return 'Create Background';
    if (pathname === '/about') return 'About';
    if (pathname.includes('/edit')) {
      if (pathname.includes('/classes/')) return 'Edit Class';
      if (pathname.includes('/races/')) return 'Edit Race';
      if (pathname.includes('/backgrounds/')) return 'Edit Background';
    }
    return 'D&D Homebrew Creator';
  };

  return (
    <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {getTitleFromPath(location.pathname)}
    </h1>
  );
}

function PlaceholderPage({ title }) {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We're working on building amazing tools for managing your {title.toLowerCase()}.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/classes/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2"
          >
            <Sword className="w-4 h-4" />
            Create New Class
          </Link>
          <Link
            to="/character-creator"
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors gap-2"
          >
            <Users className="w-4 h-4" />
            Character Creator Hub
          </Link>
        </div>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <X className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2"
        >
          <Home className="w-4 h-4" />
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default App;