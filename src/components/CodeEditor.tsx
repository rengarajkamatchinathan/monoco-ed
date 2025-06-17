import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';

interface CodeEditorProps {
  content: string;
  fileName: string;
  onChange?: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ content, fileName, onChange }) => {
  const [editorContent, setEditorContent] = useState(content);

  useEffect(() => {
    setEditorContent(content);
  }, [content]);

  const getLanguage = (fileName: string) => {
    if (fileName.endsWith('.tf')) return 'hcl';
    if (fileName.endsWith('.json')) return 'json';
    if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) return 'yaml';
    return 'plaintext';
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.tf')) return 'code';
    if (fileName.endsWith('.json')) return 'data_object';
    if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) return 'description';
    return 'insert_drive_file';
  };

  const getFileColor = (fileName: string) => {
    if (fileName.endsWith('.tf')) return 'text-blue-600';
    if (fileName.endsWith('.json')) return 'text-green-600';
    if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) return 'text-purple-600';
    return 'text-slate-600';
  };

  const handleEditorChange = (value?: string) => {
    const updatedValue = value || '';
    setEditorContent(updatedValue);
    onChange?.(updatedValue);
  };

  return (
    <div className="h-full bg-white/90 backdrop-blur-sm">
      {/* Enhanced Tab Bar */}
      <motion.div 
        className="flex items-center justify-between bg-gradient-to-r from-white/95 to-slate-50/95 backdrop-blur-xl border-b border-slate-200/50 px-6 py-3 shadow-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg border border-slate-200/50 shadow-sm">
            <span className={`material-symbols-outlined ${getFileColor(fileName)} text-lg`}>
              {getFileIcon(fileName)}
            </span>
            <span className="text-sm font-semibold text-slate-800">{fileName}</span>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse ml-2" />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span className="material-symbols-outlined text-sm">edit</span>
            <span>Editing</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-1 h-1 bg-slate-400 rounded-full" />
            <div className="w-1 h-1 bg-slate-400 rounded-full" />
            <div className="w-1 h-1 bg-slate-400 rounded-full" />
          </div>
        </div>
      </motion.div>

      {/* Editor Container */}
      <motion.div 
        className="h-[calc(100%-60px)] relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }} />
        </div>

        <Editor
          height="100%"
          language={getLanguage(fileName)}
          value={editorContent}
          onChange={handleEditorChange}
          theme="light"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            minimap: { 
              enabled: true,
              side: 'right',
              showSlider: 'always',
              renderCharacters: false
            },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
            tabSize: 2,
            insertSpaces: true,
            readOnly: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            renderLineHighlight: 'gutter',
            selectOnLineNumbers: true,
            roundedSelection: false,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              useShadows: false,
              verticalHasArrows: false,
              horizontalHasArrows: false,
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8
            },
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            padding: { top: 20, bottom: 20 },
            bracketPairColorization: {
              enabled: true
            },
            guides: {
              bracketPairs: true,
              indentation: true
            }
          }}
        />

        {/* Floating action buttons */}
        <div className="absolute bottom-6 right-6 flex flex-col space-y-2">
          <motion.button
            className="w-10 h-10 bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="material-symbols-outlined text-slate-600 group-hover:text-blue-600 text-sm">
              format_align_left
            </span>
          </motion.button>
          <motion.button
            className="w-10 h-10 bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="material-symbols-outlined text-slate-600 group-hover:text-green-600 text-sm">
              save
            </span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CodeEditor;