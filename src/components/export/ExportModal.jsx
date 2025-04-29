// src/components/export/ExportModal.jsx
import { useState } from 'react';
import { exportToJson, exportToMarkdown, exportToHtml, generateFilename } from '../../utils/exportService';

function ExportModal({ classData, onClose }) {
    const [selectedFormat, setSelectedFormat] = useState('json');
    const [customFilename, setCustomFilename] = useState(generateFilename(classData));
    const [isExporting, setIsExporting] = useState(false);
    const [exportResult, setExportResult] = useState(null);

    const exportFormats = [
        { id: 'json', name: 'JSON', description: 'For backup and sharing with other users' },
        { id: 'markdown', name: 'Markdown', description: 'Simple text format for documentation' },
        { id: 'html', name: 'HTML', description: 'Web page for viewing in browsers' }
    ];

    const handleExport = () => {
        if (!classData) {
            setExportResult({ success: false, message: 'No class data to export' });
            return;
        }

        setIsExporting(true);
        let result = false;

        try {
            switch (selectedFormat) {
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
                    ? `Successfully exported class as ${selectedFormat.toUpperCase()}`
                    : `Failed to export class as ${selectedFormat.toUpperCase()}`
            });
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

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Export {classData?.name || 'Class'}</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="form-field">
                        <label htmlFor="export-filename">Filename</label>
                        <input
                            type="text"
                            id="export-filename"
                            value={customFilename}
                            onChange={e => setCustomFilename(e.target.value)}
                            className="form-control"
                            placeholder="Enter filename without extension"
                        />
                    </div>

                    <div className="form-field">
                        <label>Export Format</label>
                        <div className="format-options">
                            {exportFormats.map(format => (
                                <div
                                    key={format.id}
                                    className={`format-option ${selectedFormat === format.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedFormat(format.id)}
                                >
                                    <div className="format-option-header">
                                        <input
                                            type="radio"
                                            id={`format-${format.id}`}
                                            name="export-format"
                                            value={format.id}
                                            checked={selectedFormat === format.id}
                                            onChange={() => setSelectedFormat(format.id)}
                                        />
                                        <label htmlFor={`format-${format.id}`}>{format.name}</label>
                                    </div>
                                    <p className="format-description">{format.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {exportResult && (
                        <div className={`export-result ${exportResult.success ? 'success' : 'error'}`}>
                            {exportResult.message}
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="button button-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="button"
                        onClick={handleExport}
                        disabled={isExporting}
                    >
                        {isExporting ? 'Exporting...' : 'Export'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ExportModal;