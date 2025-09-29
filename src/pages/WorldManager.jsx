// src/pages/WorldManager.jsx - World Builder Manager
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getWorlds, deleteWorld, duplicateWorld } from '../utils/storageService';
import {
    Map,
    Plus,
    Search,
    Edit,
    Trash2,
    Copy,
    Globe,
    Users,
    Scroll,
    MapPin
} from 'lucide-react';

function WorldManager() {
    const navigate = useNavigate();
    const [worlds, setWorlds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTheme, setFilterTheme] = useState('all');
    const [sortBy, setSortBy] = useState('name');

    useEffect(() => {
        loadWorlds();
    }, []);

    const loadWorlds = () => {
        setLoading(true);
        try {
            const savedWorlds = getWorlds();
            setWorlds(savedWorlds);
        } catch (error) {
            console.error('Error loading worlds:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
            const success = deleteWorld(id);
            if (success) {
                loadWorlds();
            } else {
                alert('Failed to delete world');
            }
        }
    };

    const handleDuplicate = (id) => {
        const world = worlds.find(w => w.id === id);
        if (world) {
            const newId = duplicateWorld(world);
            if (newId) {
                loadWorlds();
            } else {
                alert('Failed to duplicate world');
            }
        }
    };

    // Filter and sort worlds
    const filteredWorlds = worlds
        .filter(world => {
            const matchesSearch = world.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                world.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTheme = filterTheme === 'all' || world.theme === filterTheme;
            return matchesSearch && matchesTheme;
        })
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'theme') return (a.theme || '').localeCompare(b.theme || '');
            if (sortBy === 'recent') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            return 0;
        });

    const stats = {
        total: worlds.length,
        totalRegions: worlds.reduce((sum, w) => sum + (w.regions?.length || 0), 0),
        totalFactions: worlds.reduce((sum, w) => sum + (w.factions?.length || 0), 0),
        totalNPCs: worlds.reduce((sum, w) => sum + (w.npcs?.length || 0), 0),
        avgRegions: worlds.length > 0 ?
            (worlds.reduce((sum, w) => sum + (w.regions?.length || 0), 0) / worlds.length).toFixed(1) : 0,
        highFantasy: worlds.filter(w => w.theme === 'High Fantasy').length,
        lowFantasy: worlds.filter(w => w.theme === 'Low Fantasy').length,
        darkFantasy: worlds.filter(w => w.theme === 'Dark Fantasy').length
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
                        borderTopColor: '#16a34a',
                        borderRadius: '50%',
                        margin: '0 auto 16px',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{ fontSize: '20px', fontWeight: '500', color: '#374151' }}>
                        Loading your worlds...
                    </p>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
                        Gathering all your campaign settings
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
                background: 'linear-gradient(to bottom right, #dcfce7, #d1fae5)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid #bbf7d0',
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
                                background: '#16a34a',
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}>
                                <Map style={{ color: 'white' }} size={32} />
                            </div>
                            <div>
                                <h1 style={{
                                    fontSize: '36px',
                                    fontWeight: 'bold',
                                    color: '#111827',
                                    margin: 0
                                }}>
                                    World Builder
                                </h1>
                                <p style={{
                                    color: '#4b5563',
                                    marginTop: '4px',
                                    margin: 0
                                }}>
                                    Create and manage immersive campaign settings
                                </p>
                            </div>
                        </div>
                    </div>
                    <Link
                        to="/worlds/create"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            background: '#16a34a',
                            color: 'white',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontWeight: '500',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = '#15803d';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = '#16a34a';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        <Plus size={20} />
                        <span>Create New World</span>
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
                        border: '1px solid #bbf7d0',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Globe style={{ color: '#16a34a' }} size={20} />
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#14532d' }}>{stats.total}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>Total Worlds</p>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #bfdbfe',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <MapPin style={{ color: '#3b82f6' }} size={20} />
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>{stats.totalRegions}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>Total Regions</p>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #e9d5ff',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Users style={{ color: '#8b5cf6' }} size={20} />
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#6d28d9' }}>{stats.totalFactions}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>Factions</p>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #fed7aa',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Users style={{ color: '#f59e0b' }} size={20} />
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#92400e' }}>{stats.totalNPCs}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>NPCs</p>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <MapPin style={{ color: '#6b7280' }} size={20} />
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{stats.avgRegions}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>Avg Regions</p>
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
                        placeholder="Search worlds by name or description..."
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
                            e.target.style.borderColor = '#16a34a';
                            e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#d1d5db';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>

                <select
                    value={filterTheme}
                    onChange={(e) => setFilterTheme(e.target.value)}
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
                    <option value="all">All Themes</option>
                    <option value="High Fantasy">High Fantasy</option>
                    <option value="Low Fantasy">Low Fantasy</option>
                    <option value="Dark Fantasy">Dark Fantasy</option>
                    <option value="Steampunk">Steampunk</option>
                    <option value="Post-Apocalyptic">Post-Apocalyptic</option>
                    <option value="Urban Fantasy">Urban Fantasy</option>
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
                    <option value="theme">Sort by Theme</option>
                    <option value="recent">Sort by Recent</option>
                </select>
            </div>

            {/* Results Count */}
            {(searchTerm || filterTheme !== 'all') && filteredWorlds.length > 0 && (
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
                        Found {filteredWorlds.length} world{filteredWorlds.length !== 1 ? 's' : ''}
                    </span>
                    {filteredWorlds.length !== worlds.length && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setFilterTheme('all');
                            }}
                            style={{
                                fontSize: '14px',
                                color: '#16a34a',
                                fontWeight: '500',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                textDecoration: 'none'
                            }}
                            onMouseOver={(e) => e.target.style.color = '#15803d'}
                            onMouseOut={(e) => e.target.style.color = '#16a34a'}
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            )}

            {/* World Cards Grid */}
            {filteredWorlds.length === 0 ? (
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
                        background: '#dcfce7',
                        borderRadius: '50%',
                        marginBottom: '24px'
                    }}>
                        <Map style={{ color: '#16a34a' }} size={40} />
                    </div>
                    <h3 style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#111827',
                        marginBottom: '12px'
                    }}>
                        {searchTerm || filterTheme !== 'all' ? 'No worlds found' : 'No worlds yet'}
                    </h3>
                    <p style={{
                        color: '#4b5563',
                        marginBottom: '32px',
                        maxWidth: '448px',
                        margin: '0 auto 32px'
                    }}>
                        {searchTerm || filterTheme !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Create your first campaign world to start building immersive adventures'}
                    </p>
                    {!searchTerm && filterTheme === 'all' && (
                        <Link
                            to="/worlds/create"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 24px',
                                background: '#16a34a',
                                color: 'white',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#15803d'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#16a34a'}
                        >
                            <Plus size={20} />
                            Create First World
                        </Link>
                    )}
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '24px'
                }}>
                    {filteredWorlds.map((world) => (
                        <div
                            key={world.id}
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                                border: '2px solid #e5e7eb'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.borderColor = '#16a34a';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                            }}
                        >
                            {/* Card Header with Gradient */}
                            <div style={{
                                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                padding: '24px',
                                color: 'white',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: '128px',
                                    height: '128px',
                                    background: 'white',
                                    opacity: 0.1,
                                    borderRadius: '50%',
                                    marginRight: '-64px',
                                    marginTop: '-64px'
                                }}></div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    gap: '16px',
                                    position: 'relative'
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            marginBottom: '8px',
                                            margin: 0,
                                            marginBottom: '8px'
                                        }}>
                                            {world.name}
                                        </h3>
                                        {world.theme && (
                                            <span style={{
                                                padding: '4px 12px',
                                                background: 'rgba(255, 255, 255, 0.2)',
                                                backdropFilter: 'blur(10px)',
                                                borderRadius: '9999px',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}>
                                                {world.theme}
                                            </span>
                                        )}
                                    </div>
                                    <Globe style={{ color: 'rgba(255, 255, 255, 0.8)', flexShrink: 0 }} size={32} />
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
                                    {world.description}
                                </p>

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
                                        <MapPin size={16} style={{ color: '#3b82f6' }} />
                                        <span style={{ fontWeight: '500' }}>{world.regions?.length || 0}</span>
                                        <span style={{ fontSize: '12px' }}>Regions</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Users size={16} style={{ color: '#8b5cf6' }} />
                                        <span style={{ fontWeight: '500' }}>{world.factions?.length || 0}</span>
                                        <span style={{ fontSize: '12px' }}>Factions</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Scroll size={16} style={{ color: '#f59e0b' }} />
                                        <span style={{ fontWeight: '500' }}>{world.npcs?.length || 0}</span>
                                        <span style={{ fontSize: '12px' }}>NPCs</span>
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
                                            navigate(`/worlds/${world.id}/edit`);
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
                                        title="Edit World"
                                    >
                                        <Edit size={16} />
                                        <span style={{
                                            display: window.innerWidth >= 640 ? 'inline' : 'none'
                                        }}>Edit</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDuplicate(world.id);
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
                                        title="Duplicate World"
                                    >
                                        <Copy size={16} />
                                        <span style={{
                                            display: window.innerWidth >= 640 ? 'inline' : 'none'
                                        }}>Copy</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(world.id, world.name);
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
                                        title="Delete World"
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

export default WorldManager;