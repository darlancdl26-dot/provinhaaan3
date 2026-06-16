import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCommunities } from '../hooks/useCommunities';
import { CommunityCard } from '../components/community/CommunityCard';
import { useState } from 'react';
import { CreateCommunityModal } from '../components/community/CreateCommunityModal';

export const LeftSidebar: React.FC = () => {
  const { myCommunities, loading } = useCommunities();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Minhas Comunidades
          </h3>
          <button
            onClick={() => setShowCreate(true)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-cyan-400 transition-colors"
            title="Criar comunidade"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="space-y-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-12 rounded-xl" />
            ))}
          </div>
        ) : myCommunities.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-xs text-slate-500 mb-2">Você não participa de nenhuma comunidade</p>
            <Link
              to="/communities"
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Explorar comunidades →
            </Link>
          </div>
        ) : (
          <div className="space-y-0.5">
            {myCommunities.slice(0, 8).map(community => (
              <CommunityCard key={community.id} community={community} compact />
            ))}
            {myCommunities.length > 8 && (
              <Link
                to="/communities"
                className="block text-center text-xs text-slate-500 hover:text-cyan-400 transition-colors py-2"
              >
                Ver todas ({myCommunities.length})
              </Link>
            )}
          </div>
        )}
      </div>

      <CreateCommunityModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </>
  );
};
