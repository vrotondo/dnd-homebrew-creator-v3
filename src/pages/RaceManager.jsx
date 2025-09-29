// src/pages/RaceManager.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getRaces, deleteRace, duplicateRace } from '../utils/storageService';
import {
    Crown,
    Plus,
    Search,
    Edit,
    Trash2,
    Copy,
    Eye,
    Filter,
    Download,
    Upload,
    Star,
    Zap,
    Globe,
    Users,
    TrendingUp
} from 'lucide-react';

function RaceManager() {
    const navigate = useNavigate();
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSize, setFilterSize] = useState('all');
    const [sortBy, setSortBy] = useState('name');

    useEffect(() => {
        loadRaces();
    }, []);

    const loadRaces = () => {
        setLoading(true);
        try {
            const savedRaces = getRaces();
            setRaces(savedRaces);
        } catch (error) {
            console.error('Error loading races:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
            const success = deleteRace(id);
            if (success) {
                loadRaces();
            } else {
                alert('Failed to delete race');
            }
        }
    };

    const handleDuplicate = (id) => {
        const race = races.find(r => r.id === id);
        if (race) {
            const newId = duplicateRace(race);
            if (newId) {
                loadRaces();
            } else {
                alert('Failed to duplicate race');
            }
        }
    };

    // Filter and sort races
    const filteredRaces = races
        .filter(race => {
            const matchesSearch = race.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                race.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSize = filterSize === 'all' || race.size === filterSize;
            return matchesSearch && matchesSize;
        })
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'size') return a.size.localeCompare(b.size);
            if (sortBy === 'recent') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            return 0;
        });

    const getAbilityBonuses = (race) => {
        const bonuses = [];
        Object.entries(race.abilityScoreIncreases || {}).forEach(([ability, value]) => {
            if (value > 0) {
                bonuses.push(`${ability} +${value}`);
            }
        });
        return bonuses;
    };

    const stats = {
        total: races.length,
        small: races.filter(r => r.size === 'Small').length,
        medium: races.filter(r => r.size === 'Medium').length,
        large: races.filter(r => r.size === 'Large').length,
        withDarkvision: races.filter(r => r.vision?.darkvision).length,
        avgTraits: races.length > 0 ? (races.reduce((sum, r) => sum + (r.traits?.length || 0), 0) / races.length).toFixed(1) : 0
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-xl font-medium text-gray-700">Loading your races...</p>
                    <p className="text-sm text-gray-500 mt-2">Gathering all your custom creations</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header with Gradient Background */}
            <div className="mb-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-purple-600 rounded-xl shadow-lg">
                                <Crown className="text-white" size={32} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900">Race Manager</h1>
                                <p className="text-gray-600 mt-1">
                                    Create, manage, and organize your custom D&D races
                                </p>
                            </div>
                        </div>
                    </div>
                    <Link
                        to="/races/create"
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <Plus size={20} />
                        <span className="font-medium">Create New Race</span>
                    </Link>
                </div>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <Users className="text-purple-600" size={20} />
                            <span className="text-2xl font-bold text-purple-900">{stats.total}</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">Total Races</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center text-blue-700 text-xs font-bold">S</div>
                            <span className="text-2xl font-bold text-blue-900">{stats.small}</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">Small Size</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center text-green-700 text-xs font-bold">M</div>
                            <span className="text-2xl font-bold text-green-900">{stats.medium}</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">Medium Size</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-orange-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center text-orange-700 text-xs font-bold">L</div>
                            <span className="text-2xl font-bold text-orange-900">{stats.large}</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">Large Size</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <Eye className="text-indigo-600" size={20} />
                            <span className="text-2xl font-bold text-indigo-900">{stats.withDarkvision}</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">Darkvision</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-pink-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <Zap className="text-pink-600" size={20} />
                            <span className="text-2xl font-bold text-pink-900">{stats.avgTraits}</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">Avg Traits</p>
                    </div>
                </div>
            </div>

            {/* Search, Filter, and Sort Bar */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search races by name or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-gray-600" />
                            <select
                                value={filterSize}
                                onChange={(e) => setFilterSize(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
                            >
                                <option value="all">All Sizes</option>
                                <option value="Small">Small</option>
                                <option value="Medium">Medium</option>
                                <option value="Large">Large</option>
                            </select>
                        </div>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="size">Sort by Size</option>
                            <option value="recent">Most Recent</option>
                        </select>
                    </div>
                </div>

                {searchTerm && (
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                            Found {filteredRaces.length} race{filteredRaces.length !== 1 ? 's' : ''}
                        </span>
                        {filteredRaces.length !== races.length && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Race Cards Grid */}
            {filteredRaces.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
                        <Crown className="text-purple-600" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {searchTerm || filterSize !== 'all' ? 'No races found' : 'No races yet'}
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        {searchTerm || filterSize !== 'all'
                            ? 'Try adjusting your search terms or filters to find what you\'re looking for'
                            : 'Start building your campaign by creating your first custom race with unique traits and abilities'
                        }
                    </p>
                    {!searchTerm && filterSize === 'all' && (
                        <Link
                            to="/races/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg font-medium"
                        >
                            <Plus size={20} />
                            Create Your First Race
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRaces.map(race => {
                        const abilityBonuses = getAbilityBonuses(race);

                        return (
                            <div key={race.id} className="group bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1">
                                {/* Card Header with Gradient */}
                                <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold text-white mb-2">{race.name}</h3>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                                                        {race.size}
                                                    </span>
                                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                                                        {race.speed} ft
                                                    </span>
                                                    {race.vision?.darkvision && (
                                                        <span className="px-3 py-1 bg-yellow-400/30 backdrop-blur-sm text-white rounded-full text-xs font-medium flex items-center gap-1">
                                                            <Eye size={12} />
                                                            Darkvision
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <Crown className="text-white/80 flex-shrink-0" size={32} />
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6">
                                    <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                                        {race.description}
                                    </p>

                                    {/* Ability Bonuses */}
                                    {abilityBonuses.length > 0 && (
                                        <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <TrendingUp size={16} className="text-blue-600" />
                                                <p className="text-xs font-bold text-blue-900 uppercase tracking-wide">Ability Increases</p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {abilityBonuses.map((bonus, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                                                        {bonus}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Languages */}
                                    {race.languages && race.languages.length > 0 && (
                                        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Globe size={14} className="text-green-600" />
                                                <p className="text-xs font-semibold text-green-900">Languages</p>
                                            </div>
                                            <p className="text-sm text-green-700">{race.languages.slice(0, 3).join(', ')}{race.languages.length > 3 ? '...' : ''}</p>
                                        </div>
                                    )}

                                    {/* Stats Row */}
                                    <div className="flex items-center justify-between text-sm text-gray-600 py-3 border-t border-b border-gray-100 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Zap size={16} className="text-purple-600" />
                                            <span className="font-medium">{race.traits?.length || 0}</span>
                                            <span className="text-xs">Traits</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users size={16} className="text-blue-600" />
                                            <span className="font-medium">{race.subraces?.length || 0}</span>
                                            <span className="text-xs">Subraces</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Globe size={16} className="text-green-600" />
                                            <span className="font-medium">{race.languages?.length || 0}</span>
                                            <span className="text-xs">Languages</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() => navigate(`/races/${race.id}/edit`)}
                                            className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                            title="Edit Race"
                                        >
                                            <Edit size={16} />
                                            <span className="hidden sm:inline">Edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDuplicate(race.id)}
                                            className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                                            title="Duplicate Race"
                                        >
                                            <Copy size={16} />
                                            <span className="hidden sm:inline">Copy</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(race.id, race.name)}
                                            className="flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                            title="Delete Race"
                                        >
                                            <Trash2 size={16} />
                                            <span className="hidden sm:inline">Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default RaceManager;