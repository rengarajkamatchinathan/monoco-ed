import React, { useState } from 'react';
import { Send, Loader2, Cloud, Zap, Globe } from 'lucide-react';

interface PromptPageProps {
  onTerraformGenerated: (data: any) => void;
}

const PromptPage: React.FC<PromptPageProps> = ({ onTerraformGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [cloudProvider, setCloudProvider] = useState('azure');
  const [provider, setProvider] = useState('gemini');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cloud_provider: cloudProvider,
          prompt: prompt.trim(),
          provider: provider,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      onTerraformGenerated(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate Terraform configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const examplePrompts = [
    "Create a simple App Service to deploy my backend FastAPI application globally.",
    "Set up a scalable web application with load balancer and database.",
    "Deploy a containerized microservices architecture with monitoring.",
    "Create a secure API gateway with authentication and rate limiting."
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
              <Cloud className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terraform AI Generator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Describe your cloud infrastructure needs and let AI generate production-ready Terraform configurations
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Cloud Provider Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-4">
                Cloud Provider
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'azure', label: 'Azure', icon: '☁️' },
                  { value: 'aws', label: 'AWS', icon: '🟠' },
                  { value: 'gcp', label: 'GCP', icon: '🔵' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setCloudProvider(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      cloudProvider === option.value
                        ? 'border-blue-500 bg-blue-500/20 text-white'
                        : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Provider Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-4">
                AI Provider
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'gemini', label: 'Gemini', icon: <Zap className="w-5 h-5" /> },
                  { value: 'openai', label: 'OpenAI', icon: <Globe className="w-5 h-5" /> }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setProvider(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center space-x-3 ${
                      provider === option.value
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {option.icon}
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div>
              <label htmlFor="prompt" className="block text-sm font-semibold text-gray-200 mb-4">
                Describe Your Infrastructure
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to build... e.g., 'Create a simple App Service to deploy my backend FastAPI application globally.'"
                className="w-full h-32 px-6 py-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-lg"
                disabled={isLoading}
              />
            </div>

            {/* Example Prompts */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-4">
                Example Prompts
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setPrompt(example)}
                    className="text-left p-4 bg-gray-800/30 hover:bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 hover:text-white transition-all duration-200 text-sm"
                    disabled={isLoading}
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
                <p className="font-medium">Error generating configuration:</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 text-lg disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Generating Terraform Configuration...</span>
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  <span>Generate Infrastructure</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400">
          <p className="text-sm">
            Powered by AI • Generate production-ready Terraform configurations in seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromptPage;