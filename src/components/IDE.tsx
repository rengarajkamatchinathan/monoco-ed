import React, { useState } from 'react';
import { Menu, X, ArrowLeft } from 'lucide-react';
import FileTree from './FileTree';
import CodeEditor from './CodeEditor';
import Terminal from './Terminal';
import { motion, AnimatePresence } from 'framer-motion';

interface IDEProps {
  terraformData: any;
  onBackToPrompt: () => void;
}

const IDE: React.FC<IDEProps> = ({ terraformData, onBackToPrompt }) => {
  const [selectedFile, setSelectedFile] = useState<string>(() => {
    const files = Object.keys(terraformData.infrastructure || {});
    return files.includes('main.tf') ? 'main.tf' : files[0] || '';
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(true);

  const { infrastructure } = terraformData;

  const handleFileSelect = (fileName: string) => {
    setSelectedFile(fileName);
  };

  const selectedFileContent = selectedFile ? infrastructure[selectedFile]?.content || '' : '';

  return (
    <div className="h-screen bg-[#1e1e1e] text-white flex flex-col font-mono">
      {/* Title Bar */}
      <div className="bg-[#2d2d30] border-b border-[#3c3c3c] px-4 py-2 flex items-center justify-between animate-fadeIn">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToPrompt}
            className="p-1 hover:bg-[#3c3c3c] rounded transition-colors flex items-center space-x-2 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-[#3c3c3c] rounded transition-colors lg:hidden"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <motion.h1
            className="text-sm font-medium"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            Terraform Web IDE
          </motion.h1>
        </div>
        <motion.div
          className="text-xs text-gray-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {terraformData.cloud_provider?.toUpperCase()} • {Object.keys(infrastructure).length} files
        </motion.div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="w-64 overflow-hidden border-r border-[#3c3c3c] bg-[#252526]"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
            >
              <FileTree
                files={infrastructure}
                selectedFile={selectedFile}
                onFileSelect={handleFileSelect}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Editor */}
          <motion.div
            className={`${terminalOpen ? 'h-2/3' : 'h-full'} transition-all duration-300`}
            key={selectedFile}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {selectedFile ? (
              <CodeEditor content={selectedFileContent} fileName={selectedFile} />
            ) : (
              <div className="h-full bg-[#1e1e1e] flex items-center justify-center">
                <div className="text-center text-gray-400 animate-fadeIn">
                  <h2 className="text-xl mb-2">Welcome to Terraform Web IDE</h2>
                  <p>Select a file from the explorer to start editing</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Terminal */}
          <AnimatePresence>
            {terminalOpen && (
              <motion.div
                className="h-1/3 border-t border-[#3c3c3c] overflow-hidden bg-[#1e1e1e]"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-full relative">
                  <button
                    onClick={() => setTerminalOpen(!terminalOpen)}
                    className="absolute top-2 right-2 z-10 p-1 hover:bg-[#3c3c3c] rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <Terminal />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Terminal Toggle */}
          {!terminalOpen && (
            <div className="bg-[#2d2d30] border-t border-[#3c3c3c] px-4 py-2">
              <button
                onClick={() => setTerminalOpen(true)}
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Show Terminal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IDE;