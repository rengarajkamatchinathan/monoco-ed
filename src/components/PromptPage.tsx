import React, { useState, useEffect } from 'react';
import { Loader2, Send, Sparkles, Zap, Cpu, ArrowRight } from 'lucide-react';

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
    <div className="relative flex flex-col items-center text-slate-800 min-h-screen py-12 px-4 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 left-10 w-96 h-96 bg-gradient-to-r from-blue-200/40 to-indigo-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-24 right-10 w-80 h-80 bg-gradient-to-r from-purple-200/40 to-pink-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-200/30 to-blue-200/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Futuristic Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }} />
      </div>

      {/* Header */}
      <div className="text-center mb-12 relative z-10 animate-slide-down">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl mr-4">
            <span className="text-white text-2xl font-bold">IG</span>
          </div>
          <div className="text-left">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-800 text-transparent bg-clip-text">
              InfraGenie
            </h1>
            <p className="text-lg text-slate-600 font-medium">AI-Powered Infrastructure Development</p>
          </div>
        </div>
      </div>

      {/* Main Input */}
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-xl border border-slate-200/50 p-8 rounded-3xl shadow-2xl relative z-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="Describe your infrastructure needs... e.g., Deploy a Django app with MySQL on Azure using Terraform"
              className="w-full text-base bg-transparent resize-none outline-none text-slate-800 placeholder:text-slate-400 leading-relaxed"
            />
          </div>
          <button
            disabled={isLoading || !prompt.trim()}
            onClick={() => handleSubmit(prompt)}
            className={`p-4 rounded-2xl transition-all duration-300 shadow-lg hover:scale-105 ${
              isLoading || !prompt.trim()
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-white" />
            ) : (
              <Send className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap justify-center gap-4 mt-8 max-w-4xl relative z-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        {suggestions.map((suggestion, i) => (
          <button
            key={i}
            onClick={() => handleSubmit(suggestion)}
            className="group text-sm text-slate-600 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl px-6 py-3 hover:bg-white/80 hover:border-blue-300 hover:text-blue-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-102 hover:-translate-y-1"
            style={{ animationDelay: `${0.5 + i * 0.1}s` }}
          >
            <div className="flex items-center space-x-2">
              <span>{suggestion}</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      {isLoading && (
        <div className="mt-8 w-full max-w-3xl relative z-10 animate-fade-in">
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700">Generating Infrastructure...</span>
              <span className="text-sm text-slate-500">{countdown}s</span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${(10 - countdown) * 10}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Response */}
      {response && (
        <div className="mt-8 bg-white/70 backdrop-blur-xl border border-slate-200/50 p-6 w-full max-w-3xl rounded-2xl shadow-lg relative z-10 animate-fade-in">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-green-700 text-sm font-semibold">Terraform Generated Successfully</p>
          </div>
          <pre className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-200/50 max-h-64 overflow-auto">
            {response}
          </pre>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-8 text-sm text-red-700 bg-red-50 border border-red-200 px-6 py-4 rounded-2xl shadow-lg relative z-10 animate-fade-in">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-red-500">error</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full relative z-10 animate-fade-in" style={{ animationDelay: '0.6s' }}>
        {[
          {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Generate production-ready infrastructure code in seconds with AI-powered optimization.',
            color: 'from-yellow-400 to-orange-500'
          },
          {
            icon: Cpu,
            title: 'AI-Driven Intelligence',
            description: 'Advanced AI algorithms craft intelligent infrastructure layouts tailored to your needs.',
            color: 'from-blue-500 to-indigo-600'
          },
          {
            icon: Sparkles,
            title: 'Clean & Scalable',
            description: 'Readable, maintainable, and production-grade Terraform code that follows best practices.',
            color: 'from-purple-500 to-pink-600'
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="group bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-102"
            style={{ animationDelay: `${0.7 + i * 0.1}s` }}
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className={`p-4 bg-gradient-to-r ${feature.color} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">{feature.title}</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptPage;