// src/utils/exportService.js
/**
 * Export service for D&D Homebrew Creator
 * Provides functionality to export content in various formats
 */

/**
 * Export data as JSON file
 * @param {Object} data - Data to export
 * @param {string} filename - Filename without extension
 */
export const exportToJson = (data, filename = 'homebrew-export') => {
    try {
        // Create JSON string with nice formatting
        const jsonString = JSON.stringify(data, null, 2);

        // Create a blob with the data
        const blob = new Blob([jsonString], { type: 'application/json' });

        // Trigger download
        downloadFile(blob, `${filename}.json`);

        return true;
    } catch (error) {
        console.error('Error exporting to JSON:', error);
        return false;
    }
};

/**
 * Export data as Markdown text
 * @param {Object} data - Data to export (class data)
 * @param {string} filename - Filename without extension
 */
export const exportToMarkdown = (data, filename = 'homebrew-export') => {
    try {
        let markdown = generateClassMarkdown(data);

        // Create a blob with the markdown text
        const blob = new Blob([markdown], { type: 'text/markdown' });

        // Trigger download
        downloadFile(blob, `${filename}.md`);

        return true;
    } catch (error) {
        console.error('Error exporting to Markdown:', error);
        return false;
    }
};

/**
 * Export data as HTML file
 * @param {Object} data - Data to export (class data)
 * @param {string} filename - Filename without extension
 */
export const exportToHtml = (data, filename = 'homebrew-export') => {
    try {
        const html = generateClassHtml(data);

        // Create a blob with the HTML
        const blob = new Blob([html], { type: 'text/html' });

        // Trigger download
        downloadFile(blob, `${filename}.html`);

        return true;
    } catch (error) {
        console.error('Error exporting to HTML:', error);
        return false;
    }
};

/**
 * Helper function to download a file
 * @param {Blob} blob - Blob data
 * @param {string} filename - Filename with extension
 */
const downloadFile = (blob, filename) => {
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a link element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;

    // Append to the document, click, and remove
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up the URL
    URL.revokeObjectURL(url);
};

/**
 * Generate markdown representation of a class
 * @param {Object} classData - The class data
 * @returns {string} Markdown text
 */
const generateClassMarkdown = (classData) => {
    let markdown = `# ${classData.name || 'Unnamed Class'}\n\n`;

    // Description
    markdown += `${classData.description || 'No description provided.'}\n\n`;

    // Class Details
    markdown += `## Class Details\n\n`;
    markdown += `- **Hit Die:** ${classData.hitDice}\n`;
    markdown += `- **Primary Ability:** ${formatAbility(classData.primaryAbility)}\n`;
    markdown += `- **Saving Throw Proficiencies:** ${formatSavingThrows(classData.savingThrows)}\n`;

    // Proficiencies
    markdown += `\n## Proficiencies\n\n`;
    markdown += `- **Armor:** ${formatList(classData.armorProficiencies) || 'None'}\n`;
    markdown += `- **Weapons:** ${formatWeaponProficiencies(classData.weaponProficiencies) || 'None'}\n`;
    markdown += `- **Tools:** ${classData.toolProficiencies || 'None'}\n`;
    markdown += `- **Skills:** Choose ${classData.numSkillChoices} from ${formatList(classData.skillProficiencies) || 'None'}\n`;

    // Equipment
    if (classData.startingEquipment?.default?.length > 0 || classData.startingEquipment?.options?.length > 0) {
        markdown += `\n## Starting Equipment\n\n`;
        markdown += `You start with the following items, plus anything provided by your background:\n\n`;

        if (classData.startingEquipment?.options?.length > 0) {
            classData.startingEquipment.options.forEach((option, index) => {
                markdown += `${index + 1}. (a) ${option.option1} OR (b) ${option.option2}\n`;
            });
        }

        if (classData.startingEquipment?.default?.length > 0) {
            classData.startingEquipment.default.forEach((item, index) => {
                const startIndex = (classData.startingEquipment?.options?.length || 0) + 1;
                markdown += `${startIndex + index}. ${item}\n`;
            });
        }

        markdown += '\n';
    }

    // Features
    if (classData.features && classData.features.length > 0) {
        markdown += `\n## Class Features\n\n`;

        // Group features by level
        const featuresByLevel = {};
        classData.features.forEach(feature => {
            if (!featuresByLevel[feature.level]) {
                featuresByLevel[feature.level] = [];
            }
            featuresByLevel[feature.level].push(feature);
        });

        // Output features by level
        Object.keys(featuresByLevel)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .forEach(level => {
                markdown += `### Level ${level}\n\n`;

                featuresByLevel[level].forEach(feature => {
                    markdown += `#### ${feature.name}\n\n`;
                    markdown += `${feature.description}\n\n`;
                });
            });
    }

    return markdown;
};

/**
 * Generate HTML representation of a class
 * @param {Object} classData - The class data
 * @returns {string} HTML content
 */
const generateClassHtml = (classData) => {
    // Create basic HTML template
    let html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${classData.name || 'D&D Homebrew Class'}</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      h1, h2, h3, h4 {
        color: #58180D;
        margin-top: 1.5em;
      }
      h1 {
        border-bottom: 2px solid #58180D;
        padding-bottom: 10px;
      }
      h2 {
        border-bottom: 1px solid #9C2B1B;
        padding-bottom: 5px;
      }
      .class-header {
        background-color: #F2F2F2;
        padding: 15px;
        border-radius: 5px;
        margin-bottom: 20px;
      }
      .class-description {
        font-style: italic;
        margin-bottom: 20px;
      }
      .class-details {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
      }
      .detail-item {
        background-color: #F9F9F9;
        padding: 10px;
        border-radius: 5px;
      }
      .detail-item h4 {
        margin: 0 0 5px 0;
        color: #58180D;
      }
      .feature {
        margin-bottom: 20px;
      }
      .feature-name {
        font-weight: bold;
        color: #58180D;
      }
      ul {
        padding-left: 20px;
      }
      .equipment-option {
        margin-bottom: 10px;
      }
    </style>
  </head>
  <body>
    <div class="class-container">
      <div class="class-header">
        <h1>${classData.name || 'Unnamed Class'}</h1>
        <div class="class-description">${classData.description || 'No description provided.'}</div>
      </div>
  
      <h2>Class Details</h2>
      <div class="class-details">
        <div class="detail-item">
          <h4>Hit Die</h4>
          <p>${classData.hitDice}</p>
        </div>
        <div class="detail-item">
          <h4>Primary Ability</h4>
          <p>${formatAbility(classData.primaryAbility)}</p>
        </div>
        <div class="detail-item">
          <h4>Saving Throws</h4>
          <p>${formatSavingThrows(classData.savingThrows)}</p>
        </div>
      </div>
  
      <h2>Proficiencies</h2>
      <div class="proficiencies">
        <p><strong>Armor:</strong> ${formatList(classData.armorProficiencies) || 'None'}</p>
        <p><strong>Weapons:</strong> ${formatWeaponProficiencies(classData.weaponProficiencies) || 'None'}</p>
        <p><strong>Tools:</strong> ${classData.toolProficiencies || 'None'}</p>
        <p><strong>Skills:</strong> Choose ${classData.numSkillChoices} from ${formatList(classData.skillProficiencies) || 'None'}</p>
      </div>
  `;

    // Equipment section
    if (classData.startingEquipment?.default?.length > 0 || classData.startingEquipment?.options?.length > 0) {
        html += `
      <h2>Starting Equipment</h2>
      <p>You start with the following items, plus anything provided by your background:</p>
      <ul>
  `;

        if (classData.startingEquipment?.options?.length > 0) {
            classData.startingEquipment.options.forEach(option => {
                html += `      <li class="equipment-option">(a) ${option.option1} <strong>OR</strong> (b) ${option.option2}</li>\n`;
            });
        }

        if (classData.startingEquipment?.default?.length > 0) {
            classData.startingEquipment.default.forEach(item => {
                html += `      <li>${item}</li>\n`;
            });
        }

        html += `    </ul>\n`;
    }

    // Features section
    if (classData.features && classData.features.length > 0) {
        html += `
      <h2>Class Features</h2>
      <p>As a ${classData.name}, you gain the following class features:</p>
  `;

        // Group features by level
        const featuresByLevel = {};
        classData.features.forEach(feature => {
            if (!featuresByLevel[feature.level]) {
                featuresByLevel[feature.level] = [];
            }
            featuresByLevel[feature.level].push(feature);
        });

        // Output features by level
        Object.keys(featuresByLevel)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .forEach(level => {
                html += `    <h3>Level ${level}</h3>\n`;

                featuresByLevel[level].forEach(feature => {
                    html += `    <div class="feature">
        <h4>${feature.name}</h4>
        <p>${feature.description}</p>
      </div>\n`;
                });
            });
    }

    // Close HTML
    html += `
    </div>
  </body>
  </html>`;

    return html;
};

// Helper formatting functions
const formatAbility = (abilityCode) => {
    const abilities = {
        'STR': 'Strength',
        'DEX': 'Dexterity',
        'CON': 'Constitution',
        'INT': 'Intelligence',
        'WIS': 'Wisdom',
        'CHA': 'Charisma'
    };
    return abilities[abilityCode] || abilityCode || 'None';
};

const formatSavingThrows = (savingThrows) => {
    if (!savingThrows || !Array.isArray(savingThrows) || savingThrows.length === 0) {
        return 'None';
    }

    return savingThrows.map(formatAbility).join(', ');
};

const formatList = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
        return 'None';
    }

    return items.join(', ');
};

const formatWeaponProficiencies = (proficiencies) => {
    if (!proficiencies || !Array.isArray(proficiencies) || proficiencies.length === 0) {
        return 'None';
    }

    // Handle weapon groups
    const hasSimple = proficiencies.includes('simple');
    const hasMartial = proficiencies.includes('martial');

    if (hasSimple && hasMartial) {
        return 'Simple weapons, martial weapons';
    }

    const groups = [];
    const individual = [];

    proficiencies.forEach(id => {
        if (id === 'simple') {
            groups.push('Simple weapons');
        } else if (id === 'martial') {
            groups.push('Martial weapons');
        } else {
            individual.push(id);
        }
    });

    return [...groups, ...individual].join(', ');
};

/**
 * Generate a filename based on class data
 * @param {Object} classData - The class data
 * @returns {string} Filename without extension
 */
export const generateFilename = (classData) => {
    if (!classData || !classData.name) {
        return 'dnd-homebrew-class';
    }

    // Convert class name to kebab case for filename
    return `dnd-class-${classData.name.toLowerCase().replace(/\s+/g, '-')}`;
};