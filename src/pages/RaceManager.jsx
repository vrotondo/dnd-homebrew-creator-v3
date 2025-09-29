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
    Zap,
    Globe,
    Users
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
        avgTraits: races.length > 0 ?
            (races.reduce((sum, r) => sum + (r.traits?.length || 0), 0) / races.length).toFixed(1) : 0
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        border: '4px solid #f3f4f6',
                        borderTopColor: '#7c3aed',
                        borderRadius: '50%',
                        margin: '0 auto 16px',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{ fontSize: '20px', fontWeight: '500', color: '#374151' }}>
                        Loading your races...
                    </p>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
                        Gathering all your custom creations
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
            {/* Header */}
            <div style={{
                marginBottom: '32px',
                background: 'linear-gradient(to bottom right, #faf5ff, #eff6ff)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid #e9d5ff',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px'
                }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <div style={{
                                padding: '12px',
                                background: '#7c3aed',
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}>
                                <Crown style={{ color: 'white' }} size={32} />
                            </div>
                            <div>
                                <h1 style={{
                                    fontSize: '36px',
                                    fontWeight: 'bold',
                                    color: '#111827',
                                    margin: 0
                                }}>
                                    Race Manager
                                </h1>
                                <p style={{
                                    color: '#4b5563',
                                    marginTop: '4px',
                                    margin: 0
                                }}>
                                    Create, manage, and organize your custom D&D races
                                </p>
                            </div>
                        </div>
                    </div>
                    <Link
                        to="/races/create"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            background: '#7c3aed',
                            color: 'white',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontWeight: '500',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = '#6d28d9';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = '#7c3aed';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        <Plus size={20} />
                        <span>Create New Race</span>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '16px'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #e9d5ff',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Users style={{ color: '#7c3aed' }} size={20} />
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#581c87' }}>{stats.total}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>Total Races</p>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #dbeafe',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                background: '#dbeafe',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#1e40af',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>S</div>
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e3a8a' }}>{stats.small}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>Small Size</p>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #d1fae5',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                background: '#d1fae5',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#065f46',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>M</div>
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#064e3b' }}>{stats.medium}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>Medium Size</p>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #fed7aa',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                background: '#fed7aa',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#9a3412',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>L</div>
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#7c2d12' }}>{stats.large}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>Large Size</p>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Eye style={{ color: '#6b7280' }} size={20} />
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{stats.withDarkvision}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>Darkvision</p>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Zap style={{ color: '#6b7280' }} size={20} />
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{stats.avgTraits}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>Avg Traits</p>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '24px',
                flexWrap: 'wrap'
            }}>
                <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                    <Search
                        style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#9ca3af'
                        }}
                        size={20}
                    />
                    <input
                        type="text"
                        placeholder="Search races by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 12px 12px 44px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            transition: 'all 0.2s'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#7c3aed';
                            e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#d1d5db';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>

                <select
                    value={filterSize}
                    onChange={(e) => setFilterSize(e.target.value)}
                    style={{
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'white',
                        cursor: 'pointer',
                        outline: 'none'
                    }}
                >
                    <option value="all">All Sizes</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'white',
                        cursor: 'pointer',
                        outline: 'none'
                    }}
                >
                    <option value="name">Sort by Name</option>
                    <option value="size">Sort by Size</option>
                    <option value="recent">Sort by Recent</option>
                </select>
            </div>

            {/* Results Count */}
            {(searchTerm || filterSize !== 'all') && filteredRaces.length > 0 && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                    padding: '12px 16px',
                    background: '#f3f4f6',
                    borderRadius: '8px'
                }}>
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                        Found {filteredRaces.length} race{filteredRaces.length !== 1 ? 's' : ''}
                    </span>
                    {filteredRaces.length !== races.length && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setFilterSize('all');
                            }}
                            style={{
                                fontSize: '14px',
                                color: '#7c3aed',
                                fontWeight: '500',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                textDecoration: 'none'
                            }}
                            onMouseOver={(e) => e.target.style.color = '#6d28d9'}
                            onMouseOut={(e) => e.target.style.color = '#7c3aed'}
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            )}

            {/* Race Cards Grid */}
            {filteredRaces.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '64px 16px',
                    background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)',
                    borderRadius: '16px',
                    border: '2px dashed #d1d5db'
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '80px',
                        height: '80px',
                        background: '#f3e8ff',
                        borderRadius: '50%',
                        marginBottom: '24px'
                    }}>
                        <Crown style={{ color: '#7c3aed' }} size={40} />
                    </div>
                    <h3 style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#111827',
                        marginBottom: '12px'
                    }}>
                        {searchTerm || filterSize !== 'all' ? 'No races found' : 'No races yet'}
                    </h3>
                    <p style={{
                        color: '#4b5563',
                        marginBottom: '32px',
                        maxWidth: '448px',
                        margin: '0 auto 32px'
                    }}>
                        {searchTerm || filterSize !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Create your first custom race to get started with your homebrew collection'}
                    </p>
                    {!searchTerm && filterSize === 'all' && (
                        <Link
                            to="/races/create"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 24px',
                                background: '#7c3aed',
                                color: 'white',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#6d28d9'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#7c3aed'}
                        >
                            <Plus size={20} />
                            Create First Race
                        </Link>
                    )}
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '24px'
                }}>
                    {filteredRaces.map((race) => (
                        <div
                            key={race.id}
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.transform = 'translateY(-4px)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            {/* Card Header with Gradient */}
                            <div style={{
                                background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                                padding: '24px',
                                color: 'white'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    gap: '16px'
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            marginBottom: '12px',
                                            margin: 0,
                                            marginBottom: '12px'
                                        }}>
                                            {race.name}
                                        </h3>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            flexWrap: 'wrap'
                                        }}>
                                            <span style={{
                                                padding: '6px 12px',
                                                background: 'rgba(255, 255, 255, 0.2)',
                                                backdropFilter: 'blur(10px)',
                                                borderRadius: '9999px',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}>
                                                {race.size}
                                            </span>
                                            <span style={{
                                                padding: '6px 12px',
                                                background: 'rgba(255, 255, 255, 0.2)',
                                                backdropFilter: 'blur(10px)',
                                                borderRadius: '9999px',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}>
                                                {race.speed} ft
                                            </span>
                                            {race.vision?.darkvision && (
                                                <span style={{
                                                    padding: '6px 12px',
                                                    background: 'rgba(251, 191, 36, 0.3)',
                                                    backdropFilter: 'blur(10px)',
                                                    borderRadius: '9999px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}>
                                                    <Eye size={12} />
                                                    Darkvision
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Crown style={{ color: 'rgba(255, 255, 255, 0.8)', flexShrink: 0 }} size={32} />
                                </div>
                            </div>

                            {/* Card Body */}
                            <div style={{ padding: '24px' }}>
                                <p style={{
                                    color: '#374151',
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    marginBottom: '16px',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {race.description}
                                </p>

                                {/* Ability Bonuses */}
                                {getAbilityBonuses(race).length > 0 && (
                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            color: '#6b7280',
                                            marginBottom: '8px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            Ability Increases
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '8px'
                                        }}>
                                            {getAbilityBonuses(race).map((bonus, i) => (
                                                <span
                                                    key={i}
                                                    style={{
                                                        padding: '6px 12px',
                                                        background: '#ede9fe',
                                                        color: '#6d28d9',
                                                        borderRadius: '9999px',
                                                        fontSize: '12px',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    {bonus}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Stats Row */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    fontSize: '14px',
                                    color: '#4b5563',
                                    padding: '12px 0',
                                    borderTop: '1px solid #f3f4f6',
                                    borderBottom: '1px solid #f3f4f6',
                                    marginBottom: '16px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Zap size={16} style={{ color: '#7c3aed' }} />
                                        <span style={{ fontWeight: '500' }}>{race.traits?.length || 0}</span>
                                        <span style={{ fontSize: '12px' }}>Traits</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Users size={16} style={{ color: '#3b82f6' }} />
                                        <span style={{ fontWeight: '500' }}>{race.subraces?.length || 0}</span>
                                        <span style={{ fontSize: '12px' }}>Subraces</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Globe size={16} style={{ color: '#10b981' }} />
                                        <span style={{ fontWeight: '500' }}>{race.languages?.length || 0}</span>
                                        <span style={{ fontSize: '12px' }}>Languages</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '8px'
                                }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/races/${race.id}/edit`);
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '4px',
                                            padding: '10px 12px',
                                            background: '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                                        onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
                                        title="Edit Race"
                                    >
                                        <Edit size={16} />
                                        <span style={{
                                            display: window.innerWidth >= 640 ? 'inline' : 'none'
                                        }}>Edit</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDuplicate(race.id);
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '4px',
                                            padding: '10px 12px',
                                            background: '#4b5563',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = '#374151'}
                                        onMouseOut={(e) => e.currentTarget.style.background = '#4b5563'}
                                        title="Duplicate Race"
                                    >
                                        <Copy size={16} />
                                        <span style={{
                                            display: window.innerWidth >= 640 ? 'inline' : 'none'
                                        }}>Copy</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(race.id, race.name);
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '4px',
                                            padding: '10px 12px',
                                            background: '#dc2626',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = '#b91c1c'}
                                        onMouseOut={(e) => e.currentTarget.style.background = '#dc2626'}
                                        title="Delete Race"
                                    >
                                        <Trash2 size={16} />
                                        <span style={{
                                            display: window.innerWidth >= 640 ? 'inline' : 'none'
                                        }}>Delete</span>
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

export default RaceManager;