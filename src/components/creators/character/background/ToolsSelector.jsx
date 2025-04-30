// src/components/creators/character/background/ToolsSelector.jsx
import { useState } from 'react';

function ToolsSelector({ selectedTools = [], onChange }) {
    const [customTool, setCustomTool] = useState('');

    const [toolCategories] = useState([
        {
            name: 'Artisan\'s Tools',
            tools: [
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
            ]
        },
        {
            name: 'Gaming Sets',
            tools: [
                'Dice set',
                'Dragonchess set',
                'Playing card set',
                'Three-Dragon Ante set'
            ]
        },
        {
            name: 'Musical Instruments',
            tools: [
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
            ]
        },
        {
            name: 'Other Tools',
            tools: [
                'Disguise kit',
                'Forgery kit',
                'Herbalism kit',
                'Navigator\'s tools',
                'Poisoner\'s kit',
                'Thieves\' tools'
            ]
        }
    ]);

    const handleToolChange = (tool, checked) => {
        let updatedTools;

        if (checked) {
            updatedTools = [...selectedTools, tool];
        } else {
            updatedTools = selectedTools.filter(t => t !== tool);
        }

        onChange(updatedTools);
    };

    const handleAddCustomTool = () => {
        if (customTool.trim() === '') return;

        // Add the custom tool if it doesn't already exist
        if (!selectedTools.includes(customTool.trim())) {
            onChange([...selectedTools, customTool.trim()]);
        }

        setCustomTool('');
    };

    const handleRemoveTool = (tool) => {
        const updatedTools = selectedTools.filter(t => t !== tool);
        onChange(updatedTools);
    };

    return (
        <div className="tools-selector">
            <p className="form-note">Select tool proficiencies for this background.</p>

            {toolCategories.map(category => (
                <div key={category.name} className="tool-category">
                    <h5>{category.name}</h5>
                    <div className="tools-grid">
                        {category.tools.map(tool => (
                            <div key={tool} className="tool-item checkbox-item">
                                <input
                                    type="checkbox"
                                    id={`tool-${tool}`}
                                    checked={selectedTools.includes(tool)}
                                    onChange={(e) => handleToolChange(tool, e.target.checked)}
                                />
                                <label htmlFor={`tool-${tool}`} className={selectedTools.includes(tool) ? 'selected' : ''}>
                                    {tool}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className="custom-tool-section">
                <h5>Add Custom Tool</h5>
                <div className="custom-tool-input">
                    <input
                        type="text"
                        value={customTool}
                        onChange={(e) => setCustomTool(e.target.value)}
                        placeholder="Enter a custom tool proficiency"
                        className="form-control"
                    />
                    <button
                        className="button"
                        onClick={handleAddCustomTool}
                        disabled={customTool.trim() === ''}
                    >
                        Add
                    </button>
                </div>
            </div>

            {selectedTools.length > 0 && (
                <div className="selected-tools">
                    <h5>Selected Tools</h5>
                    <ul className="selected-tools-list">
                        {selectedTools.map(tool => (
                            <li key={tool} className="selected-tool-item">
                                {tool}
                                <button
                                    className="button-small button-danger"
                                    onClick={() => handleRemoveTool(tool)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default ToolsSelector;