import React, { useState } from 'react';
import { Plus, Users, Search } from 'lucide-react';
import { useCommunities } from '../hooks/useCommunities';
import { CommunityCard } from '../components/community/CommunityCard';
import { CreateCommunityModal } from '../components/community/CreateCommunityModal';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

type FilterType = 'all' | 'joined' | 'featured' | 'active';
const categories = ['todos', 'tecnologia', 'musica', 'arte', 'games', 'fitness', 'culinaria', 'viagens', 'moda', 'ciencia', 'humor', 'outros'];

export const CommunitiesPage: React.FC = () => {
  const { user } = useAuth();
  const { communities, loading, joinCommunity, leaveCommunity } = useCommunities();
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [category, setCategory] = useState('todos');
  const [search, setSearch] = useState('');

  const filtered = communities.filter(c => {
    if (filter === 'joined' && !c.is_member) return false;
    if (filter === 'featured' && c.status !== 'featured') return false;
    if (filter === 'active' && c.status !== 'active') return false;
    if (category !== 'todos' && c.category !== category) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const tabs: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'Todas' },
    { id: 'featured', label: '⭐ Destaque' },
    { id: 'active', label: '✅ Ativas' },
    { id: 'joined', label: '👤 Minhas' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 lg:py-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-white">Comunidades</h1>
        </div>
        {user && (
          <Button
            variant="cyan"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowCreate(true)}
          >
            Nova Comunidade
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar comunidades..."
          className="nexus-input pl-12 text-sm"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === t.id
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
              category === cat
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Communities grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[#131629] border border-[#2a2f52] rounded-2xl overflow-hidden">
              <div className="skeleton h-24 w-full" />
              <div className="p-4 space-y-3">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-slate-400 mb-2">Nenhuma comunidade encontrada</p>
          <button
            onClick={() => { setFilter('all'); setCategory('todos'); setSearch(''); }}
            className="text-cyan-400 hover:text-cyan-300 text-sm"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(community => (
            <CommunityCard
              key={community.id}
              community={community}
              onJoin={joinCommunity}
              onLeave={leaveCommunity}
            />
          ))}
        </div>
      )}

      <CreateCommunityModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
};
