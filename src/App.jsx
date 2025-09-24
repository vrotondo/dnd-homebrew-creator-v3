// src/App.jsx - Full Modern Version
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
  Scroll,
  Crown
} from 'lucide-react';

// Import your existing pages
import HomePage from './pages/HomePage';
import CharacterCreatorPage from './pages/CharacterCreatorPage';
import AboutPage from './pages/AboutPage';

// Import any creators that exist
// import ClassCreator from './components/creators/character/ClassCreator';
// import RaceCreator from './components/creators/character/RaceCreator';
// etc.

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('dnd-homebrew-darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Theme persistence
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
    { name: 'Manage Classes', href: '/class-manager', icon: Sword },
    { name: 'Manage Races', href: '/character/races', icon: Crown },
    { name: 'Manage Backgrounds', href: '/character/backgrounds', icon: BookOpen },
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

        {/* Mobile sidebar backdrop */}
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

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'
            } shadow-xl`}
          style={{
            width: '16rem',
            transform: window.innerWidth >= 1024 ? 'translateX(0)' : (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)')
          }}
        >

          {/* Sidebar header */}
          <div className={`flex items-center justify-between h-16 px-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
            <div className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #9333ea, #2563eb)' }}
              >
                <Scroll className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">
                <span style={{
                  background: 'linear-gradient(to right, #9333ea, #2563eb)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}>
                  D&D Homebrew
                </span>
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`p-1 rounded-md transition-colors lg:hidden ${darkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
                }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-6 px-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => {
                    let baseClasses = 'flex items-center px-3 py-2 mt-1 text-sm font-medium rounded-lg transition-all duration-200';

                    if (isActive) {
                      baseClasses += darkMode
                        ? ' text-purple-300 border-r-2'
                        : ' text-purple-900 border-r-2';
                      baseClasses += ' border-purple-400';
                      baseClasses += darkMode
                        ? ' bg-gray-700'
                        : ' bg-purple-100';
                    } else {
                      baseClasses += darkMode
                        ? ' text-gray-300 hover:bg-gray-700 hover:text-white'
                        : ' text-gray-700 hover:bg-gray-100 hover:text-gray-900';
                    }

                    return baseClasses;
                  }}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Theme toggle */}
          <div className="absolute bottom-6 left-3 right-3">
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${darkMode
                  ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4 mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 mr-2" />
                  Dark Mode
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main content */}
        <div style={{
          marginLeft: window.innerWidth >= 1024 ? '16rem' : '0',
          minHeight: '100vh'
        }}>
          {/* Top bar */}
          <header
            className={`sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b backdrop-blur-md ${darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            style={{
              backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              className={`p-2 rounded-md transition-colors lg:hidden ${darkMode
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

          {/* Page content */}
          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/character-creator" element={<CharacterCreatorPage />} />
                <Route path="/about" element={<AboutPage />} />

                {/* Placeholder routes for now */}
                <Route path="/class-manager" element={<PlaceholderPage title="Class Manager" />} />
                <Route path="/character/races" element={<PlaceholderPage title="Race Manager" />} />
                <Route path="/character/backgrounds" element={<PlaceholderPage title="Background Manager" />} />

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </main>

          {/* Footer */}
          <footer
            className={`mt-12 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            style={{
              backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(249, 250, 251, 0.5)'
            }}
          >
            <div className="max-w-7xl mx-auto py-6 px-6">
              <div
                className="flex justify-between items-center"
                style={{
                  flexDirection: window.innerWidth >= 640 ? 'row' : 'column',
                  gap: window.innerWidth >= 640 ? '0' : '0.5rem'
                }}
              >
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  © {new Date().getFullYear()} D&D Homebrew Creator
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Not affiliated with Wizards of the Coast • Compatible with 5th Edition SRD
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </Router>
  );
}

// Helper component for navigation links
function NavLink({ to, className, children, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className={className({ isActive })} onClick={onClick}>
      {children}
    </Link>
  );
}

// Component to display current page title
function PageTitle({ darkMode }) {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/character-creator': return 'Character Creator';
      case '/class-manager': return 'Class Manager';
      case '/character/races': return 'Race Manager';
      case '/character/backgrounds': return 'Background Manager';
      case '/about': return 'About';
      default: return 'D&D Homebrew Creator';
    }
  };

  return (
    <h1 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      {getPageTitle()}
    </h1>
  );
}

// Placeholder component for pages under development
function PlaceholderPage({ title }) {
  return (
    <div className="text-center py-12">
      <div className="card max-w-md mx-auto">
        <div className="card-content p-8">
          <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-gray-600 mb-6">This section is under development and will be available soon.</p>
          <Link to="/" className="btn btn-primary">
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

// Simple 404 component
function NotFoundPage() {
  return (
    <div className="text-center py-12">
      <div className="card max-w-md mx-auto">
        <div className="card-content p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;