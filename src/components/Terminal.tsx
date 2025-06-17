import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import { motion } from 'framer-motion';
import 'xterm/css/xterm.css';

const Terminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Create terminal instance with light theme
    const xterm = new XTerm({
      theme: {
        background: '#fefefe',
        foreground: '#1e293b',
        cursor: '#3b82f6',
        selection: '#dbeafe',
        black: '#1e293b',
        red: '#dc2626',
        green: '#059669',
        yellow: '#d97706',
        blue: '#2563eb',
        magenta: '#7c3aed',
        cyan: '#0891b2',
        white: '#64748b',
        brightBlack: '#475569',
        brightRed: '#ef4444',
        brightGreen: '#10b981',
        brightYellow: '#f59e0b',
        brightBlue: '#3b82f6',
        brightMagenta: '#8b5cf6',
        brightCyan: '#06b6d4',
        brightWhite: '#1e293b',
      },
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
      fontSize: 13,
      fontWeight: '400',
      rows: 15,
      cols: 80,
      cursorBlink: true,
      cursorStyle: 'bar',
      allowTransparency: true,
    });

    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);

    xterm.open(terminalRef.current);
    fitAddon.fit();

    // Store references
    xtermRef.current = xterm;
    fitAddonRef.current = fitAddon;

    // Enhanced terraform init output with colors and styling
    const lines = [
      '\x1b[1;36m$ terraform init\x1b[0m',
      '',
      '\x1b[1;33m⚡ Initializing the backend...\x1b[0m',
      '',
      '\x1b[1;34m🔧 Initializing provider plugins...\x1b[0m',
      '\x1b[90m- Finding hashicorp/azurerm versions matching "~> 3.0"...\x1b[0m',
      '\x1b[32m- Installing hashicorp/azurerm v3.116.0...\x1b[0m',
      '\x1b[32m- Installed hashicorp/azurerm v3.116.0 (signed by HashiCorp)\x1b[0m',
      '',
      '\x1b[33m📋 Terraform has created a lock file .terraform.lock.hcl to record the provider\x1b[0m',
      '\x1b[33mselections it made above. Include this file in your version control repository\x1b[0m',
      '\x1b[33mso that Terraform can guarantee to make the same selections by default when\x1b[0m',
      '\x1b[33myou run "terraform init" in the future.\x1b[0m',
      '',
      '\x1b[1;32m✅ Terraform has been successfully initialized!\x1b[0m',
      '',
      '\x1b[36mYou may now begin working with Terraform. Try running "terraform plan" to see\x1b[0m',
      '\x1b[36many changes that are required for your infrastructure. All Terraform commands\x1b[0m',
      '\x1b[36mshould now work.\x1b[0m',
      '',
      '\x1b[90mIf you ever set or change modules or backend configuration for Terraform,\x1b[0m',
      '\x1b[90mrerun this command to reinitialize your working directory. If you forget, other\x1b[0m',
      '\x1b[90mcommands will detect it and remind you to do so if necessary.\x1b[0m',
      '',
      '\x1b[1;36m$ \x1b[0m',
    ];

    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < lines.length) {
        xterm.writeln(lines[index]);
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 150);

    // Handle resize
    const handleResize = () => {
      fitAddon.fit();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(typeInterval);
      window.removeEventListener('resize', handleResize);
      xterm.dispose();
    };
  }, []);

  return (
    <div className="h-full bg-white/95 backdrop-blur-sm">
      {/* Enhanced Terminal Header */}
      <motion.div 
        className="flex items-center justify-between bg-gradient-to-r from-slate-100/90 to-slate-200/90 backdrop-blur-xl border-b border-slate-200/50 px-6 py-3 shadow-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-white text-sm">terminal</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-800">Terminal</span>
              <div className="flex items-center space-x-2 mt-0.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-slate-500">Active Session</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-400 rounded-full hover:bg-red-500 cursor-pointer transition-colors" />
            <div className="w-3 h-3 bg-yellow-400 rounded-full hover:bg-yellow-500 cursor-pointer transition-colors" />
            <div className="w-3 h-3 bg-green-400 rounded-full hover:bg-green-500 cursor-pointer transition-colors" />
          </div>
        </div>
      </motion.div>

      {/* Terminal Content */}
      <motion.div 
        ref={terminalRef} 
        className="h-[calc(100%-60px)] p-4 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.01] pointer-events-none">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '10px 10px'
          }} />
        </div>
      </motion.div>
    </div>
  );
};

export default Terminal;