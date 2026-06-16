import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Users, FileText, Hash } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { Profile, Community, Post } from '../types';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { PostCard } from '../components/post/PostCard';
import { useFeedPosts } from '../hooks/usePosts';

type Tab = 'posts' | 'users' | 'communities';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [tab, setTab] = useState<Tab>('posts');
  const [searchQuery, setSearchQuery] = useState(query);
  const [users, setUsers] = useState<Profile[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const { toggleLike } = useFeedPosts();

  useEffect(() => {
    setSearchQuery(query);
    if (query) search(query);
    else loadRecent();
  }, [query]);

  const loadRecent = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('posts')
      .select('*, author:profiles!posts_author_id_fkey(*), community:communities(id, title, image_url, category)')
      .order('created_at', { ascending: false })
      .limit(20);
    setPosts(data || []);
    setLoading(false);
  };

  const search = async (q: string) => {
    setLoading(true);
    try {
      const [usersRes, communitiesRes, postsRes] = await Promise.all([
        supabase.from('profiles').select('*')
          .or(`username.ilike.%${q}%,full_name.ilike.%${q}%`).limit(10),
        supabase.from('communities').select('*')
          .or(`title.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%`).limit(10),
        supabase.from('posts')
          .select('*, author:profiles!posts_author_id_fkey(*), community:communities(id, title, image_url, category)')
          .ilike('content', `%${q}%`)
          .order('created_at', { ascending: false })
          .limit(20),
      ]);
      setUsers(usersRes.data || []);
      setCommunities(communitiesRes.data || []);
      setPosts(postsRes.data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    } else {
      setSearchParams({});
      loadRecent();
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'posts', label: 'Posts', icon: <FileText className="w-4 h-4" />, count: posts.length },
    { id: 'users', label: 'Usuários', icon: <Users className="w-4 h-4" />, count: users.length },
    { id: 'communities', label: 'Comunidades', icon: <Hash className="w-4 h-4" />, count: communities.length },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 lg:py-0">
      <div className="flex items-center gap-2 mb-6">
        <Search className="w-5 h-5 text-cyan-400" />
        <h1 className="text-xl font-bold text-white">Explorar</h1>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar posts, usuários, comunidades..."
            className="nexus-input pl-12 py-3 text-base"
          />
          {searchQuery && (
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-cyan-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium"
            >
              Buscar
            </button>
          )}
        </div>
      </form>

      {/* Tabs */}
      {query && (
        <div className="flex gap-4 border-b border-[#2a2f52] mb-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.icon}
              {t.label}
              {t.count > 0 && (
                <Badge variant="cyan" size="sm">{t.count}</Badge>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {(!query || tab === 'posts') && (
            <div className="space-y-4">
              {!query && (
                <p className="text-sm text-slate-500 mb-4">Posts recentes</p>
              )}
              {posts.length === 0 && query ? (
                <p className="text-center text-slate-500 py-8">Nenhum post encontrado</p>
              ) : (
                posts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={toggleLike}
                  />
                ))
              )}
            </div>
          )}

          {query && tab === 'users' && (
            <div className="space-y-3">
              {users.length === 0 ? (
                <p className="text-center text-slate-500 py-8">Nenhum usuário encontrado</p>
              ) : (
                users.map(u => (
                  <Link
                    key={u.id}
                    to={`/profile/${u.username}`}
                    className="flex items-center gap-4 p-4 bg-[#131629] border border-[#2a2f52] rounded-2xl hover:border-cyan-500/30 transition-all"
                  >
                    <Avatar src={u.avatar_url} size="lg" ring />
                    <div>
                      <p className="font-semibold text-white">{u.full_name}</p>
                      <p className="text-sm text-slate-500">@{u.username}</p>
                      {u.bio && <p className="text-xs text-slate-400 mt-1 line-clamp-1">{u.bio}</p>}
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {query && tab === 'communities' && (
            <div className="space-y-3">
              {communities.length === 0 ? (
                <p className="text-center text-slate-500 py-8">Nenhuma comunidade encontrada</p>
              ) : (
                communities.map(c => (
                  <Link
                    key={c.id}
                    to={`/community/${c.id}`}
                    className="flex items-center gap-4 p-4 bg-[#131629] border border-[#2a2f52] rounded-2xl hover:border-cyan-500/30 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                      {c.category === 'tecnologia' ? '💻' : c.category === 'musica' ? '🎵' : '🌐'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{c.title}</p>
                        <Badge variant={c.status === 'featured' ? 'purple' : c.status === 'active' ? 'green' : 'slate'} size="sm">
                          {c.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">{c.description}</p>
                      <p className="text-xs text-slate-500 mt-1">{c.members_count} membros</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
