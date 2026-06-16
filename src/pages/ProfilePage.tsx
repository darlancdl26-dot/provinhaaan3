import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit2, Camera, Users, UserCheck, Calendar, ArrowLeft, Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useProfile } from '../hooks/useProfile';
import { usePosts } from '../hooks/usePosts';
import { PostCard } from '../components/post/PostCard';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { PostSkeleton } from '../components/ui/Skeleton';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';
import { useConversations } from '../hooks/useMessages';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user, profile: currentProfile, updateProfile } = useAuth();
  const { profile, loading, followersCount, followingCount, isFollowing, toggleFollow } = useProfile(username);
  const { posts, loading: postsLoading, deletePost, toggleLike } = usePosts(undefined, profile?.id);
  const { createOrGetConversation } = useConversations();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: '', bio: '' });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isOwn = user?.id === profile?.id;

  const handleEdit = () => {
    setEditForm({ full_name: profile?.full_name || '', bio: profile?.bio || '' });
    setIsEditing(true);
  };

  const handleSave = async () => {
    const { error } = await updateProfile(editForm);
    if (error) {
      toast.error('Erro ao salvar perfil');
    } else {
      toast.success('Perfil atualizado!');
      setIsEditing(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `avatars/${user.id}.${ext}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      
      const { error: updateError } = await updateProfile({ avatar_url: publicUrl });
      if (updateError) throw updateError;
      
      toast.success('Foto atualizada!');
    } catch {
      toast.error('Erro ao fazer upload');
    } finally {
      setUploading(false);
    }
  };

  const handleMessage = async () => {
    if (!profile) return;
    const convId = await createOrGetConversation(profile.id);
    if (convId) navigate(`/messages?conv=${convId}`);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="skeleton h-40 rounded-2xl mb-6" />
        <div className="flex items-end gap-4 -mt-10 mb-6 px-4">
          <div className="skeleton w-24 h-24 rounded-full" />
        </div>
        <div className="space-y-3 px-4">
          <div className="skeleton h-6 w-40" />
          <div className="skeleton h-4 w-28" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 text-lg">Usuário não encontrado</p>
        <button onClick={() => navigate(-1)} className="text-cyan-400 mt-2 text-sm">Voltar</button>
      </div>
    );
  }

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

      {/* Profile card */}
      <div className="bg-[#131629] border border-[#2a2f52] rounded-2xl overflow-hidden mb-4">
        {/* Cover */}
        <div className="h-36 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/30 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#131629]/60 to-transparent" />
        </div>

        {/* Avatar & actions */}
        <div className="px-5 pb-5">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="relative">
              <Avatar
                src={isOwn ? currentProfile?.avatar_url : profile.avatar_url}
                size="2xl"
                ring
              />
              {isOwn && (
                <>
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-1 right-1 w-8 h-8 bg-[#1a1f3a] border-2 border-[#0F122A] rounded-full flex items-center justify-center hover:bg-cyan-500/20 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-slate-300" />
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </>
              )}
            </div>

            <div className="flex gap-2 pb-1">
              {isOwn ? (
                isEditing ? (
                  <>
                    <Button variant="ghost" size="sm" icon={<X className="w-4 h-4" />} onClick={() => setIsEditing(false)}>Cancelar</Button>
                    <Button variant="cyan" size="sm" icon={<Check className="w-4 h-4" />} onClick={handleSave}>Salvar</Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" icon={<Edit2 className="w-4 h-4" />} onClick={handleEdit}>
                    Editar perfil
                  </Button>
                )
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMessage}
                  >
                    Mensagem
                  </Button>
                  <Button
                    variant={isFollowing ? 'outline' : 'cyan'}
                    size="sm"
                    onClick={toggleFollow}
                    icon={isFollowing ? <UserCheck className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                  >
                    {isFollowing ? 'Seguindo' : 'Seguir'}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Info */}
          {isEditing ? (
            <div className="space-y-3 mb-4">
              <input
                value={editForm.full_name}
                onChange={e => setEditForm(p => ({ ...p, full_name: e.target.value }))}
                placeholder="Nome completo"
                className="nexus-input text-sm"
                maxLength={60}
              />
              <textarea
                value={editForm.bio}
                onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))}
                placeholder="Bio (opcional)"
                className="nexus-input text-sm resize-none"
                rows={3}
                maxLength={200}
              />
            </div>
          ) : (
            <div className="mb-4">
              <h1 className="text-xl font-bold text-white">{profile.full_name}</h1>
              <p className="text-slate-500 text-sm">@{profile.username}</p>
              {profile.bio && (
                <p className="text-slate-300 text-sm mt-2 leading-relaxed">{profile.bio}</p>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-lg font-bold text-white">{posts.length}</p>
              <p className="text-xs text-slate-500">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">{followersCount}</p>
              <p className="text-xs text-slate-500">Seguidores</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">{followingCount}</p>
              <p className="text-xs text-slate-500">Seguindo</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 ml-auto">
              <Calendar className="w-3.5 h-3.5" />
              Desde {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true, locale: ptBR })}
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          Publicações
        </h2>
        <div className="space-y-4">
          {postsLoading ? (
            Array.from({ length: 2 }).map((_, i) => <PostSkeleton key={i} />)
          ) : posts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-400">Nenhuma publicação ainda</p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard key={post.id} post={post} onLike={toggleLike} onDelete={deletePost} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
