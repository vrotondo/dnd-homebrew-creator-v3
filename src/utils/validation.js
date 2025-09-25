// src/utils/validation.js - Form Validation Utilities

import { ValidationRules, SRDReference } from './dataModels';

/**
 * Generic validation function
 * @param {Object} data - Data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export const validateData = (data, schema) => {
    const errors = {};
    let isValid = true;

    // Check required fields
    if (schema.required) {
        schema.required.forEach(field => {
            if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) {
                errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
                isValid = false;
            }
        });
    }

    // Validate specific fields
    Object.entries(schema).forEach(([key, rules]) => {
        if (key === 'required') return; // Already handled

        const value = data[key];

        if (value !== undefined && value !== null && value !== '') {
            // Length validation
            if (rules.minLength && value.length < rules.minLength) {
                errors[key] = `Must be at least ${rules.minLength} characters`;
                isValid = false;
            }

            if (rules.maxLength && value.length > rules.maxLength) {
                errors[key] = `Must be no more than ${rules.maxLength} characters`;
                isValid = false;
            }

            // Range validation
            if (rules.min !== undefined && value < rules.min) {
                errors[key] = `Must be at least ${rules.min}`;
                isValid = false;
            }

            if (rules.max !== undefined && value > rules.max) {
                errors[key] = `Must be no more than ${rules.max}`;
                isValid = false;
            }

            // Options validation
            if (rules.options && !rules.options.includes(value)) {
                errors[key] = `Must be one of: ${rules.options.join(', ')}`;
                isValid = false;
            }

            // Pattern validation
            if (rules.pattern && !rules.pattern.test(value)) {
                errors[key] = rules.patternMessage || 'Invalid format';
                isValid = false;
            }

            // Custom validation
            if (rules.validate && typeof rules.validate === 'function') {
                const customError = rules.validate(value, data);
                if (customError) {
                    errors[key] = customError;
                    isValid = false;
                }
            }
        }
    });

    return { isValid, errors };
};

/**
 * Character Class validation
 */
export const validateCharacterClass = (classData) => {
    const schema = {
        required: ['name', 'description', 'hitDie', 'primaryAbility', 'savingThrows'],
        name: {
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Z\s-']+$/,
            patternMessage: 'Name can only contain letters, spaces, hyphens, and apostrophes'
        },
        description: {
            minLength: 10,
            maxLength: 1000
        },
        hitDie: {
            options: [4, 6, 8, 10, 12, 20]
        },
        primaryAbility: {
            validate: (value) => {
                if (!Array.isArray(value) || value.length === 0) {
                    return 'At least one primary ability is required';
                }
                if (value.length > 3) {
                    return 'Maximum 3 primary abilities allowed';
                }
                const invalidAbilities = value.filter(ability => !SRDReference.abilities.includes(ability));
                if (invalidAbilities.length > 0) {
                    return `Invalid abilities: ${invalidAbilities.join(', ')}`;
                }
                return null;
            }
        },
        savingThrows: {
            validate: (value) => {
                if (!Array.isArray(value) || value.length !== 2) {
                    return 'Exactly 2 saving throw proficiencies required';
                }
                const invalidSaves = value.filter(save => !SRDReference.abilities.includes(save));
                if (invalidSaves.length > 0) {
                    return `Invalid saving throws: ${invalidSaves.join(', ')}`;
                }
                return null;
            }
        }
    };

    return validateData(classData, schema);
};

/**
 * Character Race validation
 */
export const validateCharacterRace = (raceData) => {
    const schema = {
        required: ['name', 'description', 'size', 'speed'],
        name: {
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Z\s-']+$/,
            patternMessage: 'Name can only contain letters, spaces, hyphens, and apostrophes'
        },
        description: {
            minLength: 10,
            maxLength: 1000
        },
        size: {
            options: ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan']
        },
        speed: {
            min: 0,
            max: 120,
            validate: (value) => {
                if (value % 5 !== 0) {
                    return 'Speed must be a multiple of 5';
                }
                return null;
            }
        },
        abilityScoreIncrease: {
            validate: (value) => {
                if (!value || Object.keys(value).length === 0) {
                    return 'At least one ability score increase is required';
                }

                const totalIncrease = Object.values(value).reduce((sum, increase) => sum + increase, 0);
                if (totalIncrease > 3) {
                    return 'Total ability score increase cannot exceed +3';
                }

                const invalidAbilities = Object.keys(value).filter(ability => !SRDReference.abilities.includes(ability));
                if (invalidAbilities.length > 0) {
                    return `Invalid abilities: ${invalidAbilities.join(', ')}`;
                }

                return null;
            }
        }
    };

    return validateData(raceData, schema);
};

/**
 * Background validation
 */
export const validateBackground = (backgroundData) => {
    const schema = {
        required: ['name', 'description', 'feature'],
        name: {
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Z\s-']+$/,
            patternMessage: 'Name can only contain letters, spaces, hyphens, and apostrophes'
        },
        description: {
            minLength: 10,
            maxLength: 1000
        },
        feature: {
            validate: (value) => {
                if (!value || !value.name || !value.description) {
                    return 'Feature must have both name and description';
                }
                if (value.name.length < 2 || value.name.length > 100) {
                    return 'Feature name must be 2-100 characters';
                }
                if (value.description.length < 10 || value.description.length > 500) {
                    return 'Feature description must be 10-500 characters';
                }
                return null;
            }
        },
        skillProficiencies: {
            validate: (value) => {
                if (!Array.isArray(value)) return null;

                if (value.length > 2) {
                    return 'Maximum 2 skill proficiencies allowed';
                }

                const invalidSkills = value.filter(skill => !SRDReference.skills.includes(skill));
                if (invalidSkills.length > 0) {
                    return `Invalid skills: ${invalidSkills.join(', ')}`;
                }

                return null;
            }
        }
    };

    return validateData(backgroundData, schema);
};

/**
 * Subclass validation
 */
export const validateSubclass = (subclassData) => {
    const schema = {
        required: ['name', 'description', 'parentClass'],
        name: {
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Z\s-']+$/,
            patternMessage: 'Name can only contain letters, spaces, hyphens, and apostrophes'
        },
        description: {
            minLength: 10,
            maxLength: 1000
        },
        parentClass: {
            minLength: 1,
            validate: (value, data) => {
                // You could validate against existing classes here
                return null;
            }
        }
    };

    return validateData(subclassData, schema);
};

/**
 * Real-time field validation
 */
export const validateField = (fieldName, value, schema, allData = {}) => {
    const fieldRules = schema[fieldName];
    if (!fieldRules) return null;

    // Required check
    if (schema.required && schema.required.includes(fieldName)) {
        if (!value || (Array.isArray(value) && value.length === 0)) {
            return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        }
    }

    // Skip other validation if field is empty and not required
    if (!value || value === '' || (Array.isArray(value) && value.length === 0)) {
        return null;
    }

    // Length validation
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
        return `Must be at least ${fieldRules.minLength} characters`;
    }

    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
        return `Must be no more than ${fieldRules.maxLength} characters`;
    }

    // Range validation
    if (fieldRules.min !== undefined && value < fieldRules.min) {
        return `Must be at least ${fieldRules.min}`;
    }

    if (fieldRules.max !== undefined && value > fieldRules.max) {
        return `Must be no more than ${fieldRules.max}`;
    }

    // Options validation
    if (fieldRules.options && !fieldRules.options.includes(value)) {
        return `Must be one of: ${fieldRules.options.join(', ')}`;
    }

    // Pattern validation
    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
        return fieldRules.patternMessage || 'Invalid format';
    }

    // Custom validation
    if (fieldRules.validate && typeof fieldRules.validate === 'function') {
        return fieldRules.validate(value, allData);
    }

    return null;
};

/**
 * Async validation for unique names
 */
export const validateUniqueName = async (name, contentType, currentId = null, storageService) => {
    try {
        const existingItems = await storageService.getAllItems(contentType);
        const duplicate = existingItems.find(item =>
            item.name.toLowerCase() === name.toLowerCase() &&
            item.id !== currentId
        );

        return duplicate ? 'Name already exists' : null;
    } catch (error) {
        console.error('Error validating unique name:', error);
        return null; // Don't block validation on error
    }
};

/**
 * SRD Compliance validation
 */
export const validateSRDCompliance = (data, contentType) => {
    const warnings = [];
    const errors = [];

    // Check for non-SRD content based on content type
    switch (contentType) {
        case 'class':
            // Validate class features against SRD
            if (data.features) {
                // Add specific SRD validation logic here
            }
            break;

        case 'race':
            // Validate racial traits against SRD
            if (data.traits) {
                // Add specific SRD validation logic here
            }
            break;

        case 'spell':
            // Validate spell schools, levels, etc.
            if (data.school && !ValidationRules.CustomSpell.schools.includes(data.school)) {
                errors.push(`Invalid spell school: ${data.school}`);
            }
            break;
    }

    return {
        isCompliant: errors.length === 0,
        errors,
        warnings
    };
};

/**
 * Batch validation for multiple items
 */
export const validateBatch = (items, validationFunction) => {
    const results = items.map((item, index) => {
        const validation = validationFunction(item);
        return {
            index,
            item,
            ...validation
        };
    });

    const hasErrors = results.some(result => !result.isValid);
    const errorCount = results.filter(result => !result.isValid).length;

    return {
        isValid: !hasErrors,
        results,
        errorCount,
        totalCount: items.length
    };
};

/**
 * Form state validation helper
 */
export const createFormValidator = (validationFunction) => {
    return {
        validate: (data) => validationFunction(data),
        validateField: (fieldName, value, allData) => {
            const tempData = { ...allData, [fieldName]: value };
            const result = validationFunction(tempData);
            return result.errors[fieldName] || null;
        }
    };
};

/**
 * Export validation schemas for use in forms
 */
export const validationSchemas = {
    characterClass: {
        required: ['name', 'description', 'hitDie', 'primaryAbility', 'savingThrows'],
        name: { minLength: 2, maxLength: 50 },
        description: { minLength: 10, maxLength: 1000 },
        hitDie: { options: [4, 6, 8, 10, 12, 20] }
    },

    characterRace: {
        required: ['name', 'description', 'size', 'speed'],
        name: { minLength: 2, maxLength: 50 },
        description: { minLength: 10, maxLength: 1000 },
        size: { options: ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'] },
        speed: { min: 0, max: 120 }
    },

    background: {
        required: ['name', 'description', 'feature'],
        name: { minLength: 2, maxLength: 50 },
        description: { minLength: 10, maxLength: 1000 }
    },

    subclass: {
        required: ['name', 'description', 'parentClass'],
        name: { minLength: 2, maxLength: 50 },
        description: { minLength: 10, maxLength: 1000 }
    }
};