// src/utils/racesMigration.js
import { saveRace, getRaces } from './storageService';

/**
 * Migrates races from old storage format to new format
 * This fixes the inconsistency between 'races' and 'dnd-homebrew-races' keys
 */
export const migrateRacesData = () => {
    try {
        // Check if there's data in the old storage key
        const oldRacesData = localStorage.getItem('races');

        if (oldRacesData) {
            const oldRaces = JSON.parse(oldRacesData);
            if (oldRaces && oldRaces.length > 0) {
                console.log('Found races in old storage format. Migrating...');

                // Get current races in the new format
                const currentRaces = getRaces();
                const currentRaceIds = currentRaces.map(race => race.id);

                // Count how many races we need to migrate
                let migratedCount = 0;

                // Save old races to new format
                oldRaces.forEach(race => {
                    // Only migrate if doesn't already exist
                    if (!race.id || !currentRaceIds.includes(race.id)) {
                        saveRace(race);
                        migratedCount++;
                    }
                });

                // Clear old storage
                localStorage.removeItem('races');

                console.log(`Migration complete. Migrated ${migratedCount} races.`);
            }
        }
        return true;
    } catch (error) {
        console.error('Error migrating races data:', error);
        return false;
    }
};

export const RACE_STORAGE_KEY = 'dnd-homebrew-races';