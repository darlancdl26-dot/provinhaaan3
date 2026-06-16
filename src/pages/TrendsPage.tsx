import React, { useState } from 'react';
import { TrendingUp, Flame, Hash, Clock, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';

const trendsData = [
  {
    id: 1,
    tag: '#webdev',
    category: 'Tecnologia',
    posts: '12.4K',
    growth: '+340%',
    hot: true,
    description: 'Desenvolvimento web moderno, frameworks e tendências.',
    color: 'from-cyan-500/20 to-blue-500/20',
    emoji: '',
  },
  {
    id: 2,
    tag: '#ai',
    category: 'Tecnologia',
    posts: '15.1K',
    growth: '+520%',
    hot: true,
    description: 'Inteligência artificial, LLMs e automação.',
    color: 'from-purple-500/20 to-pink-500/20',
    emoji: '',
  },
  {
    id: 3,
    tag: '#reactjs',
    category: 'Dev',
    posts: '8.9K',
    growth: '+180%',
    hot: false,
    description: 'React, componentes, hooks e ecossistema.',
    color: 'from-blue-500/20 to-cyan-500/20',
    emoji: '',
  },
  {
    id: 4,
    tag: '#design',
    category: 'Arte',
    posts: '7.2K',
    growth: '+145%',
    hot: false,
    description: 'UI/UX design, sistemas de design e tendências visuais.',
    color: 'from-orange-500/20 to-yellow-500/20',
    emoji: '',
  },
  {
    id: 5,
    tag: '#gaming',
    category: 'Games',
    posts: '11.2K',
    growth: '+210%',
    hot: true,
    description: 'Games, lançamentos, speedruns e streaming.',
    color: 'from-green-500/20 to-emerald-500/20',
    emoji: '',
  },
  {
    id: 6,
    tag: '#typescript',
    category: 'Dev',
    posts: '6.8K',
    growth: '+165%',
    hot: false,
    description: 'TypeScript, tipos avançados e melhores práticas.',
    color: 'from-blue-500/20 to-indigo-500/20',
    emoji: '',
  },
  {
    id: 7,
    tag: '#music',
    category: 'Música',
    posts: '9.4K',
    growth: '+200%',
    hot: false,
    description: 'Música, produção, artistas e novos lançamentos.',
    color: 'from-rose-500/20 to-pink-500/20',
    emoji: '',
  },
  {
    id: 8,
    tag: '#opensource',
    category: 'Dev',
    posts: '5.3K',
    growth: '+130%',
    hot: false,
    description: 'Projetos open source, contribuições e comunidade.',
    color: 'from-teal-500/20 to-cyan-500/20',
    emoji: '',
  },
  {
    id: 9,
    tag: '#fitness',
    category: 'Saúde',
    posts: '8.1K',
    growth: '+175%',
    hot: false,
    description: 'Exercícios, saúde, nutrição e motivação.',
    color: 'from-red-500/20 to-orange-500/20',
    emoji: '',
  },
  {
    id: 10,
    tag: '#startup',
    category: 'Negócios',
    posts: '4.6K',
    growth: '+120%',
    hot: false,
    description: 'Startups, empreendedorismo e inovação.',
    color: 'from-amber-500/20 to-yellow-500/20',
    emoji: '',
  },
  {
    id: 11,
    tag: '#photography',
    category: 'Arte',
    posts: '6.3K',
    growth: '+155%',
    hot: false,
    description: 'Fotografia, edição e composição visual.',
    color: 'from-purple-500/20 to-indigo-500/20',
    emoji: '',
  },
  {
    id: 12,
    tag: '#python',
    category: 'Dev',
    posts: '7.8K',
    growth: '+190%',
    hot: false,
    description: 'Python, data science, scripts e automação.',
    color: 'from-yellow-500/20 to-green-500/20',
    emoji: '',
  },
];

const challenges = [
  {
    id: 1,
    title: '30 Days of Code',
    description: 'Programe por 30 dias seguidos. Compartilhe seu progresso!',
    participants: 2340,
    daysLeft: 12,
    emoji: '🔥',
    color: 'from-orange-500/30 to-red-500/20',
  },
  {
    id: 2,
    title: 'UI Redesign Challenge',
    description: 'Redesenhe uma interface famosa com seu toque pessoal.',
    participants: 1180,
    daysLeft: 5,
    emoji: '🎨',
    color: 'from-purple-500/30 to-pink-500/20',
  },
  {
    id: 3,
    title: 'Build in Public',
    description: 'Construa um produto do zero e documente tudo.',
    participants: 876,
    daysLeft: 20,
    emoji: '🚀',
    color: 'from-cyan-500/30 to-blue-500/20',
  },
  {
    id: 4,
    title: 'Photo of the Day',
    description: 'Uma foto por dia durante todo o mês.',
    participants: 3210,
    daysLeft: 8,
    emoji: '📸',
    color: 'from-teal-500/30 to-emerald-500/20',
  },
];

type TrendsFilter = 'all' | 'hot' | 'tech' | 'art' | 'games';

export const TrendsPage: React.FC = () => {
  const [filter, setFilter] = useState<TrendsFilter>('all');
  const [view, setView] = useState<'trends' | 'challenges'>('trends');

  const filtered = trendsData.filter(t => {
    if (filter === 'hot') return t.hot;
    if (filter === 'tech') return ['Tecnologia', 'Dev'].includes(t.category);
    if (filter === 'art') return ['Arte', 'Música'].includes(t.category);
    if (filter === 'games') return t.category === 'Games';
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 lg:py-0">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-purple-400" />
        <h1 className="text-xl font-bold text-white">Trends & Desafios</h1>
      </div>

      {/* View toggle */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setView('trends')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            view === 'trends'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Hash className="w-4 h-4" />
          Trending
        </button>
        <button
          onClick={() => setView('challenges')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            view === 'challenges'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Flame className="w-4 h-4" />
          Desafios
        </button>
      </div>

      {view === 'trends' ? (
        <>
          {/* Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'hot', label: 'Em Alta' },
              { id: 'tech', label: 'Tech' },
              { id: 'art', label: 'Arte' },
              { id: 'games', label: 'Games' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as TrendsFilter)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === f.id
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Trending list */}
          <div className="space-y-3">
            {filtered.map((trend, i) => (
              <Link
                key={trend.id}
                to={`/explore?q=${encodeURIComponent(trend.tag.slice(1))}`}
                className="block"
              >
                <div className={`bg-gradient-to-r ${trend.color} border border-white/10 rounded-2xl p-4 hover:border-purple-500/30 transition-all card-hover`}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-bold text-slate-600 w-5">{i + 1}</span>
                      <span className="text-2xl">{trend.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white text-sm">{trend.tag}</h3>
                        <Badge variant="purple" size="sm">{trend.category}</Badge>
                        {trend.hot && (
                          <Badge variant="orange" size="sm">
                            <Flame className="w-3 h-3" />
                            Em alta
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{trend.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-white">{trend.posts}</p>
                      <p className="text-xs text-green-400">{trend.growth}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <p className="text-sm text-slate-400">Participe dos desafios ativos e mostre seu talento</p>
          </div>

          <div className="space-y-4">
            {challenges.map(challenge => (
              <div
                key={challenge.id}
                className={`bg-gradient-to-r ${challenge.color} border border-white/10 rounded-2xl p-5 card-hover`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{challenge.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-white">{challenge.title}</h3>
                      <Badge variant="orange" size="sm">
                        <Clock className="w-3 h-3" />
                        {challenge.daysLeft}d
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-300 mt-1 mb-3">{challenge.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Star className="w-3.5 h-3.5 text-yellow-400" />
                        <span>{challenge.participants.toLocaleString()} participantes</span>
                      </div>
                      <Link
                        to="/communities"
                        className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1"
                      >
                        Participar
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl text-center">
            <p className="text-sm text-slate-300 mb-2">
              Crie seu próprio desafio e inspire outros!
            </p>
            <Link
              to="/communities"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Criar desafio
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
};
