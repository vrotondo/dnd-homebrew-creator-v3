// src/components/creators/character/steps/PreviewStep.jsx
import React from 'react';
import { Card, CardHeader, CardContent, Badge, Button } from '../../../ui';
import { Download, Share, Eye, CheckCircle, AlertTriangle } from 'lucide-react';
import { dndUtils } from '../../../../utils/dndConstants';

export default function PreviewStep({ classData, errors }) {
    const hasErrors = Object.keys(errors).length > 0;
    const isComplete = classData.name && classData.description && classData.hitDie &&
        classData.primaryAbility?.length > 0 && classData.savingThrows?.length === 2;

    const exportToPDF = () => {
        // TODO: Implement PDF export
        console.log('Export to PDF:', classData);
    };

    const shareClass = () => {
        // TODO: Implement sharing functionality
        console.log('Share class:', classData);
    };

    const getFeatureCount = () => {
        if (!classData.features) return 0;
        return Object.values(classData.features).reduce((total, features) => total + features.length, 0);
    };

    const renderEquipmentList = () => {
        if (!classData.startingEquipment) return 'No equipment defined';

        const equipment = classData.startingEquipment;
        const parts = [];

        if (equipment.standard?.length > 0) {
            parts.push(equipment.standard.join(', '));
        }

        if (equipment.options?.length > 0) {
            equipment.options.forEach((option, index) => {
                parts.push(`Choose: ${option.optionA} OR ${option.optionB}`);
            });
        }

        if (equipment.startingGold) {
            parts.push(`Starting Gold: ${equipment.startingGold} gp`);
        }

        return parts.length > 0 ? parts : ['No equipment defined'];
    };

    const renderSpellcasting = () => {
        if (!classData.spellcasting?.enabled) {
            return <span className="text-gray-600 italic">No spellcasting</span>;
        }

        const sc = classData.spellcasting;
        return (
            <div className="spellcasting-summary">
                <div className="spellcasting-basics">
                    <span><strong>Ability:</strong> {sc.ability}</span>
                    <span><strong>Type:</strong> {sc.type} caster</span>
                    <span><strong>Starts:</strong> Level {sc.startLevel}</span>
                </div>
                {sc.focusType && (
                    <div className="text-sm text-gray-600 mt-1">
                        Focus: {sc.focusType}
                    </div>
                )}
                {sc.ritualCasting && (
                    <Badge variant="success" size="sm" className="mt-1">
                        Ritual Casting
                    </Badge>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Status Header */}
            <div className="preview-status">
                <div className="status-card">
                    {isComplete ? (
                        <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-semibold">Class is ready to save!</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-amber-700">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="font-semibold">Class needs more information</span>
                        </div>
                    )}

                    {hasErrors && (
                        <div className="text-red-600 text-sm mt-1">
                            {Object.keys(errors).length} error(s) to fix
                        </div>
                    )}
                </div>

                <div className="action-buttons">
                    <Button variant="outline" onClick={exportToPDF}>
                        <Download className="w-4 h-4 mr-2" />
                        Export PDF
                    </Button>
                    <Button variant="outline" onClick={shareClass}>
                        <Share className="w-4 h-4 mr-2" />
                        Share
                    </Button>
                </div>
            </div>

            {/* Class Header */}
            <Card className="class-preview-header">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {classData.name || 'Unnamed Class'}
                            </h2>
                            <div className="flex items-center gap-2 mb-3">
                                <Badge variant="primary">
                                    Hit Die: d{classData.hitDie || '?'}
                                </Badge>
                                <Badge variant="outline">
                                    {getFeatureCount()} Features
                                </Badge>
                                {classData.spellcasting?.enabled && (
                                    <Badge variant="success">Spellcaster</Badge>
                                )}
                                <Badge variant={classData.srdCompliant ? 'success' : 'warning'}>
                                    {classData.srdCompliant ? 'SRD' : 'Non-SRD'}
                                </Badge>
                            </div>
                        </div>
                        <div className="class-icon">
                            ⚔️
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                        {classData.description || 'No description provided.'}
                    </p>
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="stat-card">
                    <CardContent className="p-4 text-center">
                        <div className="stat-label">Hit Die</div>
                        <div className="stat-value">d{classData.hitDie || '?'}</div>
                    </CardContent>
                </Card>

                <Card className="stat-card">
                    <CardContent className="p-4 text-center">
                        <div className="stat-label">Primary Abilities</div>
                        <div className="stat-value text-sm">
                            {classData.primaryAbility?.join(', ') || 'None'}
                        </div>
                    </CardContent>
                </Card>

                <Card className="stat-card">
                    <CardContent className="p-4 text-center">
                        <div className="stat-label">Saving Throws</div>
                        <div className="stat-value text-sm">
                            {classData.savingThrows?.join(', ') || 'None'}
                        </div>
                    </CardContent>
                </Card>

                <Card className="stat-card">
                    <CardContent className="p-4 text-center">
                        <div className="stat-label">Skills Available</div>
                        <div className="stat-value">
                            {classData.skillChoices?.choose || 0} of {classData.skillChoices?.from?.length || 0}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Proficiencies */}
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold">Proficiencies</h3>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <strong>Armor:</strong> {classData.armorProficiencies?.join(', ') || 'None'}
                        </div>
                        <div>
                            <strong>Weapons:</strong> {classData.weaponProficiencies?.join(', ') || 'None'}
                        </div>
                        <div>
                            <strong>Tools:</strong> {classData.toolProficiencies?.join(', ') || 'None'}
                        </div>
                        <div>
                            <strong>Saving Throws:</strong> {classData.savingThrows?.join(', ') || 'None'}
                        </div>
                        <div>
                            <strong>Skills:</strong> Choose {classData.skillChoices?.choose || 0} from {classData.skillChoices?.from?.join(', ') || 'none'}
                        </div>
                    </CardContent>
                </Card>

                {/* Starting Equipment */}
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold">Starting Equipment</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {renderEquipmentList().map((item, index) => (
                                <div key={index} className="text-sm">
                                    • {item}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Spellcasting */}
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold">Spellcasting</h3>
                    </CardHeader>
                    <CardContent>
                        {renderSpellcasting()}
                    </CardContent>
                </Card>

                {/* Subclass */}
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold">Subclass</h3>
                    </CardHeader>
                    <CardContent>
                        <div><strong>Level:</strong> {classData.subclassFeature?.level || 1}</div>
                        <div><strong>Name:</strong> {classData.subclassFeature?.name || 'Not specified'}</div>
                        {classData.subclassFeature?.description && (
                            <div className="mt-2 text-sm text-gray-600">
                                {classData.subclassFeature.description}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Features by Level */}
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold">Class Features</h3>
                </CardHeader>
                <CardContent>
                    {classData.features ? (
                        <div className="features-preview">
                            {Object.entries(classData.features)
                                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                                .map(([level, features]) => (
                                    <div key={level} className="feature-level-preview">
                                        <div className="feature-level-header">
                                            <h4 className="font-semibold">Level {level}</h4>
                                            <Badge variant="outline" size="sm">
                                                {features.length} Feature{features.length !== 1 ? 's' : ''}
                                            </Badge>
                                        </div>
                                        <div className="feature-level-content">
                                            {features.map((feature, index) => (
                                                <div key={index} className="feature-preview">
                                                    <div className="feature-name">{feature.name}</div>
                                                    <div className="feature-description">
                                                        {feature.description.length > 150
                                                            ? `${feature.description.substring(0, 150)}...`
                                                            : feature.description
                                                        }
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <div className="text-gray-600 italic text-center py-4">
                            No features defined yet. Add features in the Features step.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Validation Summary */}
            {hasErrors && (
                <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                        <h3 className="text-lg font-semibold text-red-800">Validation Errors</h3>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-1 text-red-700">
                            {Object.entries(errors).map(([field, error]) => (
                                <li key={field}>• <strong>{field}:</strong> {error}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Creation Notes */}
            {classData.authorNotes && (
                <Card className="border-gray-200 bg-gray-50">
                    <CardHeader>
                        <h3 className="text-lg font-semibold">Author Notes</h3>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700">{classData.authorNotes}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}