// src/utils/debugStorage.js

/**
 * A utility to help debug localStorage contents
 * Import and call this function in your components for troubleshooting
 */
export const debugLocalStorage = () => {
    console.log('=== DEBUG: localStorage contents ===');

    // List all keys in localStorage
    console.log('All localStorage keys:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        console.log(`- ${key}`);

        try {
            // Try to parse the content as JSON
            const value = localStorage.getItem(key);
            const parsedValue = JSON.parse(value);

            if (Array.isArray(parsedValue)) {
                console.log(`  Array with ${parsedValue.length} items`);
                if (parsedValue.length > 0) {
                    // Log the first item as a sample
                    console.log('  Sample item:', parsedValue[0]);
                }
            } else {
                console.log('  Value:', parsedValue);
            }
        } catch (e) {
            // If not JSON, just log the raw value
            console.log(`  Raw value: ${localStorage.getItem(key)}`);
        }
    }

    // Specifically check for race storage
    console.log('\nChecking race storage specifically:');
    console.log('- Old races key ("races"):', localStorage.getItem('races'));
    console.log('- New races key ("dnd-homebrew-races"):', localStorage.getItem('dnd-homebrew-races'));

    console.log('=== END DEBUG ===');
};

/**
 * Utility to quickly add a test race to storage
 * Use this in development to populate storage with test data
 */
export const addTestRace = () => {
    const { saveRace } = require('./storageService');

    const testRace = {
        name: `Test Race ${Date.now()}`,
        description: 'A test race created for debugging purposes',
        size: 'Medium',
        speed: 30,
        abilityScoreIncreases: {
            STR: 1,
            DEX: 1,
            CON: 0,
            INT: 0,
            WIS: 0,
            CHA: 0
        },
        age: {
            maturity: 'Reaches adulthood at 18',
            lifespan: 'Lives about 80 years'
        },
        alignment: 'Usually neutral',
        languages: ['Common'],
        vision: {
            darkvision: true,
            range: 60
        },
        traits: [
            {
                name: 'Test Trait',
                description: 'This is a test trait for debugging'
            }
        ],
        subraces: []
    };

    const id = saveRace(testRace);
    console.log(`Added test race with ID: ${id}`);
    return id;
};