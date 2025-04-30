// src/components/creators/character/SubclassCreator.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getClasses } from '../../../utils/storageService';
import { saveSubclass, getSubclassById } from '../../../utils/storageService';
import ExportModal from '../../export/ExportModal';

function SubclassCreator({ onSave, onCancel }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const [currentStep, setCurrentStep] = useState(1);
    const [subclassData, setSubclassData] = useState({
        name: '',
        parentClass: '',
        description: '',
        flavorText: '',
        features: [],
        spells: []
    });

    const [availableClasses, setAvailableClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [showExportModal, setShowExportModal] = useState(false);

    // Load available classes on component mount
    useEffect(() => {
        const classes = getClasses();
        setAvailableClasses(classes);
    }, []);

    // Load existing subclass if editing
    useEffect(() => {
        if (id) {
            const existingSubclass = getSubclassById(id);
            if (existingSubclass) {
                setSubclassData(existingSubclass);

                // Find the parent class
                if (existingSubclass.parentClass) {
                    const parent = availableClasses.find(c => c.id === existingSubclass.parentClass);
                    if (parent) {
                        setSelectedClass(parent);
                    }
                }
            }
        }
    }, [id, availableClasses]);

    // Update selected class when parent class changes
    useEffect(() => {
        if (subclassData.parentClass) {
            const parent = availableClasses.find(c => c.id === subclassData.parentClass);
            if (parent) {
                setSelectedClass(parent);
            }
        }
    }, [subclassData.parentClass, availableClasses]);

    // Form validation
    useEffect(() => {
        const newErrors = {};

        if (touched.name && !subclassData.name) {
            newErrors.name = 'Subclass name is required';
        }

        if (touched.parentClass && !subclassData.parentClass) {
            newErrors.parentClass = 'Parent class is required';
        }

        if (touched.description && !subclassData.description) {
            newErrors.description = 'Description is required';
        } else if (touched.description && subclassData.description.length < 20) {
            newErrors.description = 'Description should be at least 20 characters';
        }

        setErrors(newErrors);
    }, [subclassData, touched]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSubclassData(prev => ({ ...prev, [name]: value }));
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleClassSelect = (classId) => {
        setSubclassData(prev => ({ ...prev, parentClass: classId }));
        setTouched(prev => ({ ...prev, parentClass: true }));

        // Find the selected class
        const selectedClass = availableClasses.find(c => c.id === classId);
        setSelectedClass(selectedClass);
    };

    const updateSubclassData = (newData) => {
        setSubclassData(prev => ({ ...prev, ...newData }));
    };

    // Check if current step is valid
    const isStepValid = (step) => {
        switch (step) {
            case 1: // Basic info
                return subclassData.name &&
                    subclassData.parentClass &&
                    subclassData.description &&
                    subclassData.description.length >= 20;
            default:
                return true;
        }
    };

    const handleSave = () => {
        // Validate basic info
        if (!isStepValid(1)) {
            setCurrentStep(1);
            setTouched({
                name: true,
                parentClass: true,
                description: true
            });
            return;
        }

        // Save subclass
        const savedId = saveSubclass(subclassData);

        if (savedId) {
            alert('Subclass saved successfully!');
            if (typeof onSave === 'function') {
                onSave();
            }
        } else {
            alert('Failed to save subclass. Please try again.');
        }
    };

    const nextStep = () => {
        if (isStepValid(currentStep)) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Mark fields as touched to show validation errors
            if (currentStep === 1) {
                setTouched({
                    name: true,
                    parentClass: true,
                    description: true
                });
            }
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const steps = [
        { id: 1, name: 'Basic Info' },
        { id: 2, name: 'Features' },
        { id: 3, name: 'Spells' },
        { id: 4, name: 'Preview' }
    ];

    // Get subclass feature levels based on parent class
    const getSubclassFeatureLevels = () => {
        if (!selectedClass) return [];

        // Default subclass levels (fits most classes)
        const defaultLevels = [3, 6, 10, 14];

        // Special cases for different classes
        switch (selectedClass.name.toLowerCase()) {
            case 'cleric':
                return [1, 2, 6, 8, 17];
            case 'druid':
                return [2, 6, 10, 14];
            case 'warlock':
                return [1, 6, 10, 14];
            case 'wizard':
                return [2, 6, 10, 14];
            case 'artificer':
                return [3, 5, 9, 15];
            case 'sorcerer':
                return [1, 6, 14, 18];
            default:
                return defaultLevels;
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Basic info
                return (
                    <div className="form-group">
                        <div className="form-field">
                            <label htmlFor="parentClass">Parent Class*</label>
                            <select
                                id="parentClass"
                                name="parentClass"
                                className={`form-control ${errors.parentClass ? 'error' : ''}`}
                                value={subclassData.parentClass}
                                onChange={(e) => handleClassSelect(e.target.value)}
                                onBlur={() => setTouched(prev => ({ ...prev, parentClass: true }))}
                            >
                                <option value="">Select a parent class...</option>
                                {availableClasses.map(cls => (
                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                ))}
                            </select>
                            {errors.parentClass && <div className="error-message">{errors.parentClass}</div>}

                            {availableClasses.length === 0 && (
                                <div className="info-message">
                                    You need to create at least one class before creating subclasses.
                                    <br />
                                    <button
                                        className="button button-small mt-2"
                                        onClick={() => navigate('/character-creator/class/new')}
                                    >
                                        Create a Class
                                    </button>
                                </div>
                            )}
                        </div>

                        {selectedClass && (
                            <div className="selected-class-info">
                                <h4>Selected Class: {selectedClass.name}</h4>
                                <p>{selectedClass.description.substring(0, 150)}...</p>
                                <div className="subclass-levels">
                                    <strong>Subclass Features at Levels:</strong> {getSubclassFeatureLevels().join(', ')}
                                </div>
                            </div>
                        )}

                        <div className="form-field">
                            <label htmlFor="name">Subclass Name*</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className={`form-control ${errors.name ? 'error' : ''}`}
                                value={subclassData.name}
                                onChange={handleInputChange}
                                onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                                placeholder={selectedClass ? `e.g., ${getSubclassNameExample(selectedClass)}` : 'e.g., School of Enchantment'}
                            />
                            {errors.name && <div className="error-message">{errors.name}</div>}
                        </div>

                        <div className="form-field">
                            <label htmlFor="description">Description*</label>
                            <textarea
                                id="description"
                                name="description"
                                className={`form-control ${errors.description ? 'error' : ''}`}
                                value={subclassData.description}
                                onChange={handleInputChange}
                                onBlur={() => setTouched(prev => ({ ...prev, description: true }))}
                                rows={4}
                                placeholder="Describe your subclass concept and flavor..."
                            />
                            {errors.description && <div className="error-message">{errors.description}</div>}
                        </div>

                        <div className="form-field">
                            <label htmlFor="flavorText">Flavor Text (Optional)</label>
                            <textarea
                                id="flavorText"
                                name="flavorText"
                                className="form-control"
                                value={subclassData.flavorText}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Add thematic flavor text to introduce your subclass..."
                            />
                        </div>

                        <p className="form-note">* Required fields</p>
                    </div>
                );

            case 2: // Features
                return (
                    <div className="form-group">
                        <h3>Subclass Features</h3>
                        {selectedClass ? (
                            <SubclassFeatures
                                subclassData={subclassData}
                                updateSubclassData={updateSubclassData}
                                featureLevels={getSubclassFeatureLevels()}
                            />
                        ) : (
                            <div className="info-message">
                                Please select a parent class first to see subclass feature levels.
                            </div>
                        )}
                    </div>
                );

            case 3: // Spells
                return (
                    <div className="form-group">
                        <h3>Subclass Spells</h3>
                        {selectedClass && hasSubclassSpells(selectedClass) ? (
                            <SubclassSpells
                                subclassData={subclassData}
                                updateSubclassData={updateSubclassData}
                                parentClass={selectedClass}
                            />
                        ) : (
                            <div className="info-message">
                                {selectedClass
                                    ? `The ${selectedClass.name} class does not typically have subclass-specific spells.`
                                    : 'Please select a parent class first to determine if subclass spells are available.'}
                            </div>
                        )}
                    </div>
                );

            case 4: // Preview
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
                            <SubclassPreview
                                subclassData={subclassData}
                                parentClass={selectedClass}
                            />
                        </div>

                        {showExportModal && (
                            <ExportModal
                                classData={subclassData}
                                onClose={() => setShowExportModal(false)}
                            />
                        )}
                    </div>
                );

            default:
                return <div>Unknown step</div>;
        }
    };

    // Helper function to generate example subclass names based on parent class
    const getSubclassNameExample = (parentClass) => {
        if (!parentClass) return '';

        const className = parentClass.name.toLowerCase();

        switch (className) {
            case 'barbarian': return 'Path of the Berserker';
            case 'bard': return 'College of Lore';
            case 'cleric': return 'Life Domain';
            case 'druid': return 'Circle of the Land';
            case 'fighter': return 'Battle Master';
            case 'monk': return 'Way of the Open Hand';
            case 'paladin': return 'Oath of Devotion';
            case 'ranger': return 'Hunter';
            case 'rogue': return 'Thief';
            case 'sorcerer': return 'Draconic Bloodline';
            case 'warlock': return 'The Fiend';
            case 'wizard': return 'School of Evocation';
            default: return 'Arcane Tradition';
        }
    };

    // Check if the class has subclass spells
    const hasSubclassSpells = (parentClass) => {
        if (!parentClass) return false;

        const className = parentClass.name.toLowerCase();
        return ['cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'warlock', 'wizard'].includes(className);
    };

    return (
        <div className="form-container">
            <h2>Create a Subclass</h2>

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
                        disabled={!isStepValid(1)} // Basic validation must pass to save
                    >
                        Save Subclass
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

export default SubclassCreator;