'use client';
import React, { useState, useEffect } from 'react';
import { Loader2, Send, TerminalSquare, Zap, Cpu, Sparkles } from 'lucide-react';

const suggestions = [
  "Deploy scalable FastAPI app with PostgreSQL on Azure",
  "Create VPC with subnets and NAT gateway",
  "Set up S3 bucket with CloudFront and SSL",
];

const PromptPage = ({ onTerraformGenerated }: { onTerraformGenerated: (data: any) => void }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoading && countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isLoading, countdown]);

  const handleSubmit = async (input: string) => {
    if (!input.trim()) return;
    setPrompt(input);
    setIsLoading(true);
    setCountdown(10);
    setError('');
    setResponse('');

    try {
      const res = await fetch(import.meta.env.VITE_API_URL || 'http://localhost:8000', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cloud_provider: 'azure',
          prompt: input,
          provider: 'gemini',
        }),
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      onTerraformGenerated(data);
      setResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center text-white min-h-screen py-12 px-4 overflow-hidden bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]">

      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-24 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-24 right-10 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text animate-fade-in">
        InfraGenie IDE
      </h1>

      <div className="mt-10 w-full max-w-2xl bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-lg shadow-md">
        <div className="flex items-start gap-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="e.g. Deploy a Django app with MySQL on Azure using Terraform"
            className="w-full text-sm bg-transparent resize-none outline-none text-white placeholder:text-gray-400"
          />
          <button
            disabled={isLoading || !prompt.trim()}
            onClick={() => handleSubmit(prompt)}
            className={`p-2 rounded-md transition ${
              isLoading || !prompt.trim()
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
            }`}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-6 max-w-2xl">
        {suggestions.map((suggestion, i) => (
          <button
            key={i}
            onClick={() => handleSubmit(suggestion)}
            className="text-sm text-gray-300 border border-gray-700 rounded-full px-3 py-1 hover:border-blue-400 hover:text-white transition duration-200"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="mt-6 w-full max-w-2xl h-2 bg-gray-800/50 rounded-full overflow-hidden animate-pulse">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-600 transition-all duration-1000"
            style={{ width: `${(10 - countdown) * 10}%` }}
          />
        </div>
      )}

      {response && (
        <div className="mt-8 bg-black/30 border border-white/10 p-4 w-full max-w-2xl rounded-lg overflow-auto animate-fade-in">
          <p className="text-green-400 text-sm font-medium mb-2">Terraform Output:</p>
          <pre className="text-sm text-gray-100 whitespace-pre-wrap">{response}</pre>
        </div>
      )}

      {error && (
        <div className="mt-6 text-sm text-red-400 bg-red-500/10 border border-red-400/20 px-4 py-2 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full fade-in-up">
        {[
          {
            icon: Zap,
            title: 'Fast Output',
            description: 'Infra code in seconds, tailored to your prompt.',
          },
          {
            icon: Cpu,
            title: 'AI-Driven Infra',
            description: 'Uses AI to craft intelligent infra layouts.',
          },
          {
            icon: Sparkles,
            title: 'Clean Terraform',
            description: 'Readable, production-grade Terraform output.',
          },
        ].map((f, i) => (
          <div key={i} className="glass p-6 rounded-xl border border-white/10 hover-lift group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-[#1b76ff] to-[#35c5ff] rounded-lg group-hover:scale-110 transition">
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-white">{f.title}</h3>
            </div>
            <p className="text-sm text-gray-400">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptPage;
