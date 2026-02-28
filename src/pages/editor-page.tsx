import { useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    FileDown,
    ArrowLeft,
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Undo,
    Redo,
    CheckCircle,
    FileText,
} from 'lucide-react';
import { useCrmStore } from '../store/use-crm-store';

export default function EditorPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getLeadById, moveLead, updateLeadReport } = useCrmStore();

    const lead = useMemo(() => id ? getLeadById(id) : undefined, [id, getLeadById]);

    // Markdown-ähnlichen Text in HTML konvertieren
    const initialContent = useMemo(() => {
        if (!lead?.finalReport) return '<p>Kein Bericht verfügbar.</p>';
        return lead.finalReport
            .split('\n')
            .map(line => {
                if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`;
                if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`;
                if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`;
                if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`;
                if (line.startsWith('**') && line.endsWith('**')) return `<p><strong>${line.slice(2, -2)}</strong></p>`;
                if (line.trim() === '') return '<br>';
                return `<p>${line}</p>`;
            })
            .join('');
    }, [lead]);

    const editor = useEditor({
        extensions: [StarterKit],
        content: initialContent,
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-sm max-w-none focus:outline-none min-h-[400px] px-6 py-4',
            },
        },
    });

    const handleExportPdf = useCallback(async () => {
        if (!editor) return;
        const html = editor.getHTML();

        const container = document.createElement('div');
        container.innerHTML = html;
        container.style.cssText = `
      font-family: 'Inter', Arial, sans-serif;
      color: #1a1a2e;
      padding: 40px;
      max-width: 800px;
      line-height: 1.6;
    `;

        // html2pdf importieren
        const html2pdfModule = await import('html2pdf.js');
        const html2pdf = html2pdfModule.default;

        html2pdf()
            .set({
                margin: 15,
                filename: `Bericht_${lead?.id || 'export'}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            })
            .from(container)
            .save();
    }, [editor, lead]);

    const handleApprove = useCallback(() => {
        if (!id || !editor) return;
        // Aktuellen Editor-Inhalt speichern
        const currentHtml = editor.getHTML();
        updateLeadReport(id, currentHtml);
        // Lead in "Genehmigt"-Spalte verschieben
        moveLead(id, 'approved');
        navigate('/crm');
    }, [id, editor, updateLeadReport, moveLead, navigate]);

    if (!lead) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <FileText className="w-12 h-12 text-gray-600" />
                <p className="text-gray-500">Lead nicht gefunden.</p>
                <button
                    onClick={() => navigate('/crm')}
                    className="btn-cyber btn-cyber-primary text-xs py-2 px-4"
                >
                    Zurück zum CRM
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/crm')}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                        aria-label="Zurück"
                    >
                        <ArrowLeft className="w-4 h-4 text-gray-400" />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold text-white">Magic Editor</h2>
                        <p className="text-xs text-gray-500">Human-in-the-Loop Berichtbearbeitung</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExportPdf}
                        className="btn-cyber btn-cyber-primary flex items-center gap-2 text-xs py-2 px-4"
                    >
                        <FileDown className="w-4 h-4" />
                        PDF Export
                    </button>
                    <button
                        onClick={handleApprove}
                        className="btn-cyber btn-cyber-secondary flex items-center gap-2 text-xs py-2 px-4 bg-success/10 border-success/50 text-success hover:bg-success/20"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Genehmigen & Senden
                    </button>
                </div>
            </motion.div>

            {/* Lead Info Bar */}
            <div className="glass-panel p-4 flex items-center gap-4 text-xs">
                <span className="text-gray-500">Kategorie:</span>
                <span className="text-success font-bold">{lead.category}</span>
                <span className="text-gray-700">|</span>
                <span className="text-gray-500">Generierte Aufgabe:</span>
                <span className="text-gray-300 flex-1 truncate">{lead.generatedTask || '–'}</span>
            </div>

            {/* Toolbar */}
            {editor && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-panel p-2 flex items-center gap-1 flex-wrap"
                >
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        icon={<Bold className="w-4 h-4" />}
                        label="Fett"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        icon={<Italic className="w-4 h-4" />}
                        label="Kursiv"
                    />
                    <div className="w-px h-6 bg-white/10 mx-1" />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        icon={<Heading1 className="w-4 h-4" />}
                        label="Überschrift 1"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        icon={<Heading2 className="w-4 h-4" />}
                        label="Überschrift 2"
                    />
                    <div className="w-px h-6 bg-white/10 mx-1" />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        icon={<List className="w-4 h-4" />}
                        label="Aufzählung"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        icon={<ListOrdered className="w-4 h-4" />}
                        label="Nummerierte Liste"
                    />
                    <div className="w-px h-6 bg-white/10 mx-1" />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        isActive={false}
                        icon={<Undo className="w-4 h-4" />}
                        label="Rückgängig"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        isActive={false}
                        icon={<Redo className="w-4 h-4" />}
                        label="Wiederholen"
                    />
                </motion.div>
            )}

            {/* Editor */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel overflow-hidden"
            >
                <EditorContent editor={editor} />
            </motion.div>
        </div>
    );
}

// --- Toolbar Button ---
function ToolbarButton({
    onClick,
    isActive,
    icon,
    label,
}: {
    onClick: () => void;
    isActive: boolean;
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`p-2 rounded-lg transition-all duration-150
        ${isActive
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
            aria-label={label}
            title={label}
        >
            {icon}
        </button>
    );
}
