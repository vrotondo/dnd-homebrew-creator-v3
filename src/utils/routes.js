// src/utils/routes.js - Route Constants and Navigation System

/**
 * Route constants for consistent navigation
 */
export const ROUTES = {
    // Main Pages
    HOME: '/',
    ABOUT: '/about',

    // Character Creation Hub
    CHARACTER_CREATOR: '/character-creator',

    // Class Management
    CLASS_MANAGER: '/classes',
    CLASS_CREATE: '/classes/create',
    CLASS_EDIT: '/classes/:id/edit',
    CLASS_VIEW: '/classes/:id',
    CLASS_DUPLICATE: '/classes/:id/duplicate',

    // Subclass Management  
    SUBCLASS_MANAGER: '/subclasses',
    SUBCLASS_CREATE: '/subclasses/create',
    SUBCLASS_EDIT: '/subclasses/:id/edit',
    SUBCLASS_VIEW: '/subclasses/:id',

    // Race Management
    RACE_MANAGER: '/races',
    RACE_CREATE: '/races/create',
    RACE_EDIT: '/races/:id/edit',
    RACE_VIEW: '/races/:id',
    RACE_DUPLICATE: '/races/:id/duplicate',

    // Background Management
    BACKGROUND_MANAGER: '/backgrounds',
    BACKGROUND_CREATE: '/backgrounds/create',
    BACKGROUND_EDIT: '/backgrounds/:id/edit',
    BACKGROUND_VIEW: '/backgrounds/:id',
    BACKGROUND_DUPLICATE: '/backgrounds/:id/duplicate',

    // Item Management
    ITEM_MANAGER: '/items',
    ITEM_CREATE: '/items/create',
    ITEM_EDIT: '/items/:id/edit',
    ITEM_VIEW: '/items/:id',

    // Spell Management
    SPELL_MANAGER: '/spells',
    SPELL_CREATE: '/spells/create',
    SPELL_EDIT: '/spells/:id/edit',
    SPELL_VIEW: '/spells/:id',

    // Monster Management
    MONSTER_MANAGER: '/monsters',
    MONSTER_CREATE: '/monsters/create',
    MONSTER_EDIT: '/monsters/:id/edit',
    MONSTER_VIEW: '/monsters/:id',

    // World Building
    WORLD_BUILDER: '/worlds',
    WORLD_CREATE: '/worlds/create',
    WORLD_EDIT: '/worlds/:id/edit',
    WORLD_VIEW: '/worlds/:id',

    // Import/Export
    EXPORT: '/export',
    IMPORT: '/import',

    // Settings
    SETTINGS: '/settings',

    // Error Pages
    NOT_FOUND: '/404'
};

/**
 * Route helpers for dynamic routes
 */
export const routeHelpers = {
    classEdit: (id) => `/classes/${id}/edit`,
    classView: (id) => `/classes/${id}`,
    classDuplicate: (id) => `/classes/${id}/duplicate`,

    subclassEdit: (id) => `/subclasses/${id}/edit`,
    subclassView: (id) => `/subclasses/${id}`,

    raceEdit: (id) => `/races/${id}/edit`,
    raceView: (id) => `/races/${id}`,
    raceDuplicate: (id) => `/races/${id}/duplicate`,

    backgroundEdit: (id) => `/backgrounds/${id}/edit`,
    backgroundView: (id) => `/backgrounds/${id}`,
    backgroundDuplicate: (id) => `/backgrounds/${id}/duplicate`,

    itemEdit: (id) => `/items/${id}/edit`,
    itemView: (id) => `/items/${id}`,

    spellEdit: (id) => `/spells/${id}/edit`,
    spellView: (id) => `/spells/${id}`,

    monsterEdit: (id) => `/monsters/${id}/edit`,
    monsterView: (id) => `/monsters/${id}`,

    worldEdit: (id) => `/worlds/${id}/edit`,
    worldView: (id) => `/worlds/${id}`
};

/**
 * Navigation structure for sidebar and menus
 */
export const navigationStructure = [
    {
        id: 'home',
        name: 'Home',
        path: ROUTES.HOME,
        icon: 'Home',
        description: 'Dashboard and overview'
    },
    {
        id: 'creators',
        name: 'Character Creators',
        path: ROUTES.CHARACTER_CREATOR,
        icon: 'Users',
        description: 'Create character content',
        children: [
            {
                id: 'classes',
                name: 'Classes',
                path: ROUTES.CLASS_MANAGER,
                icon: 'Sword',
                badge: 'classes',
                actions: [
                    { name: 'Create New', path: ROUTES.CLASS_CREATE, icon: 'Plus' },
                    { name: 'View All', path: ROUTES.CLASS_MANAGER, icon: 'List' }
                ]
            },
            {
                id: 'subclasses',
                name: 'Subclasses',
                path: ROUTES.SUBCLASS_MANAGER,
                icon: 'Shield',
                badge: 'subclasses',
                actions: [
                    { name: 'Create New', path: ROUTES.SUBCLASS_CREATE, icon: 'Plus' },
                    { name: 'View All', path: ROUTES.SUBCLASS_MANAGER, icon: 'List' }
                ]
            },
            {
                id: 'races',
                name: 'Races',
                path: ROUTES.RACE_MANAGER,
                icon: 'Crown',
                badge: 'races',
                actions: [
                    { name: 'Create New', path: ROUTES.RACE_CREATE, icon: 'Plus' },
                    { name: 'View All', path: ROUTES.RACE_MANAGER, icon: 'List' }
                ]
            },
            {
                id: 'backgrounds',
                name: 'Backgrounds',
                path: ROUTES.BACKGROUND_MANAGER,
                icon: 'BookOpen',
                badge: 'backgrounds',
                actions: [
                    { name: 'Create New', path: ROUTES.BACKGROUND_CREATE, icon: 'Plus' },
                    { name: 'View All', path: ROUTES.BACKGROUND_MANAGER, icon: 'List' }
                ]
            }
        ]
    },
    {
        id: 'world',
        name: 'World Building',
        path: ROUTES.WORLD_BUILDER,
        icon: 'Map',
        description: 'Create settings and worlds',
        comingSoon: true
    },
    {
        id: 'content',
        name: 'Game Content',
        icon: 'Scroll',
        description: 'Items, spells, and monsters',
        children: [
            {
                id: 'items',
                name: 'Magic Items',
                path: ROUTES.ITEM_MANAGER,
                icon: 'Gem',
                badge: 'items',
                comingSoon: true
            },
            {
                id: 'spells',
                name: 'Spells',
                path: ROUTES.SPELL_MANAGER,
                icon: 'Zap',
                badge: 'spells',
                comingSoon: true
            },
            {
                id: 'monsters',
                name: 'Monsters',
                path: ROUTES.MONSTER_MANAGER,
                icon: 'Dragon',
                badge: 'monsters',
                comingSoon: true
            }
        ]
    },
    {
        id: 'tools',
        name: 'Tools',
        icon: 'Settings',
        description: 'Import, export, and settings',
        children: [
            {
                id: 'export',
                name: 'Export Content',
                path: ROUTES.EXPORT,
                icon: 'Download',
                description: 'Export to PDF or JSON'
            },
            {
                id: 'import',
                name: 'Import Content',
                path: ROUTES.IMPORT,
                icon: 'Upload',
                description: 'Import from files'
            },
            {
                id: 'settings',
                name: 'Settings',
                path: ROUTES.SETTINGS,
                icon: 'Settings',
                description: 'App preferences'
            }
        ]
    },
    {
        id: 'about',
        name: 'About',
        path: ROUTES.ABOUT,
        icon: 'Info',
        description: 'About this app'
    }
];

/**
 * Breadcrumb generation
 */
export const generateBreadcrumbs = (pathname, contentData = {}) => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Home', path: '/' }];

    let currentPath = '';

    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        currentPath += `/${segment}`;

        // Handle different route patterns
        if (segment === 'classes') {
            breadcrumbs.push({ name: 'Classes', path: '/classes' });
        } else if (segment === 'races') {
            breadcrumbs.push({ name: 'Races', path: '/races' });
        } else if (segment === 'backgrounds') {
            breadcrumbs.push({ name: 'Backgrounds', path: '/backgrounds' });
        } else if (segment === 'subclasses') {
            breadcrumbs.push({ name: 'Subclasses', path: '/subclasses' });
        } else if (segment === 'character-creator') {
            breadcrumbs.push({ name: 'Character Creator', path: '/character-creator' });
        } else if (segment === 'create') {
            breadcrumbs.push({ name: 'Create New', path: currentPath });
        } else if (segment === 'edit') {
            breadcrumbs.push({ name: 'Edit', path: currentPath });
        } else if (segment === 'duplicate') {
            breadcrumbs.push({ name: 'Duplicate', path: currentPath });
        } else if (segment.match(/^[a-z0-9]+$/i) && i === segments.length - 1) {
            // This is likely an ID - use content data if available
            const itemName = contentData?.name || `Item ${segment.slice(0, 8)}...`;
            breadcrumbs.push({ name: itemName, path: currentPath });
        } else {
            // Capitalize and add
            const name = segment.charAt(0).toUpperCase() + segment.slice(1);
            breadcrumbs.push({ name, path: currentPath });
        }
    }

    return breadcrumbs;
};

/**
 * Route validation and guards
 */
export const routeGuards = {
    /**
     * Check if user has unsaved changes before leaving
     */
    hasUnsavedChanges: (formData, originalData) => {
        if (!originalData) return Object.keys(formData).some(key => formData[key]);
        return JSON.stringify(formData) !== JSON.stringify(originalData);
    },

    /**
     * Validate route parameters
     */
    validateParams: (params, requirements = {}) => {
        const errors = [];

        Object.entries(requirements).forEach(([param, rules]) => {
            const value = params[param];

            if (rules.required && !value) {
                errors.push(`${param} is required`);
            }

            if (rules.pattern && value && !rules.pattern.test(value)) {
                errors.push(`${param} has invalid format`);
            }

            if (rules.minLength && value && value.length < rules.minLength) {
                errors.push(`${param} is too short`);
            }
        });

        return { isValid: errors.length === 0, errors };
    },

    /**
     * Check if content exists before showing edit/view pages
     */
    contentExists: (contentType, id, storageService) => {
        try {
            const item = storageService.getItemById(contentType, id);
            return !!item;
        } catch {
            return false;
        }
    }
};

/**
 * Navigation context helpers
 */
export const navigationHelpers = {
    /**
     * Get the active navigation item based on current path
     */
    getActiveNavItem: (pathname) => {
        // Find the matching navigation item
        const findActive = (items, path) => {
            for (const item of items) {
                if (item.path === path) return item;
                if (item.children) {
                    const childMatch = findActive(item.children, path);
                    if (childMatch) return childMatch;
                }
                if (item.path && path.startsWith(item.path + '/')) return item;
            }
            return null;
        };

        return findActive(navigationStructure, pathname);
    },

    /**
     * Get page title based on route
     */
    getPageTitle: (pathname, contentData = {}) => {
        if (pathname === '/') return 'Dashboard';
        if (pathname === '/about') return 'About';
        if (pathname === '/character-creator') return 'Character Creator';

        if (pathname.startsWith('/classes')) {
            if (pathname.includes('/create')) return 'Create Class';
            if (pathname.includes('/edit')) return `Edit ${contentData.name || 'Class'}`;
            if (pathname === '/classes') return 'Manage Classes';
            return contentData.name || 'Class Details';
        }

        if (pathname.startsWith('/races')) {
            if (pathname.includes('/create')) return 'Create Race';
            if (pathname.includes('/edit')) return `Edit ${contentData.name || 'Race'}`;
            if (pathname === '/races') return 'Manage Races';
            return contentData.name || 'Race Details';
        }

        if (pathname.startsWith('/backgrounds')) {
            if (pathname.includes('/create')) return 'Create Background';
            if (pathname.includes('/edit')) return `Edit ${contentData.name || 'Background'}`;
            if (pathname === '/backgrounds') return 'Manage Backgrounds';
            return contentData.name || 'Background Details';
        }

        // Default fallback
        const segments = pathname.split('/').filter(Boolean);
        return segments.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    },

    /**
     * Check if current path matches navigation item
     */
    isPathActive: (itemPath, currentPath) => {
        if (itemPath === currentPath) return true;
        if (itemPath !== '/' && currentPath.startsWith(itemPath + '/')) return true;
        return false;
    }
};