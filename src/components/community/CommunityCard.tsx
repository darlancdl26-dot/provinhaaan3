import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Crown, Zap, Clock } from 'lucide-react';
import { Community } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface CommunityCardProps {
  community: Community;
  onJoin?: (id: string) => void;
  onLeave?: (id: string) => void;
  compact?: boolean;
}

const statusConfig = {
  active: { label: 'Ativo', variant: 'green' as const, icon: <Zap className="w-3 h-3" /> },
  featured: { label: 'Destaque', variant: 'purple' as const, icon: <Crown className="w-3 h-3" /> },
  ended: { label: 'Encerrado', variant: 'slate' as const, icon: <Clock className="w-3 h-3" /> },
};

const categoryColors: Record<string, string> = {
  tecnologia: 'from-cyan-500/20 to-blue-500/20',
  musica: 'from-purple-500/20 to-pink-500/20',
  arte: 'from-orange-500/20 to-yellow-500/20',
  games: 'from-green-500/20 to-emerald-500/20',
  fitness: 'from-red-500/20 to-orange-500/20',
  culinaria: 'from-yellow-500/20 to-orange-500/20',
  viagens: 'from-blue-500/20 to-cyan-500/20',
  moda: 'from-pink-500/20 to-rose-500/20',
  ciencia: 'from-teal-500/20 to-cyan-500/20',
  humor: 'from-yellow-500/20 to-green-500/20',
  outros: 'from-slate-500/20 to-slate-600/20',
};

export const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  onJoin,
  onLeave,
  compact = false,
}) => {
  const { user } = useAuth();
  const status = statusConfig[community.status];
  const gradient = categoryColors[community.category] || categoryColors.outros;

  if (compact) {
    return (
      <Link to={`/community/${community.id}`} className="block group">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
            {community.image_url ? (
              <img src={community.image_url} alt={community.title} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <span className="text-lg">
                {community.category === 'tecnologia' ? '💻' :
                 community.category === 'musica' ? '🎵' :
                 community.category === 'arte' ? '🎨' :
                 community.category === 'games' ? '🎮' :
                 community.category === 'fitness' ? '💪' :
                 community.category === 'culinaria' ? '🍳' :
                 community.category === 'viagens' ? '✈️' :
                 community.category === 'moda' ? '👗' :
                 community.category === 'ciencia' ? '🔬' :
                 community.category === 'humor' ? '😂' : '🌐'}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">
              {community.title}
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Users className="w-3 h-3" />
              {community.members_count.toLocaleString()}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="community-card-gradient">
      {/* Cover */}
      <div className={`h-24 bg-gradient-to-r ${gradient} rounded-t-2xl relative overflow-hidden`}>
        {community.image_url && (
          <img
            src={community.image_url}
            alt={community.title}
            className="w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl">
            {community.category === 'tecnologia' ? '💻' :
             community.category === 'musica' ? '🎵' :
             community.category === 'arte' ? '🎨' :
             community.category === 'games' ? '🎮' :
             community.category === 'fitness' ? '💪' :
             community.category === 'culinaria' ? '🍳' :
             community.category === 'viagens' ? '✈️' :
             community.category === 'moda' ? '👗' :
             community.category === 'ciencia' ? '🔬' :
             community.category === 'humor' ? '😂' : '🌐'}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant={status.variant} size="sm">
            {status.icon}
            {status.label}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <Link to={`/community/${community.id}`}>
              <h3 className="font-bold text-white hover:text-cyan-400 transition-colors text-sm leading-tight">
                {community.title}
              </h3>
            </Link>
            <Badge variant="cyan" size="sm" className="mt-1">
              {community.category}
            </Badge>
          </div>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 mb-3">{community.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Users className="w-3.5 h-3.5" />
            <span>{community.members_count.toLocaleString()} membros</span>
          </div>

          {user && (
            community.is_member ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLeave?.(community.id)}
              >
                Sair
              </Button>
            ) : (
              community.status !== 'ended' && (
                <Button
                  variant="cyan"
                  size="sm"
                  onClick={() => onJoin?.(community.id)}
                >
                  Participar
                </Button>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
};
