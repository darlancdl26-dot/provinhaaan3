import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Trash2, MoreHorizontal, Play, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Post } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Modal } from '../ui/Modal';
import { supabase } from '../../services/supabaseClient';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { CommentsPanel } from './CommentsPanel';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onDelete }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showLikers, setShowLikers] = useState(false);
  const [likers, setLikers] = useState<Array<{ user_id: string; created_at: string; user?: { id: string; username?: string; full_name?: string; avatar_url?: string } }>>([]);
  const [loadingLikers, setLoadingLikers] = useState(false);

  const isOwner = user?.id === post.author_id;
  const [showLikes, setShowLikes] = useState<boolean>(post.show_likes ?? true);

  const handleLike = () => {
    setLiked(prev => !prev);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
    onLike?.(post.id);
  };

  const fetchLikers = async () => {
    setLoadingLikers(true);
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('created_at, user:profiles(id, username, full_name, avatar_url, id)')
        .eq('post_id', post.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setLikers(data || []);
    } catch (err) {
      console.error('Error fetching likers:', err);
      setLikers([]);
    } finally {
      setLoadingLikers(false);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <article className="bg-[#131629] border border-[#2a2f52] rounded-2xl overflow-hidden card-hover animate-fade-in">
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.author?.username}`}>
              <Avatar
                src={post.author?.avatar_url}
                alt={post.author?.full_name}
                size="md"
                ring
              />
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  to={`/profile/${post.author?.username}`}
                  className="font-semibold text-white hover:text-cyan-400 transition-colors text-sm"
                >
                  {post.author?.full_name}
                </Link>
                <span className="text-slate-500 text-xs">@{post.author?.username}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-xs text-slate-500">{timeAgo}</span>
                {post.community && (
                  <>
                    <span className="text-slate-600 text-xs">•</span>
                    <Link to={`/community/${post.community.id}`}>
                      <Badge variant="cyan" size="sm">
                        {post.community.title}
                      </Badge>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 bg-[#1a1f3a] border border-[#2a2f52] rounded-xl shadow-xl z-10 min-w-[140px] py-1 animate-fade-in">
                {isOwner && (
                  <button
                    onClick={async () => {
                      // toggle show_likes on the post
                      const newVal = !showLikes;
                      setShowLikes(newVal);
                      try {
                        await supabase.from('posts').update({ show_likes: newVal }).eq('id', post.id);
                      } catch (err) {
                        console.error('Error updating show_likes:', err);
                        setShowLikes(!newVal);
                      }
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors"
                  >
                    {showLikes ? 'Ocultar contagem' : 'Mostrar contagem'}
                  </button>
                )}
                {isOwner && (
                  <button
                    onClick={() => {
                      onDelete?.(post.id);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </button>
                )}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Copiar link
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        {post.content && (
          <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        )}
      </div>

      {/* Media */}
      {post.media_url && post.type === 'image' && (
        <div className="px-4 pb-3">
          <div className="rounded-xl overflow-hidden">
            <img
              src={post.media_url}
              alt="Post"
              className="w-full h-auto max-h-[80vh] object-contain"
              style={{ display: 'block' }}
              loading="lazy"
            />
          </div>
        </div>
      )}

      {post.media_url && post.type === 'video' && (
        <div className="px-4 pb-3">
          <div className="rounded-xl overflow-hidden bg-black">
            <video
              src={post.media_url}
              controls
              className="w-full h-auto max-h-[80vh] bg-black"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 border-t border-[#2a2f52] flex items-center gap-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-all duration-200 ${
            liked 
              ? 'text-red-400' 
              : 'text-slate-400 hover:text-red-400'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-all duration-200 ${liked ? 'fill-red-400 scale-110' : ''}`}
          />
          {showLikes && <span className="font-medium">{likesCount}</span>}
        </button>

        {isOwner && (
          <button
            onClick={async () => {
              setShowLikers(true);
              await fetchLikers();
            }}
            className="text-xs text-slate-400 hover:text-slate-200 ml-2"
          >
            Ver quem curtiu
          </button>
        )}

        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            showComments ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-400'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="font-medium">{post.comments_count}</span>
        </button>

        <button
          onClick={() => navigator.share?.({ url: window.location.href })}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-purple-400 transition-colors ml-auto"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <CommentsPanel postId={post.id} />
      )}

      <Modal isOpen={showLikers} onClose={() => setShowLikers(false)} title={`Curtidas (${likesCount})`} size="sm">
        {loadingLikers ? (
          <div className="text-sm text-slate-400">Carregando...</div>
        ) : likers.length === 0 ? (
          <div className="text-sm text-slate-400">Nenhuma curtida ainda</div>
        ) : (
          <ul className="space-y-3">
            {likers.map(l => (
              <li key={l.user_id + l.created_at} className="flex items-center gap-3">
                <Avatar src={l.user?.avatar_url} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{l.user?.full_name}</div>
                  <div className="text-xs text-slate-500 truncate">@{l.user?.username}</div>
                </div>
                <div className="text-xs text-slate-500">{new Date(l.created_at).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </article>
  );
};
