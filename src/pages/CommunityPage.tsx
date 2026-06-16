import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Calendar, Crown, Edit2, Trash2, ArrowLeft, ScrollText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCommunity, useCommunities } from '../hooks/useCommunities';
import { usePosts } from '../hooks/usePosts';
import { PostCard } from '../components/post/PostCard';
import { CreatePostForm } from '../components/post/CreatePostForm';
import { CreateCommunityModal } from '../components/community/CreateCommunityModal';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PostSkeleton } from '../components/ui/Skeleton';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const CommunityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { community, loading: communityLoading, setCommunity } = useCommunity(id!);
  const { joinCommunity, leaveCommunity, deleteCommunity } = useCommunities();
  const { posts, loading: postsLoading, createPost, deletePost, toggleLike } = usePosts(id);
  const [showEdit, setShowEdit] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'about'>('feed');

  const isOwner = user?.id === community?.creator_id;
  const isMember = community?.is_member;

  const handleJoin = async () => {
    if (!id) return;
    await joinCommunity(id);
    setCommunity(prev => prev ? { ...prev, is_member: true, members_count: prev.members_count + 1 } : prev);
    toast.success('Você entrou na comunidade!');
  };

  const handleLeave = async () => {
    if (!id) return;
    await leaveCommunity(id);
    setCommunity(prev => prev ? { ...prev, is_member: false, members_count: Math.max(0, prev.members_count - 1) } : prev);
    toast.success('Você saiu da comunidade.');
  };

  const handleDelete = async () => {
    if (!id || !confirm('Tem certeza que deseja excluir esta comunidade?')) return;
    const { error } = await deleteCommunity(id);
    if (!error) {
      toast.success('Comunidade excluída.');
      navigate('/communities');
    }
  };

  if (communityLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="skeleton h-40 rounded-2xl mb-4" />
        <div className="space-y-3">
          <div className="skeleton h-6 w-1/2" />
          <div className="skeleton h-4 w-full" />
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 text-lg">Comunidade não encontrada</p>
        <button onClick={() => navigate('/communities')} className="text-cyan-400 mt-2 text-sm">
          Voltar para comunidades
        </button>
      </div>
    );
  }

  const categoryEmojis: Record<string, string> = {
    tecnologia: '💻', musica: '🎵', arte: '🎨', games: '🎮',
    fitness: '💪', culinaria: '🍳', viagens: '✈️', moda: '👗',
    ciencia: '🔬', humor: '😂', outros: '🌐',
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 lg:py-0">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      {/* Cover */}
      <div className="relative rounded-2xl overflow-hidden mb-4">
        <div className="h-40 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 flex items-center justify-center">
          {community.image_url ? (
            <img src={community.image_url} alt={community.title} className="w-full h-full object-cover absolute inset-0" />
          ) : null}
          <span className="text-6xl relative z-10">
            {categoryEmojis[community.category] || '🌐'}
          </span>
        </div>
        
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <Badge
            variant={community.status === 'featured' ? 'purple' : community.status === 'active' ? 'green' : 'slate'}
          >
            {community.status === 'featured' ? '⭐ Destaque' : community.status === 'active' ? '✅ Ativo' : '🔒 Encerrado'}
          </Badge>
        </div>
      </div>

      {/* Community info */}
      <div className="bg-[#131629] border border-[#2a2f52] rounded-2xl p-5 mb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white mb-1">{community.title}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="cyan" size="sm">{community.category}</Badge>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Users className="w-3.5 h-3.5" />
                {community.members_count.toLocaleString()} membros
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                {formatDistanceToNow(new Date(community.created_at), { addSuffix: true, locale: ptBR })}
              </div>
              {community.creator && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Crown className="w-3.5 h-3.5 text-yellow-400" />
                  @{community.creator.username}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            {isOwner && (
              <>
                <Button variant="ghost" size="sm" icon={<Edit2 className="w-4 h-4" />} onClick={() => setShowEdit(true)}>
                  Editar
                </Button>
                <Button variant="danger" size="sm" icon={<Trash2 className="w-4 h-4" />} onClick={handleDelete}>
                  Excluir
                </Button>
              </>
            )}
            {user && !isOwner && (
              isMember ? (
                <Button variant="outline" size="sm" onClick={handleLeave}>Sair</Button>
              ) : (
                community.status !== 'ended' && (
                  <Button variant="cyan" size="sm" onClick={handleJoin}>Participar</Button>
                )
              )
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[#2a2f52] mb-4">
        {(['feed', 'about'] as const).map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === t
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t === 'feed' ? '📝 Feed' : '📋 Sobre'}
          </button>
        ))}
      </div>

      {activeTab === 'feed' ? (
        <div className="space-y-4">
          {/* Create post */}
          {isMember && user && (
            <CreatePostForm
              onSubmit={createPost}
              communityId={id}
              placeholder={`Publicar em ${community.title}...`}
            />
          )}

          {/* Posts */}
          {postsLoading ? (
            Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">Nenhuma publicação ainda.</p>
              {isMember && <p className="text-sm text-slate-500 mt-1">Seja o primeiro a publicar!</p>}
            </div>
          ) : (
            posts.map(post => (
              <PostCard key={post.id} post={post} onLike={toggleLike} onDelete={deletePost} />
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Description */}
          <div className="bg-[#131629] border border-[#2a2f52] rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <span>📝</span> Sobre
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">{community.description}</p>
          </div>

          {/* Rules */}
          {community.rules && (
            <div className="bg-[#131629] border border-[#2a2f52] rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-cyan-400" />
                Regras
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{community.rules}</p>
            </div>
          )}
        </div>
      )}

      {showEdit && (
        <CreateCommunityModal
          isOpen={showEdit}
          onClose={() => setShowEdit(false)}
          community={community}
        />
      )}
    </div>
  );
};
