import React, { useState } from 'react';
import { Post } from '../types';
import { Copy, Check, Star, Trash2, RotateCcw, RefreshCw } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onReuse?: (post: Post) => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  featured?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onDelete,
  onToggleFavorite,
  onReuse,
  onRegenerate,
  isRegenerating,
  featured = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(post.generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {}
  };

  const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const toneLabel =
    post.tone === 'custom-rewrite' ? 'Rewritten'
    : post.tone === 'carousel'     ? 'Carousel'
    : post.tone.charAt(0).toUpperCase() + post.tone.slice(1).replace('-', ' ');

  return (
    <div className={featured ? 'card-featured' : 'card'} style={{ overflow: 'hidden' }}>

      {/*Header*/}
      <div
        className="flex items-start justify-between px-5 pt-4 pb-3 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="tag-brand">{toneLabel}</span>
          {post.length !== 'na' && <span className="tag">{post.length}</span>}
          {post.topic && post.tone !== 'custom-rewrite' && (
            <span className="text-[11px] truncate max-w-[260px]" style={{ color: 'var(--text-faint)' }}>
              "{post.topic}"
            </span>
          )}
        </div>
        <span className="text-[11px] shrink-0 ml-3 mt-0.5" style={{ color: 'var(--text-faint)' }}>
          {formattedDate}
        </span>
      </div>

      {/*Content body*/}
      <div className="px-5 py-5">
        <p
          className="text-[15px] leading-[1.8] whitespace-pre-wrap select-text font-normal"
          style={{ color: 'var(--text-primary)' }}
        >
          {post.generatedContent}
        </p>
      </div>

      {/* Hashtags*/}
      {post.hashtags && post.hashtags.length > 0 && (
        <div className="px-5 pb-4 flex flex-wrap gap-1.5">
          {post.hashtags.map((tag) => (
            <span key={tag} className="text-[12px] font-medium" style={{ color: '#6366F1' }}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/*Actions footer */}
      <div
        className="flex items-center justify-between px-4 py-3 border-t"
        style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}
      >
        {/* Left: icon actions */}
        <div className="flex items-center gap-0.5">
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(post._id)}
              title={post.isFavorite ? 'Unfavorite' : 'Save to favorites'}
              className={`btn btn-ghost w-8 h-8 rounded-lg p-0 transition-all ${
                post.isFavorite ? '!text-amber-500' : ''
              }`}
            >
              <Star className={`w-4 h-4 ${post.isFavorite ? 'fill-current text-amber-500' : ''}`} />
            </button>
          )}
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={isRegenerating}
              title="Regenerate"
              className="btn btn-ghost w-8 h-8 rounded-lg p-0"
            >
              <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
            </button>
          )}
          {onReuse && (
            <button
              onClick={() => onReuse(post)}
              title="Reuse prompt"
              className="btn btn-ghost w-8 h-8 rounded-lg p-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(post._id)}
              title="Delete"
              className="btn btn-ghost w-8 h-8 rounded-lg p-0 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right: copy */}
        <button
          onClick={handleCopy}
          className={`btn btn-sm rounded-lg border font-medium text-[12px] transition-all ${
            copied
              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
              : 'btn-secondary'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PostCard;
