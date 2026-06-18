import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generatePost, toggleFavoritePost } from '../api/posts';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import Toast, { ToastMessage } from '../components/Toast';
import { Sparkles, ArrowRight, TrendingUp, Code2, Brain, Zap, Rocket, Briefcase } from 'lucide-react';

const TEMPLATES = [
  { icon: TrendingUp, label: 'Career Growth',    prompt: '3 habits that transformed my career in tech' },
  { icon: Code2,      label: 'Dev Insights',      prompt: 'What I learned after 1 year of building side projects' },
  { icon: Brain,      label: 'AI & Future',       prompt: 'How AI is changing the way developers work in 2025' },
  { icon: Zap,        label: 'Productivity',      prompt: '5 productivity tools every developer should know about' },
  { icon: Rocket,     label: 'Startup Lessons',   prompt: 'Lessons learned from launching my first SaaS product' },
  { icon: Briefcase,  label: 'Job Search',        prompt: 'How I landed my dream job without applying on LinkedIn' },
];

const TONES = [
  { value: 'professional',       label: 'Professional' },
  { value: 'casual',             label: 'Casual' },
  { value: 'storytelling',       label: 'Story' },
  { value: 'thought-leadership', label: 'Thought Leader' },
];

const LENGTHS = [
  { value: 'short',  label: 'Short',  desc: '~100 words' },
  { value: 'medium', label: 'Medium', desc: '~200 words' },
  { value: 'long',   label: 'Long',   desc: '~350 words' },
];

const GeneratePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [topic, setTopic]   = useState('');
  const [tone, setTone]     = useState('professional');
  const [length, setLength] = useState('medium');
  const [generatedPost, setGeneratedPost] = useState<Post | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (msg: string, type: 'success' | 'error') =>
    setToasts((p) => [...p, { id: Date.now().toString(), message: msg, type }]);
  const removeToast = (id: string) =>
    setToasts((p) => p.filter((t) => t.id !== id));

  const generateMutation = useMutation({
    mutationFn: generatePost,
    onSuccess: (data) => {
      setGeneratedPost(data);
      addToast('Post generated!', 'success');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (err: any) =>
      addToast(err.response?.data?.message || 'Generation failed.', 'error'),
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: toggleFavoritePost,
    onSuccess: (data) => {
      if (generatedPost?._id === data._id) setGeneratedPost(data);
      addToast(data.isFavorite ? 'Saved to favorites!' : 'Removed from favorites', 'success');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleGenerate = () => {
    if (!topic.trim()) { addToast('Enter a topic first', 'error'); return; }
    generateMutation.mutate({ topic, tone, length });
  };

  const isLoading = generateMutation.isPending;

  return (
    <div className="max-w-[720px] mx-auto px-5 py-12 animate-fade-in">

      {/* Hero  */}
      <div className="text-center mb-12">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 border"
          style={{ background: 'rgba(99,102,241,0.07)', borderColor: 'rgba(99,102,241,0.2)', color: '#6366F1' }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Powered by Gemini AI
        </div>

        <h1
          className="text-[2.6rem] font-bold tracking-tight leading-[1.15] mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Create LinkedIn content<br />
          <span className="gradient-text">that gets attention.</span>
        </h1>

        <p className="text-base leading-relaxed max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
          Generate engaging posts, rewrite drafts, and build carousel outlines — powered by AI in seconds.
        </p>
      </div>

      {/* ── Creator Card ── */}
      <div className="card p-6 mb-8">

        {/* Topic */}
        <div className="mb-5">
          <label
            className="block text-[11px] font-bold uppercase tracking-widest mb-2"
            style={{ color: 'var(--text-faint)' }}
          >
            What do you want to write about?
          </label>
          <textarea
            className="input-base min-h-[96px] text-[15px] leading-relaxed"
            placeholder="E.g., 3 lessons I learned shipping my first product to real users..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isLoading}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleGenerate();
            }}
          />
        </div>

        {/* Tone pills */}
        <div className="mb-5">
          <label
            className="block text-[11px] font-bold uppercase tracking-widest mb-2"
            style={{ color: 'var(--text-faint)' }}
          >
            Tone
          </label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                key={t.value}
                onClick={() => setTone(t.value)}
                disabled={isLoading}
                className={`btn btn-sm rounded-full border font-medium text-[13px] transition-all ${
                  tone === t.value
                    ? 'bg-brand text-white border-brand shadow-[0_2px_10px_rgba(99,102,241,0.25)]'
                    : 'btn-secondary'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Length */}
        <div className="mb-6">
          <label
            className="block text-[11px] font-bold uppercase tracking-widest mb-2"
            style={{ color: 'var(--text-faint)' }}
          >
            Length
          </label>
          <div className="grid grid-cols-3 gap-2">
            {LENGTHS.map((l) => (
              <button
                key={l.value}
                onClick={() => setLength(l.value)}
                disabled={isLoading}
                className={`py-2.5 rounded-xl border text-center transition-all ${
                  length === l.value
                    ? 'border-brand/50 bg-brand/8 dark:bg-brand/10'
                    : 'border-transparent bg-surface-2 hover:border-theme-strong'
                }`}
                style={
                  length !== l.value
                    ? { background: 'var(--surface-2)', borderColor: 'var(--border)' }
                    : {}
                }
              >
                <span
                  className={`block text-[13px] font-semibold ${length === l.value ? 'text-brand' : ''}`}
                  style={length !== l.value ? { color: 'var(--text-primary)' } : {}}
                >
                  {l.label}
                </span>
                <span className="block text-[11px] mt-0.5" style={{ color: 'var(--text-faint)' }}>
                  {l.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleGenerate}
          disabled={isLoading || !topic.trim()}
          className="btn btn-primary btn-lg w-full"
        >
          {isLoading ? (
            <>
              <span className="spinner w-4 h-4" />
              Generating with Gemini...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Post
              <ArrowRight className="w-4 h-4 ml-auto" />
            </>
          )}
        </button>

        <p className="text-center text-[11px] mt-2.5" style={{ color: 'var(--text-faint)' }}>
          Press <kbd
            className="px-1.5 py-0.5 rounded text-[10px] font-mono border"
            style={{ background: 'var(--surface-2)', borderColor: 'var(--border-strong)' }}
          >⌘ Enter</kbd> to generate
        </p>
      </div>

      {/* ── Loading skeleton ── */}
      {isLoading && (
        <div className="card p-6 mb-8 animate-pulse">
          <div className="flex items-center gap-2 mb-5">
            <div className="shimmer-line w-5 h-5 rounded-lg" />
            <div className="shimmer-line w-32" />
          </div>
          <div className="space-y-2.5">
            {[100, 88, 95, 80, 92, 75].map((w, i) => (
              <div key={i} className="shimmer-line" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      )}

      {/* ── Generated output ── */}
      {!isLoading && generatedPost && (
        <div className="animate-slide-up mb-8">
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-[11px] font-bold uppercase tracking-widest"
              style={{ color: 'var(--text-faint)' }}
            >
              Generated Post
            </span>
          </div>
          <PostCard
            post={generatedPost}
            onToggleFavorite={(id) => toggleFavoriteMutation.mutate(id)}
            onRegenerate={handleGenerate}
            isRegenerating={isLoading}
            featured
          />
        </div>
      )}

      {/* ── Empty state: templates ── */}
      {!isLoading && !generatedPost && (
        <div className="mb-8">
          <p
            className="text-[11px] font-bold uppercase tracking-widest mb-3"
            style={{ color: 'var(--text-faint)' }}
          >
            Popular Templates
          </p>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map(({ icon: Icon, label, prompt }) => (
              <button
                key={label}
                onClick={() => setTopic(prompt)}
                className="template-chip"
              >
                <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: '#6366F1' }} />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default GeneratePage;
