// src/utils/storageService.js

// Storage keys for different content types
const STORAGE_KEYS = {
    CLASSES: 'dnd-homebrew-classes',
    SUBCLASSES: 'dnd-homebrew-subclasses',
    RACES: 'dnd-homebrew-races',
    BACKGROUNDS: 'dnd-homebrew-backgrounds',
    ITEMS: 'dnd-homebrew-items',
    SPELLS: 'dnd-homebrew-spells',
    SETTINGS: 'dnd-homebrew-settings'
};

// Base storage functions
const getItems = (storageKey) => {
    try {
        const items = localStorage.getItem(storageKey);
        return items ? JSON.parse(items) : [];
    } catch (error) {
        console.error(`Error retrieving from ${storageKey}:`, error);
        return [];
    }
};

const saveItems = (storageKey, items) => {
    try {
        localStorage.setItem(storageKey, JSON.stringify(items));
        return true;
    } catch (error) {
        console.error(`Error saving to ${storageKey}:`, error);
        return false;
    }
};

/**
 * Save a single item
 * @param {string} storageKey - The key for the collection
 * @param {Object} item - Item to save
 * @returns {string|null} Item ID if successful, null if failed
 */
const saveItem = (storageKey, item) => {
    try {
        const items = getItems(storageKey);

        // Generate ID if needed
        if (!item.id) {
            item.id = generateId();
        }

        // Add timestamps
        const now = new Date().toISOString();
        if (!item.createdAt) {
            item.createdAt = now;
        }
        item.updatedAt = now;

        // Check if item exists
        const existingIndex = items.findIndex(i => i.id === item.id);

        if (existingIndex >= 0) {
            // Update existing item
            items[existingIndex] = item;
        } else {
            // Add new item
            items.push(item);
        }

        if (saveItems(storageKey, items)) {
            return item.id;
        }
        return null;
    } catch (error) {
        console.error(`Error saving item to ${storageKey}:`, error);
        return null;
    }
};

/**
 * Get item by ID
 * @param {string} storageKey - The key for the collection
 * @param {string} id - Item ID
 * @returns {Object|null} Item if found, null if not
 */
const getItemById = (storageKey, id) => {
    try {
        const items = getItems(storageKey);
        return items.find(item => item.id === id) || null;
    } catch (error) {
        console.error(`Error getting item from ${storageKey}:`, error);
        return null;
    }
};

/**
 * Delete item by ID
 * @param {string} storageKey - The key for the collection
 * @param {string} id - Item ID to delete
 * @returns {boolean} True if deleted, false if not
 */
const deleteItem = (storageKey, id) => {
    try {
        const items = getItems(storageKey);
        const filteredItems = items.filter(item => item.id !== id);

        if (filteredItems.length === items.length) {
            // Item not found
            return false;
        }

        return saveItems(storageKey, filteredItems);
    } catch (error) {
        console.error(`Error deleting item from ${storageKey}:`, error);
        return false;
    }
};

/**
 * Get all items with optional filtering and sorting
 * @param {string} storageKey - The key for the collection
 * @param {Object} options - Filtering and sorting options
 * @returns {Array} Filtered and sorted items
 */
const getAllItems = (storageKey, options = {}) => {
    try {
        let items = getItems(storageKey);

        // Apply filters if provided
        if (options.filters) {
            Object.entries(options.filters).forEach(([field, value]) => {
                if (value !== undefined && value !== null) {
                    items = items.filter(item => {
                        if (typeof value === 'string' && typeof item[field] === 'string') {
                            return item[field].toLowerCase().includes(value.toLowerCase());
                        }
                        return item[field] === value;
                    });
                }
            });
        }

        // Apply sorting if provided
        if (options.sortBy) {
            const { field, direction = 'asc' } = options.sortBy;
            items.sort((a, b) => {
                let valueA = a[field];
                let valueB = b[field];

                // Handle string comparison
                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    valueA = valueA.toLowerCase();
                    valueB = valueB.toLowerCase();
                }

                if (valueA < valueB) return direction === 'asc' ? -1 : 1;
                if (valueA > valueB) return direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return items;
    } catch (error) {
        console.error(`Error getting items from ${storageKey}:`, error);
        return [];
    }
};

/**
 * Export all homebrew content
 * @returns {Object} All homebrew content
 */
const exportAllContent = () => {
    const exportData = {
        formatVersion: '1.0.0',
        exportDate: new Date().toISOString(),
        content: {}
    };

    // Export each content type
    Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
        exportData.content[key] = getItems(storageKey);
    });

    return exportData;
};

/**
 * Import homebrew content
 * @param {Object} data - Data to import
 * @param {Object} options - Import options
 * @returns {Object} Import results
 */
const importContent = (data, options = { overwrite: false }) => {
    try {
        if (!data || !data.content) {
            throw new Error('Invalid import data format');
        }

        const results = {
            success: true,
            counts: {},
            errors: []
        };

        // Process each content type
        Object.entries(data.content).forEach(([key, items]) => {
            const storageKey = STORAGE_KEYS[key];

            if (!storageKey || !Array.isArray(items)) {
                results.errors.push(`Invalid content type: ${key}`);
                return;
            }

            try {
                let existingItems = getItems(storageKey);
                let importedCount = 0;

                items.forEach(item => {
                    if (!item.id) {
                        item.id = generateId();
                    }

                    const existingIndex = existingItems.findIndex(i => i.id === item.id);

                    if (existingIndex >= 0 && !options.overwrite) {
                        // Skip if exists and not overwriting
                        return;
                    }

                    if (existingIndex >= 0) {
                        // Update existing item
                        existingItems[existingIndex] = {
                            ...item,
                            updatedAt: new Date().toISOString()
                        };
                    } else {
                        // Add new item
                        const now = new Date().toISOString();
                        existingItems.push({
                            ...item,
                            createdAt: item.createdAt || now,
                            updatedAt: now
                        });
                    }

                    importedCount++;
                });

                if (importedCount > 0) {
                    saveItems(storageKey, existingItems);
                    results.counts[key] = importedCount;
                }
            } catch (error) {
                results.errors.push(`Error importing ${key}: ${error.message}`);
            }
        });

        results.success = results.errors.length === 0;
        return results;
    } catch (error) {
        console.error('Error importing data:', error);
        return {
            success: false,
            counts: {},
            errors: [error.message]
        };
    }
};

/**
 * Clear all homebrew content
 * @param {string|null} contentType - Optional content type to clear
 * @returns {boolean} Success
 */
const clearContent = (contentType = null) => {
    try {
        if (contentType) {
            // Clear specific content type
            const storageKey = STORAGE_KEYS[contentType];
            if (!storageKey) {
                return false;
            }
            localStorage.removeItem(storageKey);
        } else {
            // Clear all content
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
        }
        return true;
    } catch (error) {
        console.error('Error clearing content:', error);
        return false;
    }
};

/**
 * Get metadata about storage usage
 * @returns {Object} Storage statistics
 */
const getStorageStats = () => {
    const stats = {
        totalItems: 0,
        byType: {},
        lastUpdated: null
    };

    Object.entries(STORAGE_KEYS).forEach(([type, key]) => {
        const items = getItems(key);
        stats.byType[type] = items.length;
        stats.totalItems += items.length;

        // Find most recent update
        items.forEach(item => {
            const updatedAt = new Date(item.updatedAt || item.createdAt);
            if (!stats.lastUpdated || updatedAt > new Date(stats.lastUpdated)) {
                stats.lastUpdated = updatedAt.toISOString();
            }
        });
    });

    return stats;
};

// Helper function to generate unique IDs
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

// Convenience methods for specific content types
// Classes
const getClasses = (options) => getAllItems(STORAGE_KEYS.CLASSES, options);
const getClassById = (id) => getItemById(STORAGE_KEYS.CLASSES, id);
const saveClass = (classData) => saveItem(STORAGE_KEYS.CLASSES, classData);
const deleteClass = (id) => deleteItem(STORAGE_KEYS.CLASSES, id);

// Subclasses
const getSubclasses = (options) => getAllItems(STORAGE_KEYS.SUBCLASSES, options);
const getSubclassById = (id) => getItemById(STORAGE_KEYS.SUBCLASSES, id);
const saveSubclass = (subclass) => saveItem(STORAGE_KEYS.SUBCLASSES, subclass);
const deleteSubclass = (id) => deleteItem(STORAGE_KEYS.SUBCLASSES, id);

// Races
const getRaces = (options) => getAllItems(STORAGE_KEYS.RACES, options);
const getRaceById = (id) => getItemById(STORAGE_KEYS.RACES, id);
const saveRace = (race) => saveItem(STORAGE_KEYS.RACES, race);
const deleteRace = (id) => deleteItem(STORAGE_KEYS.RACES, id);

// Backgrounds
const getBackgrounds = (options) => getAllItems(STORAGE_KEYS.BACKGROUNDS, options);
const getBackgroundById = (id) => getItemById(STORAGE_KEYS.BACKGROUNDS, id);
const saveBackground = (background) => saveItem(STORAGE_KEYS.BACKGROUNDS, background);
const deleteBackground = (id) => deleteItem(STORAGE_KEYS.BACKGROUNDS, id);

export {
    // Storage keys
    STORAGE_KEYS,

    // Generic methods
    getAllItems,
    getItemById,
    saveItem,
    deleteItem,

    // Import/Export
    exportAllContent,
    importContent,
    clearContent,
    getStorageStats,

    // Class methods
    getClasses,
    getClassById,
    saveClass,
    deleteClass,

    // Subclass methods
    getSubclasses,
    getSubclassById,
    saveSubclass,
    deleteSubclass,

    // Race methods
    getRaces,
    getRaceById,
    saveRace,
    deleteRace,

    // Background methods
    getBackgrounds,
    getBackgroundById,
    saveBackground,
    deleteBackground
};