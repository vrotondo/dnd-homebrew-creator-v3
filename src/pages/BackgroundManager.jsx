// src/pages/BackgroundManager.jsx - FIXED VERSION
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
    Target,
    Briefcase,
    Package
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
        avgSkills: backgrounds.length > 0 ?
            (backgrounds.reduce((sum, bg) => sum + (bg.skillProficiencies?.length || 0), 0) / backgrounds.length).toFixed(1) : 0
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
                        borderTopColor: '#3b82f6',
                        borderRadius: '50%',
                        margin: '0 auto 16px',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{ fontSize: '20px', fontWeight: '500', color: '#374151' }}>
                        Loading your backgrounds...
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
                background: 'linear-gradient(to bottom right, #eff6ff, #eef2ff)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid #dbeafe',
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
                                background: '#3b82f6',
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}>
                                <BookOpen style={{ color: 'white' }} size={32} />
                            </div>
                            <div>
                                <h1 style={{
                                    fontSize: '36px',
                                    fontWeight: 'bold',
                                    color: '#111827',
                                    margin: 0
                                }}>
                                    Background Manager
                                </h1>
                                <p style={{
                                    color: '#4b5563',
                                    marginTop: '4px',
                                    margin: 0
                                }}>
                                    Create and manage character backstories with unique features
                                </p>
                            </div>
                        </div>
                    </div>
                    <Link
                        to="/backgrounds/create"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            background: '#3b82f6',
                            color: 'white',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontWeight: '500',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = '#2563eb';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = '#3b82f6';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        <Plus size={20} />
                        <span>Create New Background</span>
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
                        border: '1px solid #dbeafe',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <BookOpen style={{ color: '#3b82f6' }} size={20} />
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>{stats.total}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>Total Backgrounds</p>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #d1fae5',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Target style={{ color: '#10b981' }} size={20} />
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#065f46' }}>{stats.totalSkills}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>Total Skills</p>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #fed7aa',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Briefcase style={{ color: '#f59e0b' }} size={20} />
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#92400e' }}>{stats.totalTools}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>Total Tools</p>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #e9d5ff',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Package style={{ color: '#ec4899' }} size={20} />
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#831843' }}>{stats.totalEquipment}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>Equipment Items</p>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{ width: '20px', height: '20px', background: '#f3f4f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: '#4b5563' }}>✓</div>
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{stats.withFeatures}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>With Features</p>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Target style={{ color: '#6b7280' }} size={20} />
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{stats.avgSkills}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>Avg Skills</p>
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
                        placeholder="Search backgrounds by name, skills, or description..."
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
                            e.target.style.borderColor = '#3b82f6';
                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#d1d5db';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>

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
                    <option value="skills">Sort by Skills</option>
                    <option value="recent">Most Recent</option>
                </select>
            </div>

            {/* Results Count */}
            {searchTerm && filteredBackgrounds.length > 0 && (
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
                        Found {filteredBackgrounds.length} background{filteredBackgrounds.length !== 1 ? 's' : ''}
                    </span>
                    {filteredBackgrounds.length !== backgrounds.length && (
                        <button
                            onClick={() => setSearchTerm('')}
                            style={{
                                fontSize: '14px',
                                color: '#3b82f6',
                                fontWeight: '500',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                textDecoration: 'none'
                            }}
                            onMouseOver={(e) => e.target.style.color = '#2563eb'}
                            onMouseOut={(e) => e.target.style.color = '#3b82f6'}
                        >
                            Clear search
                        </button>
                    )}
                </div>
            )}

            {/* Background Cards Grid */}
            {filteredBackgrounds.length === 0 ? (
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
                        background: '#dbeafe',
                        borderRadius: '50%',
                        marginBottom: '24px'
                    }}>
                        <BookOpen style={{ color: '#3b82f6' }} size={40} />
                    </div>
                    <h3 style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#111827',
                        marginBottom: '12px'
                    }}>
                        {searchTerm ? 'No backgrounds found' : 'No backgrounds yet'}
                    </h3>
                    <p style={{
                        color: '#4b5563',
                        marginBottom: '32px',
                        maxWidth: '448px',
                        margin: '0 auto 32px'
                    }}>
                        {searchTerm
                            ? 'Try adjusting your search terms to find what you\'re looking for'
                            : 'Start building your campaign by creating your first custom background with unique features and skills'}
                    </p>
                    {!searchTerm && (
                        <Link
                            to="/backgrounds/create"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 24px',
                                background: '#3b82f6',
                                color: 'white',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
                        >
                            <Plus size={20} />
                            Create Your First Background
                        </Link>
                    )}
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '24px'
                }}>
                    {filteredBackgrounds.map((background) => (
                        <div
                            key={background.id}
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
                                e.currentTarget.style.borderColor = '#3b82f6';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                            }}
                        >
                            {/* Card Header with Gradient */}
                            <div style={{
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
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
                                            {background.name}
                                        </h3>
                                        {background.feature?.name && (
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                padding: '4px 12px',
                                                background: 'rgba(255, 255, 255, 0.2)',
                                                backdropFilter: 'blur(10px)',
                                                borderRadius: '9999px',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                marginTop: '8px'
                                            }}>
                                                Feature: {background.feature.name}
                                            </div>
                                        )}
                                    </div>
                                    <BookOpen style={{ color: 'rgba(255, 255, 255, 0.8)', flexShrink: 0 }} size={32} />
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
                                    {background.description}
                                </p>

                                {/* Skills Display */}
                                {background.skillProficiencies && background.skillProficiencies.length > 0 && (
                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            color: '#6b7280',
                                            marginBottom: '8px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            Skill Proficiencies
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '8px'
                                        }}>
                                            {background.skillProficiencies.slice(0, 3).map((skill, i) => (
                                                <span
                                                    key={i}
                                                    style={{
                                                        padding: '6px 12px',
                                                        background: '#dbeafe',
                                                        color: '#1e40af',
                                                        borderRadius: '9999px',
                                                        fontSize: '12px',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {background.skillProficiencies.length > 3 && (
                                                <span style={{
                                                    padding: '6px 12px',
                                                    background: '#f3f4f6',
                                                    color: '#6b7280',
                                                    borderRadius: '9999px',
                                                    fontSize: '12px',
                                                    fontWeight: '600'
                                                }}>
                                                    +{background.skillProficiencies.length - 3} more
                                                </span>
                                            )}
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
                                        <Target size={16} style={{ color: '#10b981' }} />
                                        <span style={{ fontWeight: '500' }}>{background.skillProficiencies?.length || 0}</span>
                                        <span style={{ fontSize: '12px' }}>Skills</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Briefcase size={16} style={{ color: '#f59e0b' }} />
                                        <span style={{ fontWeight: '500' }}>{background.toolProficiencies?.length || 0}</span>
                                        <span style={{ fontSize: '12px' }}>Tools</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Package size={16} style={{ color: '#ec4899' }} />
                                        <span style={{ fontWeight: '500' }}>{background.equipment?.length || 0}</span>
                                        <span style={{ fontSize: '12px' }}>Items</span>
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
                                            navigate(`/backgrounds/${background.id}/edit`);
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
                                        title="Edit Background"
                                    >
                                        <Edit size={16} />
                                        <span style={{
                                            display: window.innerWidth >= 640 ? 'inline' : 'none'
                                        }}>Edit</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDuplicate(background.id);
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
                                        title="Duplicate Background"
                                    >
                                        <Copy size={16} />
                                        <span style={{
                                            display: window.innerWidth >= 640 ? 'inline' : 'none'
                                        }}>Copy</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(background.id, background.name);
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
                                        title="Delete Background"
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

export default BackgroundManager;