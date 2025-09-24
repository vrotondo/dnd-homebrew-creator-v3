// src/hooks/useDndApi.js
import { useState, useEffect, useCallback } from 'react';
import dndApiService from '../services/dndApiService';

/**
 * Custom hook for D&D API operations with loading states and error handling
 */
export const useDndApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiCall = useCallback(async (apiFunction, ...args) => {
        setLoading(true);
        setError(null);

        try {
            const result = await apiFunction(...args);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        apiCall,
        clearError: () => setError(null)
    };
};

/**
 * Hook for fetching and caching class data
 */
export const useClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await dndApiService.getClasses();
                setClasses(data.results || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    const getClass = useCallback(async (classIndex) => {
        try {
            return await dndApiService.getClass(classIndex);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const getClassFeatures = useCallback(async (classIndex) => {
        try {
            return await dndApiService.getClassFeatures(classIndex);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    return {
        classes,
        loading,
        error,
        getClass,
        getClassFeatures,
        refetch: () => {
            setLoading(true);
            setError(null);
            // Trigger refetch
        }
    };
};

/**
 * Hook for fetching and caching race data
 */
export const useRaces = () => {
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRaces = async () => {
            try {
                const data = await dndApiService.getRaces();
                setRaces(data.results || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRaces();
    }, []);

    const getRace = useCallback(async (raceIndex) => {
        try {
            return await dndApiService.getRace(raceIndex);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    return {
        races,
        loading,
        error,
        getRace
    };
};

/**
 * Hook for fetching skills data
 */
export const useSkills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const data = await dndApiService.getSkills();
                setSkills(data.results || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    return { skills, loading, error };
};

/**
 * Hook for fetching equipment data
 */
export const useEquipment = () => {
    const [equipment, setEquipment] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const [equipmentData, categoriesData] = await Promise.all([
                    dndApiService.getEquipment(),
                    dndApiService.getEquipmentCategories()
                ]);

                setEquipment(equipmentData.results || []);
                setCategories(categoriesData.results || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEquipment();
    }, []);

    const getEquipmentItem = useCallback(async (equipmentIndex) => {
        try {
            return await dndApiService.getEquipmentItem(equipmentIndex);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    return {
        equipment,
        categories,
        loading,
        error,
        getEquipmentItem
    };
};

/**
 * Hook for searching across D&D content
 */
export const useDndSearch = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const search = useCallback(async (query, types = ['classes', 'races', 'spells']) => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const searchResults = await dndApiService.search(query, types);
            setResults(searchResults);
        } catch (err) {
            setError(err.message);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearSearch = useCallback(() => {
        setResults([]);
        setError(null);
    }, []);

    return {
        results,
        loading,
        error,
        search,
        clearSearch
    };
};

/**
 * Hook for validation data
 */
export const useValidation = () => {
    const [validationData, setValidationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchValidationData = async () => {
            try {
                const data = await dndApiService.getValidationData();
                setValidationData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchValidationData();
    }, []);

    const validateContent = useCallback((content, type) => {
        if (!validationData) return { isValid: false, errors: ['Validation data not loaded'] };

        const errors = [];

        // Basic validation logic - extend as needed
        switch (type) {
            case 'class':
                if (!content.name || content.name.trim() === '') {
                    errors.push('Class name is required');
                }
                if (!content.hitDie || ![6, 8, 10, 12].includes(content.hitDie)) {
                    errors.push('Valid hit die is required (6, 8, 10, or 12)');
                }
                break;

            case 'race':
                if (!content.name || content.name.trim() === '') {
                    errors.push('Race name is required');
                }
                if (!content.abilityScoreIncrease || Object.keys(content.abilityScoreIncrease).length === 0) {
                    errors.push('Ability score increases are required');
                }
                break;

            case 'background':
                if (!content.name || content.name.trim() === '') {
                    errors.push('Background name is required');
                }
                if (!content.skillProficiencies || content.skillProficiencies.length === 0) {
                    errors.push('At least one skill proficiency is required');
                }
                break;
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }, [validationData]);

    return {
        validationData,
        loading,
        error,
        validateContent
    };
};

/**
 * Hook for formatted proficiencies (useful for dropdowns and selects)
 */
export const useProficiencies = () => {
    const [proficiencies, setProficiencies] = useState({
        armor: [],
        weapons: [],
        tools: [],
        savingThrows: [],
        skills: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProficiencies = async () => {
            try {
                const formatted = await dndApiService.getFormattedProficiencies();
                setProficiencies(formatted);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProficiencies();
    }, []);

    return { proficiencies, loading, error };
};

/**
 * Hook for managing API cache
 */
export const useApiCache = () => {
    const getCacheStatus = useCallback(() => {
        return dndApiService.getCacheStatus();
    }, []);

    const clearCache = useCallback(() => {
        dndApiService.clearCache();
    }, []);

    return {
        getCacheStatus,
        clearCache
    };
};

/**
 * Combined hook for comprehensive D&D data
 */
export const useDndData = () => {
    const classes = useClasses();
    const races = useRaces();
    const skills = useSkills();
    const equipment = useEquipment();
    const validation = useValidation();

    const isLoading = classes.loading || races.loading || skills.loading ||
        equipment.loading || validation.loading;

    const hasError = classes.error || races.error || skills.error ||
        equipment.error || validation.error;

    return {
        classes: classes.classes,
        races: races.races,
        skills: skills.skills,
        equipment: equipment.equipment,
        equipmentCategories: equipment.categories,
        validationData: validation.validationData,
        loading: isLoading,
        error: hasError,

        // Methods
        getClass: classes.getClass,
        getRace: races.getRace,
        getEquipmentItem: equipment.getEquipmentItem,
        validateContent: validation.validateContent
    };
};