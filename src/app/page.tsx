'use client';

import { useState, useEffect } from 'react';

type FormatType = 'all' | 'twitter' | 'linkedin' | 'email' | 'instagram' | 'youtube';

interface GeneratedContent {
  twitter?: string;
  linkedin?: string;
  email?: string;
  instagram?: string;
  youtube?: string;
}

const formatOptions = [
  { value: 'all', label: 'All Formats', icon: '✨' },
  { value: 'twitter', label: 'Twitter/X Thread', icon: '𝕏' },
  { value: 'linkedin', label: 'LinkedIn Post', icon: 'in' },
  { value: 'email', label: 'Email Newsletter', icon: '✉️' },
  { value: 'instagram', label: 'Instagram Caption', icon: '📸' },
  { value: 'youtube', label: 'YouTube Script', icon: '▶️' },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Content Marketing Manager",
    company: "TechFlow",
    text: "ContentMorph cut my content creation time by 80%. What used to take hours now takes minutes.",
    avatar: "SC"
  },
  {
    name: "Marcus Johnson",
    role: "Solo Entrepreneur",
    company: "Growth Labs",
    text: "I went from posting once a week to daily across all platforms. Game changer for my personal brand.",
    avatar: "MJ"
  },
  {
    name: "Emily Rodriguez",
    role: "Social Media Manager",
    company: "CreativeAgency",
    text: "The AI understands tone perfectly. My LinkedIn posts sound professional, and my tweets stay casual.",
    avatar: "ER"
  }
];

export default function Home() {
  const [content, setContent] = useState('');
  const [format, setFormat] = useState<FormatType>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState('');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [isPro, setIsPro] = useState(false);

  const FREE_LIMIT = 5;

  useEffect(() => {
    // Load usage from localStorage
    const today = new Date().toDateString();
    const stored = localStorage.getItem('contentmorph_usage');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === today) {
        setUsageCount(data.count);
      } else {
        localStorage.setItem('contentmorph_usage', JSON.stringify({ date: today, count: 0 }));
      }
    }
    // Check pro status
    const proStatus = localStorage.getItem('contentmorph_pro');
    if (proStatus === 'true') {
      setIsPro(true);
    }
  }, []);

  const incrementUsage = () => {
    const today = new Date().toDateString();
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem('contentmorph_usage', JSON.stringify({ date: today, count: newCount }));
  };

  const handleGenerate = async () => {
    if (!content.trim()) {
      setError('Please enter some content to transform');
      return;
    }

    if (!isPro && usageCount >= FREE_LIMIT) {
      setError(`You've reached your free daily limit (${FREE_LIMIT} generations). Upgrade to Pro for unlimited access!`);
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedContent(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, format }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setGeneratedContent(data);
      incrementUsage();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, formatKey: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(formatKey);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch {
      setError('Failed to copy to clipboard');
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-sm">
                CM
              </div>
              <span className="font-semibold text-lg">ContentMorph</span>
            </div>
            <div className="flex items-center gap-4">
              {!isPro && (
                <span className="text-sm text-gray-400">
                  {FREE_LIMIT - usageCount} free generations left today
                </span>
              )}
              <a
                href="#pricing"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:opacity-90 transition-opacity"
              >
                {isPro ? 'Pro Member' : 'Upgrade to Pro'}
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-sm text-purple-300">AI-Powered Content Transformation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Transform Your Content Into
            <span className="block gradient-text">Every Format Instantly</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Paste your blog post, article, or idea. Get perfectly crafted content for Twitter, LinkedIn,
            email newsletters, Instagram, and YouTube - all in seconds.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>No signup required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>5 free/day</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Instant results</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main App Section */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="gradient-border p-6 glow">
            {/* Input Area */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your blog post, article, video transcript, or any content you want to transform..."
                className="w-full h-48 p-4 bg-[#111] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent resize-none transition-all"
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>{wordCount} words</span>
                <span>{charCount} characters</span>
              </div>
            </div>

            {/* Format Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Output Format
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {formatOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormat(option.value as FormatType)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      format === option.value
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-[#111] text-gray-400 hover:bg-[#1a1a1a] border border-white/10'
                    }`}
                  >
                    <span className="block text-lg mb-1">{option.icon}</span>
                    <span className="text-xs">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading || !content.trim()}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                isLoading || !content.trim()
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 pulse-glow'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Transforming Your Content...
                </span>
              ) : (
                'Transform Content'
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Generated Content Output */}
          {generatedContent && (
            <div className="mt-8 space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-center gradient-text">Your Transformed Content</h2>

              {generatedContent.twitter && (
                <OutputCard
                  title="Twitter/X Thread"
                  icon="𝕏"
                  content={generatedContent.twitter}
                  formatKey="twitter"
                  copiedFormat={copiedFormat}
                  onCopy={copyToClipboard}
                />
              )}

              {generatedContent.linkedin && (
                <OutputCard
                  title="LinkedIn Post"
                  icon="in"
                  content={generatedContent.linkedin}
                  formatKey="linkedin"
                  copiedFormat={copiedFormat}
                  onCopy={copyToClipboard}
                />
              )}

              {generatedContent.email && (
                <OutputCard
                  title="Email Newsletter"
                  icon="✉️"
                  content={generatedContent.email}
                  formatKey="email"
                  copiedFormat={copiedFormat}
                  onCopy={copyToClipboard}
                />
              )}

              {generatedContent.instagram && (
                <OutputCard
                  title="Instagram Caption"
                  icon="📸"
                  content={generatedContent.instagram}
                  formatKey="instagram"
                  copiedFormat={copiedFormat}
                  onCopy={copyToClipboard}
                />
              )}

              {generatedContent.youtube && (
                <OutputCard
                  title="YouTube Script Outline"
                  icon="▶️"
                  content={generatedContent.youtube}
                  formatKey="youtube"
                  copiedFormat={copiedFormat}
                  onCopy={copyToClipboard}
                />
              )}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Loved by Content Creators</h2>
          <p className="text-gray-400 text-center mb-12">Join thousands of marketers and creators saving hours every week</p>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="p-6 bg-[#111] rounded-xl border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
                <p className="text-gray-300">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-b from-transparent to-purple-900/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-400 text-center mb-12">Start free, upgrade when you need more</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="p-8 bg-[#111] rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-300">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  5 transformations per day
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All 5 content formats
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No signup required
                </li>
              </ul>
              <button className="w-full py-3 rounded-lg font-medium border border-white/20 text-white hover:bg-white/5 transition-colors">
                Current Plan
              </button>
            </div>

            {/* Pro Plan */}
            <div className="p-8 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-500/30 relative overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-xs font-medium">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">$9</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-200">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <strong>Unlimited</strong> transformations
                </li>
                <li className="flex items-center gap-2 text-gray-200">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All 5 content formats
                </li>
                <li className="flex items-center gap-2 text-gray-200">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority processing
                </li>
                <li className="flex items-center gap-2 text-gray-200">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced tone customization
                </li>
                <li className="flex items-center gap-2 text-gray-200">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Email support
                </li>
              </ul>
              <a
                href="https://buy.stripe.com/test_placeholder"
                className="block w-full py-3 rounded-lg font-medium text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity"
              >
                Upgrade to Pro
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-sm">
                CM
              </div>
              <span className="font-semibold">ContentMorph</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="text-sm text-gray-500">
              © 2024 ContentMorph. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Output Card Component
function OutputCard({
  title,
  icon,
  content,
  formatKey,
  copiedFormat,
  onCopy,
}: {
  title: string;
  icon: string;
  content: string;
  formatKey: string;
  copiedFormat: string | null;
  onCopy: (text: string, key: string) => void;
}) {
  return (
    <div className="p-6 bg-[#111] rounded-xl border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h3 className="font-semibold">{title}</h3>
        </div>
        <button
          onClick={() => onCopy(content, formatKey)}
          className={`px-4 py-2 text-sm rounded-lg transition-all ${
            copiedFormat === formatKey
              ? 'bg-green-500/20 text-green-400'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          {copiedFormat === formatKey ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">
        {content}
      </div>
    </div>
  );
}
