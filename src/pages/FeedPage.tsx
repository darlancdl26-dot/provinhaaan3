import React from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useFeedPosts } from '../hooks/usePosts';
import { PostCard } from '../components/post/PostCard';
import { CreatePostForm } from '../components/post/CreatePostForm';
import { PostSkeleton } from '../components/ui/Skeleton';
import { usePosts } from '../hooks/usePosts';
import { useAuth } from '../contexts/AuthContext';

export const FeedPage: React.FC = () => {
  const { user } = useAuth();
  const { posts, loading, toggleLike, deletePost, refetch } = useFeedPosts();
  const { createPost } = usePosts();

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 lg:py-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-white">Seu Feed</h1>
        </div>
        <button
          onClick={refetch}
          className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-cyan-400 transition-colors"
          title="Atualizar feed"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Create post */}
      {user && (
        <div className="mb-6">
          <CreatePostForm onSubmit={createPost} />
        </div>
      )}

      {/* Posts */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
        ) : posts.length === 0 ? (
          <EmptyFeed />
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onLike={toggleLike}
              onDelete={deletePost}
            />
          ))
        )}
      </div>
    </div>
  );
};

const EmptyFeed: React.FC = () => (
  <div className="text-center py-16">
    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
      <Sparkles className="w-10 h-10 text-cyan-400" />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">Seu feed está vazio</h3>
    <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6">
      Siga usuários e participe de comunidades para ver conteúdo aqui!
    </p>
    <div className="flex flex-col gap-3 items-center">
      <a
        href="/explore"
        className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-semibold"
      >
        🔍 Explorar usuários
      </a>
      <a
        href="/communities"
        className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-semibold"
      >
        👥 Descobrir comunidades
      </a>
    </div>
  </div>
);
