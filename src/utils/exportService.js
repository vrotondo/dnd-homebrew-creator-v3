// src/utils/exportService.js - Enhanced with PDF export
import { jsPDF } from 'jspdf';

/**
 * Export data as JSON file
 * @param {Object} data - Data to export
 * @param {string} filename - Filename without extension
 */
export const exportToJson = (data, filename = 'homebrew-export') => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    downloadFile(blob, `${filename}.json`);
    return true;
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    return false;
  }
};

/**
 * Export data as PDF file
 * @param {Object} data - Data to export (class data)
 * @param {string} filename - Filename without extension
 */
export const exportToPdf = (data, filename = 'homebrew-export') => {
  try {
    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set document properties
    doc.setProperties({
      title: `${data.name || 'D&D Homebrew Class'}`,
      subject: 'D&D 5E Homebrew Character Class',
      author: 'D&D Homebrew Creator',
      creator: 'D&D Homebrew Creator App'
    });

    // Generate PDF content
    generateClassPdf(doc, data);

    // Save the PDF
    doc.save(`${filename}.pdf`);
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
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
    const blob = new Blob([markdown], { type: 'text/markdown' });
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
    const blob = new Blob([html], { type: 'text/html' });
    downloadFile(blob, `${filename}.html`);
    return true;
  } catch (error) {
    console.error('Error exporting to HTML:', error);
    return false;
  }
};

/**
 * Generate PDF representation of a class
 * @param {jsPDF} doc - jsPDF document instance
 * @param {Object} classData - The class data
 */
const generateClassPdf = (doc, classData) => {
  let yPosition = 20;
  const leftMargin = 20;
  const rightMargin = 190;
  const lineHeight = 7;

  // Define colors (D&D theme)
  const headerColor = [88, 24, 13]; // Dark red
  const accentColor = [156, 43, 27]; // Medium red
  const textColor = [51, 51, 51]; // Dark gray

  // Helper function to add text with word wrapping
  const addWrappedText = (text, x, y, maxWidth, fontSize = 10, color = textColor) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * lineHeight);
  };

  // Header
  doc.setFillColor(...headerColor);
  doc.rect(leftMargin, yPosition - 10, rightMargin - leftMargin, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text(classData.name || 'Unnamed Class', leftMargin + 5, yPosition + 5);

  yPosition += 25;

  // Description
  if (classData.description) {
    yPosition += 10;
    doc.setFont('helvetica', 'italic');
    yPosition = addWrappedText(
      classData.description,
      leftMargin,
      yPosition,
      rightMargin - leftMargin,
      11,
      textColor
    );
  }

  // Class Details Box
  yPosition += 10;
  doc.setFillColor(245, 245, 245);
  doc.rect(leftMargin, yPosition - 5, rightMargin - leftMargin, 35, 'F');
  doc.setDrawColor(...accentColor);
  doc.rect(leftMargin, yPosition - 5, rightMargin - leftMargin, 35, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...headerColor);
  doc.text('Class Details', leftMargin + 5, yPosition + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...textColor);

  // Class details in columns
  const detailsY = yPosition + 12;
  const col1X = leftMargin + 5;
  const col2X = leftMargin + 95;

  doc.text(`Hit Die: d${classData.hitDie || '?'}`, col1X, detailsY);
  doc.text(`Primary Abilities: ${formatAbilityList(classData.primaryAbility)}`, col1X, detailsY + 7);
  doc.text(`Saving Throws: ${formatAbilityList(classData.savingThrows)}`, col2X, detailsY);

  yPosition += 40;

  // Proficiencies Section
  yPosition = addSection(doc, 'Proficiencies', yPosition, leftMargin, rightMargin, headerColor, accentColor);

  const proficiencies = classData.proficiencies || {};
  yPosition = addWrappedText(`Armor: ${formatList(proficiencies.armor)}`, leftMargin + 5, yPosition, rightMargin - leftMargin - 10);
  yPosition = addWrappedText(`Weapons: ${formatList(proficiencies.weapons)}`, leftMargin + 5, yPosition + 5, rightMargin - leftMargin - 10);
  yPosition = addWrappedText(`Tools: ${formatList(proficiencies.tools)}`, leftMargin + 5, yPosition + 5, rightMargin - leftMargin - 10);

  if (proficiencies.languages > 0) {
    yPosition = addWrappedText(`Languages: ${proficiencies.languages} additional`, leftMargin + 5, yPosition + 5, rightMargin - leftMargin - 10);
  }

  // Skills section
  const skillChoices = classData.skillChoices || {};
  if (skillChoices.count && skillChoices.options?.length) {
    yPosition = addWrappedText(
      `Skills: Choose ${skillChoices.count} from ${skillChoices.options.join(', ')}`,
      leftMargin + 5,
      yPosition + 5,
      rightMargin - leftMargin - 10
    );
  }

  yPosition += 10;

  // Starting Equipment Section (if exists)
  const equipment = classData.startingEquipment || {};
  if (equipment.standard?.length || equipment.options?.length) {
    yPosition = addSection(doc, 'Starting Equipment', yPosition, leftMargin, rightMargin, headerColor, accentColor);

    if (equipment.standard?.length) {
      equipment.standard.forEach(item => {
        yPosition = addWrappedText(`• ${item}`, leftMargin + 5, yPosition, rightMargin - leftMargin - 10);
        yPosition += 2;
      });
    }

    if (equipment.options?.length) {
      equipment.options.forEach((option, index) => {
        yPosition = addWrappedText(
          `• (a) ${option.optionA} OR (b) ${option.optionB}`,
          leftMargin + 5,
          yPosition + 3,
          rightMargin - leftMargin - 10
        );
      });
    }

    yPosition += 10;
  }

  // Features Section
  const features = classData.features || {};
  const featureLevels = Object.keys(features).filter(level => features[level]?.length > 0);

  if (featureLevels.length > 0) {
    yPosition = addSection(doc, 'Class Features', yPosition, leftMargin, rightMargin, headerColor, accentColor);

    featureLevels.sort((a, b) => parseInt(a) - parseInt(b)).forEach(level => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      // Level header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(...accentColor);
      doc.text(`Level ${level}`, leftMargin + 5, yPosition);
      yPosition += 8;

      // Features for this level
      features[level].forEach(feature => {
        // Check if we need a new page
        if (yPosition > 240) {
          doc.addPage();
          yPosition = 20;
        }

        // Feature name
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(...textColor);
        yPosition = addWrappedText(feature.name, leftMargin + 10, yPosition, rightMargin - leftMargin - 15, 11);

        // Feature description
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        yPosition = addWrappedText(feature.description, leftMargin + 10, yPosition + 3, rightMargin - leftMargin - 15);
        yPosition += 8;
      });
    });
  }

  // Spellcasting Section (if applicable)
  if (classData.spellcasting?.enabled) {
    yPosition = addSection(doc, 'Spellcasting', yPosition, leftMargin, rightMargin, headerColor, accentColor);

    const spellcasting = classData.spellcasting;
    yPosition = addWrappedText(
      `Spellcasting Ability: ${spellcasting.ability}`,
      leftMargin + 5,
      yPosition,
      rightMargin - leftMargin - 10
    );
    yPosition = addWrappedText(
      `Caster Type: ${spellcasting.type} caster`,
      leftMargin + 5,
      yPosition + 5,
      rightMargin - leftMargin - 10
    );
    yPosition = addWrappedText(
      `Spellcasting starts at level ${spellcasting.startLevel}`,
      leftMargin + 5,
      yPosition + 5,
      rightMargin - leftMargin - 10
    );
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `${classData.name || 'D&D Homebrew Class'} - Page ${i} of ${pageCount}`,
      leftMargin,
      285
    );
    doc.text(
      'Created with D&D Homebrew Creator',
      rightMargin - 50,
      285
    );
  }
};

/**
 * Helper function to add a section header
 */
const addSection = (doc, title, yPosition, leftMargin, rightMargin, headerColor, accentColor) => {
  // Check if we need a new page
  if (yPosition > 260) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFillColor(...accentColor);
  doc.rect(leftMargin, yPosition - 3, rightMargin - leftMargin, 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(title, leftMargin + 5, yPosition + 5);

  return yPosition + 15;
};

/**
 * Helper function to download a file
 * @param {Blob} blob - Blob data
 * @param {string} filename - Filename with extension
 */
const downloadFile = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
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
  markdown += `- **Hit Die:** d${classData.hitDie || '?'}\n`;
  markdown += `- **Primary Abilities:** ${formatAbilityList(classData.primaryAbility)}\n`;
  markdown += `- **Saving Throw Proficiencies:** ${formatAbilityList(classData.savingThrows)}\n`;

  // Proficiencies
  markdown += `\n## Proficiencies\n\n`;
  const proficiencies = classData.proficiencies || {};
  markdown += `- **Armor:** ${formatList(proficiencies.armor)}\n`;
  markdown += `- **Weapons:** ${formatList(proficiencies.weapons)}\n`;
  markdown += `- **Tools:** ${formatList(proficiencies.tools)}\n`;

  if (proficiencies.languages > 0) {
    markdown += `- **Languages:** ${proficiencies.languages} additional\n`;
  }

  const skillChoices = classData.skillChoices || {};
  if (skillChoices.count && skillChoices.options?.length) {
    markdown += `- **Skills:** Choose ${skillChoices.count} from ${skillChoices.options.join(', ')}\n`;
  }

  // Equipment
  const equipment = classData.startingEquipment || {};
  if (equipment.standard?.length || equipment.options?.length) {
    markdown += `\n## Starting Equipment\n\n`;
    markdown += `You start with the following items, plus anything provided by your background:\n\n`;

    if (equipment.options?.length) {
      equipment.options.forEach((option, index) => {
        markdown += `${index + 1}. (a) ${option.optionA} OR (b) ${option.optionB}\n`;
      });
    }

    if (equipment.standard?.length) {
      equipment.standard.forEach((item, index) => {
        const startIndex = (equipment.options?.length || 0) + 1;
        markdown += `${startIndex + index}. ${item}\n`;
      });
    }

    markdown += '\n';
  }

  // Features
  const features = classData.features || {};
  const featureLevels = Object.keys(features).filter(level => features[level]?.length > 0);

  if (featureLevels.length > 0) {
    markdown += `\n## Class Features\n\n`;

    featureLevels.sort((a, b) => parseInt(a) - parseInt(b)).forEach(level => {
      markdown += `### Level ${level}\n\n`;

      features[level].forEach(feature => {
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
                <p>d${classData.hitDie || '?'}</p>
            </div>
            <div class="detail-item">
                <h4>Primary Abilities</h4>
                <p>${formatAbilityList(classData.primaryAbility)}</p>
            </div>
            <div class="detail-item">
                <h4>Saving Throws</h4>
                <p>${formatAbilityList(classData.savingThrows)}</p>
            </div>
        </div>

        <h2>Proficiencies</h2>`;

  const proficiencies = classData.proficiencies || {};
  html += `
        <p><strong>Armor:</strong> ${formatList(proficiencies.armor)}</p>
        <p><strong>Weapons:</strong> ${formatList(proficiencies.weapons)}</p>
        <p><strong>Tools:</strong> ${formatList(proficiencies.tools)}</p>`;

  if (proficiencies.languages > 0) {
    html += `<p><strong>Languages:</strong> ${proficiencies.languages} additional</p>`;
  }

  const skillChoices = classData.skillChoices || {};
  if (skillChoices.count && skillChoices.options?.length) {
    html += `<p><strong>Skills:</strong> Choose ${skillChoices.count} from ${skillChoices.options.join(', ')}</p>`;
  }

  // Equipment section
  const equipment = classData.startingEquipment || {};
  if (equipment.standard?.length || equipment.options?.length) {
    html += `
        <h2>Starting Equipment</h2>
        <p>You start with the following items, plus anything provided by your background:</p>
        <ul>`;

    if (equipment.options?.length) {
      equipment.options.forEach(option => {
        html += `<li>(a) ${option.optionA} <strong>OR</strong> (b) ${option.optionB}</li>`;
      });
    }

    if (equipment.standard?.length) {
      equipment.standard.forEach(item => {
        html += `<li>${item}</li>`;
      });
    }

    html += `</ul>`;
  }

  // Features section
  const features = classData.features || {};
  const featureLevels = Object.keys(features).filter(level => features[level]?.length > 0);

  if (featureLevels.length > 0) {
    html += `
        <h2>Class Features</h2>
        <p>As a ${classData.name}, you gain the following class features:</p>`;

    featureLevels.sort((a, b) => parseInt(a) - parseInt(b)).forEach(level => {
      html += `<h3>Level ${level}</h3>`;

      features[level].forEach(feature => {
        html += `
                <div class="feature">
                    <h4>${feature.name}</h4>
                    <p>${feature.description}</p>
                </div>`;
      });
    });
  }

  html += `
    </div>
</body>
</html>`;

  return html;
};

// Helper formatting functions
const formatAbilityList = (abilities) => {
  if (!abilities || !Array.isArray(abilities) || abilities.length === 0) {
    return 'None';
  }
  return abilities.join(', ');
};

const formatList = (items) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return 'None';
  }
  return items.join(', ');
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