// src/services/dndApiService.js

const BASE_URL = 'https://www.dnd5eapi.co/api';

/**
 * D&D 5e API Service
 * Provides methods to fetch data from the D&D 5e API
 */
class DnD5eApiService {
    constructor() {
        this.cache = new Map();
        this.cacheExpiration = 30 * 60 * 1000; // 30 minutes
    }

    /**
     * Generic fetch method with caching and error handling
     */
    async fetchWithCache(endpoint) {
        const cacheKey = endpoint;
        const cached = this.cache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < this.cacheExpiration) {
            return cached.data;
        }

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Cache the result
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            throw new Error(`Failed to fetch data from D&D API: ${error.message}`);
        }
    }

    // ===================
    // CHARACTER CLASSES
    // ===================

    /**
     * Get all available classes
     */
    async getClasses() {
        return this.fetchWithCache('/classes');
    }

    /**
     * Get specific class details by index
     */
    async getClass(classIndex) {
        return this.fetchWithCache(`/classes/${classIndex}`);
    }

    /**
     * Get all subclasses
     */
    async getSubclasses() {
        return this.fetchWithCache('/subclasses');
    }

    /**
     * Get specific subclass details
     */
    async getSubclass(subclassIndex) {
        return this.fetchWithCache(`/subclasses/${subclassIndex}`);
    }

    /**
     * Get class levels (progression information)
     */
    async getClassLevels(classIndex, level = null) {
        const endpoint = level
            ? `/classes/${classIndex}/levels/${level}`
            : `/classes/${classIndex}/levels`;
        return this.fetchWithCache(endpoint);
    }

    /**
     * Get class features
     */
    async getClassFeatures(classIndex) {
        return this.fetchWithCache(`/classes/${classIndex}/features`);
    }

    // ===================
    // RACES
    // ===================

    /**
     * Get all available races
     */
    async getRaces() {
        return this.fetchWithCache('/races');
    }

    /**
     * Get specific race details
     */
    async getRace(raceIndex) {
        return this.fetchWithCache(`/races/${raceIndex}`);
    }

    /**
     * Get subraces for a specific race
     */
    async getSubraces(raceIndex = null) {
        const endpoint = raceIndex
            ? `/races/${raceIndex}/subraces`
            : '/subraces';
        return this.fetchWithCache(endpoint);
    }

    /**
     * Get specific subrace details
     */
    async getSubrace(subraceIndex) {
        return this.fetchWithCache(`/subraces/${subraceIndex}`);
    }

    // ===================
    // ABILITIES & SKILLS
    // ===================

    /**
     * Get all ability scores
     */
    async getAbilityScores() {
        return this.fetchWithCache('/ability-scores');
    }

    /**
     * Get specific ability score details
     */
    async getAbilityScore(abilityIndex) {
        return this.fetchWithCache(`/ability-scores/${abilityIndex}`);
    }

    /**
     * Get all skills
     */
    async getSkills() {
        return this.fetchWithCache('/skills');
    }

    /**
     * Get specific skill details
     */
    async getSkill(skillIndex) {
        return this.fetchWithCache(`/skills/${skillIndex}`);
    }

    // ===================
    // PROFICIENCIES
    // ===================

    /**
     * Get all proficiencies
     */
    async getProficiencies() {
        return this.fetchWithCache('/proficiencies');
    }

    /**
     * Get specific proficiency details
     */
    async getProficiency(proficiencyIndex) {
        return this.fetchWithCache(`/proficiencies/${proficiencyIndex}`);
    }

    // ===================
    // EQUIPMENT
    // ===================

    /**
     * Get all equipment
     */
    async getEquipment() {
        return this.fetchWithCache('/equipment');
    }

    /**
     * Get specific equipment details
     */
    async getEquipmentItem(equipmentIndex) {
        return this.fetchWithCache(`/equipment/${equipmentIndex}`);
    }

    /**
     * Get equipment categories
     */
    async getEquipmentCategories() {
        return this.fetchWithCache('/equipment-categories');
    }

    /**
     * Get items in specific equipment category
     */
    async getEquipmentCategory(categoryIndex) {
        return this.fetchWithCache(`/equipment-categories/${categoryIndex}`);
    }

    /**
     * Get weapon properties
     */
    async getWeaponProperties() {
        return this.fetchWithCache('/weapon-properties');
    }

    // ===================
    // SPELLS
    // ===================

    /**
     * Get all spells with optional filtering
     */
    async getSpells(params = {}) {
        let endpoint = '/spells';
        const searchParams = new URLSearchParams();

        // Add query parameters
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, value);
            }
        });

        if (searchParams.toString()) {
            endpoint += `?${searchParams.toString()}`;
        }

        return this.fetchWithCache(endpoint);
    }

    /**
     * Get specific spell details
     */
    async getSpell(spellIndex) {
        return this.fetchWithCache(`/spells/${spellIndex}`);
    }

    /**
     * Get spell schools
     */
    async getSpellSchools() {
        return this.fetchWithCache('/magic-schools');
    }

    // ===================
    // MONSTERS
    // ===================

    /**
     * Get all monsters
     */
    async getMonsters() {
        return this.fetchWithCache('/monsters');
    }

    /**
     * Get specific monster details
     */
    async getMonster(monsterIndex) {
        return this.fetchWithCache(`/monsters/${monsterIndex}`);
    }

    // ===================
    // LANGUAGES
    // ===================

    /**
     * Get all languages
     */
    async getLanguages() {
        return this.fetchWithCache('/languages');
    }

    /**
     * Get specific language details
     */
    async getLanguage(languageIndex) {
        return this.fetchWithCache(`/languages/${languageIndex}`);
    }

    // ===================
    // UTILITY METHODS
    // ===================

    /**
     * Search for content across multiple endpoints
     */
    async search(query, types = ['classes', 'races', 'spells', 'monsters']) {
        const searchPromises = types.map(async (type) => {
            try {
                const data = await this.fetchWithCache(`/${type}`);
                const results = data.results?.filter(item =>
                    item.name.toLowerCase().includes(query.toLowerCase())
                ) || [];

                return {
                    type,
                    results
                };
            } catch (error) {
                console.error(`Error searching ${type}:`, error);
                return { type, results: [] };
            }
        });

        const searchResults = await Promise.all(searchPromises);
        return searchResults.filter(result => result.results.length > 0);
    }

    /**
     * Get validation data for homebrew content
     */
    async getValidationData() {
        try {
            const [classes, races, skills, proficiencies, equipment] = await Promise.all([
                this.getClasses(),
                this.getRaces(),
                this.getSkills(),
                this.getProficiencies(),
                this.getEquipment()
            ]);

            return {
                classes: classes.results || [],
                races: races.results || [],
                skills: skills.results || [],
                proficiencies: proficiencies.results || [],
                equipment: equipment.results || []
            };
        } catch (error) {
            console.error('Error getting validation data:', error);
            throw error;
        }
    }

    /**
     * Clear cache (useful for testing or manual refresh)
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Get cache status (for debugging)
     */
    getCacheStatus() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }

    // ===================
    // ENHANCED DATA PROCESSING
    // ===================

    /**
     * Process class data for homebrew creation
     */
    async processClassData(classIndex) {
        try {
            const [classData, classLevels, classFeatures] = await Promise.all([
                this.getClass(classIndex),
                this.getClassLevels(classIndex),
                this.getClassFeatures(classIndex)
            ]);

            return {
                ...classData,
                levels: classLevels,
                features: classFeatures.results || []
            };
        } catch (error) {
            console.error(`Error processing class data for ${classIndex}:`, error);
            throw error;
        }
    }

    /**
     * Get comprehensive race data
     */
    async processRaceData(raceIndex) {
        try {
            const [raceData, subraces] = await Promise.all([
                this.getRace(raceIndex),
                this.getSubraces(raceIndex).catch(() => ({ results: [] }))
            ]);

            return {
                ...raceData,
                subraces: subraces.results || []
            };
        } catch (error) {
            console.error(`Error processing race data for ${raceIndex}:`, error);
            throw error;
        }
    }

    /**
     * Get formatted proficiencies for UI display
     */
    async getFormattedProficiencies() {
        try {
            const proficiencies = await this.getProficiencies();

            const formatted = {
                armor: [],
                weapons: [],
                tools: [],
                savingThrows: [],
                skills: []
            };

            proficiencies.results.forEach(prof => {
                const category = prof.type;
                if (formatted[category]) {
                    formatted[category].push({
                        index: prof.index,
                        name: prof.name,
                        type: prof.type
                    });
                }
            });

            return formatted;
        } catch (error) {
            console.error('Error formatting proficiencies:', error);
            throw error;
        }
    }
}

// Create and export a singleton instance
const dndApiService = new DnD5eApiService();

export default dndApiService;

// Also export the class for testing purposes
export { DnD5eApiService };