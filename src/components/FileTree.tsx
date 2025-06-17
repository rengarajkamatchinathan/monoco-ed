import React from 'react';
import { File, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileTreeProps {
  files: Record<string, any>;
  selectedFile: string | null;
  onFileSelect: (fileName: string) => void;
}

const FileTree: React.FC<FileTreeProps> = ({ files, selectedFile, onFileSelect }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  const getFileIcon = (fileName: string) => {
    let icon = 'insert_drive_file';
    if (fileName.endsWith('.tf')) icon = 'code';
    else if (fileName.endsWith('.json')) icon = 'data_object';
    else if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) icon = 'description';
  
    return (
      <span className="material-symbols-outlined text-purple-400 text-sm leading-none">
        {icon}
      </span>
    );
  };
  

  return (
    <div className="bg-[#252526] h-full border-r border-[#3c3c3c] animate-fadeIn">
      <div className="p-3 border-b border-[#3c3c3c]">
        <div className="flex items-center justify-between text-xs font-medium text-gray-300 uppercase tracking-wide">
          <span>Explorer</span>
        </div>
      </div>

      <div className="p-2">
        <div className="mb-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors w-full text-left"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 mr-1" />
            ) : (
              <ChevronDown className="w-4 h-4 mr-1" />
            )}
            TERRAFORM
          </button>
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              className="ml-4 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {Object.keys(files).map((fileName) => (
                <motion.button
                  key={fileName}
                  onClick={() => onFileSelect(fileName)}
                  className={`flex items-center w-full text-left px-2 py-1 text-sm rounded hover:bg-[#2a2d2e] transition-colors overflow-hidden whitespace-nowrap ${{
                    true: 'bg-[#094771] text-white',
                    false: 'text-gray-300 hover:text-white',
                  }[String(selectedFile === fileName)]}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {getFileIcon(fileName)}
                  <span className="ml-2 truncate">{fileName}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FileTree;
