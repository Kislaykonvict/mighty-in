'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Palette,
  Highlighter,
  Link2,
  Unlink,
  Eraser,
  Undo2,
  Redo2,
  Check,
  X,
} from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';

export interface MinimalRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: 'inline' | 'multiline';
  minHeight?: string;
  className?: string;
  isDark?: boolean;
}

const COLOR_PRESETS = [
  { label: 'Default', color: '' },
  { label: 'Tech Indigo', color: '#6366F1' },
  { label: 'Growth Coral', color: '#FF5E3A' },
  { label: 'Sky Blue', color: '#38BDF8' },
  { label: 'Talent Emerald', color: '#10B981' },
  { label: 'Amber Gold', color: '#F59E0B' },
  { label: 'Rose Red', color: '#F43F5E' },
  { label: 'Pure White', color: '#FFFFFF' },
  { label: 'Dark Slate', color: '#0F172A' },
];

export function MinimalRichTextEditor({
  value,
  onChange,
  placeholder = '',
  variant = 'inline',
  minHeight,
  className = '',
  isDark: propIsDark,
}: MinimalRichTextEditorProps) {
  const { theme } = useAdminTheme();
  const isDark = propIsDark !== undefined ? propIsDark : theme === 'dark';

  const [isMounted, setIsMounted] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const linkModalRef = useRef<HTMLDivElement>(null);

  // Close popovers when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
      if (linkModalRef.current && !linkModalRef.current.contains(e.target as Node)) {
        setShowLinkModal(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        bulletList: false,
        orderedList: false,
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-400 underline underline-offset-2 hover:text-indigo-300',
        },
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      let html = editor.getHTML();

      if (variant === 'inline') {
        // Strip wrapping paragraph tags so single-line fields remain clean
        html = html
          .replace(/^<p\b[^>]*>/i, '')
          .replace(/<\/p>$/i, '')
          .trim();
        // If it was just empty paragraph, return empty string
        if (html === '<p></p>' || html === '') {
          onChange('');
          return;
        }
      } else {
        if (editor.isEmpty) {
          onChange('');
          return;
        }
      }

      onChange(html);
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        // In inline mode, Enter should blur or prevent newline
        if (variant === 'inline' && event.key === 'Enter') {
          event.preventDefault();
          view.dom.blur();
          return true;
        }
        return false;
      },
      attributes: {
        class: `focus:outline-none prose max-w-none text-xs sm:text-sm font-medium ${
          isDark ? 'prose-invert text-white' : 'text-slate-900'
        } ${variant === 'inline' ? 'min-h-[26px] py-1 leading-normal' : 'min-h-[64px] py-1.5 leading-relaxed'}`,
      },
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync external value updates
  useEffect(() => {
    if (editor && value !== undefined) {
      let current = editor.getHTML();
      if (variant === 'inline') {
        current = current.replace(/^<p\b[^>]*>/i, '').replace(/<\/p>$/i, '').trim();
      }
      if (current !== value) {
        editor.commands.setContent(value || '', { emitUpdate: false });
      }
    }
  }, [value, editor, variant]);

  if (!isMounted || !editor) {
    return (
      <div
        className={`w-full rounded-xl border px-3.5 py-2.5 text-xs opacity-50 ${
          isDark ? 'bg-slate-800/80 border-slate-700 text-slate-400' : 'bg-white border-slate-300 text-slate-500'
        } ${className}`}
      >
        {value || placeholder || 'Loading editor...'}
      </div>
    );
  }

  const handleApplyLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().unsetLink().run();
    } else {
      let formattedUrl = linkUrl.trim();
      if (!/^https?:\/\//i.test(formattedUrl) && !formattedUrl.startsWith('/') && !formattedUrl.startsWith('#')) {
        formattedUrl = `https://${formattedUrl}`;
      }
      editor.chain().focus().setLink({ href: formattedUrl }).run();
    }
    setShowLinkModal(false);
    setLinkUrl('');
  };

  const isEditorEmpty = editor.isEmpty;

  return (
    <div
      className={`group relative rounded-xl border transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 ${
        isDark
          ? 'bg-slate-800/80 border-slate-700 text-white focus-within:border-indigo-500'
          : 'bg-white border-slate-300 text-slate-900 focus-within:border-indigo-600'
      } ${className}`}
    >
      {/* Sleek Minimal Toolbar */}
      <div
        className={`flex items-center justify-between px-2.5 py-1 border-b select-none ${
          isDark
            ? 'bg-slate-900/60 border-slate-700/80 text-slate-400'
            : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}
      >
        <div className="flex items-center gap-0.5">
          {/* Bold */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer ${
              editor.isActive('bold')
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-3 h-3" />
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer ${
              editor.isActive('italic')
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-3 h-3" />
          </button>

          {/* Underline */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer ${
              editor.isActive('underline')
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-3 h-3" />
          </button>

          <span className="w-px h-3.5 bg-slate-300 dark:bg-slate-700 mx-1" />

          {/* Color Palette Popover */}
          <div className="relative" ref={colorPickerRef}>
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className={`w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer ${
                showColorPicker
                  ? 'bg-indigo-600 text-white'
                  : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
              title="Text Color"
            >
              <Palette className="w-3 h-3" />
            </button>

            {showColorPicker && (
              <div
                className={`absolute left-0 top-full mt-1.5 p-2 rounded-xl shadow-xl border z-50 min-w-[140px] grid grid-cols-5 gap-1.5 ${
                  isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                }`}
              >
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      if (!preset.color) {
                        editor.chain().focus().unsetColor().run();
                      } else {
                        editor.chain().focus().setColor(preset.color).run();
                      }
                      setShowColorPicker(false);
                    }}
                    className="w-5 h-5 rounded-full border border-black/10 dark:border-white/20 hover:scale-110 transition-transform flex items-center justify-center cursor-pointer shadow-xs"
                    style={{ backgroundColor: preset.color || (isDark ? '#FFFFFF' : '#0F172A') }}
                    title={preset.label}
                  >
                    {!preset.color && <span className="text-[9px] font-bold text-rose-500">×</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Highlight */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer ${
              editor.isActive('highlight')
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
            title="Highlight Text"
          >
            <Highlighter className="w-3 h-3" />
          </button>

          {/* Link */}
          <div className="relative" ref={linkModalRef}>
            <button
              type="button"
              onClick={() => {
                if (editor.isActive('link')) {
                  editor.chain().focus().unsetLink().run();
                } else {
                  setLinkUrl('');
                  setShowLinkModal(!showLinkModal);
                }
              }}
              className={`w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer ${
                editor.isActive('link')
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
              title={editor.isActive('link') ? 'Remove Link' : 'Add Link'}
            >
              {editor.isActive('link') ? <Unlink className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
            </button>

            {showLinkModal && (
              <div
                className={`absolute left-0 top-full mt-1.5 p-2 rounded-xl shadow-xl border z-50 flex items-center gap-1.5 w-64 ${
                  isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                }`}
              >
                <input
                  type="text"
                  placeholder="https://..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyLink();
                    }
                  }}
                  className={`flex-1 px-2 py-1 text-xs rounded-lg border focus:outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleApplyLink}
                  className="p-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                  title="Apply"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
                  title="Cancel"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <span className="w-px h-3.5 bg-slate-300 dark:bg-slate-700 mx-1" />

          {/* Clear Formatting */}
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            className="w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
            title="Clear Formatting"
          >
            <Eraser className="w-3 h-3" />
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="w-5 h-5 rounded flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
            title="Undo"
          >
            <Undo2 className="w-2.5 h-2.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="w-5 h-5 rounded flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
            title="Redo"
          >
            <Redo2 className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="relative px-3 py-1.5" style={{ minHeight: minHeight }}>
        {isEditorEmpty && placeholder && (
          <div
            className={`pointer-events-none absolute left-3 top-2 text-xs select-none ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            {placeholder}
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default MinimalRichTextEditor;
