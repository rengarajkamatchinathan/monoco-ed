import React, { useState } from 'react';
import { Menu, X, ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import FileTree from './FileTree';
import CodeEditor from './CodeEditor';
import Terminal from './Terminal';

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
  const [isMaximized, setIsMaximized] = useState(false);

  const { infrastructure } = terraformData;

  const handleFileSelect = (fileName: string) => {
    setSelectedFile(fileName);
  };

  const selectedFileContent = selectedFile ? infrastructure[selectedFile]?.content || '' : '';

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-slate-800 flex flex-col font-mono relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-r from-cyan-200/20 to-blue-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Futuristic Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Title Bar */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4 flex items-center justify-between relative z-10 shadow-sm animate-slide-down">
        <div className="flex items-center space-x-6">
          <button
            onClick={onBackToPrompt}
            className="group flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md border border-slate-200/50 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-slate-800 transition-colors" />
            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Back to Prompt</span>
          </button>
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-200/50 rounded-lg transition-colors lg:hidden"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center space-x-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">TF</span>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                InfraGenie IDE
              </h1>
              <p className="text-xs text-slate-500">Terraform Development Environment</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full border border-blue-200/50">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-slate-700">
              {terraformData.cloud_provider?.toUpperCase()}
            </span>
          </div>
          <div className="text-xs text-slate-500 bg-slate-100/50 px-3 py-1 rounded-full border border-slate-200/50">
            {Object.keys(infrastructure).length} files
          </div>
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-2 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Sidebar */}
        <div className={`w-80 overflow-hidden bg-white/70 backdrop-blur-xl border-r border-slate-200/50 shadow-lg transition-all duration-400 ease-out ${
          sidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}>
          <FileTree
            files={infrastructure}
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white/50 backdrop-blur-sm">
          {/* Editor */}
          <div className={`${terminalOpen ? 'h-2/3' : 'h-full'} transition-all duration-500 ease-out`}>
            {selectedFile ? (
              <div className="h-full bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-tl-2xl shadow-lg overflow-hidden animate-fade-in">
                <CodeEditor content={selectedFileContent} fileName={selectedFile} />
              </div>
            ) : (
              <div className="h-full bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-tl-2xl shadow-lg flex items-center justify-center">
                <div className="text-center animate-fade-in">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
                    <span className="text-white text-2xl font-bold">TF</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-3">Welcome to InfraGenie IDE</h2>
                  <p className="text-slate-600 max-w-md">Select a file from the explorer to start editing your Terraform infrastructure code</p>
                  <div className="mt-6 flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Terminal */}
          <div className={`h-1/3 border-t border-slate-200/50 overflow-hidden bg-white/70 backdrop-blur-xl shadow-lg transition-all duration-400 ease-out ${
            terminalOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}>
            <div className="h-full relative">
              <button
                onClick={() => setTerminalOpen(!terminalOpen)}
                className="absolute top-3 right-3 z-10 p-2 hover:bg-slate-200/50 rounded-lg transition-colors bg-white/50 backdrop-blur-sm border border-slate-200/50"
              >
                <X className="w-4 h-4" />
              </button>
              <Terminal />
            </div>
          </div>

          {/* Terminal Toggle */}
          {!terminalOpen && (
            <div className="bg-white/80 backdrop-blur-xl border-t border-slate-200/50 px-6 py-4 shadow-lg animate-fade-in">
              <button
                onClick={() => setTerminalOpen(true)}
                className="flex items-center space-x-2 text-sm text-slate-600 hover:text-slate-800 transition-colors px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
              >
                <span className="material-symbols-outlined text-lg">terminal</span>
                <span>Show Terminal</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IDE;