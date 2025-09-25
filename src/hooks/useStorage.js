// src/hooks/useStorage.js - React Hooks for Storage Management

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    // Generic methods
    getAllItems,
    getItemById,
    saveItem,
    deleteItem,
    STORAGE_KEYS,

    // Specific methods
    getClasses,
    getClassById,
    saveClass,
    deleteClass,
    duplicateClass,

    getSubclasses,
    getSubclassById,
    saveSubclass,
    deleteSubclass,
    duplicateSubclass,

    getRaces,
    getRaceById,
    saveRace,
    deleteRace,
    duplicateRace,

    getBackgrounds,
    getBackgroundById,
    saveBackground,
    deleteBackground,
    duplicateBackground,

    exportAllContent,
    importContent,
    getStorageStats
} from '../utils/storageService';

/**
 * Generic hook for any content type
 * @param {string} contentType - The type of content (classes, races, etc.)
 * @param {Object} options - Options for filtering/sorting
 */
export const useContent = (contentType, options = {}) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const storageKey = STORAGE_KEYS[contentType.toUpperCase()];

    // Load items
    const loadItems = useCallback(() => {
        try {
            setLoading(true);
            setError(null);
            const data = getAllItems(storageKey, options);
            setItems(data);
        } catch (err) {
            console.error(`Error loading ${contentType}:`, err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [storageKey, options]);

    // Initial load
    useEffect(() => {
        loadItems();
    }, [loadItems]);

    // Save item
    const saveItemHandler = useCallback(async (item) => {
        try {
            setError(null);
            const savedId = saveItem(storageKey, item);
            if (savedId) {
                loadItems(); // Refresh list
                return savedId;
            } else {
                throw new Error('Failed to save item');
            }
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [storageKey, loadItems]);

    // Delete item
    const deleteItemHandler = useCallback(async (id) => {
        try {
            setError(null);
            const success = deleteItem(storageKey, id);
            if (success) {
                loadItems(); // Refresh list
                return true;
            } else {
                throw new Error('Failed to delete item');
            }
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [storageKey, loadItems]);

    // Get single item
    const getItem = useCallback((id) => {
        return getItemById(storageKey, id);
    }, [storageKey]);

    return {
        items,
        loading,
        error,
        saveItem: saveItemHandler,
        deleteItem: deleteItemHandler,
        getItem,
        refresh: loadItems,
        count: items.length
    };
};

/**
 * Hook for character classes
 */
export const useClasses = (options = {}) => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadClasses = useCallback(() => {
        try {
            setLoading(true);
            setError(null);
            const data = getClasses(options);
            setClasses(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [options]);

    useEffect(() => {
        loadClasses();
    }, [loadClasses]);

    const save = useCallback(async (classData) => {
        try {
            const savedId = saveClass(classData);
            if (savedId) {
                loadClasses();
                return savedId;
            }
            throw new Error('Failed to save class');
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [loadClasses]);

    const remove = useCallback(async (id) => {
        try {
            const success = deleteClass(id);
            if (success) {
                loadClasses();
                return true;
            }
            throw new Error('Failed to delete class');
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [loadClasses]);

    const duplicate = useCallback(async (classData) => {
        try {
            const duplicatedId = duplicateClass(classData);
            if (duplicatedId) {
                loadClasses();
                return duplicatedId;
            }
            throw new Error('Failed to duplicate class');
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [loadClasses]);

    const getById = useCallback((id) => {
        return getClassById(id);
    }, []);

    return {
        classes,
        loading,
        error,
        save,
        remove,
        duplicate,
        getById,
        refresh: loadClasses,
        count: classes.length
    };
};

/**
 * Hook for character races
 */
export const useRaces = (options = {}) => {
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadRaces = useCallback(() => {
        try {
            setLoading(true);
            setError(null);
            const data = getRaces(options);
            setRaces(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [options]);

    useEffect(() => {
        loadRaces();
    }, [loadRaces]);

    const save = useCallback(async (raceData) => {
        try {
            const savedId = saveRace(raceData);
            if (savedId) {
                loadRaces();
                return savedId;
            }
            throw new Error('Failed to save race');
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [loadRaces]);

    const remove = useCallback(async (id) => {
        try {
            const success = deleteRace(id);
            if (success) {
                loadRaces();
                return true;
            }
            throw new Error('Failed to delete race');
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [loadRaces]);

    const duplicate = useCallback(async (raceData) => {
        try {
            const duplicatedId = duplicateRace(raceData);
            if (duplicatedId) {
                loadRaces();
                return duplicatedId;
            }
            throw new Error('Failed to duplicate race');
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [loadRaces]);

    const getById = useCallback((id) => {
        return getRaceById(id);
    }, []);

    return {
        races,
        loading,
        error,
        save,
        remove,
        duplicate,
        getById,
        refresh: loadRaces,
        count: races.length
    };
};

/**
 * Hook for backgrounds
 */
export const useBackgrounds = (options = {}) => {
    const [backgrounds, setBackgrounds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadBackgrounds = useCallback(() => {
        try {
            setLoading(true);
            setError(null);
            const data = getBackgrounds(options);
            setBackgrounds(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [options]);

    useEffect(() => {
        loadBackgrounds();
    }, [loadBackgrounds]);

    const save = useCallback(async (backgroundData) => {
        try {
            const savedId = saveBackground(backgroundData);
            if (savedId) {
                loadBackgrounds();
                return savedId;
            }
            throw new Error('Failed to save background');
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [loadBackgrounds]);

    const remove = useCallback(async (id) => {
        try {
            const success = deleteBackground(id);
            if (success) {
                loadBackgrounds();
                return true;
            }
            throw new Error('Failed to delete background');
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [loadBackgrounds]);

    const duplicate = useCallback(async (backgroundData) => {
        try {
            const duplicatedId = duplicateBackground(backgroundData);
            if (duplicatedId) {
                loadBackgrounds();
                return duplicatedId;
            }
            throw new Error('Failed to duplicate background');
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [loadBackgrounds]);

    const getById = useCallback((id) => {
        return getBackgroundById(id);
    }, []);

    return {
        backgrounds,
        loading,
        error,
        save,
        remove,
        duplicate,
        getById,
        refresh: loadBackgrounds,
        count: backgrounds.length
    };
};

/**
 * Hook for subclasses
 */
export const useSubclasses = (options = {}) => {
    const [subclasses, setSubclasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadSubclasses = useCallback(() => {
        try {
            setLoading(true);
            setError(null);
            const data = getSubclasses(options);
            setSubclasses(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [options]);

    useEffect(() => {
        loadSubclasses();
    }, [loadSubclasses]);

    const save = useCallback(async (subclassData) => {
        try {
            const savedId = saveSubclass(subclassData);
            if (savedId) {
                loadSubclasses();
                return savedId;
            }
            throw new Error('Failed to save subclass');
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [loadSubclasses]);

    const remove = useCallback(async (id) => {
        try {
            const success = deleteSubclass(id);
            if (success) {
                loadSubclasses();
                return true;
            }
            throw new Error('Failed to delete subclass');
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [loadSubclasses]);

    const duplicate = useCallback(async (subclassData) => {
        try {
            const duplicatedId = duplicateSubclass(subclassData);
            if (duplicatedId) {
                loadSubclasses();
                return duplicatedId;
            }
            throw new Error('Failed to duplicate subclass');
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [loadSubclasses]);

    const getById = useCallback((id) => {
        return getSubclassById(id);
    }, []);

    return {
        subclasses,
        loading,
        error,
        save,
        remove,
        duplicate,
        getById,
        refresh: loadSubclasses,
        count: subclasses.length
    };
};

/**
 * Hook for managing all storage
 */
export const useStorageManager = () => {
    const [stats, setStats] = useState({
        totalItems: 0,
        byType: {},
        lastUpdated: null
    });

    const refreshStats = useCallback(() => {
        const newStats = getStorageStats();
        setStats(newStats);
    }, []);

    useEffect(() => {
        refreshStats();
    }, [refreshStats]);

    const exportAll = useCallback(() => {
        try {
            return exportAllContent();
        } catch (err) {
            console.error('Export failed:', err);
            throw err;
        }
    }, []);

    const importAll = useCallback(async (data, options = {}) => {
        try {
            const result = importContent(data, options);
            if (result.success) {
                refreshStats();
            }
            return result;
        } catch (err) {
            console.error('Import failed:', err);
            throw err;
        }
    }, [refreshStats]);

    return {
        stats,
        refreshStats,
        exportAll,
        importAll
    };
};

/**
 * Hook for a single item (for editing)
 */
export const useItem = (contentType, id) => {
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const storageKey = STORAGE_KEYS[contentType.toUpperCase()];

    const loadItem = useCallback(() => {
        try {
            setLoading(true);
            setError(null);

            if (id) {
                const data = getItemById(storageKey, id);
                setItem(data);
            } else {
                setItem(null);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [storageKey, id]);

    useEffect(() => {
        loadItem();
    }, [loadItem]);

    const save = useCallback(async (itemData) => {
        try {
            const savedId = saveItem(storageKey, itemData);
            if (savedId) {
                loadItem(); // Refresh
                return savedId;
            }
            throw new Error('Failed to save item');
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [storageKey, loadItem]);

    return {
        item,
        loading,
        error,
        save,
        refresh: loadItem
    };
};

/**
 * Hook for filtered/searched content
 */
export const useFilteredContent = (contentType, filters = {}, searchTerm = '') => {
    const { items, loading, error, ...rest } = useContent(contentType);

    const filteredItems = useMemo(() => {
        let filtered = [...items];

        // Apply search
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(search) ||
                item.description.toLowerCase().includes(search) ||
                (item.tags && item.tags.some(tag => tag.toLowerCase().includes(search)))
            );
        }

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                if (Array.isArray(value)) {
                    // Multi-select filter
                    filtered = filtered.filter(item =>
                        value.length === 0 || value.includes(item[key])
                    );
                } else {
                    // Single value filter
                    filtered = filtered.filter(item => item[key] === value);
                }
            }
        });

        return filtered;
    }, [items, filters, searchTerm]);

    return {
        items: filteredItems,
        loading,
        error,
        ...rest
    };
};