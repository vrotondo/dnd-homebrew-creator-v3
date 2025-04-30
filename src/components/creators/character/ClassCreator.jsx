// src/components/creators/character/ClassCreator.jsx
import { useState, useEffect } from 'react';
import { saveClass, getClassById } from "../../../utils/storageService";
import ExportModal from '../../export/ExportModal';
import SpellSelector from './SpellSelector';
import { getSpellById, formatSpellLevel } from '../../../utils/spellData';

function ClassCreator({ itemId, onSave, onCancel }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [classData, setClassData] = useState({
        name: '',
        description: '',
        hitDice: 'd8',
        primaryAbility: '',
        savingThrows: [],
        armorProficiencies: [],
        weaponProficiencies: [],
        toolProficiencies: '',
        skillProficiencies: [],
        numSkillChoices: 2,
        startingEquipment: {
            default: [],
            options: []
        },
        spellcasting: {
            enabled: false,
            ability: '',
            type: 'full',
            focusType: '',
            spellList: []
        },
        features: []
    });

    const [showExportModal, setShowExportModal] = useState(false);

    // New state for equipment option editing
    const [currentEquipmentItem, setCurrentEquipmentItem] = useState('');
    const [currentOptionSet, setCurrentOptionSet] = useState({
        option1: '',
        option2: ''
    });

    // States for feature editing
    const [currentFeature, setCurrentFeature] = useState({
        name: '',
        level: 1,
        description: ''
    });
    const [editingFeatureIndex, setEditingFeatureIndex] = useState(null);
    const [featureErrors, setFeatureErrors] = useState({});
    const [featureTouched, setFeatureTouched] = useState({});

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Data for proficiency selections
    const armorTypes = [
        { id: 'light', name: 'Light Armor' },
        { id: 'medium', name: 'Medium Armor' },
        { id: 'heavy', name: 'Heavy Armor' },
        { id: 'shields', name: 'Shields' }
    ];

    const weaponGroups = [
        { id: 'simple', name: 'Simple Weapons' },
        { id: 'martial', name: 'Martial Weapons' }
    ];

    const specificWeapons = [
        { id: 'club', name: 'Club', type: 'simple' },
        { id: 'dagger', name: 'Dagger', type: 'simple' },
        { id: 'greatclub', name: 'Greatclub', type: 'simple' },
        { id: 'handaxe', name: 'Handaxe', type: 'simple' },
        { id: 'javelin', name: 'Javelin', type: 'simple' },
        { id: 'light-hammer', name: 'Light Hammer', type: 'simple' },
        { id: 'mace', name: 'Mace', type: 'simple' },
        { id: 'quarterstaff', name: 'Quarterstaff', type: 'simple' },
        { id: 'sickle', name: 'Sickle', type: 'simple' },
        { id: 'spear', name: 'Spear', type: 'simple' },
        { id: 'light-crossbow', name: 'Light Crossbow', type: 'simple' },
        { id: 'dart', name: 'Dart', type: 'simple' },
        { id: 'shortbow', name: 'Shortbow', type: 'simple' },
        { id: 'sling', name: 'Sling', type: 'simple' },
        { id: 'battleaxe', name: 'Battleaxe', type: 'martial' },
        { id: 'flail', name: 'Flail', type: 'martial' },
        { id: 'glaive', name: 'Glaive', type: 'martial' },
        { id: 'greataxe', name: 'Greataxe', type: 'martial' },
        { id: 'greatsword', name: 'Greatsword', type: 'martial' },
        { id: 'halberd', name: 'Halberd', type: 'martial' },
        { id: 'lance', name: 'Lance', type: 'martial' },
        { id: 'longsword', name: 'Longsword', type: 'martial' },
        { id: 'maul', name: 'Maul', type: 'martial' },
        { id: 'morningstar', name: 'Morningstar', type: 'martial' },
        { id: 'pike', name: 'Pike', type: 'martial' },
        { id: 'rapier', name: 'Rapier', type: 'martial' },
        { id: 'scimitar', name: 'Scimitar', type: 'martial' },
        { id: 'shortsword', name: 'Shortsword', type: 'martial' },
        { id: 'trident', name: 'Trident', type: 'martial' },
        { id: 'war-pick', name: 'War Pick', type: 'martial' },
        { id: 'warhammer', name: 'Warhammer', type: 'martial' },
        { id: 'whip', name: 'Whip', type: 'martial' },
        { id: 'blowgun', name: 'Blowgun', type: 'martial' },
        { id: 'hand-crossbow', name: 'Hand Crossbow', type: 'martial' },
        { id: 'heavy-crossbow', name: 'Heavy Crossbow', type: 'martial' },
        { id: 'longbow', name: 'Longbow', type: 'martial' },
        { id: 'net', name: 'Net', type: 'martial' }
    ];

    const skills = [
        { id: 'acrobatics', name: 'Acrobatics', ability: 'DEX' },
        { id: 'animal-handling', name: 'Animal Handling', ability: 'WIS' },
        { id: 'arcana', name: 'Arcana', ability: 'INT' },
        { id: 'athletics', name: 'Athletics', ability: 'STR' },
        { id: 'deception', name: 'Deception', ability: 'CHA' },
        { id: 'history', name: 'History', ability: 'INT' },
        { id: 'insight', name: 'Insight', ability: 'WIS' },
        { id: 'intimidation', name: 'Intimidation', ability: 'CHA' },
        { id: 'investigation', name: 'Investigation', ability: 'INT' },
        { id: 'medicine', name: 'Medicine', ability: 'WIS' },
        { id: 'nature', name: 'Nature', ability: 'INT' },
        { id: 'perception', name: 'Perception', ability: 'WIS' },
        { id: 'performance', name: 'Performance', ability: 'CHA' },
        { id: 'persuasion', name: 'Persuasion', ability: 'CHA' },
        { id: 'religion', name: 'Religion', ability: 'INT' },
        { id: 'sleight-of-hand', name: 'Sleight of Hand', ability: 'DEX' },
        { id: 'stealth', name: 'Stealth', ability: 'DEX' },
        { id: 'survival', name: 'Survival', ability: 'WIS' }
    ];

    // Basic info form handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClassData(prev => ({ ...prev, [name]: value }));
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleCheckboxChange = (e) => {
        const { name, value, checked } = e.target;
        if (checked) {
            setClassData(prev => ({
                ...prev,
                [name]: [...prev[name], value]
            }));
        } else {
            setClassData(prev => ({
                ...prev,
                [name]: prev[name].filter(item => item !== value)
            }));
        }
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= 0) {
            setClassData(prev => ({ ...prev, [name]: numValue }));
        }
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    // Handle weapon proficiency selection with groups
    const handleWeaponGroupChange = (e) => {
        const { value, checked } = e.target;

        if (checked) {
            // Add the group
            setClassData(prev => ({
                ...prev,
                weaponProficiencies: [...prev.weaponProficiencies, value]
            }));

            // Remove any individual weapons of this group to avoid redundancy
            const groupWeapons = specificWeapons
                .filter(weapon => weapon.type === value)
                .map(weapon => weapon.id);

            setClassData(prev => ({
                ...prev,
                weaponProficiencies: prev.weaponProficiencies.filter(
                    item => !groupWeapons.includes(item)
                )
            }));
        } else {
            // Remove the group
            setClassData(prev => ({
                ...prev,
                weaponProficiencies: prev.weaponProficiencies.filter(item => item !== value)
            }));
        }

        setTouched(prev => ({ ...prev, weaponProficiencies: true }));
    };

    // Equipment handlers
    const handleEquipmentItemChange = (e) => {
        setCurrentEquipmentItem(e.target.value);
    };

    const handleOptionChange = (e) => {
        const { name, value } = e.target;
        setCurrentOptionSet(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addDefaultEquipment = () => {
        if (currentEquipmentItem.trim()) {
            const currentDefault = Array.isArray(classData.startingEquipment?.default) ?
                classData.startingEquipment.default : [];

            setClassData(prev => ({
                ...prev,
                startingEquipment: {
                    ...prev.startingEquipment || {},
                    default: [...currentDefault, currentEquipmentItem.trim()]
                }
            }));
            setCurrentEquipmentItem('');
        }
    };

    const removeDefaultEquipment = (index) => {
        setClassData(prev => ({
            ...prev,
            startingEquipment: {
                ...prev.startingEquipment,
                default: prev.startingEquipment.default.filter((_, i) => i !== index)
            }
        }));
    };

    const addEquipmentOption = () => {
        if (currentOptionSet.option1.trim() && currentOptionSet.option2.trim()) {
            setClassData(prev => ({
                ...prev,
                startingEquipment: {
                    ...prev.startingEquipment,
                    options: [
                        ...prev.startingEquipment.options,
                        {
                            option1: currentOptionSet.option1.trim(),
                            option2: currentOptionSet.option2.trim()
                        }
                    ]
                }
            }));
            setCurrentOptionSet({ option1: '', option2: '' });
        }
    };

    const removeEquipmentOption = (index) => {
        setClassData(prev => ({
            ...prev,
            startingEquipment: {
                ...prev.startingEquipment,
                options: prev.startingEquipment.options.filter((_, i) => i !== index)
            }
        }));
    };

    // Feature form handlers
    const handleFeatureChange = (e) => {
        const { name, value } = e.target;
        setCurrentFeature(prev => ({
            ...prev,
            [name]: name === 'level' ? parseInt(value, 10) || 1 : value
        }));
        setFeatureTouched(prev => ({ ...prev, [name]: true }));
    };

    const validateFeature = () => {
        const newErrors = {};

        if (featureTouched.name && !currentFeature.name.trim()) {
            newErrors.name = 'Feature name is required';
        }

        if (featureTouched.level && (currentFeature.level < 1 || currentFeature.level > 20)) {
            newErrors.level = 'Level must be between 1 and 20';
        }

        if (featureTouched.description && !currentFeature.description.trim()) {
            newErrors.description = 'Feature description is required';
        }

        setFeatureErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const updateClassData = (newData) => {
        setClassData(prev => {
            // Handle nested updates for spellcasting
            if (newData.spellcasting) {
                return {
                    ...prev,
                    spellcasting: {
                        ...prev.spellcasting,
                        ...newData.spellcasting
                    }
                };
            }
            // Regular update for non-nested properties
            return { ...prev, ...newData };
        });
    };

    const handleAddFeature = () => {
        if (validateFeature()) {
            if (editingFeatureIndex !== null) {
                // Update existing feature
                const updatedFeatures = [...classData.features];
                updatedFeatures[editingFeatureIndex] = { ...currentFeature };
                setClassData(prev => ({ ...prev, features: updatedFeatures }));
            } else {
                // Add new feature
                setClassData(prev => ({
                    ...prev,
                    features: [...prev.features, { ...currentFeature }]
                }));
            }

            // Reset feature form
            setCurrentFeature({ name: '', level: 1, description: '' });
            setEditingFeatureIndex(null);
            setFeatureTouched({});
        } else {
            // Mark all feature fields as touched to show validation errors
            setFeatureTouched({
                name: true,
                level: true,
                description: true
            });
        }
    };

    const handleEditFeature = (index) => {
        setCurrentFeature({ ...classData.features[index] });
        setEditingFeatureIndex(index);
        setFeatureTouched({});
    };

    const handleDeleteFeature = (index) => {
        const updatedFeatures = classData.features.filter((_, i) => i !== index);
        setClassData(prev => ({ ...prev, features: updatedFeatures }));

        if (editingFeatureIndex === index) {
            setCurrentFeature({ name: '', level: 1, description: '' });
            setEditingFeatureIndex(null);
            setFeatureTouched({});
        }
    };

    const handleCancelFeatureEdit = () => {
        setCurrentFeature({ name: '', level: 1, description: '' });
        setEditingFeatureIndex(null);
        setFeatureTouched({});
        setFeatureErrors({});
    };

    // Basic info validation
    useEffect(() => {
        const newErrors = {};

        if (touched.name && !classData.name) {
            newErrors.name = 'Class name is required';
        }

        if (touched.description && !classData.description) {
            newErrors.description = 'Description is required';
        } else if (touched.description && classData.description.length < 20) {
            newErrors.description = 'Description should be at least 20 characters';
        }

        if (touched.primaryAbility && !classData.primaryAbility) {
            newErrors.primaryAbility = 'Please select a primary ability';
        }

        if (touched.savingThrows && classData.savingThrows.length !== 2) {
            newErrors.savingThrows = 'Please select exactly 2 saving throw proficiencies';
        }

        if (touched.skillProficiencies && classData.skillProficiencies.length > classData.numSkillChoices) {
            newErrors.skillProficiencies = `Select at most ${classData.numSkillChoices} skills`;
        }

        setErrors(newErrors);
    }, [classData, touched]);

    // Load existing class data if editing
    useEffect(() => {
        if (itemId) {
            const existingClass = getClassById(itemId);
            if (existingClass) {
                // Ensure spellcasting is properly initialized with defaults
                const updatedClass = {
                    ...existingClass,
                    // Initialize spellcasting if it doesn't exist
                    spellcasting: existingClass.spellcasting || {
                        enabled: false,
                        ability: '',
                        type: 'full',
                        focusType: '',
                        spellList: []
                    },
                    // Initialize startingEquipment if it doesn't exist
                    startingEquipment: existingClass.startingEquipment || {
                        default: [],
                        options: []
                    }
                };

                setClassData(updatedClass);
            }
        }
    }, [itemId]);

    // Feature validation
    useEffect(() => {
        validateFeature();
    }, [currentFeature, featureTouched]);

    // Check if the current step is valid
    const isStepValid = (step) => {
        switch (step) {
            case 1:
                // Check all required fields for basic info
                return classData.name &&
                    classData.description &&
                    classData.description.length >= 20 &&
                    classData.primaryAbility &&
                    classData.savingThrows.length === 2;
            case 2:
                // For now, we're not enforcing validation on the proficiencies step
                return true;
            case 3:
                // For now, we're not enforcing validation on the equipment step
                return true;
            case 4:
                // For now, we're not enforcing validation on the features step
                return true;
            default:
                return true;
        }
    };

    const handleSave = () => {
        // Final validation
        if (!isStepValid(1)) {
            setCurrentStep(1);
            // Mark all fields as touched to show validation errors
            setTouched({
                name: true,
                description: true,
                primaryAbility: true,
                savingThrows: true
            });
            return;
        }

        // Save using storage service
        const savedId = saveClass(classData);

        if (savedId) {
            alert('Class saved successfully!');
            if (typeof onSave === 'function') {
                onSave();
            }
        } else {
            alert('Failed to save class. Please try again.');
        }
    };

    const nextStep = () => {
        if (isStepValid(currentStep)) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Mark all fields in the current step as touched to show validation errors
            if (currentStep === 1) {
                setTouched({
                    ...touched,
                    name: true,
                    description: true,
                    primaryAbility: true,
                    savingThrows: true
                });
            }
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const steps = [
        { id: 1, name: 'Basic Info' },
        { id: 2, name: 'Proficiencies' },
        { id: 3, name: 'Equipment' },
        { id: 4, name: 'Spellcasting' },
        { id: 5, name: 'Features' },
        { id: 6, name: 'Preview' }
    ];

    const renderStepContent = () => {
        console.log("Rendering step:", currentStep);

        switch (currentStep) {
            case 1:
                return (
                    <div className="form-group">
                        <div className="form-field">
                            <label htmlFor="name">Class Name*</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className={`form-control ${errors.name ? 'error' : ''}`}
                                value={classData.name}
                                onChange={handleInputChange}
                                onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                                placeholder="e.g., Battle Mage"
                            />
                            {errors.name && <div className="error-message">{errors.name}</div>}
                        </div>

                        <div className="form-field">
                            <label htmlFor="description">Description*</label>
                            <textarea
                                id="description"
                                name="description"
                                className={`form-control ${errors.description ? 'error' : ''}`}
                                value={classData.description}
                                onChange={handleInputChange}
                                onBlur={() => setTouched(prev => ({ ...prev, description: true }))}
                                rows={4}
                                placeholder="Describe your class concept and flavor..."
                            />
                            {errors.description && <div className="error-message">{errors.description}</div>}
                        </div>

                        <div className="form-field">
                            <label htmlFor="hitDice">Hit Dice*</label>
                            <select
                                id="hitDice"
                                name="hitDice"
                                className="form-control"
                                value={classData.hitDice}
                                onChange={handleInputChange}
                            >
                                <option value="d6">d6</option>
                                <option value="d8">d8</option>
                                <option value="d10">d10</option>
                                <option value="d12">d12</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label htmlFor="primaryAbility">Primary Ability*</label>
                            <select
                                id="primaryAbility"
                                name="primaryAbility"
                                className={`form-control ${errors.primaryAbility ? 'error' : ''}`}
                                value={classData.primaryAbility}
                                onChange={handleInputChange}
                                onBlur={() => setTouched(prev => ({ ...prev, primaryAbility: true }))}
                            >
                                <option value="">Select an ability...</option>
                                <option value="STR">Strength</option>
                                <option value="DEX">Dexterity</option>
                                <option value="CON">Constitution</option>
                                <option value="INT">Intelligence</option>
                                <option value="WIS">Wisdom</option>
                                <option value="CHA">Charisma</option>
                            </select>
                            {errors.primaryAbility && <div className="error-message">{errors.primaryAbility}</div>}
                        </div>

                        <div className="form-field">
                            <label>Saving Throw Proficiencies* (select exactly 2)</label>
                            <div className="checkbox-group">
                                {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(ability => (
                                    <div key={ability} className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            id={`savingThrow-${ability}`}
                                            name="savingThrows"
                                            value={ability}
                                            checked={classData.savingThrows.includes(ability)}
                                            onChange={handleCheckboxChange}
                                            onBlur={() => setTouched(prev => ({ ...prev, savingThrows: true }))}
                                        />
                                        <label htmlFor={`savingThrow-${ability}`}>{getAbilityName(ability)}</label>
                                    </div>
                                ))}
                            </div>
                            {errors.savingThrows && <div className="error-message">{errors.savingThrows}</div>}
                        </div>

                        <p className="form-note">* Required fields</p>
                    </div>
                );
            case 2:
                return (
                    <div className="form-group">
                        <p className="form-info">
                            Define which armor, weapons, tools, and skills your class is proficient with.
                            These proficiencies represent what members of this class are trained to use.
                        </p>

                        {/* Armor Proficiencies */}
                        <div className="form-field">
                            <label>Armor Proficiencies</label>
                            <div className="checkbox-group">
                                {armorTypes.map(armor => (
                                    <div key={armor.id} className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            id={`armor-${armor.id}`}
                                            name="armorProficiencies"
                                            value={armor.id}
                                            checked={classData.armorProficiencies.includes(armor.id)}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor={`armor-${armor.id}`}>{armor.name}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Weapon Proficiencies - Groups */}
                        <div className="form-field">
                            <label>Weapon Proficiencies</label>
                            <p className="form-help">Select weapon groups or individual weapons</p>

                            <div className="proficiency-section">
                                <h4>Weapon Categories</h4>
                                <div className="checkbox-group">
                                    {weaponGroups.map(group => (
                                        <div key={group.id} className="checkbox-item">
                                            <input
                                                type="checkbox"
                                                id={`weapon-group-${group.id}`}
                                                name="weaponGroups"
                                                value={group.id}
                                                checked={classData.weaponProficiencies.includes(group.id)}
                                                onChange={handleWeaponGroupChange}
                                            />
                                            <label htmlFor={`weapon-group-${group.id}`}>{group.name}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Individual Weapons Selection */}
                            <div className="proficiency-section">
                                <h4>Individual Weapons</h4>
                                <p className="form-help">
                                    You only need to select individual weapons if your class doesn't have proficiency
                                    with an entire weapon category.
                                </p>

                                <div className="proficiency-columns">
                                    <div>
                                        <h5>Simple Weapons</h5>
                                        <div className="checkbox-group-vertical">
                                            {specificWeapons
                                                .filter(weapon => weapon.type === 'simple')
                                                .map(weapon => {
                                                    // If the class has the 'simple' group, disable individual simple weapons
                                                    const isGroupSelected = classData.weaponProficiencies.includes('simple');

                                                    return (
                                                        <div key={weapon.id} className="checkbox-item">
                                                            <input
                                                                type="checkbox"
                                                                id={`weapon-${weapon.id}`}
                                                                name="weaponProficiencies"
                                                                value={weapon.id}
                                                                checked={isGroupSelected || classData.weaponProficiencies.includes(weapon.id)}
                                                                onChange={handleCheckboxChange}
                                                                disabled={isGroupSelected}
                                                            />
                                                            <label
                                                                htmlFor={`weapon-${weapon.id}`}
                                                                className={isGroupSelected ? 'text-muted' : ''}
                                                            >
                                                                {weapon.name}
                                                            </label>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>

                                    <div>
                                        <h5>Martial Weapons</h5>
                                        <div className="checkbox-group-vertical">
                                            {specificWeapons
                                                .filter(weapon => weapon.type === 'martial')
                                                .map(weapon => {
                                                    // If the class has the 'martial' group, disable individual martial weapons
                                                    const isGroupSelected = classData.weaponProficiencies.includes('martial');

                                                    return (
                                                        <div key={weapon.id} className="checkbox-item">
                                                            <input
                                                                type="checkbox"
                                                                id={`weapon-${weapon.id}`}
                                                                name="weaponProficiencies"
                                                                value={weapon.id}
                                                                checked={isGroupSelected || classData.weaponProficiencies.includes(weapon.id)}
                                                                onChange={handleCheckboxChange}
                                                                disabled={isGroupSelected}
                                                            />
                                                            <label
                                                                htmlFor={`weapon-${weapon.id}`}
                                                                className={isGroupSelected ? 'text-muted' : ''}
                                                            >
                                                                {weapon.name}
                                                            </label>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tool Proficiencies */}
                        <div className="form-field">
                            <label htmlFor="toolProficiencies">Tool Proficiencies</label>
                            <p className="form-help">
                                Enter any tool proficiencies, separated by commas
                                (e.g., "Thieves' Tools, Herbalism Kit")
                            </p>
                            <textarea
                                id="toolProficiencies"
                                name="toolProficiencies"
                                className="form-control"
                                value={classData.toolProficiencies}
                                onChange={handleInputChange}
                                rows={2}
                                placeholder="Enter tool proficiencies..."
                            />
                        </div>

                        {/* Skill Proficiencies */}
                        <div className="form-field">
                            <label>Skill Proficiencies</label>
                            <div className="skill-selection">
                                <div className="skill-selection-header">
                                    <label htmlFor="numSkillChoices">
                                        Number of skills characters can choose:
                                    </label>
                                    <input
                                        type="number"
                                        id="numSkillChoices"
                                        name="numSkillChoices"
                                        className="form-control small-input"
                                        value={classData.numSkillChoices}
                                        onChange={handleNumberChange}
                                        min="0"
                                        max="10"
                                    />
                                </div>

                                <p className="form-help">
                                    Select which skills your class members can choose from:
                                </p>

                                <div className="proficiency-columns">
                                    {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(ability => (
                                        <div key={ability} className="skill-group">
                                            <h5>{getAbilityName(ability)} Skills</h5>
                                            <div className="checkbox-group-vertical">
                                                {skills
                                                    .filter(skill => skill.ability === ability)
                                                    .map(skill => (
                                                        <div key={skill.id} className="checkbox-item">
                                                            <input
                                                                type="checkbox"
                                                                id={`skill-${skill.id}`}
                                                                name="skillProficiencies"
                                                                value={skill.id}
                                                                checked={classData.skillProficiencies.includes(skill.id)}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label htmlFor={`skill-${skill.id}`}>{skill.name}</label>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {errors.skillProficiencies && (
                                    <div className="error-message">{errors.skillProficiencies}</div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 3:
                // New equipment step
                return (
                    <div className="form-group">
                        <h3>Starting Equipment</h3>
                        <p className="form-info">
                            Define what equipment characters of this class start with. You can specify default equipment
                            and alternative options that players can choose from.
                        </p>

                        {/* Default Equipment */}
                        <div className="form-field">
                            <label>Default Equipment</label>
                            <p className="form-help">
                                Add items that all characters of this class start with.
                            </p>

                            <div className="input-with-button">
                                <input
                                    type="text"
                                    value={currentEquipmentItem}
                                    onChange={handleEquipmentItemChange}
                                    className="form-control"
                                    placeholder="e.g., A longsword and a shield"
                                />
                                <button
                                    className="button button-compact"
                                    onClick={addDefaultEquipment}
                                >
                                    Add
                                </button>
                            </div>

                            {classData.startingEquipment?.default?.length > 0 ? (
                                <ul className="equipment-list">
                                    {classData.startingEquipment.default.map((item, index) => (
                                        <li key={index} className="equipment-item">
                                            <span>{item}</span>
                                            <button
                                                className="button-small button-danger"
                                                onClick={() => removeDefaultEquipment(index)}
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="placeholder-text">No default equipment added yet.</p>
                            )}
                        </div>

                        {/* Equipment Options */}
                        <div className="form-field">
                            <label>Equipment Options</label>
                            <p className="form-help">
                                Add equipment choices that players can select from instead of some default items.
                                Each option set creates a "choose option1 OR option2" scenario.
                            </p>

                            <div className="option-container">
                                <div className="option-group">
                                    <div className="option-field">
                                        <label htmlFor="option1">Option 1</label>
                                        <input
                                            type="text"
                                            id="option1"
                                            name="option1"
                                            value={currentOptionSet.option1}
                                            onChange={handleOptionChange}
                                            className="form-control"
                                            placeholder="e.g., (a) a martial weapon and a shield"
                                        />
                                    </div>

                                    <div className="option-separator">OR</div>

                                    <div className="option-field">
                                        <label htmlFor="option2">Option 2</label>
                                        <input
                                            type="text"
                                            id="option2"
                                            name="option2"
                                            value={currentOptionSet.option2}
                                            onChange={handleOptionChange}
                                            className="form-control"
                                            placeholder="e.g., (b) two martial weapons"
                                        />
                                    </div>
                                </div>

                                <button
                                    className="button"
                                    onClick={addEquipmentOption}
                                    disabled={!currentOptionSet.option1.trim() || !currentOptionSet.option2.trim()}
                                >
                                    Add Option Set
                                </button>
                            </div>

                            {classData.startingEquipment?.options?.length > 0 ? (
                                <div className="options-list">
                                    {classData.startingEquipment.options.map((optionSet, index) => (
                                        <div key={index} className="option-set">
                                            <div className="option-set-content">
                                                <div className="option-item">{optionSet.option1}</div>
                                                <div className="option-or">OR</div>
                                                <div className="option-item">{optionSet.option2}</div>
                                            </div>
                                            <button
                                                className="button-small button-danger"
                                                onClick={() => removeEquipmentOption(index)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="placeholder-text">No equipment options added yet.</p>
                            )}

                            <div className="equipment-example">
                                <h4>Example Format</h4>
                                <p>
                                    You start with the following items, plus anything provided by your background.
                                </p>
                                <ul>
                                    <li>(a) a longsword and a shield OR (b) two shortswords</li>
                                    <li>(a) five javelins OR (b) any simple melee weapon</li>
                                    <li>A explorer's pack and a holy symbol</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );
            case 4: // Spellcasting step
                return (
                    <div className="form-group">
                        <h3>Spellcasting</h3>

                        <div className="form-field">
                            <div className="checkbox-item">
                                <input
                                    type="checkbox"
                                    id="spellcasting-enabled"
                                    checked={classData.spellcasting?.enabled || false}
                                    onChange={(e) => {
                                        console.log("Checkbox clicked, new value:", e.target.checked);
                                        console.log("Current spellcasting state:", classData.spellcasting);

                                        // Then update state
                                        setClassData(prev => {
                                            const newState = {
                                                ...prev,
                                                spellcasting: {
                                                    ...prev.spellcasting,
                                                    enabled: e.target.checked
                                                }
                                            };
                                            console.log("New state will be:", newState);
                                            return newState;
                                        });
                                    }}
                                />
                                <label htmlFor="spellcasting-enabled">This class can cast spells</label>
                            </div>
                        </div>

                        {classData.spellcasting?.enabled && (
                            <>
                                <div className="spellcasting-options">
                                    <div className="form-field">
                                        <label htmlFor="spellcasting-ability">Spellcasting Ability</label>
                                        <select
                                            id="spellcasting-ability"
                                            value={classData.spellcasting.ability}
                                            onChange={(e) => {
                                                updateClassData({
                                                    spellcasting: {
                                                        ...classData.spellcasting,
                                                        ability: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                        >
                                            <option value="">Select ability...</option>
                                            <option value="INT">Intelligence</option>
                                            <option value="WIS">Wisdom</option>
                                            <option value="CHA">Charisma</option>
                                        </select>
                                    </div>

                                    <div className="form-field">
                                        <label htmlFor="spellcasting-type">Spellcasting Progression</label>
                                        <select
                                            id="spellcasting-type"
                                            value={classData.spellcasting.type}
                                            onChange={(e) => {
                                                updateClassData({
                                                    spellcasting: {
                                                        ...classData.spellcasting,
                                                        type: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                        >
                                            <option value="full">Full Caster (like Wizard, Cleric)</option>
                                            <option value="half">Half Caster (like Paladin, Ranger)</option>
                                            <option value="third">Third Caster (like Eldritch Knight)</option>
                                            <option value="pact">Pact Magic (like Warlock)</option>
                                        </select>
                                    </div>

                                    <div className="form-field">
                                        <label htmlFor="spellcasting-focus">Spellcasting Focus</label>
                                        <select
                                            id="spellcasting-focus"
                                            value={classData.spellcasting.focusType}
                                            onChange={(e) => {
                                                updateClassData({
                                                    spellcasting: {
                                                        ...classData.spellcasting,
                                                        focusType: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                        >
                                            <option value="">No special focus</option>
                                            <option value="arcane">Arcane Focus</option>
                                            <option value="druidic">Druidic Focus</option>
                                            <option value="holy">Holy Symbol</option>
                                            <option value="special">Special Focus</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-field mt-6">
                                    <h4 className="mb-2">Spell List</h4>
                                    <p className="form-help">Select which spells are available to this class.</p>

                                    <SpellSelector
                                        selectedSpells={classData.spellcasting.spellList}
                                        onChange={(spellList) => {
                                            updateClassData({
                                                spellcasting: {
                                                    ...classData.spellcasting,
                                                    spellList
                                                }
                                            });
                                        }}
                                        spellcastingType={classData.spellcasting.type}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                );
            case 5:
                // Features step
                return (
                    <div className="features-container">
                        <h3>Class Features</h3>
                        <p className="form-note">
                            Add features that define your class's abilities. These typically unlock at specific levels
                            as characters progress.
                        </p>

                        {/* Feature Form */}
                        <div className="card">
                            <h4>{editingFeatureIndex !== null ? 'Edit Feature' : 'Add New Feature'}</h4>
                            <div className="form-field">
                                <label htmlFor="featureName">Feature Name*</label>
                                <input
                                    type="text"
                                    id="featureName"
                                    name="name"
                                    className={`form-control ${featureErrors.name ? 'error' : ''}`}
                                    value={currentFeature.name}
                                    onChange={handleFeatureChange}
                                    onBlur={() => setFeatureTouched(prev => ({ ...prev, name: true }))}
                                    placeholder="e.g., Spellcasting"
                                />
                                {featureErrors.name && <div className="error-message">{featureErrors.name}</div>}
                            </div>

                            <div className="form-field">
                                <label htmlFor="featureLevel">Level*</label>
                                <input
                                    type="number"
                                    id="featureLevel"
                                    name="level"
                                    className={`form-control ${featureErrors.level ? 'error' : ''}`}
                                    value={currentFeature.level}
                                    onChange={handleFeatureChange}
                                    onBlur={() => setFeatureTouched(prev => ({ ...prev, level: true }))}
                                    min="1"
                                    max="20"
                                />
                                {featureErrors.level && <div className="error-message">{featureErrors.level}</div>}
                            </div>

                            <div className="form-field">
                                <label htmlFor="featureDescription">Description*</label>
                                <textarea
                                    id="featureDescription"
                                    name="description"
                                    className={`form-control ${featureErrors.description ? 'error' : ''}`}
                                    value={currentFeature.description}
                                    onChange={handleFeatureChange}
                                    onBlur={() => setFeatureTouched(prev => ({ ...prev, description: true }))}
                                    rows={4}
                                    placeholder="Describe what this feature does..."
                                />
                                {featureErrors.description && <div className="error-message">{featureErrors.description}</div>}
                            </div>

                            <div className="form-actions">
                                <button
                                    className="button"
                                    onClick={handleAddFeature}
                                >
                                    {editingFeatureIndex !== null ? 'Update Feature' : 'Add Feature'}
                                </button>

                                {editingFeatureIndex !== null && (
                                    <button
                                        className="button button-secondary"
                                        onClick={handleCancelFeatureEdit}
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Features List */}
                        <div className="features-list">
                            <h4>Current Features</h4>

                            {classData.features.length === 0 ? (
                                <div className="empty-state">
                                    <p>No features added yet. Use the form above to add class features.</p>
                                </div>
                            ) : (
                                <div>
                                    {/* Group features by level */}
                                    {Array.from(
                                        { length: 20 },
                                        (_, i) => i + 1
                                    ).filter(level =>
                                        classData.features.some(feature => feature.level === level)
                                    ).map(level => (
                                        <div key={level} className="feature-level-group">
                                            <h5>Level {level}</h5>

                                            {classData.features
                                                .filter(feature => feature.level === level)
                                                .map((feature, index) => {
                                                    // Find the actual index in the overall features array
                                                    const actualIndex = classData.features.findIndex(
                                                        f => f.name === feature.name && f.level === feature.level
                                                    );

                                                    return (
                                                        <div key={index} className="feature-card">
                                                            <div className="feature-header">
                                                                <h6>{feature.name}</h6>
                                                                <div className="feature-actions">
                                                                    <button
                                                                        className="button-small"
                                                                        onClick={() => handleEditFeature(actualIndex)}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        className="button-small button-danger"
                                                                        onClick={() => handleDeleteFeature(actualIndex)}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <p>{feature.description}</p>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 6: // Preview step
                return (
                    <div className="preview-container">
                        <div className="preview-header">
                            <h3>Preview</h3>
                            <button
                                className="button"
                                onClick={() => setShowExportModal(true)}
                            >
                                Export
                            </button>
                        </div>

                        <div className="card class-preview">
                            <h3 className="class-title">{classData.name || "Unnamed Class"}</h3>
                            <p className="class-description">{classData.description}</p>

                            <div className="class-details">
                                <div className="detail-item">
                                    <h4>Hit Die</h4>
                                    <p>{classData.hitDice}</p>
                                </div>

                                <div className="detail-item">
                                    <h4>Primary Ability</h4>
                                    <p>{getAbilityName(classData.primaryAbility)}</p>
                                </div>

                                <div className="detail-item">
                                    <h4>Saving Throws</h4>
                                    <p>{classData.savingThrows.map(getAbilityName).join(', ')}</p>
                                </div>
                            </div>

                            <div className="class-proficiencies">
                                <h4>Proficiencies</h4>

                                <div className="proficiency-item">
                                    <h5>Armor</h5>
                                    <p>{formatArmorProficiencies(classData.armorProficiencies)}</p>
                                </div>

                                <div className="proficiency-item">
                                    <h5>Weapons</h5>
                                    <p>{formatWeaponProficiencies(classData.weaponProficiencies)}</p>
                                </div>

                                <div className="proficiency-item">
                                    <h5>Tools</h5>
                                    <p>{classData.toolProficiencies || 'None'}</p>
                                </div>

                                <div className="proficiency-item">
                                    <h5>Skills</h5>
                                    <p>Choose {classData.numSkillChoices} from {formatSkillProficiencies(classData.skillProficiencies)}</p>
                                </div>
                            </div>

                            {/* Spellcasting section */}
                            {classData.spellcasting?.enabled && (
                                <div className="class-spellcasting">
                                    <h4>Spellcasting</h4>

                                    <p>
                                        As a {classData.name}, you can cast spells using your {getAbilityName(classData.spellcasting.ability)} as your spellcasting ability.
                                        {classData.spellcasting.focusType && ` You can use a ${formatFocusType(classData.spellcasting.focusType)} as a spellcasting focus.`}
                                    </p>

                                    <h5>Spell Progression</h5>
                                    <p>{formatSpellcastingType(classData.spellcasting.type)}</p>

                                    <h5>Spell List</h5>
                                    {classData.spellcasting.spellList?.length > 0 ? (
                                        <div className="spell-list-preview">
                                            {renderSpellListPreview(classData.spellcasting.spellList)}
                                        </div>
                                    ) : (
                                        <p className="empty-text">No spells selected.</p>
                                    )}
                                </div>
                            )}

                            {/* Equipment Section */}
                            {(classData.startingEquipment?.default?.length > 0 ||
                                classData.startingEquipment?.options?.length > 0) && (
                                    <div className="class-equipment">
                                        <h4>Equipment</h4>
                                        <p>
                                            You start with the following items, plus anything provided by your background:
                                        </p>

                                        <ul className="equipment-preview-list">
                                            {classData.startingEquipment?.options?.map((optionSet, index) => (
                                                <li key={`option-${index}`}>
                                                    (a) {optionSet.option1} <strong>OR</strong> (b) {optionSet.option2}
                                                </li>
                                            ))}

                                            {classData.startingEquipment?.default?.map((item, index) => (
                                                <li key={`default-${index}`}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                            {/* Features section */}
                            {classData.features.length > 0 && (
                                <div className="class-features">
                                    <h4>Class Features</h4>
                                    <p>As a {classData.name}, you gain the following class features.</p>

                                    {Array.from(
                                        { length: 20 },
                                        (_, i) => i + 1
                                    ).filter(level =>
                                        classData.features.some(feature => feature.level === level)
                                    ).map(level => (
                                        <div key={level} className="feature-level">
                                            <h5>Level {level}</h5>

                                            {classData.features
                                                .filter(feature => feature.level === level)
                                                .map((feature, index) => (
                                                    <div key={index} className="feature">
                                                        <h6>{feature.name}</h6>
                                                        <p>{feature.description}</p>
                                                    </div>
                                                ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {showExportModal && (
                            <ExportModal
                                classData={classData}
                                onClose={() => setShowExportModal(false)}
                            />
                        )}
                    </div>
                );
            default:
                return <div>Unknown step</div>;
        }
    };

    // Helper functions
    function getAbilityName(abilityCode) {
        const abilities = {
            'STR': 'Strength',
            'DEX': 'Dexterity',
            'CON': 'Constitution',
            'INT': 'Intelligence',
            'WIS': 'Wisdom',
            'CHA': 'Charisma'
        };
        return abilities[abilityCode] || abilityCode;
    }

    function formatArmorProficiencies(proficiencies) {
        if (!proficiencies || proficiencies.length === 0) {
            return 'None';
        }

        const formattedProficiencies = proficiencies.map(id => {
            const armor = armorTypes.find(a => a.id === id);
            return armor ? armor.name : id;
        });

        return formattedProficiencies.join(', ');
    }

    function formatWeaponProficiencies(proficiencies) {
        if (!proficiencies || proficiencies.length === 0) {
            return 'None';
        }

        // Check for weapon groups first
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
                const weapon = specificWeapons.find(w => w.id === id);
                if (weapon) {
                    individual.push(weapon.name);
                }
            }
        });

        return [...groups, ...individual].join(', ');
    }

    function formatSkillProficiencies(proficiencies) {
        if (!proficiencies || proficiencies.length === 0) {
            return 'None';
        }

        const formattedProficiencies = proficiencies.map(id => {
            const skill = skills.find(s => s.id === id);
            return skill ? skill.name : id;
        });

        return formattedProficiencies.join(', ');
    }

    // Format focus type
    const formatFocusType = (focusType) => {
        switch (focusType) {
            case 'arcane': return 'arcane focus (such as a wand, staff, or crystal)';
            case 'druidic': return 'druidic focus (such as a sprig of mistletoe, totem, wooden staff, or yew wand)';
            case 'holy': return 'holy symbol';
            case 'special': return 'special focus for this class';
            default: return 'spellcasting focus';
        }
    };

    // Format spellcasting type
    const formatSpellcastingType = (type) => {
        switch (type) {
            case 'full': return 'You follow the spellcasting progression of a full spellcaster, such as a Wizard or Cleric, gaining access to higher level spells as you gain levels.';
            case 'half': return 'You follow the spellcasting progression of a half caster, such as a Paladin or Ranger, gaining spell slots at a slower rate and maxing out at 5th-level spells.';
            case 'third': return 'You follow the spellcasting progression of a third caster, such as an Eldritch Knight or Arcane Trickster, gaining spell slots at a very slow rate and maxing out at 4th-level spells.';
            case 'pact': return 'You follow the Pact Magic spellcasting progression, similar to a Warlock.';
            default: return 'Your spellcasting follows a custom progression.';
        }
    };

    // Render spell list preview
    const renderSpellListPreview = (spellList) => {
        if (!spellList || spellList.length === 0) {
            return null;
        }

        const spells = spellList
            .map(id => getSpellById(id))
            .filter(Boolean);

        // Group by level
        const spellsByLevel = spells.reduce((acc, spell) => {
            if (!acc[spell.level]) {
                acc[spell.level] = [];
            }
            acc[spell.level].push(spell);
            return acc;
        }, {});

        return (
            <div className="spell-list-by-level">
                {Object.keys(spellsByLevel)
                    .sort((a, b) => parseInt(a) - parseInt(b))
                    .map(level => (
                        <div key={level} className="spell-level">
                            <h6>{formatSpellLevel(parseInt(level))}</h6>
                            <ul className="spell-names">
                                {spellsByLevel[level]
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map(spell => (
                                        <li key={spell.id}>{spell.name}</li>
                                    ))}
                            </ul>
                        </div>
                    ))}
            </div>
        );
    };

    return (
        <div className="form-container">
            <h2>Create a Character Class</h2>

            <div className="step-navigation">
                {steps.map(step => (
                    <button
                        key={step.id}
                        className={`step-button ${currentStep === step.id ? 'active' : ''}`}
                        onClick={() => setCurrentStep(step.id)}
                    >
                        {step.name}
                    </button>
                ))}
            </div>

            <div className="step-content">
                {renderStepContent()}
            </div>

            <div className="form-actions">
                {currentStep > 1 && (
                    <button
                        className="button button-secondary"
                        onClick={prevStep}
                    >
                        Previous
                    </button>
                )}

                {currentStep < steps.length ? (
                    <button
                        className="button"
                        onClick={nextStep}
                    >
                        Next
                    </button>
                ) : (
                    <button
                        className="button"
                        onClick={handleSave}
                        disabled={!isStepValid(1)}
                    >
                        Save Class
                    </button>
                )}

                <button
                    className="button button-secondary"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default ClassCreator;