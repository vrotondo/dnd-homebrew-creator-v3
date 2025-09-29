// src/pages/BackgroundManager.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getBackgrounds, deleteBackground, duplicateBackground } from '../utils/storageService';
import {
    BookOpen,
    Plus,
    Search,
    Edit,
    Trash2,
    Copy,
    Eye,
    Filter,
    Download,
    Upload,
    Award,
    Briefcase,
    Target,
    Package,
    TrendingUp
} from 'lucide-react';

function BackgroundManager() {
    const navigate = useNavigate();
    const [backgrounds, setBackgrounds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');

    useEffect(() => {
        loadBackgrounds();
    }, []);

    const loadBackgrounds = () => {
        setLoading(true);
        try {
            const savedBackgrounds = getBackgrounds();
            setBackgrounds(savedBackgrounds);
        } catch (error) {
            console.error('Error loading backgrounds:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
            const success = deleteBackground(id);
            if (success) {
                loadBackgrounds();
            } else {
                alert('Failed to delete background');
            }
        }
    };

    const handleDuplicate = (id) => {
        const background = backgrounds.find(b => b.id === id);
        if (background) {
            const newId = duplicateBackground(background);
            if (newId) {
                loadBackgrounds();
            } else {
                alert('Failed to duplicate background');
            }
        }
    };

    // Filter and sort backgrounds
    const filteredBackgrounds = backgrounds
        .filter(bg => {
            const matchesSearch = bg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bg.skillProficiencies?.some(skill =>
                    skill.toLowerCase().includes(searchTerm.toLowerCase())
                ) ||
                bg.feature?.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        })
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'skills') return (b.skillProficiencies?.length || 0) - (a.skillProficiencies?.length || 0);
            if (sortBy === 'recent') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            return 0;
        });

    const stats = {
        total: backgrounds.length,
        totalSkills: backgrounds.reduce((sum, bg) => sum + (bg.skillProficiencies?.length || 0), 0),
        totalTools: backgrounds.reduce((sum, bg) => sum + (bg.toolProficiencies?.length || 0), 0),
        withFeatures: backgrounds.filter(bg => bg.feature?.name).length,
        totalEquipment: backgrounds.reduce((sum, bg) => sum + (bg.equipment?.length || 0), 0),
        avgSkills: backgrounds.length > 0 ? (backgrounds.reduce((sum, bg) => sum + (bg.skillProficiencies?.length || 0), 0) / backgrounds.length).toFixed(1) : 0
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-xl font-medium text-gray-700">Loading your backgrounds...</p>
                    <p className="text-sm text-gray-500 mt-2">Gathering all your custom creations</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header with Gradient Background */}
            <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                                <BookOpen className="text-white" size={32} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900">Background Manager</h1>
                                <p className="text-gray-600 mt-1">
                                    Create and manage character backstories with unique features
                                </p>
                            </div>
                        </div>
                    </div>
                    <Link
                        to="/backgrounds/create"
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <Plus size={20} />
                        <span className="font-medium">Create New Background</span>
                    </Link>
                </div>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <BookOpen className="text-blue-600" size={20} />
                            <span className="text-2xl font-bold text-blue-900">{stats.total}</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">Total Backgrounds</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <Target className="text-green-600" size={20} />
                            <span className="text-2xl font-bold text-green-900">{stats.totalSkills}</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">Total Skills</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-orange-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <Briefcase className="text-orange-600" size={20} />
                            <span className="text-2xl font-bold text-orange-900">{stats.totalTools}</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">Total Tools</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <Award className="text-purple-600" size={20} />
                            <span className="text-2xl font-bold text-purple-900">{stats.withFeatures}</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">With Features</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-pink-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <Package className="text-pink-600" size={20} />
                            <span className="text-2xl font-bold text-pink-900">{stats.totalEquipment}</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">Total Equipment</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="text-indigo-600" size={20} />
                            <span className="text-2xl font-bold text-indigo-900">{stats.avgSkills}</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">Avg Skills</p>
                    </div>
                </div>
            </div>

            {/* Search and Sort Bar */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search backgrounds by name, skills, or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="skills">Sort by Skills</option>
                            <option value="recent">Most Recent</option>
                        </select>
                    </div>
                </div>

                {searchTerm && (
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                            Found {filteredBackgrounds.length} background{filteredBackgrounds.length !== 1 ? 's' : ''}
                        </span>
                        {filteredBackgrounds.length !== backgrounds.length && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Background Cards Grid */}
            {filteredBackgrounds.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                        <BookOpen className="text-blue-600" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {searchTerm ? 'No backgrounds found' : 'No backgrounds yet'}
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        {searchTerm
                            ? 'Try adjusting your search terms to find what you\'re looking for'
                            : 'Start building your campaign by creating your first custom background with unique features and skills'
                        }
                    </p>
                    {!searchTerm && (
                        <Link
                            to="/backgrounds/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg font-medium"
                        >
                            <Plus size={20} />
                            Create Your First Background
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBackgrounds.map(background => (
                        <div key={background.id} className="group bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1">
                            {/* Card Header with Gradient */}
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                                <div className="relative">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-white mb-2">{background.name}</h3>
                                            {background.feature?.name && (
                                                <div className="flex items-center gap-2">
                                                    <Award className="text-white/80" size={16} />
                                                    <span className="text-white/90 text-sm font-medium">
                                                        {background.feature.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <BookOpen className="text-white/80 flex-shrink-0" size={32} />
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6">
                                <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                                    {background.description}
                                </p>

                                {/* Skill Proficiencies */}
                                {background.skillProficiencies && background.skillProficiencies.length > 0 && (
                                    <div className="mb-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Target size={16} className="text-green-600" />
                                            <p className="text-xs font-bold text-green-900 uppercase tracking-wide">Skill Proficiencies</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {background.skillProficiencies.map((skill, index) => (
                                                <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tool Proficiencies */}
                                {background.toolProficiencies && background.toolProficiencies.length > 0 && (
                                    <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Briefcase size={14} className="text-orange-600" />
                                            <p className="text-xs font-semibold text-orange-900">Tools</p>
                                        </div>
                                        <p className="text-sm text-orange-700">
                                            {background.toolProficiencies.slice(0, 2).join(', ')}
                                            {background.toolProficiencies.length > 2 ? '...' : ''}
                                        </p>
                                    </div>
                                )}

                                {/* Stats Row */}
                                <div className="flex items-center justify-between text-sm text-gray-600 py-3 border-t border-b border-gray-100 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Target size={16} className="text-green-600" />
                                        <span className="font-medium">{background.skillProficiencies?.length || 0}</span>
                                        <span className="text-xs">Skills</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Briefcase size={16} className="text-orange-600" />
                                        <span className="font-medium">{background.toolProficiencies?.length || 0}</span>
                                        <span className="text-xs">Tools</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Package size={16} className="text-pink-600" />
                                        <span className="font-medium">{background.equipment?.length || 0}</span>
                                        <span className="text-xs">Items</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => navigate(`/backgrounds/${background.id}/edit`)}
                                        className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                        title="Edit Background"
                                    >
                                        <Edit size={16} />
                                        <span className="hidden sm:inline">Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDuplicate(background.id)}
                                        className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                                        title="Duplicate Background"
                                    >
                                        <Copy size={16} />
                                        <span className="hidden sm:inline">Copy</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(background.id, background.name)}
                                        className="flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                        title="Delete Background"
                                    >
                                        <Trash2 size={16} />
                                        <span className="hidden sm:inline">Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BackgroundManager;