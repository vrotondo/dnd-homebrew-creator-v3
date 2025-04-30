// src/utils/spellData.js
/**
 * SRD Spell Data Service
 * Contains the basic spells from the SRD that can be used in homebrew content
 */

// Basic spell list from SRD
export const SRD_SPELLS = [
    // Cantrips (Level 0)
    { id: 'acid-splash', name: 'Acid Splash', level: 0, school: 'conjuration', castingTime: '1 action', range: '60 feet', components: 'V, S', duration: 'Instantaneous', classes: ['sorcerer', 'wizard'] },
    { id: 'chill-touch', name: 'Chill Touch', level: 0, school: 'necromancy', castingTime: '1 action', range: '120 feet', components: 'V, S', duration: '1 round', classes: ['sorcerer', 'warlock', 'wizard'] },
    { id: 'dancing-lights', name: 'Dancing Lights', level: 0, school: 'evocation', castingTime: '1 action', range: '120 feet', components: 'V, S, M', duration: 'Concentration, up to 1 minute', classes: ['bard', 'sorcerer', 'wizard'] },
    { id: 'druidcraft', name: 'Druidcraft', level: 0, school: 'transmutation', castingTime: '1 action', range: '30 feet', components: 'V, S', duration: 'Instantaneous', classes: ['druid'] },
    { id: 'eldritch-blast', name: 'Eldritch Blast', level: 0, school: 'evocation', castingTime: '1 action', range: '120 feet', components: 'V, S', duration: 'Instantaneous', classes: ['warlock'] },
    { id: 'fire-bolt', name: 'Fire Bolt', level: 0, school: 'evocation', castingTime: '1 action', range: '120 feet', components: 'V, S', duration: 'Instantaneous', classes: ['sorcerer', 'wizard'] },
    { id: 'guidance', name: 'Guidance', level: 0, school: 'divination', castingTime: '1 action', range: 'Touch', components: 'V, S', duration: 'Concentration, up to 1 minute', classes: ['cleric', 'druid'] },
    { id: 'light', name: 'Light', level: 0, school: 'evocation', castingTime: '1 action', range: 'Touch', components: 'V, M', duration: '1 hour', classes: ['bard', 'cleric', 'sorcerer', 'wizard'] },
    { id: 'mage-hand', name: 'Mage Hand', level: 0, school: 'conjuration', castingTime: '1 action', range: '30 feet', components: 'V, S', duration: '1 minute', classes: ['bard', 'sorcerer', 'warlock', 'wizard'] },
    { id: 'mending', name: 'Mending', level: 0, school: 'transmutation', castingTime: '1 minute', range: 'Touch', components: 'V, S, M', duration: 'Instantaneous', classes: ['bard', 'cleric', 'druid', 'sorcerer', 'wizard'] },

    // 1st Level
    { id: 'alarm', name: 'Alarm', level: 1, school: 'abjuration', castingTime: '1 minute', range: '30 feet', components: 'V, S, M', duration: '8 hours', ritual: true, classes: ['ranger', 'wizard'] },
    { id: 'burning-hands', name: 'Burning Hands', level: 1, school: 'evocation', castingTime: '1 action', range: 'Self (15-foot cone)', components: 'V, S', duration: 'Instantaneous', classes: ['sorcerer', 'wizard'] },
    { id: 'charm-person', name: 'Charm Person', level: 1, school: 'enchantment', castingTime: '1 action', range: '30 feet', components: 'V, S', duration: '1 hour', classes: ['bard', 'druid', 'sorcerer', 'warlock', 'wizard'] },
    { id: 'cure-wounds', name: 'Cure Wounds', level: 1, school: 'evocation', castingTime: '1 action', range: 'Touch', components: 'V, S', duration: 'Instantaneous', classes: ['bard', 'cleric', 'druid', 'paladin', 'ranger'] },
    { id: 'detect-magic', name: 'Detect Magic', level: 1, school: 'divination', castingTime: '1 action', range: 'Self', components: 'V, S', duration: 'Concentration, up to 10 minutes', ritual: true, classes: ['bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'wizard'] },

    // 2nd Level
    { id: 'acid-arrow', name: 'Acid Arrow', level: 2, school: 'evocation', castingTime: '1 action', range: '90 feet', components: 'V, S, M', duration: 'Instantaneous', classes: ['wizard'] },
    { id: 'aid', name: 'Aid', level: 2, school: 'abjuration', castingTime: '1 action', range: '30 feet', components: 'V, S, M', duration: '8 hours', classes: ['cleric', 'paladin'] },
    { id: 'alter-self', name: 'Alter Self', level: 2, school: 'transmutation', castingTime: '1 action', range: 'Self', components: 'V, S', duration: 'Concentration, up to 1 hour', classes: ['sorcerer', 'wizard'] },

    // Add more spells as needed...

    // These are just examples - a complete implementation would include all SRD spells
];

// Schools of magic for filtering
export const SCHOOLS_OF_MAGIC = [
    { id: 'abjuration', name: 'Abjuration' },
    { id: 'conjuration', name: 'Conjuration' },
    { id: 'divination', name: 'Divination' },
    { id: 'enchantment', name: 'Enchantment' },
    { id: 'evocation', name: 'Evocation' },
    { id: 'illusion', name: 'Illusion' },
    { id: 'necromancy', name: 'Necromancy' },
    { id: 'transmutation', name: 'Transmutation' }
];

// Spell levels for filtering
export const SPELL_LEVELS = [
    { value: 0, label: 'Cantrip' },
    { value: 1, label: '1st Level' },
    { value: 2, label: '2nd Level' },
    { value: 3, label: '3rd Level' },
    { value: 4, label: '4th Level' },
    { value: 5, label: '5th Level' },
    { value: 6, label: '6th Level' },
    { value: 7, label: '7th Level' },
    { value: 8, label: '8th Level' },
    { value: 9, label: '9th Level' }
];

// Standard D&D spellcasting classes
export const SPELLCASTING_CLASSES = [
    { id: 'bard', name: 'Bard', spellcasting: 'full' },
    { id: 'cleric', name: 'Cleric', spellcasting: 'full' },
    { id: 'druid', name: 'Druid', spellcasting: 'full' },
    { id: 'paladin', name: 'Paladin', spellcasting: 'half' },
    { id: 'ranger', name: 'Ranger', spellcasting: 'half' },
    { id: 'sorcerer', name: 'Sorcerer', spellcasting: 'full' },
    { id: 'warlock', name: 'Warlock', spellcasting: 'pact' },
    { id: 'wizard', name: 'Wizard', spellcasting: 'full' }
];

/**
 * Get all spells from the SRD
 * @param {Object} filters - Optional filters to apply
 * @returns {Array} Filtered spell list
 */
export const getSpells = (filters = {}) => {
    let result = [...SRD_SPELLS];

    // Filter by name
    if (filters.name) {
        const searchTerm = filters.name.toLowerCase();
        result = result.filter(spell =>
            spell.name.toLowerCase().includes(searchTerm)
        );
    }

    // Filter by level
    if (filters.level !== undefined && filters.level !== null) {
        result = result.filter(spell => spell.level === filters.level);
    }

    // Filter by school
    if (filters.school) {
        result = result.filter(spell => spell.school === filters.school);
    }

    // Filter by class
    if (filters.class) {
        result = result.filter(spell =>
            spell.classes.includes(filters.class)
        );
    }

    // Filter by ritual
    if (filters.ritual !== undefined) {
        result = result.filter(spell => spell.ritual === filters.ritual);
    }

    return result;
};

/**
 * Get a spell by ID
 * @param {string} id - Spell ID
 * @returns {Object|null} Spell object or null if not found
 */
export const getSpellById = (id) => {
    return SRD_SPELLS.find(spell => spell.id === id) || null;
};

/**
 * Format spell level
 * @param {number} level - Spell level (0-9)
 * @returns {string} Formatted level string
 */
export const formatSpellLevel = (level) => {
    if (level === 0) return 'Cantrip';
    if (level === 1) return '1st Level';
    if (level === 2) return '2nd Level';
    if (level === 3) return '3rd Level';
    return `${level}th Level`;
};

/**
 * Format school of magic
 * @param {string} school - School ID
 * @returns {string} Formatted school name
 */
export const formatSchool = (school) => {
    const found = SCHOOLS_OF_MAGIC.find(s => s.id === school);
    return found ? found.name : school;
};