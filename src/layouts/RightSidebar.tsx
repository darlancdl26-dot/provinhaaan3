import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, UserPlus } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { Profile, Community } from '../types';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';

const trends = [
  { tag: '#webdev', posts: '12.4K' },
  { tag: '#reactjs', posts: '8.9K' },
  { tag: '#design', posts: '7.2K' },
  { tag: '#ai', posts: '15.1K' },
  { tag: '#opensource', posts: '5.3K' },
  { tag: '#typescript', posts: '6.8K' },
  { tag: '#gaming', posts: '11.2K' },
  { tag: '#music', posts: '9.4K' },
];

export const RightSidebar: React.FC = () => {
  const { user } = useAuth();
  const [suggestedUsers, setSuggestedUsers] = useState<Profile[]>([]);
  const [featuredCommunities, setFeaturedCommunities] = useState<Community[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Fetch users not being followed
      const { data: follows } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);
      
      const followingIds = follows?.map((f: { following_id: string }) => f.following_id) || [];
      
      let usersQuery = supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .limit(4);
      
      if (followingIds.length > 0) {
        usersQuery = usersQuery.not('id', 'in', `(${followingIds.join(',')})`);
      }
      
      const { data: users } = await usersQuery;
      setSuggestedUsers(users || []);

      // Featured communities
      const { data: communities } = await supabase
        .from('communities')
        .select('*')
        .eq('status', 'featured')
        .limit(3);
      setFeaturedCommunities(communities || []);
    };

    fetchData();
  }, [user]);

  const handleFollow = async (profileId: string) => {
    if (!user) return;
    await supabase.from('follows').insert({ follower_id: user.id, following_id: profileId });
    setSuggestedUsers(prev => prev.filter(p => p.id !== profileId));
  };

  return (
    <div className="space-y-4">
      {/* Trending */}
      <div className="bg-[#131629] border border-[#2a2f52] rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white">Trending</h3>
        </div>
        <div className="space-y-2">
          {trends.map((trend, i) => (
            <Link
              key={trend.tag}
              to={`/explore?q=${encodeURIComponent(trend.tag.slice(1))}`}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 w-4">{i + 1}</span>
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">
                    {trend.tag}
                  </p>
                </div>
              </div>
              <Badge variant="purple" size="sm">{trend.posts}</Badge>
            </Link>
          ))}
        </div>
        <Link
          to="/trends"
          className="block text-center text-xs text-cyan-400 hover:text-cyan-300 transition-colors mt-3 py-1"
        >
          Ver todos os trends →
        </Link>
      </div>

      {/* Suggested users */}
      {suggestedUsers.length > 0 && (
        <div className="bg-[#131629] border border-[#2a2f52] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Sugestões</h3>
          </div>
          <div className="space-y-3">
            {suggestedUsers.map(profile => (
              <div key={profile.id} className="flex items-center gap-3">
                <Link to={`/profile/${profile.username}`}>
                  <Avatar src={profile.avatar_url} size="sm" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/profile/${profile.username}`}
                    className="text-xs font-semibold text-white hover:text-cyan-400 transition-colors block truncate"
                  >
                    {profile.full_name}
                  </Link>
                  <p className="text-[11px] text-slate-500 truncate">@{profile.username}</p>
                </div>
                <button
                  onClick={() => handleFollow(profile.id)}
                  className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors border border-cyan-500/30 hover:border-cyan-400 px-2.5 py-1 rounded-lg"
                >
                  Seguir
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured communities */}
      {featuredCommunities.length > 0 && (
        <div className="bg-[#131629] border border-[#2a2f52] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Comunidades em Destaque</h3>
          </div>
          <div className="space-y-3">
            {featuredCommunities.map(c => (
              <Link
                key={c.id}
                to={`/community/${c.id}`}
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">
                    {c.category === 'tecnologia' ? '💻' : c.category === 'musica' ? '🎵' : '🌐'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">
                    {c.title}
                  </p>
                  <p className="text-[11px] text-slate-500">{c.members_count} membros</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-[11px] text-slate-600 space-y-1">
        <p>© 2025 Trend Hub • Todos os direitos reservados</p>
        <div className="flex justify-center gap-3">
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacidade</span>
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Termos</span>
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Ajuda</span>
        </div>
      </div>
    </div>
  );
};
