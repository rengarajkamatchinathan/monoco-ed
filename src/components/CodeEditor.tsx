import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  content: string;
  fileName: string;
  onChange?: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ content, fileName, onChange }) => {
  const getLanguage = (fileName: string) => {
    if (fileName.endsWith('.tf')) return 'hcl';
    if (fileName.endsWith('.json')) return 'json';
    if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) return 'yaml';
    return 'plaintext';
  };

  return (
    <div className="h-full bg-[#1e1e1e]">
      <div className="flex items-center bg-[#2d2d30] border-b border-[#3c3c3c] px-4 py-2">
        <span className="text-sm text-gray-300">{fileName}</span>
      </div>
      <div className="h-[calc(100%-40px)]">
        <Editor
          height="100%"
          language={getLanguage(fileName)}
          value={content}
          onChange={(value) => onChange?.(value || '')}
          theme="vs-dark"
          options={{
            fontSize: 14,
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
            tabSize: 2,
            insertSpaces: true,
            readOnly: false,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;