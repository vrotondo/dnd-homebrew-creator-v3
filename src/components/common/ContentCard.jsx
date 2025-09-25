// ============================================================================
// src/components/common/ContentCard.jsx - Reusable content card
// ============================================================================

import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, Button, Badge } from '../ui';
import { Eye, Edit, Copy, Trash2, Calendar } from 'lucide-react';

export const ContentCard = ({
    item,
    onView,
    onEdit,
    onDuplicate,
    onDelete,
    showActions = true,
    customActions = [],
    variant = 'default',
    className = ''
}) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        return new Date(dateString).toLocaleDateString();
    };

    const getItemIcon = (item) => {
        // You can customize this based on item type
        if (item.type === 'class') return '⚔️';
        if (item.type === 'race') return '👤';
        if (item.type === 'background') return '📜';
        if (item.type === 'spell') return '✨';
        if (item.type === 'item') return '💎';
        return '📄';
    };

    return (
        <Card className={`content-card ${className}`} hover>
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="content-icon">{getItemIcon(item)}</span>
                        <div>
                            <h3 className="content-title">{item.name}</h3>
                            {item.version && (
                                <Badge variant="outline" size="sm">
                                    v{item.version}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {item.srdCompliant !== undefined && (
                        <Badge
                            variant={item.srdCompliant ? 'success' : 'warning'}
                            size="sm"
                        >
                            {item.srdCompliant ? 'SRD' : 'Non-SRD'}
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="py-2">
                <p className="content-description">
                    {item.description?.length > 120
                        ? `${item.description.substring(0, 120)}...`
                        : item.description || 'No description provided'
                    }
                </p>

                {item.tags && item.tags.length > 0 && (
                    <div className="content-tags">
                        {item.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" size="sm">
                                {tag}
                            </Badge>
                        ))}
                        {item.tags.length > 3 && (
                            <Badge variant="outline" size="sm">
                                +{item.tags.length - 3}
                            </Badge>
                        )}
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-2">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>
                            {item.updatedAt
                                ? `Updated ${formatDate(item.updatedAt)}`
                                : `Created ${formatDate(item.createdAt)}`
                            }
                        </span>
                    </div>

                    {showActions && (
                        <div className="flex items-center space-x-1">
                            {onView && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onView(item)}
                                    title="View"
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                            )}

                            {onEdit && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(item)}
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                            )}

                            {onDuplicate && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDuplicate(item)}
                                    title="Duplicate"
                                >
                                    <Copy className="w-4 h-4" />
                                </Button>
                            )}

                            {customActions.map((action, index) => (
                                <Button
                                    key={index}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => action.onClick(item)}
                                    title={action.title}
                                >
                                    <action.icon className="w-4 h-4" />
                                </Button>
                            ))}

                            {onDelete && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDelete(item)}
                                    title="Delete"
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
};