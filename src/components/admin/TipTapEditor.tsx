'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import ImageExtension from '@tiptap/extension-image';
import { uploadMedia } from '@/lib/clientUpload';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link2,
  Unlink,
  Undo,
  Redo,
  Minus,
  Table as TableIcon,
  Palette,
  Eraser,
  Highlighter,
  MoveVertical,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Image as ImageIcon,
  FileCode,
  Pilcrow,
  Code2,
  ChevronDown,
  Plus,
  Trash2,
  Upload,
  Loader2,
} from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  isDark?: boolean;
}

const COLOR_PRESETS = [
  { label: 'Default Light', color: '#F8FAFC' },
  { label: 'Muted Slate', color: '#94A3B8' },
  { label: 'Sky Blue', color: '#38BDF8' },
  { label: 'Growth Coral', color: '#FF5E3A' },
  { label: 'Tech Indigo', color: '#6366F1' },
  { label: 'Talent Emerald', color: '#10B981' },
  { label: 'Amber Gold', color: '#F59E0B' },
  { label: 'Pure White', color: '#FFFFFF' },
];

export function TipTapEditor({ content, onChange, isDark = true }: TipTapEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [rawHtml, setRawHtml] = useState(content || '');
  const [isScrollbox, setIsScrollbox] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      Subscript,
      Superscript,
      ImageExtension.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto my-4 border border-white/10 shadow-lg',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-sky-400 underline underline-offset-4 hover:text-sky-300 transition-colors',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content || '<p></p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setRawHtml(html);
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: `prose prose-slate dark:prose-invert prose-headings:text-slate-900 dark:prose-headings:text-white max-w-none focus:outline-none min-h-[380px] p-5 text-sm sm:text-base leading-relaxed ${
          isDark ? 'text-slate-100' : 'text-slate-800'
        }`,
      },
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync external content changes if editor content is substantially different
  useEffect(() => {
    if (editor && content !== undefined && editor.getHTML() !== content) {
      editor.commands.setContent(content, { emitUpdate: false });
      setRawHtml(content);
    }
  }, [content, editor]);

  // Synchronize editor typography classes whenever isDark theme changes
  useEffect(() => {
    if (editor) {
      editor.setOptions({
        editorProps: {
          attributes: {
            class: `prose prose-slate dark:prose-invert prose-headings:text-slate-900 dark:prose-headings:text-white max-w-none focus:outline-none min-h-[380px] p-5 text-sm sm:text-base leading-relaxed ${
              isDark ? 'text-slate-100' : 'text-slate-800'
            }`,
          },
        },
      });
    }
  }, [editor, isDark]);


  if (!isMounted || !editor) {
    return (
      <div
        className={`border rounded-xl p-8 min-h-[400px] flex items-center justify-center text-sm ${
          isDark
            ? 'bg-slate-900/60 border-slate-800 text-slate-500'
            : 'bg-white border-slate-200 text-slate-400'
        }`}
      >
        Loading rich text editor...
      </div>
    );
  }

  // Link Dialog Action
  const setLink = () => {
    if (!linkUrl) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      setLinkModalOpen(false);
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: linkUrl.startsWith('http') || linkUrl.startsWith('/') ? linkUrl : `https://${linkUrl}` })
      .run();
    setLinkModalOpen(false);
    setLinkUrl('');
  };

  const openLinkModal = () => {
    const previousUrl = editor.getAttributes('link').href || '';
    setLinkUrl(previousUrl);
    setLinkModalOpen(true);
  };

  // Image Insert & Upload
  const insertImage = (url: string, alt?: string) => {
    if (url) {
      editor.chain().focus().setImage({ src: url, alt: alt || '' }).run();
      setImageModalOpen(false);
      setImageUrl('');
      setImageAlt('');
    }
  };

  const handleImageFileUpload = async (file: File) => {
    setIsUploadingImage(true);
    try {
      const result = await uploadMedia({
        file,
        folder: 'mighty-warner/content',
        resourceType: 'image',
      });
      if (result.url) {
        insertImage(result.url, file.name);
      }
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Source Code Toggle
  const toggleSourceMode = () => {
    if (isSourceMode) {
      // Switching back to WYSIWYG
      editor.commands.setContent(rawHtml, { emitUpdate: true });
      onChange(rawHtml);
      setIsSourceMode(false);
    } else {
      // Switching to Source view
      setRawHtml(editor.getHTML());
      setIsSourceMode(true);
    }
  };

  const handleRawHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRawHtml(val);
    onChange(val);
  };

  const btnClass = (isActive: boolean) =>
    `p-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center ${
      isActive
        ? 'bg-indigo-600 text-white shadow-xs'
        : isDark
        ? 'text-slate-300 hover:text-white hover:bg-slate-800'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  // Word & Character count calculation
  const textContent = editor.getText();
  const characterCount = textContent.length;
  const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;

  return (
    <div
      className={`border rounded-xl transition-all shadow-sm ${
        isDark
          ? 'bg-[#0B101D] border-slate-800/80 focus-within:border-indigo-500/50'
          : 'bg-white border-slate-200 focus-within:border-indigo-500/50'
      }`}
    >
      {/* 
        ========================================================================
        Top Controls Toolbar: STICKY directly below AdminHeader (top-[76px])
        Comprehensive Suite of Tools Matching CKEditor
        ========================================================================
      */}
      <div
        className={`p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-1 border-b transition-all shadow-md z-20 ${
          isDark
            ? 'sticky top-[76px] bg-[#0E1526] border-slate-800 rounded-t-xl backdrop-blur-md'
            : 'sticky top-[76px] bg-white border-slate-200 rounded-t-xl backdrop-blur-md shadow-xs'
        }`}
      >
        <div className="flex flex-wrap items-center gap-1">
          {/* 1. Undo / Redo */}
          <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700/50 dark:border-slate-800">
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Block Typography: Paragraph & Headings */}
          <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-700/50 dark:border-slate-800">
            <button
              type="button"
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={btnClass(editor.isActive('paragraph') && !editor.isActive('heading'))}
              title="Normal Paragraph"
            >
              <Pilcrow className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={btnClass(editor.isActive('heading', { level: 1 }))}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={btnClass(editor.isActive('heading', { level: 2 }))}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={btnClass(editor.isActive('heading', { level: 3 }))}
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
              className={btnClass(editor.isActive('heading', { level: 4 }))}
              title="Heading 4"
            >
              <Heading4 className="w-4 h-4" />
            </button>
          </div>

          {/* 3. Text Formatting (Bold, Italic, Underline, Strike, Sub, Super, Code, CodeBlock) */}
          <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-700/50 dark:border-slate-800">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={btnClass(editor.isActive('bold'))}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={btnClass(editor.isActive('italic'))}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={btnClass(editor.isActive('underline'))}
              title="Underline (Ctrl+U)"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={btnClass(editor.isActive('strike'))}
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={btnClass(editor.isActive('subscript'))}
              title="Subscript (X₂)"
            >
              <SubscriptIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={btnClass(editor.isActive('superscript'))}
              title="Superscript (X²)"
            >
              <SuperscriptIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={btnClass(editor.isActive('code'))}
              title="Inline Code"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={btnClass(editor.isActive('codeBlock'))}
              title="Code Block"
            >
              <Code2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={btnClass(editor.isActive('highlight'))}
              title="Highlight Text"
            >
              <Highlighter className="w-4 h-4" />
            </button>
          </div>

          {/* 4. Text Alignment */}
          <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-700/50 dark:border-slate-800">
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={btnClass(editor.isActive({ textAlign: 'left' }))}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={btnClass(editor.isActive({ textAlign: 'center' }))}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={btnClass(editor.isActive({ textAlign: 'right' }))}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={btnClass(editor.isActive({ textAlign: 'justify' }))}
              title="Justify"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          {/* 5. Lists & Quotes & Divider */}
          <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-700/50 dark:border-slate-800">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={btnClass(editor.isActive('bulletList'))}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={btnClass(editor.isActive('orderedList'))}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={btnClass(editor.isActive('blockquote'))}
              title="Blockquote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className={btnClass(false)}
              title="Divider Line"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* 6. Links, Media Image & Color */}
          <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-700/50 dark:border-slate-800 relative">
            <button
              type="button"
              onClick={openLinkModal}
              className={btnClass(editor.isActive('link'))}
              title="Insert Link"
            >
              <Link2 className="w-4 h-4" />
            </button>
            {editor.isActive('link') && (
              <button
                type="button"
                onClick={() => editor.chain().focus().unsetLink().run()}
                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 transition-colors"
                title="Remove Link"
              >
                <Unlink className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setImageModalOpen(true)}
              className={btnClass(false)}
              title="Insert Image (URL or Upload)"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            {/* Color Palette Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className={btnClass(showColorPicker)}
                title="Text Color"
              >
                <Palette className="w-4 h-4" />
              </button>

              {showColorPicker && (
                <div
                  className={`absolute left-0 mt-2 p-2.5 rounded-xl border shadow-xl z-30 flex flex-col gap-1.5 w-44 ${
                    isDark
                      ? 'bg-[#0E1526] border-slate-700 text-slate-200'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                    Preset Colors
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.color}
                        type="button"
                        onClick={() => {
                          editor.chain().focus().setColor(preset.color).run();
                          setShowColorPicker(false);
                        }}
                        className="w-7 h-7 rounded-lg border border-white/20 flex items-center justify-center hover:scale-110 transition-transform"
                        style={{ backgroundColor: preset.color }}
                        title={preset.label}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().unsetColor().run();
                      setShowColorPicker(false);
                    }}
                    className="mt-1 text-xs text-left px-2 py-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    Reset Color
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 7. Comprehensive Table Operations Menu */}
          <div className="relative flex items-center gap-0.5 px-1.5 border-r border-slate-700/50 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowTableMenu(!showTableMenu)}
              className={btnClass(editor.isActive('table') || showTableMenu)}
              title="Table Operations Menu"
            >
              <TableIcon className="w-4 h-4" />
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
            </button>

            {showTableMenu && (
              <div
                className={`absolute left-0 top-full mt-2 p-2 rounded-xl border shadow-2xl z-30 flex flex-col gap-1 w-52 ${
                  isDark
                    ? 'bg-[#0E1526] border-slate-700 text-slate-200'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                  Table Actions
                </div>
                {!editor.isActive('table') ? (
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                      setShowTableMenu(false);
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Insert 3×3 Table</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().addRowBefore().run();
                        setShowTableMenu(false);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs text-left hover:bg-slate-800 transition-colors"
                    >
                      + Add Row Above
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().addRowAfter().run();
                        setShowTableMenu(false);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs text-left hover:bg-slate-800 transition-colors"
                    >
                      + Add Row Below
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().deleteRow().run();
                        setShowTableMenu(false);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs text-left text-rose-400 hover:bg-rose-950/40 transition-colors"
                    >
                      - Delete Row
                    </button>
                    <div className="h-px bg-slate-700/50 my-0.5" />
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().addColumnBefore().run();
                        setShowTableMenu(false);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs text-left hover:bg-slate-800 transition-colors"
                    >
                      + Add Column Left
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().addColumnAfter().run();
                        setShowTableMenu(false);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs text-left hover:bg-slate-800 transition-colors"
                    >
                      + Add Column Right
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().deleteColumn().run();
                        setShowTableMenu(false);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs text-left text-rose-400 hover:bg-rose-950/40 transition-colors"
                    >
                      - Delete Column
                    </button>
                    <div className="h-px bg-slate-700/50 my-0.5" />
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().deleteTable().run();
                        setShowTableMenu(false);
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-left text-rose-400 hover:bg-rose-950/60 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Entire Table</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* 8. Clear formatting */}
          <div className="flex items-center gap-0.5 pl-1.5">
            <button
              type="button"
              onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
              title="Clear All Formatting"
            >
              <Eraser className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 9. HTML Source Toggle & View Modes */}
        <div className="flex items-center gap-1.5 ml-auto pl-2 border-l border-slate-700/50 dark:border-slate-800">
          {/* HTML Source Toggle */}
          <button
            type="button"
            onClick={toggleSourceMode}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isSourceMode
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
            title="Toggle Raw HTML Source Code"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isSourceMode ? 'Visual Editor' : '<> Source'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsScrollbox(!isScrollbox)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isScrollbox
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
            title={isScrollbox ? 'Switch to Full Page Scrolling' : 'Constrain to Scrollable Box'}
          >
            <MoveVertical className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isScrollbox ? 'Contained Box' : 'Page Scroll'}
            </span>
          </button>
        </div>
      </div>

      {/* Editor Content Area / Raw HTML Source View */}
      <div
        className={`relative ${
          isScrollbox
            ? 'h-[520px] overflow-y-auto rounded-b-xl'
            : 'min-h-[400px] rounded-b-xl'
        } ${isDark ? 'bg-[#0B101D] text-slate-100' : 'bg-white text-slate-800'}`}
      >
        {isSourceMode ? (
          <div className="p-4 h-full">
            <div className="text-[11px] font-mono text-amber-400 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Direct HTML Source Editor (Changes take effect automatically)</span>
            </div>
            <textarea
              value={rawHtml}
              onChange={handleRawHtmlChange}
              rows={22}
              className="w-full h-[450px] font-mono text-xs sm:text-sm p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 leading-relaxed resize-y selection:bg-indigo-500/30"
              placeholder="<p>Enter HTML code here...</p>"
            />
          </div>
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>

      {/* Live Word & Character Counter Bottom Bar */}
      <div
        className={`px-4 py-2 border-t text-[11px] font-mono flex items-center justify-between text-slate-500 ${
          isDark ? 'border-slate-800/80 bg-[#090E1A]' : 'border-slate-200 bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <span>Words: <strong className="text-slate-300">{wordCount}</strong></span>
          <span>•</span>
          <span>Characters: <strong className="text-slate-300">{characterCount}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span>TipTap / ProseMirror Full Engine</span>
        </div>
      </div>

      {/* Link Input Modal Dialog */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-2xl border p-5 shadow-2xl space-y-4 ${
              isDark ? 'bg-[#0E1526] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <h4 className="text-sm font-bold tracking-tight">Insert / Edit Link</h4>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Target URL</label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com or /contact"
                className={`w-full px-3.5 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setLink();
                  }
                }}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={setLink}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
              >
                Apply Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Input / Upload Modal Dialog */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-2xl border p-5 shadow-2xl space-y-4 ${
              isDark ? 'bg-[#0E1526] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <h4 className="text-sm font-bold tracking-tight">Insert Image into Content</h4>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">Image Web URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or /uploads/..."
                  className={`w-full px-3.5 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">Alt Text / Description (Optional)</label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Image description"
                  className={`w-full px-3.5 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* Direct Upload Option */}
              <div className="pt-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageFileUpload(file);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading to CDN...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Device (Cloudinary / Local)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => insertImage(imageUrl, imageAlt)}
                disabled={!imageUrl}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
