// src/pages/ClassManager.jsx - FIXED VERSION
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getClasses, deleteClass, duplicateClass } from '../utils/storageService';
import {
    Sword,
    Plus,
    Search,
    Edit,
    Trash2,
    Copy,
    Heart,
    Shield,
    Zap,
    Target
} from 'lucide-react';

function ClassManager() {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDice, setFilterDice] = useState('all');
    const [sortBy, setSortBy] = useState('name');

    useEffect(() => {
        loadClasses();
    }, []);

    const loadClasses = () => {
        setLoading(true);
        try {
            const savedClasses = getClasses();
            setClasses(savedClasses);
        } catch (error) {
            console.error('Error loading classes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
            const success = deleteClass(id);
            if (success) {
                loadClasses();
            } else {
                alert('Failed to delete class');
            }
        }
    };

    const handleDuplicate = (id) => {
        const classData = classes.find(c => c.id === id);
        if (classData) {
            const newId = duplicateClass(classData);
            if (newId) {
                loadClasses();
            } else {
                alert('Failed to duplicate class');
            }
        }
    };

    // Filter and sort classes
    const filteredClasses = classes
        .filter(cls => {
            const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cls.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDice = filterDice === 'all' || cls.hitDie === filterDice;
            return matchesSearch && matchesDice;
        })
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'hitDie') return parseInt(b.hitDie) - parseInt(a.hitDie);
            if (sortBy === 'recent') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            return 0;
        });

    const getFeaturesCount = (classData) => {
        if (!classData.features) return 0;
        return Object.values(classData.features).reduce((total, levelFeatures) =>
            total + (levelFeatures?.length || 0), 0
        );
    };

    const stats = {
        total: classes.length,
        spellcasters: classes.filter(c => c.spellcasting?.enabled).length,
        avgHitDie: classes.length > 0 ?
            (classes.reduce((sum, c) => sum + (parseInt(c.hitDie) || 0), 0) / classes.length).toFixed(1) : 0,
        totalFeatures: classes.reduce((sum, c) => sum + getFeaturesCount(c), 0),
        d6Classes: classes.filter(c => c.hitDie === 'd6').length,
        d8Classes: classes.filter(c => c.hitDie === 'd8').length,
        d10Classes: classes.filter(c => c.hitDie === 'd10').length,
        d12Classes: classes.filter(c => c.hitDie === 'd12').length
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
                        borderTopColor: '#dc2626',
                        borderRadius: '50%',
                        margin: '0 auto 16px',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{ fontSize: '20px', fontWeight: '500', color: '#374151' }}>
                        Loading your classes...
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
                background: 'linear-gradient(to bottom right, #fee2e2, #fef3c7)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid #fecaca',
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
                                background: '#dc2626',
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}>
                                <Sword style={{ color: 'white' }} size={32} />
                            </div>
                            <div>
                                <h1 style={{
                                    fontSize: '36px',
                                    fontWeight: 'bold',
                                    color: '#111827',
                                    margin: 0
                                }}>
                                    Class Manager
                                </h1>
                                <p style={{
                                    color: '#4b5563',
                                    marginTop: '4px',
                                    margin: 0
                                }}>
                                    Create and manage powerful character classes
                                </p>
                            </div>
                        </div>
                    </div>
                    <Link
                        to="/classes/create"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            background: '#dc2626',
                            color: 'white',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontWeight: '500',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = '#b91c1c';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = '#dc2626';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        <Plus size={20} />
                        <span>Create New Class</span>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '16px'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #fecaca',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Sword style={{ color: '#dc2626' }} size={20} />
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#7f1d1d' }}>{stats.total}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>Total Classes</p>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #dbeafe',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Zap style={{ color: '#3b82f6' }} size={20} />
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>{stats.spellcasters}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>Spellcasters</p>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #fecaca',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Heart style={{ color: '#dc2626' }} size={20} />
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#7f1d1d' }}>{stats.avgHitDie}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>Avg Hit Die</p>
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
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#065f46' }}>{stats.totalFeatures}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>Total Features</p>
                    </div>

                    {/* Hit Dice Distribution */}
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{ width: '20px', height: '20px', background: '#fecaca', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', color: '#7f1d1d' }}>d6</div>
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#7f1d1d' }}>{stats.d6Classes}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>d6 Classes</p>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{ width: '20px', height: '20px', background: '#fed7aa', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', color: '#9a3412' }}>d8</div>
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#9a3412' }}>{stats.d8Classes}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>d8 Classes</p>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{ width: '20px', height: '20px', background: '#d1fae5', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold', color: '#065f46' }}>d10</div>
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#065f46' }}>{stats.d10Classes}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>d10 Classes</p>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{ width: '20px', height: '20px', background: '#dbeafe', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold', color: '#1e40af' }}>d12</div>
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>{stats.d12Classes}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', margin: 0 }}>d12 Classes</p>
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
                        placeholder="Search classes by name or description..."
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
                            e.target.style.borderColor = '#dc2626';
                            e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#d1d5db';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>

                <select
                    value={filterDice}
                    onChange={(e) => setFilterDice(e.target.value)}
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
                    <option value="all">All Hit Dice</option>
                    <option value="d6">d6</option>
                    <option value="d8">d8</option>
                    <option value="d10">d10</option>
                    <option value="d12">d12</option>
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
                    <option value="hitDie">Sort by Hit Die</option>
                    <option value="recent">Sort by Recent</option>
                </select>
            </div>

            {/* Results Count */}
            {(searchTerm || filterDice !== 'all') && filteredClasses.length > 0 && (
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
                        Found {filteredClasses.length} class{filteredClasses.length !== 1 ? 'es' : ''}
                    </span>
                    {filteredClasses.length !== classes.length && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setFilterDice('all');
                            }}
                            style={{
                                fontSize: '14px',
                                color: '#dc2626',
                                fontWeight: '500',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                textDecoration: 'none'
                            }}
                            onMouseOver={(e) => e.target.style.color = '#b91c1c'}
                            onMouseOut={(e) => e.target.style.color = '#dc2626'}
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            )}

            {/* Class Cards Grid */}
            {filteredClasses.length === 0 ? (
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
                        background: '#fee2e2',
                        borderRadius: '50%',
                        marginBottom: '24px'
                    }}>
                        <Sword style={{ color: '#dc2626' }} size={40} />
                    </div>
                    <h3 style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#111827',
                        marginBottom: '12px'
                    }}>
                        {searchTerm || filterDice !== 'all' ? 'No classes found' : 'No classes yet'}
                    </h3>
                    <p style={{
                        color: '#4b5563',
                        marginBottom: '32px',
                        maxWidth: '448px',
                        margin: '0 auto 32px'
                    }}>
                        {searchTerm || filterDice !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Create your first custom class to get started with your homebrew collection'}
                    </p>
                    {!searchTerm && filterDice === 'all' && (
                        <Link
                            to="/classes/create"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 24px',
                                background: '#dc2626',
                                color: 'white',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#b91c1c'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#dc2626'}
                        >
                            <Plus size={20} />
                            Create First Class
                        </Link>
                    )}
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '24px'
                }}>
                    {filteredClasses.map((classData) => (
                        <div
                            key={classData.id}
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
                                e.currentTarget.style.borderColor = '#dc2626';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                            }}
                        >
                            {/* Card Header with Gradient */}
                            <div style={{
                                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
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
                                            {classData.name}
                                        </h3>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            flexWrap: 'wrap'
                                        }}>
                                            <span style={{
                                                padding: '4px 10px',
                                                background: 'rgba(255, 255, 255, 0.2)',
                                                backdropFilter: 'blur(10px)',
                                                borderRadius: '9999px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                <Heart size={12} />
                                                Hit Die: {classData.hitDie}
                                            </span>
                                            {classData.spellcasting?.enabled && (
                                                <span style={{
                                                    padding: '4px 10px',
                                                    background: 'rgba(147, 197, 253, 0.3)',
                                                    backdropFilter: 'blur(10px)',
                                                    borderRadius: '9999px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}>
                                                    <Zap size={12} />
                                                    Spellcaster
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Sword style={{ color: 'rgba(255, 255, 255, 0.8)', flexShrink: 0 }} size={32} />
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
                                    {classData.description}
                                </p>

                                {/* Primary Ability */}
                                {classData.primaryAbility && classData.primaryAbility.length > 0 && (
                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            color: '#6b7280',
                                            marginBottom: '8px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            Primary Ability
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '8px'
                                        }}>
                                            {classData.primaryAbility.map((ability, i) => (
                                                <span
                                                    key={i}
                                                    style={{
                                                        padding: '6px 12px',
                                                        background: '#fee2e2',
                                                        color: '#7f1d1d',
                                                        borderRadius: '9999px',
                                                        fontSize: '12px',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    {ability}
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
                                        <Target size={16} style={{ color: '#10b981' }} />
                                        <span style={{ fontWeight: '500' }}>{getFeaturesCount(classData)}</span>
                                        <span style={{ fontSize: '12px' }}>Features</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Shield size={16} style={{ color: '#6b7280' }} />
                                        <span style={{ fontWeight: '500' }}>{classData.armorProficiencies?.length || 0}</span>
                                        <span style={{ fontSize: '12px' }}>Armor</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Sword size={16} style={{ color: '#f59e0b' }} />
                                        <span style={{ fontWeight: '500' }}>{classData.weaponProficiencies?.length || 0}</span>
                                        <span style={{ fontSize: '12px' }}>Weapons</span>
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
                                            navigate(`/classes/${classData.id}/edit`);
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
                                        title="Edit Class"
                                    >
                                        <Edit size={16} />
                                        <span style={{
                                            display: window.innerWidth >= 640 ? 'inline' : 'none'
                                        }}>Edit</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDuplicate(classData.id);
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
                                        title="Duplicate Class"
                                    >
                                        <Copy size={16} />
                                        <span style={{
                                            display: window.innerWidth >= 640 ? 'inline' : 'none'
                                        }}>Copy</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(classData.id, classData.name);
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
                                        title="Delete Class"
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

export default ClassManager;