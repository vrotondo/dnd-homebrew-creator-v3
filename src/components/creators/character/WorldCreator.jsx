// src/components/creators/WorldCreator.jsx - Complete World Builder Creator
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { saveWorld, getWorldById } from '../../../utils/storageService';
import { ChevronLeft, ChevronRight, Check, Map, AlertCircle, Plus, X } from 'lucide-react';

const WORLD_THEMES = [
    'High Fantasy', 'Low Fantasy', 'Dark Fantasy', 'Steampunk',
    'Cyberpunk', 'Post-Apocalyptic', 'Urban Fantasy', 'Historical Fantasy',
    'Sword & Sorcery', 'Epic Fantasy', 'Grimdark', 'Fairy Tale'
];

const TECH_LEVELS = [
    'Stone Age', 'Bronze Age', 'Iron Age', 'Medieval',
    'Renaissance', 'Industrial', 'Modern', 'Futuristic'
];

const ALIGNMENTS = [
    'Lawful Good', 'Neutral Good', 'Chaotic Good',
    'Lawful Neutral', 'Neutral', 'Chaotic Neutral',
    'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'
];

function WorldCreator({ onSave, onCancel }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const [currentStep, setCurrentStep] = useState(1);
    const [worldData, setWorldData] = useState({
        name: '',
        description: '',
        theme: 'High Fantasy',
        technologyLevel: 'Medieval',
        regions: [],
        factions: [],
        npcs: [],
        history: '',
        cosmology: {
            planes: [],
            deities: []
        },
        customRules: ''
    });

    const [errors, setErrors] = useState({});

    const steps = [
        { id: 1, name: 'Basic Info' },
        { id: 2, name: 'Regions' },
        { id: 3, name: 'Factions' },
        { id: 4, name: 'NPCs' },
        { id: 5, name: 'History & Lore' },
        { id: 6, name: 'Preview' }
    ];

    useEffect(() => {
        if (id) {
            const existingWorld = getWorldById(id);
            if (existingWorld) {
                setWorldData(existingWorld);
            }
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setWorldData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Region management
    const addRegion = () => {
        setWorldData(prev => ({
            ...prev,
            regions: [...prev.regions, { id: Date.now(), name: '', description: '', climate: '', population: '' }]
        }));
    };

    const updateRegion = (index, field, value) => {
        setWorldData(prev => {
            const regions = [...prev.regions];
            regions[index] = { ...regions[index], [field]: value };
            return { ...prev, regions };
        });
    };

    const removeRegion = (index) => {
        setWorldData(prev => ({
            ...prev,
            regions: prev.regions.filter((_, i) => i !== index)
        }));
    };

    // Faction management
    const addFaction = () => {
        setWorldData(prev => ({
            ...prev,
            factions: [...prev.factions, { id: Date.now(), name: '', description: '', alignment: 'Neutral', goals: '' }]
        }));
    };

    const updateFaction = (index, field, value) => {
        setWorldData(prev => {
            const factions = [...prev.factions];
            factions[index] = { ...factions[index], [field]: value };
            return { ...prev, factions };
        });
    };

    const removeFaction = (index) => {
        setWorldData(prev => ({
            ...prev,
            factions: prev.factions.filter((_, i) => i !== index)
        }));
    };

    // NPC management
    const addNPC = () => {
        setWorldData(prev => ({
            ...prev,
            npcs: [...prev.npcs, { id: Date.now(), name: '', title: '', description: '', location: '' }]
        }));
    };

    const updateNPC = (index, field, value) => {
        setWorldData(prev => {
            const npcs = [...prev.npcs];
            npcs[index] = { ...npcs[index], [field]: value };
            return { ...prev, npcs };
        });
    };

    const removeNPC = (index) => {
        setWorldData(prev => ({
            ...prev,
            npcs: prev.npcs.filter((_, i) => i !== index)
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (currentStep === 1) {
            if (!worldData.name.trim()) newErrors.name = 'World name is required';
            if (!worldData.description.trim()) newErrors.description = 'Description is required';
            else if (worldData.description.length < 20) newErrors.description = 'Description must be at least 20 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validate()) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setErrors({});
        }
    };

    const handleSave = () => {
        try {
            const savedId = saveWorld(worldData);
            if (onSave) {
                onSave(savedId);
            } else {
                navigate('/worlds');
            }
        } catch (error) {
            console.error('Error saving world:', error);
            alert('Error saving world. Please try again.');
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Basic Info
                return (
                    <div style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#111827' }}>
                            Basic Information
                        </h3>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
                                World Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={worldData.name}
                                onChange={handleInputChange}
                                placeholder="e.g., Aethoria, The Shattered Realms, New Terra"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: errors.name ? '2px solid #ef4444' : '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            />
                            {errors.name && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', color: '#ef4444', fontSize: '14px' }}>
                                    <AlertCircle size={14} />
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
                                World Description *
                            </label>
                            <textarea
                                name="description"
                                value={worldData.description}
                                onChange={handleInputChange}
                                placeholder="Describe your world's overall feel, major themes, and what makes it unique..."
                                rows={6}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: errors.description ? '2px solid #ef4444' : '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    resize: 'vertical'
                                }}
                            />
                            {errors.description && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', color: '#ef4444', fontSize: '14px' }}>
                                    <AlertCircle size={14} />
                                    {errors.description}
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
                                    Theme
                                </label>
                                <select
                                    name="theme"
                                    value={worldData.theme}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        background: 'white'
                                    }}
                                >
                                    {WORLD_THEMES.map(theme => (
                                        <option key={theme} value={theme}>{theme}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
                                    Technology Level
                                </label>
                                <select
                                    name="technologyLevel"
                                    value={worldData.technologyLevel}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        background: 'white'
                                    }}
                                >
                                    {TECH_LEVELS.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Regions
                return (
                    <div style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div>
                                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>
                                    Regions & Locations
                                </h3>
                                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                                    Define the major regions, cities, and landmarks in your world
                                </p>
                            </div>
                            <button
                                onClick={addRegion}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '10px 16px',
                                    background: '#16a34a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    fontSize: '14px'
                                }}
                            >
                                <Plus size={16} />
                                Add Region
                            </button>
                        </div>

                        {worldData.regions.length === 0 ? (
                            <div style={{
                                padding: '48px',
                                border: '2px dashed #d1d5db',
                                borderRadius: '12px',
                                textAlign: 'center'
                            }}>
                                <Map size={48} style={{ color: '#9ca3af', margin: '0 auto 16px' }} />
                                <p style={{ color: '#6b7280', marginBottom: '16px' }}>No regions added yet</p>
                                <button
                                    onClick={addRegion}
                                    style={{
                                        padding: '12px 24px',
                                        background: '#16a34a',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    + Add Your First Region
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {worldData.regions.map((region, index) => (
                                    <div key={region.id} style={{
                                        padding: '20px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        background: '#ffffff'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                                            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>
                                                Region {index + 1}
                                            </h4>
                                            <button
                                                onClick={() => removeRegion(index)}
                                                style={{
                                                    padding: '4px',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: '#ef4444'
                                                }}
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                            <input
                                                type="text"
                                                placeholder="Region Name"
                                                value={region.name}
                                                onChange={(e) => updateRegion(index, 'name', e.target.value)}
                                                style={{
                                                    padding: '10px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    background: 'white'
                                                }}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Climate"
                                                value={region.climate}
                                                onChange={(e) => updateRegion(index, 'climate', e.target.value)}
                                                style={{
                                                    padding: '10px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    background: 'white'
                                                }}
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Population (e.g., 50,000 inhabitants)"
                                            value={region.population}
                                            onChange={(e) => updateRegion(index, 'population', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                marginTop: '12px',
                                                background: 'white'
                                            }}
                                        />
                                        <textarea
                                            placeholder="Describe this region..."
                                            value={region.description}
                                            onChange={(e) => updateRegion(index, 'description', e.target.value)}
                                            rows={3}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                marginTop: '12px',
                                                fontFamily: 'inherit',
                                                resize: 'vertical',
                                                background: 'white'
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 3: // Factions
                return (
                    <div style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div>
                                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>
                                    Factions & Organizations
                                </h3>
                                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                                    Define the major powers, guilds, and organizations in your world
                                </p>
                            </div>
                            <button
                                onClick={addFaction}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '10px 16px',
                                    background: '#16a34a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    fontSize: '14px'
                                }}
                            >
                                <Plus size={16} />
                                Add Faction
                            </button>
                        </div>

                        {worldData.factions.length === 0 ? (
                            <div style={{
                                padding: '48px',
                                border: '2px dashed #d1d5db',
                                borderRadius: '12px',
                                textAlign: 'center'
                            }}>
                                <p style={{ color: '#6b7280', marginBottom: '16px' }}>No factions added yet</p>
                                <button
                                    onClick={addFaction}
                                    style={{
                                        padding: '12px 24px',
                                        background: '#16a34a',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    + Add Your First Faction
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
                                {worldData.factions.map((faction, index) => (
                                    <div key={faction.id} style={{
                                        padding: '20px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        background: '#f9fafb'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                                            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>
                                                Faction {index + 1}
                                            </h4>
                                            <button
                                                onClick={() => removeFaction(index)}
                                                style={{
                                                    padding: '4px',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: '#ef4444'
                                                }}
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Faction Name"
                                            value={faction.name}
                                            onChange={(e) => updateFaction(index, 'name', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                marginBottom: '12px',
                                                background: 'white'
                                            }}
                                        />
                                        <select
                                            value={faction.alignment}
                                            onChange={(e) => updateFaction(index, 'alignment', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                marginBottom: '12px',
                                                background: 'white'
                                            }}
                                        >
                                            {ALIGNMENTS.map(align => (
                                                <option key={align} value={align}>{align}</option>
                                            ))}
                                        </select>
                                        <textarea
                                            placeholder="Describe this faction..."
                                            value={faction.description}
                                            onChange={(e) => updateFaction(index, 'description', e.target.value)}
                                            rows={3}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                fontFamily: 'inherit',
                                                marginBottom: '12px',
                                                resize: 'vertical',
                                                background: 'white'
                                            }}
                                        />
                                        <textarea
                                            placeholder="Goals and motivations..."
                                            value={faction.goals}
                                            onChange={(e) => updateFaction(index, 'goals', e.target.value)}
                                            rows={2}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                fontFamily: 'inherit',
                                                resize: 'vertical',
                                                background: 'white'
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 4: // NPCs
                return (
                    <div style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div>
                                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>
                                    Notable NPCs
                                </h3>
                                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                                    Define important characters and personalities in your world
                                </p>
                            </div>
                            <button
                                onClick={addNPC}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '10px 16px',
                                    background: '#16a34a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    fontSize: '14px'
                                }}
                            >
                                <Plus size={16} />
                                Add NPC
                            </button>
                        </div>

                        {worldData.npcs.length === 0 ? (
                            <div style={{
                                padding: '48px',
                                border: '2px dashed #d1d5db',
                                borderRadius: '12px',
                                textAlign: 'center'
                            }}>
                                <p style={{ color: '#6b7280', marginBottom: '16px' }}>No NPCs added yet</p>
                                <button
                                    onClick={addNPC}
                                    style={{
                                        padding: '12px 24px',
                                        background: '#16a34a',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    + Add Your First NPC
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                                {worldData.npcs.map((npc, index) => (
                                    <div key={npc.id} style={{
                                        padding: '16px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        background: '#f9fafb'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                                            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>
                                                NPC {index + 1}
                                            </h4>
                                            <button
                                                onClick={() => removeNPC(index)}
                                                style={{
                                                    padding: '4px',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: '#ef4444'
                                                }}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="NPC Name"
                                            value={npc.name}
                                            onChange={(e) => updateNPC(index, 'name', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                marginBottom: '8px',
                                                background: 'white'
                                            }}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Title/Role"
                                            value={npc.title}
                                            onChange={(e) => updateNPC(index, 'title', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                marginBottom: '8px',
                                                background: 'white'
                                            }}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Location"
                                            value={npc.location}
                                            onChange={(e) => updateNPC(index, 'location', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                marginBottom: '8px',
                                                background: 'white'
                                            }}
                                        />
                                        <textarea
                                            placeholder="Description..."
                                            value={npc.description}
                                            onChange={(e) => updateNPC(index, 'description', e.target.value)}
                                            rows={3}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                fontFamily: 'inherit',
                                                background: 'white',
                                                resize: 'vertical'
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 5: // History & Lore
                return (
                    <div style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#111827' }}>
                            History & Lore
                        </h3>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
                                World History
                            </label>
                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                                Describe major historical events, ages, and how your world came to be
                            </p>
                            <textarea
                                name="history"
                                value={worldData.history}
                                onChange={handleInputChange}
                                placeholder="Describe the major events, ages, and evolution of your world..."
                                rows={8}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
                                Custom Rules & Modifications
                            </label>
                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                                Any house rules, banned content, or special modifications for this world
                            </p>
                            <textarea
                                name="customRules"
                                value={worldData.customRules}
                                onChange={handleInputChange}
                                placeholder="e.g., No flying races before level 5, critical hits deal max damage + roll, resurrection requires special quest..."
                                rows={6}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    resize: 'vertical'
                                }}
                            />
                        </div>
                    </div>
                );

            case 6: // Preview
                return (
                    <div style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#111827' }}>
                            Preview Your World
                        </h3>

                        {/* World Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
                            padding: '32px',
                            borderRadius: '12px',
                            marginBottom: '24px',
                            color: 'white'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                                <div>
                                    <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                                        {worldData.name || 'Unnamed World'}
                                    </h2>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                        <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.2)', borderRadius: '9999px', fontSize: '12px' }}>
                                            {worldData.theme}
                                        </span>
                                        <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.2)', borderRadius: '9999px', fontSize: '12px' }}>
                                            {worldData.technologyLevel}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p style={{ fontSize: '16px', lineHeight: '1.6', opacity: 0.9 }}>
                                {worldData.description || 'No description provided'}
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>
                                    {worldData.regions?.length || 0}
                                </div>
                                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Regions</div>
                            </div>
                            <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}>
                                    {worldData.factions?.length || 0}
                                </div>
                                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Factions</div>
                            </div>
                            <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>
                                    {worldData.npcs?.length || 0}
                                </div>
                                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>NPCs</div>
                            </div>
                        </div>

                        {/* Content Sections */}
                        {worldData.regions.length > 0 && (
                            <div style={{ marginBottom: '24px' }}>
                                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>Regions</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {worldData.regions.map((region, i) => (
                                        <div key={i} style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                                            <div style={{ fontWeight: '600', color: '#111827' }}>{region.name}</div>
                                            {region.description && (
                                                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                                                    {region.description}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {worldData.factions.length > 0 && (
                            <div style={{ marginBottom: '24px' }}>
                                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>Factions</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {worldData.factions.map((faction, i) => (
                                        <div key={i} style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                                            <div style={{ fontWeight: '600', color: '#111827' }}>{faction.name}</div>
                                            <div style={{ fontSize: '12px', color: '#8b5cf6', marginTop: '2px' }}>{faction.alignment}</div>
                                            {faction.description && (
                                                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                                                    {faction.description}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {worldData.npcs.length > 0 && (
                            <div style={{ marginBottom: '24px' }}>
                                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>Notable NPCs</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {worldData.npcs.map((npc, i) => (
                                        <div key={i} style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                                            <div style={{ fontWeight: '600', color: '#111827' }}>{npc.name}</div>
                                            {npc.title && (
                                                <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '2px' }}>{npc.title}</div>
                                            )}
                                            {npc.description && (
                                                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                                                    {npc.description}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {worldData.history && (
                            <div style={{ background: '#fef3c7', padding: '24px', borderRadius: '12px', border: '2px solid #fbbf24', marginBottom: '24px' }}>
                                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#92400e' }}>
                                    Historical Overview
                                </h4>
                                <p style={{ fontSize: '14px', color: '#78350f', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                    {worldData.history}
                                </p>
                            </div>
                        )}

                        {worldData.customRules && (
                            <div style={{ background: '#fef2f2', padding: '24px', borderRadius: '12px', border: '2px solid #fca5a5' }}>
                                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#991b1b' }}>
                                    Custom Rules
                                </h4>
                                <p style={{ fontSize: '14px', color: '#7f1d1d', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                    {worldData.customRules}
                                </p>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                    {id ? 'Edit World' : 'Create World'}
                </h1>
                <p style={{ color: '#6b7280', fontSize: '16px' }}>
                    Build an immersive campaign setting with regions, factions, and lore
                </p>
            </div>

            {/* Step Navigation */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '32px',
                padding: '24px',
                background: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                overflowX: 'auto'
            }}>
                {steps.map((step, index) => (
                    <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: '600',
                                background: currentStep === step.id ? '#16a34a' : currentStep > step.id ? '#10b981' : '#e5e7eb',
                                color: currentStep >= step.id ? 'white' : '#6b7280',
                                border: currentStep === step.id ? '3px solid #86efac' : 'none'
                            }}>
                                {currentStep > step.id ? '✓' : step.id}
                            </div>
                            <span style={{
                                fontSize: '14px',
                                fontWeight: currentStep === step.id ? '600' : '400',
                                color: currentStep === step.id ? '#14532d' : '#6b7280',
                                whiteSpace: 'nowrap'
                            }}>
                                {step.name}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div style={{
                                flex: 1,
                                height: '2px',
                                background: currentStep > step.id ? '#10b981' : '#e5e7eb',
                                margin: '0 16px',
                                minWidth: '20px'
                            }} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                marginBottom: '24px',
                minHeight: '400px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        background: currentStep === 1 ? '#f3f4f6' : '#6b7280',
                        color: currentStep === 1 ? '#9ca3af' : 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '500',
                        fontSize: '16px',
                        cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                        opacity: currentStep === 1 ? 0.5 : 1
                    }}
                >
                    <ChevronLeft size={20} />
                    Previous
                </button>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={onCancel || (() => navigate('/worlds'))}
                        style={{
                            padding: '12px 24px',
                            border: '2px solid #d1d5db',
                            background: 'white',
                            color: '#374151',
                            borderRadius: '8px',
                            fontWeight: '500',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>

                    {currentStep < steps.length ? (
                        <button
                            onClick={nextStep}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 24px',
                                background: '#16a34a',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '500',
                                fontSize: '16px',
                                cursor: 'pointer'
                            }}
                        >
                            Next
                            <ChevronRight size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 24px',
                                background: '#16a34a',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '500',
                                fontSize: '16px',
                                cursor: 'pointer'
                            }}
                        >
                            <Check size={20} />
                            Save World
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default WorldCreator;