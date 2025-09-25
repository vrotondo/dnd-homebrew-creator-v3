// src/utils/dataModels.js - Data Structure Schemas for D&D Homebrew Creator

/**
 * Base model for all homebrew content
 */
export const BaseContent = {
    id: null,                    // Auto-generated
    name: '',                    // Required
    description: '',             // Required
    createdAt: null,            // Auto-generated
    updatedAt: null,            // Auto-updated
    version: '1.0.0',           // Version tracking
    tags: [],                   // User tags
    isPublic: false,            // Sharing status
    authorNotes: '',            // Private notes
    srdCompliant: true          // SRD compliance flag
};

/**
 * Character Class model
 */
export const CharacterClass = {
    ...BaseContent,

    // Basic Info
    hitDie: 8,                  // d8, d10, d12, etc.
    primaryAbility: [],         // ['Strength', 'Dexterity']
    savingThrows: [],           // ['Strength', 'Constitution']

    // Proficiencies
    armorProficiencies: [],     // ['Light armor', 'Medium armor']
    weaponProficiencies: [],    // ['Simple weapons', 'Shortswords']
    toolProficiencies: [],      // ['Thieves' tools']
    savingThrowProficiencies: [], // Auto from savingThrows

    // Skills
    skillChoices: {
        choose: 2,              // Number to choose
        from: [],              // Available skills
    },

    // Equipment
    startingEquipment: {
        standard: [],           // Fixed starting equipment
        options: [],           // Choice-based equipment
        startingGold: null     // Alternative to equipment
    },

    // Features by Level
    features: {
        1: [],                 // Level 1 features
        2: [],                 // Level 2 features
        // ... up to 20
    },

    // Progression Table
    progression: {
        proficiencyBonus: [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6],
        features: [],          // Features gained per level
        spellcasting: null     // Spellcasting progression if applicable
    },

    // Subclasses
    subclassFeature: {
        level: 1,              // When subclass is chosen
        name: '',              // "Martial Archetype", "Sacred Oath"
        description: ''
    },

    // Optional: Multiclassing
    multiclassing: {
        prerequisites: {},     // {strength: 13, dexterity: 13}
        proficiencies: []      // Gained when multiclassing
    }
};

/**
 * Subclass model
 */
export const Subclass = {
    ...BaseContent,

    parentClass: '',           // ID of parent class
    parentClassName: '',       // Name for display

    // Features by Level
    features: {
        3: [],                // Usually starts at 3rd level
        7: [],
        10: [],
        15: [],
        18: []
    },

    // Spells (if applicable)
    spellList: [],            // Additional spells

    // Flavor
    roleplayTips: '',         // How to play this subclass
    examples: []              // Famous examples from D&D lore
};

/**
 * Character Race model
 */
export const CharacterRace = {
    ...BaseContent,

    // Basic Traits
    abilityScoreIncrease: {},  // {strength: 2, constitution: 1}
    size: 'Medium',            // Tiny, Small, Medium, Large, etc.
    speed: 30,                 // Walking speed in feet
    languages: [],             // Known languages

    // Proficiencies
    skillProficiencies: [],
    weaponProficiencies: [],
    toolProficiencies: [],
    armorProficiencies: [],

    // Special Traits
    traits: [
        // {
        //     name: 'Darkvision',
        //     description: 'You can see in dim light...',
        //     type: 'sense'
        // }
    ],

    // Subraces
    hasSubraces: false,
    subraceDetails: {
        chooseFrom: [],        // Available subraces
        description: ''        // How subraces work
    },

    // Variant Rules
    variants: [],             // Optional variant traits

    // Lore
    culture: '',              // Cultural background
    physicalDescription: '',   // How they look
    namingConventions: {
        male: [],
        female: [],
        family: [],
        examples: ''
    }
};

/**
 * Character Background model
 */
export const CharacterBackground = {
    ...BaseContent,

    // Proficiencies
    skillProficiencies: [],    // 2 skills usually
    toolProficiencies: [],     // Tools or instruments
    languages: [],             // Known languages

    // Equipment
    equipment: [],             // Starting equipment
    startingMoney: 0,          // Starting gold

    // Feature
    feature: {
        name: '',              // Feature name
        description: ''        // What it does
    },

    // Personality
    suggestedCharacteristics: {
        personalityTraits: [],
        ideals: [],
        bonds: [],
        flaws: []
    },

    // Variants
    variants: [],             // Alternative versions

    // Specialty (if applicable)
    specialties: []           // Guild specialties, criminal contacts, etc.
};

/**
 * Magic Item model
 */
export const MagicItem = {
    ...BaseContent,

    type: '',                 // Weapon, Armor, Wondrous Item, etc.
    rarity: 'common',         // common, uncommon, rare, very rare, legendary, artifact
    attunement: false,        // Requires attunement?
    attunementBy: '',         // Class/race restrictions

    // Properties
    armorClass: null,         // For armor
    damage: null,             // For weapons
    properties: [],           // Weapon properties

    // Magic Properties
    magicalProperties: [],    // What it does
    charges: null,            // Daily charges if applicable

    // Restrictions
    cursed: false,
    restrictions: []          // Who can use it
};

/**
 * Custom Spell model
 */
export const CustomSpell = {
    ...BaseContent,

    level: 0,                 // Cantrip = 0, 1-9 for spell levels
    school: '',               // Evocation, Illusion, etc.
    castingTime: '1 action',
    range: 'Self',
    components: {
        verbal: false,
        somatic: false,
        material: false,
        materials: ''         // Material components
    },
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,

    // Classes that can learn it
    classes: [],

    // Spell effects
    atHigherLevels: '',      // Scaling effects

    // Reference
    source: 'homebrew'
};

/**
 * Monster/Creature model
 */
export const Monster = {
    ...BaseContent,

    // Basic Stats
    armorClass: 10,
    hitPoints: 1,
    hitDice: '1d8',
    speed: {
        walk: 30,
        fly: null,
        swim: null,
        climb: null
    },

    // Ability Scores
    abilities: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10
    },

    // Combat
    challengeRating: '0',
    experiencePoints: 0,
    proficiencyBonus: 2,

    // Defenses
    savingThrows: {},
    skills: {},
    damageResistances: [],
    damageImmunities: [],
    damageVulnerabilities: [],
    conditionImmunities: [],

    // Senses
    senses: {
        darkvision: null,
        blindsight: null,
        truesight: null,
        tremorsense: null,
        passivePerception: 10
    },

    languages: [],

    // Special Abilities
    traits: [],              // Passive abilities
    actions: [],             // Attack actions
    bonusActions: [],        // Bonus actions
    reactions: [],           // Reaction abilities
    legendaryActions: [],    // For legendary creatures

    // Spellcasting (if applicable)
    spellcasting: null,

    // Lore
    environment: [],         // Where found
    organization: '',        // How they group
    treasure: ''            // What they carry
};

/**
 * Campaign Setting model
 */
export const CampaignSetting = {
    ...BaseContent,

    // World Details
    theme: '',               // High fantasy, steampunk, etc.
    technologyLevel: '',     // Medieval, Renaissance, etc.
    magicLevel: '',          // High magic, low magic, no magic

    // Geography
    continents: [],
    majorCities: [],
    importantLocations: [],

    // Factions
    factions: [],
    governments: [],
    religions: [],

    // History
    timeline: [],            // Major events
    currentEvents: [],       // What's happening now

    // Rules Modifications
    houseRules: [],
    bannedContent: [],       // What's not allowed
    allowedContent: [],      // What IS allowed

    // Resources
    maps: [],               // Image URLs or descriptions
    handouts: [],           // Player handouts
    references: []          // Useful links/books
};

/**
 * Validation schemas for each model
 */
export const ValidationRules = {
    CharacterClass: {
        required: ['name', 'description', 'hitDie', 'primaryAbility', 'savingThrows'],
        hitDie: [4, 6, 8, 10, 12, 20],
        levelRange: [1, 20]
    },

    Subclass: {
        required: ['name', 'description', 'parentClass'],
        levelRange: [1, 20]
    },

    CharacterRace: {
        required: ['name', 'description', 'size', 'speed'],
        validSizes: ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'],
        speedRange: [0, 120]
    },

    CharacterBackground: {
        required: ['name', 'description', 'feature'],
        skillCount: [2, 2], // Usually exactly 2 skills
    },

    MagicItem: {
        required: ['name', 'description', 'type', 'rarity'],
        rarities: ['common', 'uncommon', 'rare', 'very rare', 'legendary', 'artifact']
    },

    CustomSpell: {
        required: ['name', 'description', 'level', 'school'],
        levelRange: [0, 9],
        schools: ['Abjuration', 'Conjuration', 'Divination', 'Enchantment', 'Evocation', 'Illusion', 'Necromancy', 'Transmutation']
    }
};

/**
 * Default templates for quick creation
 */
export const Templates = {
    CharacterClass: {
        Fighter: { ...CharacterClass, name: 'Fighter', hitDie: 10, primaryAbility: ['Strength', 'Dexterity'] },
        Wizard: { ...CharacterClass, name: 'Wizard', hitDie: 6, primaryAbility: ['Intelligence'] },
        Rogue: { ...CharacterClass, name: 'Rogue', hitDie: 8, primaryAbility: ['Dexterity'] }
    },

    CharacterRace: {
        Human: { ...CharacterRace, name: 'Human', size: 'Medium', speed: 30 },
        Elf: { ...CharacterRace, name: 'Elf', size: 'Medium', speed: 30 },
        Dwarf: { ...CharacterRace, name: 'Dwarf', size: 'Medium', speed: 25 }
    }
};

/**
 * SRD Reference data for validation
 */
export const SRDReference = {
    skills: [
        'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception',
        'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine',
        'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion',
        'Sleight of Hand', 'Stealth', 'Survival'
    ],

    abilities: [
        'Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'
    ],

    languages: [
        'Common', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc',
        'Abyssal', 'Celestial', 'Draconic', 'Deep Speech', 'Infernal', 'Primordial', 'Sylvan', 'Undercommon'
    ],

    damageTypes: [
        'Acid', 'Bludgeoning', 'Cold', 'Fire', 'Force', 'Lightning',
        'Necrotic', 'Piercing', 'Poison', 'Psychic', 'Radiant', 'Slashing', 'Thunder'
    ]
};