// src/utils/dndConstants.js - D&D 5E Constants and SRD Reference Data

/**
 * Core D&D 5E ability scores
 */
export const ABILITY_SCORES = [
    'Strength',
    'Dexterity',
    'Constitution',
    'Intelligence',
    'Wisdom',
    'Charisma'
];

/**
 * All skills with their associated abilities
 */
export const SKILLS = [
    { name: 'Acrobatics', ability: 'Dexterity' },
    { name: 'Animal Handling', ability: 'Wisdom' },
    { name: 'Arcana', ability: 'Intelligence' },
    { name: 'Athletics', ability: 'Strength' },
    { name: 'Deception', ability: 'Charisma' },
    { name: 'History', ability: 'Intelligence' },
    { name: 'Insight', ability: 'Wisdom' },
    { name: 'Intimidation', ability: 'Charisma' },
    { name: 'Investigation', ability: 'Intelligence' },
    { name: 'Medicine', ability: 'Wisdom' },
    { name: 'Nature', ability: 'Intelligence' },
    { name: 'Perception', ability: 'Wisdom' },
    { name: 'Performance', ability: 'Charisma' },
    { name: 'Persuasion', ability: 'Charisma' },
    { name: 'Religion', ability: 'Intelligence' },
    { name: 'Sleight of Hand', ability: 'Dexterity' },
    { name: 'Stealth', ability: 'Dexterity' },
    { name: 'Survival', ability: 'Wisdom' }
];

/**
 * Skill names only (for easier validation)
 */
export const SKILL_NAMES = SKILLS.map(skill => skill.name);

/**
 * Standard languages in D&D 5E
 */
export const LANGUAGES = {
    standard: [
        'Common',
        'Dwarvish',
        'Elvish',
        'Giant',
        'Gnomish',
        'Goblin',
        'Halfling',
        'Orc'
    ],
    exotic: [
        'Abyssal',
        'Celestial',
        'Draconic',
        'Deep Speech',
        'Infernal',
        'Primordial',
        'Sylvan',
        'Undercommon'
    ]
};

export const ALL_LANGUAGES = [...LANGUAGES.standard, ...LANGUAGES.exotic];

/**
 * Armor types and proficiencies
 */
export const ARMOR_TYPES = [
    'Light armor',
    'Medium armor',
    'Heavy armor',
    'Shields'
];

export const SPECIFIC_ARMOR = {
    light: ['Padded', 'Leather', 'Studded leather'],
    medium: ['Hide', 'Chain shirt', 'Scale mail', 'Breastplate', 'Half plate'],
    heavy: ['Ring mail', 'Chain mail', 'Splint', 'Plate'],
    shields: ['Shield']
};

/**
 * Weapon categories and specific weapons
 */
export const WEAPON_CATEGORIES = [
    'Simple weapons',
    'Martial weapons'
];

export const SPECIFIC_WEAPONS = {
    simple: {
        melee: ['Club', 'Dagger', 'Dart', 'Javelin', 'Light hammer', 'Mace', 'Quarterstaff', 'Sickle', 'Spear'],
        ranged: ['Light crossbow', 'Shortbow', 'Sling']
    },
    martial: {
        melee: ['Battleaxe', 'Flail', 'Glaive', 'Greataxe', 'Greatsword', 'Halberd', 'Lance', 'Longsword', 'Maul', 'Morningstar', 'Pike', 'Rapier', 'Scimitar', 'Shortsword', 'Trident', 'War pick', 'Warhammer', 'Whip'],
        ranged: ['Blowgun', 'Hand crossbow', 'Heavy crossbow', 'Longbow', 'Net']
    }
};

/**
 * Tools and their categories
 */
export const TOOL_CATEGORIES = [
    'Artisan\'s tools',
    'Gaming sets',
    'Musical instruments',
    'Other tools'
];

export const TOOLS = {
    artisan: [
        'Alchemist\'s supplies',
        'Brewer\'s supplies',
        'Calligrapher\'s supplies',
        'Carpenter\'s tools',
        'Cartographer\'s tools',
        'Cobbler\'s tools',
        'Cook\'s utensils',
        'Glassblower\'s tools',
        'Jeweler\'s tools',
        'Leatherworker\'s tools',
        'Mason\'s tools',
        'Painter\'s supplies',
        'Potter\'s tools',
        'Smith\'s tools',
        'Tinker\'s tools',
        'Weaver\'s tools',
        'Woodcarver\'s tools'
    ],
    gaming: [
        'Dice set',
        'Dragonchess set',
        'Playing card set',
        'Three-Dragon Ante set'
    ],
    musical: [
        'Bagpipes',
        'Drum',
        'Dulcimer',
        'Flute',
        'Lute',
        'Lyre',
        'Horn',
        'Pan flute',
        'Shawm',
        'Viol'
    ],
    other: [
        'Disguise kit',
        'Forgery kit',
        'Herbalism kit',
        'Navigator\'s tools',
        'Poisoner\'s kit',
        'Thieves\' tools'
    ]
};

export const ALL_TOOLS = Object.values(TOOLS).flat();

/**
 * Character sizes
 */
export const SIZES = [
    'Tiny',
    'Small',
    'Medium',
    'Large',
    'Huge',
    'Gargantuan'
];

/**
 * Damage types
 */
export const DAMAGE_TYPES = [
    'Acid',
    'Bludgeoning',
    'Cold',
    'Fire',
    'Force',
    'Lightning',
    'Necrotic',
    'Piercing',
    'Poison',
    'Psychic',
    'Radiant',
    'Slashing',
    'Thunder'
];

/**
 * Conditions
 */
export const CONDITIONS = [
    'Blinded',
    'Charmed',
    'Deafened',
    'Frightened',
    'Grappled',
    'Incapacitated',
    'Invisible',
    'Paralyzed',
    'Petrified',
    'Poisoned',
    'Prone',
    'Restrained',
    'Stunned',
    'Unconscious'
];

/**
 * Spell schools
 */
export const SPELL_SCHOOLS = [
    'Abjuration',
    'Conjuration',
    'Divination',
    'Enchantment',
    'Evocation',
    'Illusion',
    'Necromancy',
    'Transmutation'
];

/**
 * Spell levels
 */
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

/**
 * Hit dice options
 */
export const HIT_DICE = [
    { value: 4, label: 'd4', description: 'Very low HP (Wizard-like)' },
    { value: 6, label: 'd6', description: 'Low HP (Sorcerer, Wizard)' },
    { value: 8, label: 'd8', description: 'Medium HP (Artificer, Bard, Cleric, Druid, Monk, Rogue, Warlock)' },
    { value: 10, label: 'd10', description: 'High HP (Fighter, Paladin, Ranger)' },
    { value: 12, label: 'd12', description: 'Very high HP (Barbarian)' },
    { value: 20, label: 'd20', description: 'Extremely high HP (rare/homebrew)' }
];

/**
 * Character level progression data
 */
export const LEVEL_PROGRESSION = {
    proficiencyBonus: [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6],
    levels: Array.from({ length: 20 }, (_, i) => i + 1)
};

/**
 * Common spellcasting progressions
 */
export const SPELLCASTING_PROGRESSIONS = {
    full: {
        name: 'Full Caster',
        description: 'Like Wizard, Sorcerer, etc.',
        slots: {
            1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
            2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
            3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
            4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
            5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
            // ... continue for all levels
        }
    },
    half: {
        name: 'Half Caster',
        description: 'Like Paladin, Ranger',
        slots: {
            2: [2, 0, 0, 0, 0],
            3: [3, 0, 0, 0, 0],
            5: [4, 2, 0, 0, 0],
            // ... continue for all levels
        }
    },
    third: {
        name: 'Third Caster',
        description: 'Like Eldritch Knight, Arcane Trickster',
        slots: {
            3: [2, 0, 0, 0],
            4: [3, 0, 0, 0],
            7: [4, 2, 0, 0],
            // ... continue for all levels
        }
    }
};

/**
 * Common equipment packages
 */
export const EQUIPMENT_PACKAGES = {
    explorer: {
        name: 'Explorer\'s Pack',
        items: ['Backpack', 'Bedroll', 'Mess kit', 'Tinderbox', '10 torches', '10 days of rations', 'Waterskin', '50 feet of hempen rope']
    },
    dungeoneer: {
        name: 'Dungeoneer\'s Pack',
        items: ['Backpack', 'Crowbar', 'Hammer', '10 pitons', '10 torches', 'Tinderbox', '10 days of rations', 'Waterskin', '50 feet of hempen rope']
    },
    entertainer: {
        name: 'Entertainer\'s Pack',
        items: ['Backpack', 'Bedroll', '2 costumes', '5 candles', '5 days of rations', 'Waterskin', 'Disguise kit']
    }
};

/**
 * Class-specific data for quick reference
 */
export const CLASS_ARCHETYPES = {
    barbarian: {
        primaryAbility: ['Strength'],
        hitDie: 12,
        savingThrows: ['Strength', 'Constitution'],
        subclassLevel: 3,
        subclassName: 'Primal Path'
    },
    bard: {
        primaryAbility: ['Charisma'],
        hitDie: 8,
        savingThrows: ['Dexterity', 'Charisma'],
        subclassLevel: 3,
        subclassName: 'College'
    },
    cleric: {
        primaryAbility: ['Wisdom'],
        hitDie: 8,
        savingThrows: ['Wisdom', 'Charisma'],
        subclassLevel: 1,
        subclassName: 'Divine Domain'
    },
    druid: {
        primaryAbility: ['Wisdom'],
        hitDie: 8,
        savingThrows: ['Intelligence', 'Wisdom'],
        subclassLevel: 2,
        subclassName: 'Circle'
    },
    fighter: {
        primaryAbility: ['Strength', 'Dexterity'],
        hitDie: 10,
        savingThrows: ['Strength', 'Constitution'],
        subclassLevel: 3,
        subclassName: 'Martial Archetype'
    },
    monk: {
        primaryAbility: ['Dexterity', 'Wisdom'],
        hitDie: 8,
        savingThrows: ['Strength', 'Dexterity'],
        subclassLevel: 3,
        subclassName: 'Monastic Tradition'
    },
    paladin: {
        primaryAbility: ['Strength', 'Charisma'],
        hitDie: 10,
        savingThrows: ['Wisdom', 'Charisma'],
        subclassLevel: 3,
        subclassName: 'Sacred Oath'
    },
    ranger: {
        primaryAbility: ['Dexterity', 'Wisdom'],
        hitDie: 10,
        savingThrows: ['Strength', 'Dexterity'],
        subclassLevel: 3,
        subclassName: 'Archetype'
    },
    rogue: {
        primaryAbility: ['Dexterity'],
        hitDie: 8,
        savingThrows: ['Dexterity', 'Intelligence'],
        subclassLevel: 3,
        subclassName: 'Roguish Archetype'
    },
    sorcerer: {
        primaryAbility: ['Charisma'],
        hitDie: 6,
        savingThrows: ['Constitution', 'Charisma'],
        subclassLevel: 1,
        subclassName: 'Sorcerous Origin'
    },
    warlock: {
        primaryAbility: ['Charisma'],
        hitDie: 8,
        savingThrows: ['Wisdom', 'Charisma'],
        subclassLevel: 1,
        subclassName: 'Otherworldly Patron'
    },
    wizard: {
        primaryAbility: ['Intelligence'],
        hitDie: 6,
        savingThrows: ['Intelligence', 'Wisdom'],
        subclassLevel: 2,
        subclassName: 'Arcane Tradition'
    }
};

/**
 * Common racial traits
 */
export const COMMON_RACIAL_TRAITS = [
    {
        name: 'Darkvision',
        description: 'You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.',
        type: 'sense'
    },
    {
        name: 'Keen Senses',
        description: 'You have proficiency in the Perception skill.',
        type: 'proficiency'
    },
    {
        name: 'Fey Ancestry',
        description: 'You have advantage on saving throws against being charmed, and magic can\'t put you to sleep.',
        type: 'resistance'
    },
    {
        name: 'Trance',
        description: 'You don\'t need to sleep and can\'t be forced to sleep. You can finish a long rest in 4 hours.',
        type: 'special'
    },
    {
        name: 'Lucky',
        description: 'When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die.',
        type: 'special'
    },
    {
        name: 'Brave',
        description: 'You have advantage on saving throws against being frightened.',
        type: 'resistance'
    },
    {
        name: 'Halfling Nimbleness',
        description: 'You can move through the space of any creature that is of a size larger than yours.',
        type: 'movement'
    }
];

/**
 * Background features examples
 */
export const BACKGROUND_FEATURES = [
    {
        name: 'Feature: Shelter of the Faithful',
        description: 'You and your companions can receive free healing and care at temples, shrines, and other established presences of your faith.'
    },
    {
        name: 'Feature: Researcher',
        description: 'When you attempt to learn or recall a piece of lore, if you do not know that information, you often know where and from whom you can obtain it.'
    },
    {
        name: 'Feature: Guild Membership',
        description: 'Your guild membership grants you certain benefits, including lodging and meals at guild halls.'
    }
];

/**
 * Form field configurations for different content types
 */
export const FORM_CONFIGS = {
    characterClass: {
        fields: [
            { name: 'name', type: 'text', label: 'Class Name', required: true },
            { name: 'description', type: 'textarea', label: 'Description', required: true },
            { name: 'hitDie', type: 'select', label: 'Hit Die', options: HIT_DICE, required: true },
            { name: 'primaryAbility', type: 'multiselect', label: 'Primary Abilities', options: ABILITY_SCORES, required: true },
            { name: 'savingThrows', type: 'multiselect', label: 'Saving Throw Proficiencies', options: ABILITY_SCORES, required: true, max: 2 }
        ]
    },
    characterRace: {
        fields: [
            { name: 'name', type: 'text', label: 'Race Name', required: true },
            { name: 'description', type: 'textarea', label: 'Description', required: true },
            { name: 'size', type: 'select', label: 'Size', options: SIZES, required: true },
            { name: 'speed', type: 'number', label: 'Speed (feet)', required: true, min: 0, max: 120, step: 5 }
        ]
    }
};

/**
 * Utility functions for working with constants
 */
export const dndUtils = {
    /**
     * Get ability modifier from score
     */
    getAbilityModifier: (score) => Math.floor((score - 10) / 2),

    /**
     * Get proficiency bonus for level
     */
    getProficiencyBonus: (level) => LEVEL_PROGRESSION.proficiencyBonus[level - 1] || 2,

    /**
     * Get skill by name
     */
    getSkill: (skillName) => SKILLS.find(skill => skill.name === skillName),

    /**
     * Get skills by ability
     */
    getSkillsByAbility: (abilityName) => SKILLS.filter(skill => skill.ability === abilityName),

    /**
     * Format spell level
     */
    formatSpellLevel: (level) => {
        if (level === 0) return 'Cantrip';
        if (level === 1) return '1st Level';
        if (level === 2) return '2nd Level';
        if (level === 3) return '3rd Level';
        return `${level}th Level`;
    },

    /**
     * Get class archetype data
     */
    getClassArchetype: (className) => CLASS_ARCHETYPES[className.toLowerCase()],

    /**
     * Validate ability score array
     */
    isValidAbilityArray: (abilities) => {
        return Array.isArray(abilities) &&
            abilities.every(ability => ABILITY_SCORES.includes(ability)) &&
            abilities.length <= 6;
    },

    /**
     * Validate skill array
     */
    isValidSkillArray: (skills) => {
        return Array.isArray(skills) &&
            skills.every(skill => SKILL_NAMES.includes(skill));
    }
};