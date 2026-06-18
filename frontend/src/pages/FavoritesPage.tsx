import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, deletePost, toggleFavoritePost } from '../api/posts';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import Toast, { ToastMessage } from '../components/Toast';
import { Star, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FavoritesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate    = useNavigate();
  const [search, setSearch] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts', search, true],
    queryFn: () => getPosts(search, true),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: (response) => {
      addToast(response.message, 'success');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: () => addToast('Failed to delete post.', 'error'),
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: toggleFavoritePost,
    onSuccess: (data) => {
      addToast(data.isFavorite ? 'Saved to favorites' : 'Removed from favorites', 'success');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleReuse = (post: Post) => navigate('/', { state: { reusePost: post } });

  return (
    <div className="max-w-[720px] mx-auto px-5 py-12 animate-fade-in">
      {/* ── Header ── */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full tag mb-4" style={{ background: 'rgba(245, 158, 11, 0.08)', borderColor: 'rgba(245, 158, 11, 0.15)' }}>
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span style={{ color: 'var(--text-muted)' }} className="text-xs font-semibold">Saved Posts</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
          Favorites
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Posts you've saved for quick access. Star any post to add it here.
        </p>
      </div>

      {/* ── Search ── */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-faint)' }} />
        <input
          type="text"
          className="input-base pl-11 h-11"
          placeholder="Search your favorites..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Content*/}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader size="large" />
        </div>
      ) : posts.length > 0 ? (
        <div className="flex flex-col gap-4">
          <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>
            {posts.length} saved post{posts.length !== 1 ? 's' : ''}
          </p>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={(id) => deleteMutation.mutate(id)}
              onToggleFavorite={(id) => toggleFavoriteMutation.mutate(id)}
              onReuse={handleReuse}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 card p-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex items-center justify-center mx-auto mb-4">
            <Star className="w-5 h-5 text-amber-500/50" />
          </div>
          <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            {search ? 'No favorites match your search' : 'No favorites yet'}
          </p>
          <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
            {search
              ? 'Try a different search term'
              : 'Star any generated post to save it here for quick access.'}
          </p>
          {!search && (
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary btn-md"
            >
              Generate a Post
            </button>
          )}
        </div>
      )}

      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default FavoritesPage;
