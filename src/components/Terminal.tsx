import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import 'xterm/css/xterm.css';

const Terminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Create terminal instance
    const xterm = new XTerm({
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#d4d4d4',
        selection: '#264f78',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#e5e5e5',
      },
      fontFamily: 'Consolas, "Courier New", monospace',
      fontSize: 14,
      rows: 15,
      cols: 80,
      cursorBlink: true,
    });

    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);

    xterm.open(terminalRef.current);
    fitAddon.fit();

    // Store references
    xtermRef.current = xterm;
    fitAddonRef.current = fitAddon;

    // Simulate terraform init output
    const lines = [
      'terraform init',
      '',
      'Initializing the backend...',
      '',
      'Initializing provider plugins...',
      '- Finding hashicorp/azurerm versions matching "~> 3.0"...',
      '- Installing hashicorp/azurerm v3.116.0...',
      '- Installed hashicorp/azurerm v3.116.0 (signed by HashiCorp)',
      '',
      'Terraform has created a lock file .terraform.lock.hcl to record the provider',
      'selections it made above. Include this file in your version control repository',
      'so that Terraform can guarantee to make the same selections by default when',
      'you run "terraform init" in the future.',
      '',
      '✅ Terraform has been successfully initialized!',
      '',
      'You may now begin working with Terraform. Try running "terraform plan" to see',
      'any changes that are required for your infrastructure. All Terraform commands',
      'should now work.',
      '',
      'If you ever set or change modules or backend configuration for Terraform,',
      'rerun this command to reinitialize your working directory. If you forget, other',
      'commands will detect it and remind you to do so if necessary.',
      '',
      '$ ',
    ];

    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < lines.length) {
        xterm.writeln(lines[index]);
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 200);

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
    <div className="h-full bg-[#1e1e1e]">
      <div className="flex items-center bg-[#2d2d30] border-b border-[#3c3c3c] px-4 py-2">
        <span className="text-sm text-gray-300">Terminal</span>
      </div>
      <div ref={terminalRef} className="h-[calc(100%-40px)] p-2" />
    </div>
  );
};

export default Terminal;