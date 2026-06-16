import React, { useState, useEffect } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '../../services/supabaseClient';
import { Comment } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface CommentsPanelProps {
  postId: string;
}

export const CommentsPanel: React.FC<CommentsPanelProps> = ({ postId }) => {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('comments')
        .select('*, author:profiles!comments_author_id_fkey(id, username, full_name, avatar_url)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      setComments(data || []);
      setLoading(false);
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !text.trim()) return;
    
    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({ content: text.trim(), author_id: user.id, post_id: postId })
        .select('*, author:profiles!comments_author_id_fkey(id, username, full_name, avatar_url)')
        .single();

      if (!error && data) {
        setComments(prev => [...prev, data]);
        await supabase
          .from('posts')
          .update({ comments_count: comments.length + 1 })
          .eq('id', postId);
        setText('');
        toast.success('Comentário publicado!');
      } else {
        toast.error('Erro ao publicar comentário');
      }
    } catch (err) {
      toast.error('Erro ao publicar comentário');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await supabase.from('comments').delete().eq('id', commentId).eq('author_id', user?.id);
      setComments(prev => prev.filter(c => c.id !== commentId));
      await supabase
        .from('posts')
        .update({ comments_count: Math.max(0, comments.length - 1) })
        .eq('id', postId);
      toast.success('Comentário removido');
    } catch (err) {
      toast.error('Erro ao remover comentário');
    }
  };

  return (
    <div className="border-t border-[#2a2f52] bg-[#0f122a]/50">
      {/* Comments list */}
      <div className="max-h-72 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-sm text-slate-500">Carregando comentários...</div>
        ) : comments.length === 0 ? (
          <div className="p-4 text-center text-sm text-slate-500">Nenhum comentário ainda. Seja o primeiro!</div>
        ) : (
          <div className="divide-y divide-[#2a2f52]/50">
            {comments.map(comment => (
              <div key={comment.id} className="flex items-start gap-3 p-4">
                <Link to={`/profile/${comment.author?.username}`}>
                  <Avatar src={comment.author?.avatar_url} size="sm" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      to={`/profile/${comment.author?.username}`}
                      className="text-xs font-semibold text-white hover:text-cyan-400 transition-colors"
                    >
                      {comment.author?.full_name}
                    </Link>
                    <span className="text-xs text-slate-500">@{comment.author?.username}</span>
                    <span className="text-xs text-slate-500">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ptBR })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 mt-1 break-words">{comment.content}</p>
                </div>
                {user?.id === comment.author_id && (
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      {user && (
        <form onSubmit={handleSubmit} className="flex items-center gap-3 p-4 border-t border-[#2a2f52]/50">
          <Avatar src={profile?.avatar_url} size="sm" />
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Adicionar comentário..."
            className="nexus-input flex-1 py-2 text-sm"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!text.trim() || submitting}
            className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
};
