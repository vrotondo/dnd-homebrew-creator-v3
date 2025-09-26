// src/pages/ClassManager.jsx - Updated with proper styling and UI components
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardContent,
    Button,
    Input,
    Badge,
    EmptyState
} from '../components/ui';
import {
    Plus,
    Search,
    Filter,
    Edit,
    Copy,
    Download,
    Trash2,
    Eye,
    Clock,
    Star,
    Sword,
    Shield,
    Heart,
    X
} from 'lucide-react';
import {
    getClasses, deleteClass, duplicateClass,
    getSubclasses, deleteSubclass, duplicateSubclass,
    getClassById
} from '../utils/storageService';
import ExportModal from '../components/export/ExportModal';

function ClassManager() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('classes');
    const [classes, setClasses] = useState([]);
    const [subclasses, setSubclasses] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState({ field: 'updatedAt', direction: 'desc' });
    const [selectedItem, setSelectedItem] = useState(null);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
        classes: {
            hitDice: [],
            primaryAbility: []
        },
        subclasses: {
            parentClass: []
        }
    });

    // Load data on component mount and when tab changes
    useEffect(() => {
        loadData();
    }, [activeTab]);

    // Load classes and subclasses
    const loadData = () => {
        if (activeTab === 'classes') {
            loadClasses();
        } else {
            loadSubclasses();
        }
    };

    // Apply filters and search
    const applyFilters = (items, search, filters, type) => {
        let filtered = items;

        // Apply search filter
        if (search) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
            );
        }

        // Apply type-specific filters
        if (type === 'classes') {
            if (filters.hitDice && filters.hitDice.length > 0) {
                filtered = filtered.filter(item => filters.hitDice.includes(item.hitDie));
            }
            if (filters.primaryAbility && filters.primaryAbility.length > 0) {
                filtered = filtered.filter(item =>
                    item.primaryAbility && item.primaryAbility.some(ability =>
                        filters.primaryAbility.includes(ability)
                    )
                );
            }
        } else if (type === 'subclasses') {
            if (filters.parentClass && filters.parentClass.length > 0) {
                filtered = filtered.filter(item => filters.parentClass.includes(item.parentClass));
            }
        }

        setFilteredItems(filtered);
    };

    // Load classes
    const loadClasses = () => {
        const allClasses = getClasses({ sortBy });
        setClasses(allClasses);
        applyFilters(allClasses, searchTerm, filterOptions.classes, 'classes');
    };

    // Load subclasses
    const loadSubclasses = () => {
        const allSubclasses = getSubclasses({ sortBy });
        setSubclasses(allSubclasses);
        applyFilters(allSubclasses, searchTerm, filterOptions.subclasses, 'subclasses');
    };

    // Handle search
    const handleSearch = (e) => {
        const search = e.target.value;
        setSearchTerm(search);
        const items = activeTab === 'classes' ? classes : subclasses;
        const filters = activeTab === 'classes' ? filterOptions.classes : filterOptions.subclasses;
        applyFilters(items, search, filters, activeTab);
    };

    // Handle item actions
    const handleEdit = (item) => {
        if (activeTab === 'classes') {
            navigate(`/character-creator/class/${item.id}`);
        } else {
            navigate(`/character-creator/subclass/${item.id}`);
        }
    };

    const handleDelete = (item) => {
        if (window.confirm(`Are you sure you want to delete "${item.name}"? This cannot be undone.`)) {
            if (activeTab === 'classes') {
                deleteClass(item.id);
                loadClasses();
            } else {
                deleteSubclass(item.id);
                loadSubclasses();
            }
        }
    };

    const handleDuplicate = (item) => {
        if (activeTab === 'classes') {
            duplicateClass(item);
            loadClasses();
        } else {
            duplicateSubclass(item);
            loadSubclasses();
        }
    };

    const handleExport = (item) => {
        setSelectedItem(item);
        setShowExportModal(true);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get features count
    const getFeaturesCount = (item) => {
        if (!item.features) return 0;
        return Object.values(item.features).reduce((total, levelFeatures) =>
            total + (levelFeatures ? levelFeatures.length : 0), 0
        );
    };

    const currentItems = filteredItems;
    const emptyText = searchTerm || showFilters
        ? `No ${activeTab} found matching your criteria.`
        : `You haven't created any ${activeTab} yet.`;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Manage Classes & Subclasses
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                View, edit, and organize your homebrew character classes
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {activeTab === 'classes' ? (
                                <Link to="/character-creator/class/new">
                                    <Button className="gap-2">
                                        <Plus className="w-4 h-4" />
                                        Create Class
                                    </Button>
                                </Link>
                            ) : (
                                <Link to="/character-creator/subclass/new">
                                    <Button className="gap-2">
                                        <Plus className="w-4 h-4" />
                                        Create Subclass
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Tab Navigation */}
                <Card className="mb-6">
                    <CardContent className="p-0">
                        <div className="flex border-b border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setActiveTab('classes')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'classes'
                                        ? 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Sword className="w-4 h-4" />
                                    Classes ({classes.length})
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('subclasses')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'subclasses'
                                        ? 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Subclasses ({subclasses.length})
                                </div>
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Search and Controls */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        type="text"
                                        placeholder={`Search ${activeTab}...`}
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="gap-2"
                                >
                                    <Filter className="w-4 h-4" />
                                    Filters
                                </Button>
                                <select
                                    value={`${sortBy.field}-${sortBy.direction}`}
                                    onChange={(e) => {
                                        const [field, direction] = e.target.value.split('-');
                                        setSortBy({ field, direction });
                                        loadData();
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="updatedAt-desc">Recently Updated</option>
                                    <option value="updatedAt-asc">Oldest First</option>
                                    <option value="name-asc">Name A-Z</option>
                                    <option value="name-desc">Name Z-A</option>
                                    <option value="createdAt-desc">Recently Created</option>
                                    <option value="createdAt-asc">Oldest Created</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Content Grid */}
                {currentItems.length === 0 ? (
                    <EmptyState
                        title={`No ${activeTab} found`}
                        description={emptyText}
                        icon={activeTab === 'classes' ? Sword : Shield}
                        action={
                            !searchTerm && !showFilters ? (
                                activeTab === 'classes' ? (
                                    <Link to="/character-creator/class/new">
                                        <Button className="gap-2">
                                            <Plus className="w-4 h-4" />
                                            Create Your First Class
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link to="/character-creator/subclass/new">
                                        <Button className="gap-2">
                                            <Plus className="w-4 h-4" />
                                            Create Your First Subclass
                                        </Button>
                                    </Link>
                                )
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setShowFilters(false);
                                        loadData();
                                    }}
                                    className="gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Clear Filters
                                </Button>
                            )
                        }
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentItems.map(item => (
                            <Card key={item.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                                                {item.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                {activeTab === 'classes' ? (
                                                    <>
                                                        {item.hitDie && (
                                                            <Badge variant="outline" className="gap-1">
                                                                <Heart className="w-3 h-3" />
                                                                d{item.hitDie}
                                                            </Badge>
                                                        )}
                                                        {item.spellcasting?.enabled && (
                                                            <Badge variant="secondary">
                                                                Spellcaster
                                                            </Badge>
                                                        )}
                                                    </>
                                                ) : (
                                                    <Badge variant="outline">
                                                        {getClassById(item.parentClass)?.name || 'Unknown Class'}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(item)}
                                                className="p-2"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                                        {item.description || 'No description provided'}
                                    </p>

                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3" />
                                            {getFeaturesCount(item)} features
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(item.updatedAt)}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(item)}
                                            className="flex-1 gap-1"
                                        >
                                            <Edit className="w-3 h-3" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDuplicate(item)}
                                            className="gap-1"
                                        >
                                            <Copy className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleExport(item)}
                                            className="gap-1"
                                        >
                                            <Download className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(item)}
                                            className="gap-1 text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Export Modal */}
            {showExportModal && selectedItem && (
                <ExportModal
                    classData={selectedItem}
                    onClose={() => {
                        setShowExportModal(false);
                        setSelectedItem(null);
                    }}
                />
            )}
        </div>
    );
}

export default ClassManager;