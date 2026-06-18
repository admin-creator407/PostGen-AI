import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rewritePost, toggleFavoritePost } from '../api/posts';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import Toast, { ToastMessage } from '../components/Toast';
import { PenLine, ArrowRight, Lightbulb } from 'lucide-react';

const REWRITE_TIPS = [
  'Make it more engaging with a strong hook',
  'Simplify and make it conversational',
  'Add a clear call-to-action at the end',
  'Structure with bullet points for readability',
];

const RewritePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [draft, setDraft]               = useState('');
  const [rewrittenPost, setRewrittenPost] = useState<Post | null>(null);
  const [toasts, setToasts]             = useState<ToastMessage[]>([]);

  const addToast = (msg: string, type: 'success' | 'error') =>
    setToasts((p) => [...p, { id: Date.now().toString(), message: msg, type }]);
  const removeToast = (id: string) =>
    setToasts((p) => p.filter((t) => t.id !== id));

  const rewriteMutation = useMutation({
    mutationFn: rewritePost,
    onSuccess: (data) => {
      setRewrittenPost(data);
      addToast('Post rewritten!', 'success');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (err: any) =>
      addToast(err.response?.data?.message || 'Rewrite failed.', 'error'),
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: toggleFavoritePost,
    onSuccess: (data) => {
      if (rewrittenPost?._id === data._id) setRewrittenPost(data);
      addToast(data.isFavorite ? 'Saved to favorites!' : 'Removed from favorites', 'success');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleRewrite = () => {
    if (!draft.trim()) { addToast('Paste a draft to rewrite', 'error'); return; }
    rewriteMutation.mutate(draft);
  };

  const isLoading = rewriteMutation.isPending;

  return (
    <div className="max-w-[720px] mx-auto px-5 py-12 animate-fade-in">

      {/* Hero */}
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 border"
          style={{ background: 'rgba(139,92,246,0.07)', borderColor: 'rgba(139,92,246,0.2)', color: '#8B5CF6' }}
        >
          <PenLine className="w-3.5 h-3.5" />
          AI Rewriter
        </div>
        <h1
          className="text-[2.4rem] font-bold tracking-tight leading-[1.18] mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Transform rough drafts into<br />
          <span className="gradient-text">polished LinkedIn posts.</span>
        </h1>
        <p className="text-base leading-relaxed max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
          Paste your existing draft or rough notes. AI will restructure, enhance, and make it LinkedIn-ready.
        </p>
      </div>

      {/*  Input card */}
      <div className="card p-6 mb-6">
        <label
          className="block text-[11px] font-bold uppercase tracking-widest mb-2"
          style={{ color: 'var(--text-faint)' }}
        >
          Your draft
        </label>
        <textarea
          className="input-base min-h-[160px] text-[15px] leading-relaxed mb-4"
          placeholder="Paste your rough draft here... even bullet points or messy notes work great."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={isLoading}
        />

        {/* Tips — only when empty */}
        {!draft && (
          <div
            className="mb-4 p-4 rounded-xl border"
            style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center gap-1.5 mb-2.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: 'var(--text-faint)' }}
              >
                Try rewriting to...
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {REWRITE_TIPS.map((tip) => (
                <button
                  key={tip}
                  onClick={() => setDraft(tip + '\n\n[Paste your content below]\n')}
                  className="template-chip text-[12px]"
                >
                  {tip}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleRewrite}
          disabled={isLoading || !draft.trim()}
          className="btn btn-primary btn-lg w-full"
        >
          {isLoading ? (
            <>
              <span className="spinner w-4 h-4" />
              Rewriting...
            </>
          ) : (
            <>
              <PenLine className="w-4 h-4" />
              Rewrite Draft
              <ArrowRight className="w-4 h-4 ml-auto" />
            </>
          )}
        </button>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="card p-6 mb-6 animate-pulse">
          <div className="space-y-2.5">
            {[100, 88, 94, 76, 90].map((w, i) => (
              <div key={i} className="shimmer-line" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      )}

      {/* Rewritten output  */}
      {!isLoading && rewrittenPost && (
        <div className="animate-slide-up mb-6">
          <p
            className="text-[11px] font-bold uppercase tracking-widest mb-3"
            style={{ color: 'var(--text-faint)' }}
          >
            Rewritten Post
          </p>
          <PostCard
            post={rewrittenPost}
            onToggleFavorite={(id) => toggleFavoriteMutation.mutate(id)}
            onRegenerate={handleRewrite}
            isRegenerating={isLoading}
            featured
          />
        </div>
      )}

      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default RewritePage;
