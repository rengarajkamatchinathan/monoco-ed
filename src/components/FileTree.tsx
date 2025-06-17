import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileTreeProps {
  files: Record<string, any>;
  selectedFile: string | null;
  onFileSelect: (fileName: string) => void;
}

const FileTree: React.FC<FileTreeProps> = ({ files, selectedFile, onFileSelect }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  const getFileIcon = (fileName: string) => {
    let icon = 'description';
    let color = 'text-slate-500';
    
    if (fileName.endsWith('.tf')) {
      icon = 'code';
      color = 'text-blue-600';
    } else if (fileName.endsWith('.json')) {
      icon = 'data_object';
      color = 'text-green-600';
    } else if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) {
      icon = 'description';
      color = 'text-purple-600';
    }
  
    return (
      <span className={`material-symbols-outlined ${color} text-lg leading-none`}>
        {icon}
      </span>
    );
  };

  return (
    <div className="h-full">
      {/* Header */}
      <motion.div 
        className="p-6 border-b border-slate-200/50 bg-gradient-to-r from-white/80 to-slate-50/80 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-white text-sm">folder</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Project Explorer</h3>
              <p className="text-xs text-slate-500">Infrastructure Files</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* File Tree */}
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center w-full text-left p-3 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/50 rounded-xl transition-all duration-200 group"
          >
            <motion.div
              animate={{ rotate: collapsed ? 0 : 90 }}
              transition={{ duration: 0.2 }}
              className="mr-2"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.div>
            <span className="material-symbols-outlined text-amber-600 mr-3 text-lg">folder_open</span>
            <span className="group-hover:text-blue-600 transition-colors">TERRAFORM</span>
            <div className="ml-auto bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full">
              {Object.keys(files).length}
            </div>
          </button>
        </motion.div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              className="ml-6 mt-2 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {Object.keys(files).map((fileName, index) => (
                <motion.button
                  key={fileName}
                  onClick={() => onFileSelect(fileName)}
                  className={`flex items-center w-full text-left px-4 py-3 text-sm rounded-xl transition-all duration-200 group relative overflow-hidden ${
                    selectedFile === fileName
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-[1.02]'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200 hover:shadow-md'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: selectedFile === fileName ? 1.02 : 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Selection indicator */}
                  {selectedFile === fileName && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                      layoutId="selection-indicator"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  
                  <div className="flex items-center space-x-3 relative z-10">
                    {getFileIcon(fileName)}
                    <span className="truncate font-medium">{fileName}</span>
                  </div>
                  
                  {/* File type badge */}
                  <div className={`ml-auto text-xs px-2 py-1 rounded-full ${
                    selectedFile === fileName
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 text-slate-600 group-hover:bg-slate-300'
                  }`}>
                    {fileName.split('.').pop()?.toUpperCase()}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Stats */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white/90 to-transparent backdrop-blur-sm border-t border-slate-200/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Ready</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>{Object.keys(files).length} files</span>
            <span>•</span>
            <span>Terraform</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FileTree;