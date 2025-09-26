// src/components/export/ExportModal.jsx - Enhanced with PDF export
import { useState } from 'react';
import {
    exportToJson,
    exportToMarkdown,
    exportToHtml,
    exportToPdf,
    generateFilename
} from '../../utils/exportService';
import { Card, CardContent, Button, Input } from '../ui';
import { Download, FileText, Code, Globe, X, AlertCircle, CheckCircle } from 'lucide-react';

function ExportModal({ classData, onClose }) {
    const [selectedFormat, setSelectedFormat] = useState('pdf');
    const [customFilename, setCustomFilename] = useState(generateFilename(classData));
    const [isExporting, setIsExporting] = useState(false);
    const [exportResult, setExportResult] = useState(null);

    const exportFormats = [
        {
            id: 'pdf',
            name: 'PDF',
            description: 'Professional document perfect for printing and sharing',
            icon: FileText,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            recommended: true
        },
        {
            id: 'json',
            name: 'JSON',
            description: 'Data format for backup and importing into other tools',
            icon: Code,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            id: 'markdown',
            name: 'Markdown',
            description: 'Simple text format for documentation and wikis',
            icon: FileText,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            id: 'html',
            name: 'HTML',
            description: 'Web page format for viewing in browsers',
            icon: Globe,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        }
    ];

    const handleExport = async () => {
        if (!classData) {
            setExportResult({ success: false, message: 'No class data to export' });
            return;
        }

        setIsExporting(true);
        setExportResult(null);

        try {
            let result = false;

            switch (selectedFormat) {
                case 'pdf':
                    result = await exportToPdf(classData, customFilename);
                    break;
                case 'json':
                    result = exportToJson(classData, customFilename);
                    break;
                case 'markdown':
                    result = exportToMarkdown(classData, customFilename);
                    break;
                case 'html':
                    result = exportToHtml(classData, customFilename);
                    break;
                default:
                    throw new Error(`Unsupported format: ${selectedFormat}`);
            }

            setExportResult({
                success: result,
                message: result
                    ? `Successfully exported ${classData.name} as ${selectedFormat.toUpperCase()}`
                    : `Failed to export ${classData.name} as ${selectedFormat.toUpperCase()}`
            });

            // Auto-close modal after successful export
            if (result) {
                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        } catch (error) {
            console.error('Export error:', error);
            setExportResult({
                success: false,
                message: `Error during export: ${error.message}`
            });
        } finally {
            setIsExporting(false);
        }
    };

    const selectedFormatData = exportFormats.find(f => f.id === selectedFormat);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Export {classData?.name || 'Class'}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Choose a format to download your homebrew class
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <CardContent className="p-6 space-y-6">
                    {/* Filename Input */}
                    <div>
                        <label htmlFor="export-filename" className="block text-sm font-medium text-gray-700 mb-2">
                            Filename
                        </label>
                        <Input
                            id="export-filename"
                            value={customFilename}
                            onChange={(e) => setCustomFilename(e.target.value)}
                            placeholder="Enter filename without extension"
                            className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Extension will be added automatically (.{selectedFormat})
                        </p>
                    </div>

                    {/* Format Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Export Format
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {exportFormats.map(format => {
                                const Icon = format.icon;
                                const isSelected = selectedFormat === format.id;

                                return (
                                    <button
                                        key={format.id}
                                        onClick={() => setSelectedFormat(format.id)}
                                        className={`relative p-4 border-2 rounded-lg text-left transition-all ${isSelected
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {format.recommended && (
                                            <div className="absolute -top-2 -right-2">
                                                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                                    Recommended
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg ${format.bgColor}`}>
                                                <Icon className={`w-5 h-5 ${format.color}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium text-gray-900">
                                                        {format.name}
                                                    </h4>
                                                    {isSelected && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {format.description}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Format-specific info */}
                    {selectedFormatData && (
                        <div className={`p-4 rounded-lg ${selectedFormatData.bgColor} border border-gray-200`}>
                            <div className="flex items-start gap-3">
                                <selectedFormatData.icon className={`w-5 h-5 ${selectedFormatData.color} mt-0.5 flex-shrink-0`} />
                                <div>
                                    <h5 className="font-medium text-gray-900 mb-1">
                                        {selectedFormatData.name} Export
                                    </h5>
                                    <p className="text-sm text-gray-700">
                                        {selectedFormatData.description}
                                    </p>
                                    {selectedFormat === 'pdf' && (
                                        <p className="text-sm text-gray-600 mt-2">
                                            📄 Creates a professional D&D-style document with proper formatting, sections, and layout.
                                        </p>
                                    )}
                                    {selectedFormat === 'json' && (
                                        <p className="text-sm text-gray-600 mt-2">
                                            💾 Perfect for backup or importing into other D&D tools and homebrew creators.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Export Result */}
                    {exportResult && (
                        <div className={`p-4 rounded-lg border ${exportResult.success
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : 'bg-red-50 border-red-200 text-red-800'
                            }`}>
                            <div className="flex items-center gap-2">
                                {exportResult.success ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                )}
                                <span className="font-medium">
                                    {exportResult.message}
                                </span>
                            </div>
                            {exportResult.success && (
                                <p className="text-sm mt-2 text-green-700">
                                    Check your downloads folder for the exported file.
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isExporting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleExport}
                        disabled={isExporting || !customFilename.trim()}
                        className="gap-2"
                    >
                        {isExporting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Exporting...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                Export {selectedFormatData?.name}
                            </>
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export default ExportModal;