// src/pages/CharacterCreatorPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Sword,
    Crown,
    BookOpen,
    Shield,
    Plus,
    Search,
    Filter,
    Grid,
    List,
    Calendar,
    Edit,
    Trash2,
    Eye,
    Download,
    Upload,
    Star,
    Clock,
    User,
    Zap
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    Button,
    SearchInput,
    Badge,
    EmptyState,
    ActionButton,
    Alert
} from '../components/ui';

function CharacterCreatorPage() {
    const [stats, setStats] = useState({
        classes: 0,
        races: 0,
        backgrounds: 0,
        total: 0
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = () => {
        try {
            const classes = JSON.parse(localStorage.getItem('dnd-homebrew-classes') || '[]');
            const races = JSON.parse(localStorage.getItem('dnd-homebrew-races') || '[]');
            const backgrounds = JSON.parse(localStorage.getItem('dnd-homebrew-backgrounds') || '[]');

            setStats({
                classes: classes.length,
                races: races.length,
                backgrounds: backgrounds.length,
                total: classes.length + races.length + backgrounds.length
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const creatorTypes = [
        {
            id: 'class',
            title: 'Character Class',
            description: 'Design powerful classes with unique abilities, spell progressions, and 20 levels of features.',
            icon: Sword,
            bgColor: '#fee2e2',
            textColor: '#dc2626',
            borderColor: '#fecaca',
            route: '/character-creator/class/new',
            manageRoute: '/class-manager',
            examples: ['Fighter', 'Wizard', 'Rogue', 'Cleric'],
            difficulty: 'Advanced'
        },
        {
            id: 'subclass',
            title: 'Subclass',
            description: 'Create specialized archetypes that enhance existing classes with thematic features.',
            icon: Shield,
            bgColor: '#fff7ed',
            textColor: '#ea580c',
            borderColor: '#fed7aa',
            route: '/character-creator/subclass/new',
            examples: ['Champion', 'School of Evocation', 'Assassin'],
            difficulty: 'Intermediate'
        },
        {
            id: 'race',
            title: 'Character Race',
            description: 'Build diverse races with custom traits, ability score improvements, and cultural features.',
            icon: Crown,
            bgColor: '#f3e8ff',
            textColor: '#7c3aed',
            borderColor: '#e9d5ff',
            route: '/character/races/create',
            manageRoute: '/character/races',
            examples: ['Elf', 'Dwarf', 'Human', 'Dragonborn'],
            difficulty: 'Beginner'
        },
        {
            id: 'background',
            title: 'Background',
            description: 'Craft compelling backstories with skill proficiencies, equipment, and unique features.',
            icon: BookOpen,
            bgColor: '#dbeafe',
            textColor: '#2563eb',
            borderColor: '#bfdbfe',
            route: '/character/backgrounds/create',
            manageRoute: '/character/backgrounds',
            examples: ['Acolyte', 'Criminal', 'Folk Hero', 'Noble'],
            difficulty: 'Beginner'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Character Creator
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Build custom character classes, subclasses, races, and backgrounds for your D&D campaigns.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <Badge variant="primary" className="hidden sm:inline-flex">
                        {stats.total} Total Creations
                    </Badge>
                    <Button variant="outline" icon={Upload}>
                        Import
                    </Button>
                    <Button variant="outline" icon={Download}>
                        Export All
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div
                className="grid gap-6"
                style={{
                    gridTemplateColumns: window.innerWidth >= 1024 ? 'repeat(4, minmax(0, 1fr))' :
                        window.innerWidth >= 768 ? 'repeat(2, minmax(0, 1fr))' :
                            'repeat(1, minmax(0, 1fr))'
                }}
            >
                {[
                    { title: 'Classes', count: stats.classes, icon: Sword, color: '#dc2626', bg: '#fee2e2' },
                    { title: 'Races', count: stats.races, icon: Crown, color: '#7c3aed', bg: '#f3e8ff' },
                    { title: 'Backgrounds', count: stats.backgrounds, icon: BookOpen, color: '#2563eb', bg: '#dbeafe' },
                    { title: 'SRD Reference', count: 20, icon: Shield, color: '#16a34a', bg: '#dcfce7' }
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
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Creator Selection */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Choose Your Creator
                </h2>

                <div
                    className="grid gap-6"
                    style={{
                        gridTemplateColumns: window.innerWidth >= 1024 ? 'repeat(2, minmax(0, 1fr))' : '1fr'
                    }}
                >
                    {creatorTypes.map((creator) => {
                        const Icon = creator.icon;

                        return (
                            <Card
                                key={creator.id}
                                className="group border-2 hover:shadow-xl transition-all duration-300"
                                style={{ borderColor: creator.borderColor }}
                            >
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div
                                                className="flex items-center justify-center group-hover:scale-110 transition-transform rounded-xl"
                                                style={{
                                                    width: '4rem',
                                                    height: '4rem',
                                                    backgroundColor: creator.bgColor
                                                }}
                                            >
                                                <Icon style={{ width: '2rem', height: '2rem', color: creator.textColor }} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {creator.title}
                                                </h3>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <Badge variant="primary">{creator.difficulty}</Badge>
                                                    {creator.manageRoute && (
                                                        <Link to={creator.manageRoute}>
                                                            <Badge variant="outline" className="hover:bg-gray-100 cursor-pointer">
                                                                Manage
                                                            </Badge>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    <p className="text-gray-600 mb-4 leading-relaxed">
                                        {creator.description}
                                    </p>

                                    <div className="mb-6">
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                            Examples:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {creator.examples.map((example, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                                >
                                                    {example}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <Link to={creator.route} className="block">
                                        <Button className="w-full group">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create New {creator.title}
                                            <Zap className="w-4 h-4 ml-2 group-hover:text-yellow-300 transition-colors" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Your Creations Preview */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Your Recent Creations
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Your latest homebrew content
                            </p>
                        </div>
                        <Link to="/character/races">
                            <Button variant="outline" size="sm">
                                View All
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {stats.total === 0 ? (
                        <EmptyState
                            title="No creations yet"
                            description="Start building your first homebrew content using the creators above"
                            icon={User}
                            action={
                                <div className="space-x-3">
                                    <Link to="/character-creator/class/new">
                                        <Button>
                                            <Sword className="w-4 h-4 mr-2" />
                                            Create Class
                                        </Button>
                                    </Link>
                                    <Link to="/character/races/create">
                                        <Button variant="outline">
                                            <Crown className="w-4 h-4 mr-2" />
                                            Create Race
                                        </Button>
                                    </Link>
                                </div>
                            }
                        />
                    ) : (
                        <div className="text-center py-8">
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Star className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Great work!
                            </h3>
                            <p className="text-gray-600 mb-4">
                                You have {stats.total} homebrew creations. Keep building amazing content!
                            </p>
                            <div className="flex justify-center space-x-3">
                                <Link to="/class-manager">
                                    <Button variant="outline">Manage Classes</Button>
                                </Link>
                                <Link to="/character/races">
                                    <Button variant="outline">Manage Races</Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* SRD Reference */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                SRD Reference
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Official D&D 5e content for reference and validation
                            </p>
                        </div>
                        <Badge variant="success">
                            Available
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <Alert variant="info" title="SRD Integration">
                        This tool integrates with the official D&D 5e Systems Reference Document to help validate
                        your homebrew content and ensure compatibility with published rules.
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
}

export default CharacterCreatorPage;