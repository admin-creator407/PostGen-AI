import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateCarousel, toggleFavoritePost } from '../api/posts';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import Toast, { ToastMessage } from '../components/Toast';
import { GalleryHorizontal, ArrowRight, LayoutList } from 'lucide-react';

const CAROUSEL_EXAMPLES = [
  'CSS Grid vs Flexbox: When to use what',
  '5 steps to ace your next technical interview',
  'The product development lifecycle explained',
  'How to build a personal brand on LinkedIn',
  'React hooks every developer should know',
];

const CarouselPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [topic, setTopic]           = useState('');
  const [carouselPost, setCarouselPost] = useState<Post | null>(null);
  const [toasts, setToasts]         = useState<ToastMessage[]>([]);

  const addToast = (msg: string, type: 'success' | 'error') =>
    setToasts((p) => [...p, { id: Date.now().toString(), message: msg, type }]);
  const removeToast = (id: string) =>
    setToasts((p) => p.filter((t) => t.id !== id));

  const carouselMutation = useMutation({
    mutationFn: generateCarousel,
    onSuccess: (data) => {
      setCarouselPost(data);
      addToast('Carousel outline generated!', 'success');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (err: any) =>
      addToast(err.response?.data?.message || 'Generation failed.', 'error'),
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: toggleFavoritePost,
    onSuccess: (data) => {
      if (carouselPost?._id === data._id) setCarouselPost(data);
      addToast(data.isFavorite ? 'Saved to favorites!' : 'Removed from favorites', 'success');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleGenerate = () => {
    if (!topic.trim()) { addToast('Enter a carousel topic', 'error'); return; }
    carouselMutation.mutate(topic);
  };

  const isLoading = carouselMutation.isPending;

  return (
    <div className="max-w-[720px] mx-auto px-5 py-12 animate-fade-in">

      {/* Hero  */}
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 border"
          style={{ background: 'rgba(14,165,233,0.07)', borderColor: 'rgba(14,165,233,0.2)', color: '#0EA5E9' }}
        >
          <GalleryHorizontal className="w-3.5 h-3.5" />
          Carousel Builder
        </div>
        <h1
          className="text-[2.4rem] font-bold tracking-tight leading-[1.18] mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Build slide-by-slide carousel<br />
          <span className="gradient-text">outlines in seconds.</span>
        </h1>
        <p className="text-base leading-relaxed max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
          Generate structured LinkedIn carousel content with hooks, slides, and CTAs — ready to design.
        </p>
      </div>

      {/* Input card  */}
      <div className="card p-6 mb-6">
        <label
          className="block text-[11px] font-bold uppercase tracking-widest mb-2"
          style={{ color: 'var(--text-faint)' }}
        >
          Carousel Topic / Concept
        </label>
        <textarea
          className="input-base min-h-[100px] text-[15px] leading-relaxed mb-4"
          placeholder="E.g., 5 steps to ace your next technical interview..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={isLoading}
        />

        {/* Example topics */}
        {!topic && (
          <div className="mb-4">
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{ color: 'var(--text-faint)' }}
            >
              Example topics
            </p>
            <div className="flex flex-col gap-1.5">
              {CAROUSEL_EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setTopic(ex)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-left transition-all"
                  style={{
                    background: 'var(--surface-2)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-muted)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                  }}
                >
                  <LayoutList className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-faint)' }} />
                  <span className="text-[13px] font-medium">{ex}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isLoading || !topic.trim()}
          className="btn btn-primary btn-lg w-full"
        >
          {isLoading ? (
            <>
              <span className="spinner w-4 h-4" />
              Building carousel...
            </>
          ) : (
            <>
              <GalleryHorizontal className="w-4 h-4" />
              Generate Carousel
              <ArrowRight className="w-4 h-4 ml-auto" />
            </>
          )}
        </button>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="card p-6 mb-6 animate-pulse">
          <div className="space-y-2.5">
            {[100, 85, 92, 78, 88, 70].map((w, i) => (
              <div key={i} className="shimmer-line" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      )}

      {/* Carousel output */}
      {!isLoading && carouselPost && (
        <div className="animate-slide-up mb-6">
          <p
            className="text-[11px] font-bold uppercase tracking-widest mb-3"
            style={{ color: 'var(--text-faint)' }}
          >
            Carousel Outline
          </p>
          <PostCard
            post={carouselPost}
            onToggleFavorite={(id) => toggleFavoriteMutation.mutate(id)}
            onRegenerate={handleGenerate}
            isRegenerating={isLoading}
            featured
          />
        </div>
      )}

      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default CarouselPage;
