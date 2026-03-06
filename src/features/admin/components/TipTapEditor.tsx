import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import './editorStyles.css';

interface TipTapEditorProps {
    value: string;
    onChange: (html: string) => void;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({ value, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'tiptap',
            },
        },
    });

    // Sync external value changes (e.g. loading existing post)
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value, { emitUpdate: false });
        }
    }, [value, editor]);

    if (!editor) return null;

    return (
        <div>
            {/* ── Toolbar ── */}
            <div className="editor-toolbar">
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`editor-toolbar-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
                    title="Bold"
                >
                    B
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                    }}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`editor-toolbar-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
                    title="Italic"
                    style={{ fontStyle: 'italic' }}
                >
                    I
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                    }}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`editor-toolbar-btn ${editor.isActive('strike') ? 'is-active' : ''}`}
                    title="Strikethrough"
                    style={{ textDecoration: 'line-through' }}
                >
                    S
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                    }}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={`editor-toolbar-btn ${editor.isActive('code') ? 'is-active' : ''}`}
                    title="Inline Code"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}
                >
                    {'</>'}
                </button>

                <div className="editor-toolbar-divider" />

                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`editor-toolbar-btn ${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`}
                    title="Heading 1"
                >
                    H1
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                    }}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`editor-toolbar-btn ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
                    title="Heading 2"
                >
                    H2
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                    }}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`editor-toolbar-btn ${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`}
                    title="Heading 3"
                >
                    H3
                </button>

                <div className="editor-toolbar-divider" />

                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                    }}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`editor-toolbar-btn ${editor.isActive('bulletList') ? 'is-active' : ''}`}
                    title="Bullet List"
                >
                    •
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                    }}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`editor-toolbar-btn ${editor.isActive('orderedList') ? 'is-active' : ''}`}
                    title="Ordered List"
                >
                    1.
                </button>

                <div className="editor-toolbar-divider" />

                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                    }}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`editor-toolbar-btn ${editor.isActive('blockquote') ? 'is-active' : ''}`}
                    title="Blockquote"
                    style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
                >
                    "
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`editor-toolbar-btn ${editor.isActive('codeBlock') ? 'is-active' : ''}`}
                    title="Code Block"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}
                >
                    {'{ }'}
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                    }}
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    className="editor-toolbar-btn"
                    title="Horizontal Rule"
                >
                    ―
                </button>

                <div className="editor-toolbar-divider" />

                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                    }}
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="editor-toolbar-btn"
                    title="Undo"
                    style={{ opacity: editor.can().undo() ? 1 : 0.3 }}
                >
                    ↶
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                    }}
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="editor-toolbar-btn"
                    title="Redo"
                    style={{ opacity: editor.can().redo() ? 1 : 0.3 }}
                >
                    ↷
                </button>
            </div>

            {/* ── Bubble Menu ── */}
            <BubbleMenu editor={editor} {...({ tippyOptions: { duration: 150 } } as any)}>
                <div className="editor-bubble">
                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                        }}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`editor-bubble-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
                    >
                        B
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                        }}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`editor-bubble-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
                        style={{ fontStyle: 'italic' }}
                    >
                        I
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                        }}
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`editor-bubble-btn ${editor.isActive('strike') ? 'is-active' : ''}`}
                        style={{ textDecoration: 'line-through' }}
                    >
                        S
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                        }}
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        className={`editor-bubble-btn ${editor.isActive('code') ? 'is-active' : ''}`}
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}
                    >
                        {'</>'}
                    </button>
                </div>
            </BubbleMenu>

            {/* ── Editor content ── */}
            <EditorContent editor={editor} />
        </div>
    );
};

export default TipTapEditor;
