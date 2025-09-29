// src/pages/HomePage.jsx - Full Modern Version
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    Sword,
    Crown,
    BookOpen,
    Map,
    Shield,
    Scroll,
    Zap,
    Download,
    Sparkles,
    ArrowRight,
    Play,
    Star,
    TrendingUp,
    Clock,
    CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, Button, Badge, Alert } from '../components/ui';

function HomePage() {
    const [stats, setStats] = useState({
        classes: 0,
        races: 0,
        backgrounds: 0,
        totalCreations: 0
    });

    useEffect(() => {
        loadUserStats();
    }, []);

    const loadUserStats = () => {
        try {
            const classes = JSON.parse(localStorage.getItem('dnd-homebrew-classes') || '[]');
            const races = JSON.parse(localStorage.getItem('dnd-homebrew-races') || '[]');
            const backgrounds = JSON.parse(localStorage.getItem('dnd-homebrew-backgrounds') || '[]');

            setStats({
                classes: classes.length,
                races: races.length,
                backgrounds: backgrounds.length,
                totalCreations: classes.length + races.length + backgrounds.length
            });
        } catch (error) {
            console.error('Error loading user stats:', error);
        }
    };

    const creators = [
        {
            id: 'class',
            title: 'Character Classes',
            description: 'Design powerful classes with unique abilities, spell progressions, and features that define how characters grow.',
            icon: Sword,
            bgColor: '#fee2e2',
            textColor: '#dc2626',
            link: '/character-creator',
            stats: stats.classes,
            features: ['20 Levels of Progression', 'Subclass Support', 'Feature Management', 'SRD Validation']
        },
        {
            id: 'race',
            title: 'Character Races',
            description: 'Create diverse races with custom traits, ability score improvements, and unique cultural features.',
            icon: Crown,
            bgColor: '#f3e8ff',
            textColor: '#7c3aed',
            link: '/races/create',
            stats: stats.races,
            features: ['Ability Score Bonuses', 'Racial Traits', 'Subrace Support', 'Language Options']
        },
        {
            id: 'background',
            title: 'Backgrounds',
            description: 'Craft compelling backstories with skill proficiencies, equipment, and unique background features.',
            icon: BookOpen,
            bgColor: '#dbeafe',
            textColor: '#2563eb',
            link: '/backgrounds/create',
            stats: stats.backgrounds,
            features: ['Skill Proficiencies', 'Starting Equipment', 'Background Features', 'Personality Traits']
        },
        {
            id: 'world',
            title: 'World Builder',
            description: 'Create immersive campaign settings, regions, and lore for unforgettable adventures.',
            icon: Map,
            bgColor: '#dcfce7',
            textColor: '#16a34a',
            link: '#',
            stats: 0,
            features: ['Coming Soon', 'Campaign Settings', 'Region Builder', 'Lore Management'],
            comingSoon: true
        }
    ];

    const quickActions = [
        { title: 'Start from Template', icon: Play, description: 'Use pre-made templates' },
        { title: 'Import Content', icon: Download, description: 'Import existing homebrew' },
        { title: 'Browse SRD', icon: Shield, description: 'Reference official content' },
        { title: 'Export All', icon: Zap, description: 'Export your creations' }
    ];

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <Card
                className="border-0 text-white"
                style={{
                    background: 'linear-gradient(135deg, #9333ea 0%, #2563eb 50%, #4f46e5 100%)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <CardContent className="p-8 relative">
                    {/* Background decoration */}
                    <div
                        className="absolute top-0 right-0"
                        style={{
                            width: '16rem',
                            height: '16rem',
                            opacity: 0.1,
                            transform: 'translate(4rem, -4rem)'
                        }}
                    >
                        <Scroll style={{ width: '100%', height: '100%' }} />
                    </div>

                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <div className="flex items-center mb-4">
                            <div
                                className="flex items-center justify-center mr-4 rounded-full"
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                                }}
                            >
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <Badge
                                variant="default"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    color: 'white'
                                }}
                            >
                                v3.0 Beta
                            </Badge>
                        </div>

                        <h1 className="font-bold mb-4" style={{
                            fontSize: window.innerWidth >= 768 ? '3rem' : '2.25rem',
                            lineHeight: '1.1'
                        }}>
                            Welcome to D&D Homebrew Creator
                        </h1>

                        <p
                            className="mb-8"
                            style={{
                                fontSize: window.innerWidth >= 768 ? '1.5rem' : '1.25rem',
                                color: '#bfdbfe',
                                maxWidth: '48rem',
                                lineHeight: '1.6'
                            }}
                        >
                            Create, manage, and export your own D&D 5E homebrew content while ensuring
                            SRD compliance. Design classes, races, backgrounds, and entire worlds.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button
                                size="lg"
                                style={{
                                    backgroundColor: 'white',
                                    color: '#7c3aed',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <Users className="w-5 h-5 mr-2" />
                                Start Creating
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                style={{
                                    color: 'white',
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                <Shield className="w-5 h-5 mr-2" />
                                Learn About SRD
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Overview */}
            <div
                className="grid gap-6"
                style={{
                    gridTemplateColumns: window.innerWidth >= 1024 ? 'repeat(4, minmax(0, 1fr))' :
                        window.innerWidth >= 768 ? 'repeat(2, minmax(0, 1fr))' :
                            'repeat(1, minmax(0, 1fr))'
                }}
            >
                {[
                    {
                        title: 'Your Creations',
                        count: stats.totalCreations,
                        icon: Sparkles,
                        color: '#7c3aed',
                        bg: '#f3e8ff',
                        trend: 'Growing collection'
                    },
                    {
                        title: 'SRD Classes',
                        count: 12,
                        icon: Sword,
                        color: '#dc2626',
                        bg: '#fee2e2',
                        trend: 'Official reference'
                    },
                    {
                        title: 'SRD Races',
                        count: 8,
                        icon: Crown,
                        color: '#7c3aed',
                        bg: '#f3e8ff',
                        trend: 'Validated content'
                    },
                    {
                        title: 'Quick Actions',
                        count: quickActions.length,
                        icon: Zap,
                        color: '#16a34a',
                        bg: '#dcfce7',
                        trend: 'Ready to use'
                    }
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            {stat.title}
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {stat.count}
                                        </p>
                                    </div>
                                    <div
                                        className="rounded-full flex items-center justify-center"
                                        style={{
                                            width: '3rem',
                                            height: '3rem',
                                            backgroundColor: stat.bg
                                        }}
                                    >
                                        <Icon style={{ width: '1.5rem', height: '1.5rem', color: stat.color }} />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center text-sm" style={{ color: stat.color }}>
                                        <TrendingUp className="w-4 h-4 mr-1" />
                                        {stat.trend}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Creator Cards */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Choose Your Creator
                </h2>

                <div
                    className="grid gap-8"
                    style={{
                        gridTemplateColumns: window.innerWidth >= 1024 ? 'repeat(2, minmax(0, 1fr))' : '1fr'
                    }}
                >
                    {creators.map((creator) => {
                        const Icon = creator.icon;

                        return (
                            <Card key={creator.id} className="group relative" style={{ overflow: 'hidden' }}>
                                <div
                                    className="absolute top-0 right-0 group-hover:scale-110 transition-transform"
                                    style={{
                                        width: '8rem',
                                        height: '8rem',
                                        opacity: 0.05,
                                        transform: 'translate(2rem, -2rem)'
                                    }}
                                >
                                    <Icon style={{ width: '100%', height: '100%' }} />
                                </div>

                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className="rounded-lg flex items-center justify-center"
                                                style={{
                                                    width: '3rem',
                                                    height: '3rem',
                                                    backgroundColor: creator.bgColor
                                                }}
                                            >
                                                <Icon style={{ width: '1.5rem', height: '1.5rem', color: creator.textColor }} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {creator.title}
                                                </h3>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <Badge variant="primary">{creator.stats} created</Badge>
                                                    {creator.comingSoon && (
                                                        <Badge variant="warning">Coming Soon</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    <p className="text-gray-600 mb-6" style={{ lineHeight: '1.75' }}>
                                        {creator.description}
                                    </p>

                                    <div className="space-y-3 mb-6">
                                        <h4 className="font-semibold text-gray-900 text-sm">
                                            Features:
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {creator.features.map((feature, index) => (
                                                <div key={index} className="flex items-center text-sm">
                                                    <CheckCircle
                                                        style={{
                                                            width: '1rem',
                                                            height: '1rem',
                                                            marginRight: '0.5rem',
                                                            color: creator.comingSoon ? '#9ca3af' : creator.textColor
                                                        }}
                                                    />
                                                    <span style={{
                                                        color: creator.comingSoon ? '#6b7280' : '#374151'
                                                    }}>
                                                        {feature}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {creator.comingSoon ? (
                                        <Button variant="secondary" className="w-full" disabled>
                                            Coming Soon
                                        </Button>
                                    ) : (
                                        <Link to={creator.link} className="block">
                                            <Button className="w-full group">
                                                Start Building
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Quick Actions
                </h2>

                <div
                    className="grid gap-4"
                    style={{
                        gridTemplateColumns: window.innerWidth >= 1024 ? 'repeat(4, minmax(0, 1fr))' :
                            window.innerWidth >= 768 ? 'repeat(2, minmax(0, 1fr))' : '1fr'
                    }}
                >
                    {quickActions.map((action, index) => {
                        const Icon = action.icon;

                        return (
                            <Card
                                key={index}
                                className="group cursor-pointer hover:shadow-xl transition-all"
                                style={{
                                    border: '1px solid #e5e7eb'
                                }}
                            >
                                <CardContent className="p-6 text-center">
                                    <div
                                        className="rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                                        style={{
                                            width: '3rem',
                                            height: '3rem',
                                            background: 'linear-gradient(135deg, #f3e8ff, #dbeafe)'
                                        }}
                                    >
                                        <Icon style={{ width: '1.5rem', height: '1.5rem', color: '#7c3aed' }} />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        {action.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {action.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Getting Started */}
            <Card>
                <CardHeader>
                    <h2 className="text-2xl font-bold text-gray-900">Getting Started</h2>
                    <p className="text-gray-600">Follow these steps to create your first homebrew content</p>
                </CardHeader>
                <CardContent>
                    <div
                        className="grid gap-6"
                        style={{
                            gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(3, minmax(0, 1fr))' : '1fr'
                        }}
                    >
                        {[
                            {
                                step: '1',
                                title: 'Choose a Creator',
                                description: 'Select what type of content you want to create',
                                color: '#3b82f6'
                            },
                            {
                                step: '2',
                                title: 'Build Your Content',
                                description: 'Use our intuitive tools to craft your homebrew',
                                color: '#7c3aed'
                            },
                            {
                                step: '3',
                                title: 'Export & Share',
                                description: 'Export your creation and share with others',
                                color: '#16a34a'
                            }
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg"
                                    style={{ backgroundColor: item.color }}
                                >
                                    {item.step}
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Tips */}
            <div
                className="grid gap-8"
                style={{
                    gridTemplateColumns: window.innerWidth >= 1024 ? 'repeat(2, minmax(0, 1fr))' : '1fr'
                }}
            >
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Pro Tips
                        </h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            {
                                title: 'Start Simple',
                                description: 'Begin with basic concepts and add complexity as you learn'
                            },
                            {
                                title: 'Test Your Content',
                                description: 'Playtest homebrew content to ensure it\'s balanced and fun'
                            },
                            {
                                title: 'Use Templates',
                                description: 'Official classes and races make excellent starting templates'
                            }
                        ].map((tip, index) => (
                            <div key={index} className="flex items-start space-x-3">
                                <Star className="w-5 h-5 text-yellow-500" style={{ marginTop: '0.125rem' }} />
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {tip.title}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {tip.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold text-gray-900">
                            SRD Compliance
                        </h3>
                    </CardHeader>
                    <CardContent>
                        <Alert variant="info" title="Important Notice">
                            Always reference the Systems Reference Document to ensure your homebrew
                            content can be safely shared without copyright issues. This tool helps
                            validate your content against SRD guidelines.
                        </Alert>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center text-sm text-green-600">
                                <Shield className="w-4 h-4 mr-2" />
                                SRD-compliant content validation built-in
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default HomePage;