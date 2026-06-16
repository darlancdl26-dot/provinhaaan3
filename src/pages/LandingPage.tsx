import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, TrendingUp, Users, MessageCircle, Shield, Star, ArrowRight, Flame, Globe, Sparkles } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <TrendingUp className="w-6 h-6 text-purple-400" />,
      title: 'Trends em Tempo Real',
      desc: 'Acompanhe o que está em alta e nunca perca uma tendência.',
      color: 'from-purple-500/20 to-pink-500/10',
    },
    {
      icon: <Users className="w-6 h-6 text-cyan-400" />,
      title: 'Comunidades de Nicho',
      desc: 'Encontre seu grupo, crie comunidades e participe de desafios.',
      color: 'from-cyan-500/20 to-blue-500/10',
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-blue-400" />,
      title: 'Chat em Tempo Real',
      desc: 'Mensagens diretas com Supabase Realtime. Instantâneo.',
      color: 'from-blue-500/20 to-indigo-500/10',
    },
    {
      icon: <Shield className="w-6 h-6 text-green-400" />,
      title: 'Seguro e Privado',
      desc: 'Row Level Security no Supabase. Seus dados, suas regras.',
      color: 'from-green-500/20 to-teal-500/10',
    },
    {
      icon: <Flame className="w-6 h-6 text-orange-400" />,
      title: 'Desafios Criativos',
      desc: 'Participe de desafios, mostre seu talento e ganhe visibilidade.',
      color: 'from-orange-500/20 to-red-500/10',
    },
    {
      icon: <Globe className="w-6 h-6 text-teal-400" />,
      title: 'Feed Personalizado',
      desc: 'Conteúdo de quem você segue e comunidades que participa.',
      color: 'from-teal-500/20 to-cyan-500/10',
    },
  ];

  const stats = [
    { label: 'Usuários', value: '50K+', icon: '' },
    { label: 'Comunidades', value: '1K+', icon: '' },
    { label: 'Posts', value: '100K+', icon: '' },
    { label: 'Trends', value: '500+', icon: '' },
  ];

  const trending = ['#webdev', '#ai', '#reactjs', '#design', '#gaming', '#typescript', '#opensource'];

  return (
    <div className="min-h-screen bg-[#0F122A] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#2a2f52]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black gradient-text">Trend Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
            >
              Entrar
            </Link>
            <Link
              to="/auth"
              className="btn-cyan text-sm px-5 py-2 rounded-xl"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative">
        {/* Background effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          {/* Trending badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-semibold mb-8 animate-fade-in">
            <Flame className="w-4 h-4" />
            A nova rede social que você estava esperando
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Conecte-se com
            <br />
            <span className="gradient-text">comunidades</span>
            <br />
            que importam
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Trend Hub é uma rede social moderna focada em <strong className="text-white">trends</strong>, <strong className="text-white">desafios criativos</strong> e <strong className="text-white">comunidades de nicho</strong>. Seu feed, sua escolha.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              to="/auth"
              className="btn-cyan text-base px-8 py-3.5 rounded-2xl flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Sparkles className="w-5 h-5" />
              Criar conta grátis
            </Link>
            <Link
              to="/auth"
              className="btn-primary text-base px-8 py-3.5 rounded-2xl flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Fazer login
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Trending tags */}
          <div className="flex flex-wrap gap-2 justify-center">
            {trending.map(tag => (
              <span
                key={tag}
                className="trend-badge"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(stat => (
              <div
                key={stat.label}
                className="bg-[#131629] border border-[#2a2f52] rounded-2xl p-6 text-center card-hover"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <p className="text-2xl font-black gradient-text">{stat.value}</p>
                <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">
              Tudo que você precisa,
              <br />
              <span className="gradient-text">num só lugar</span>
            </h2>
            <p className="text-slate-400 text-lg">Construído com Supabase, React e uma pitada de magia ✨</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(feature => (
              <div
                key={feature.title}
                className={`bg-gradient-to-br ${feature.color} border border-white/10 rounded-2xl p-6 card-hover`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8 text-slate-300">Stack moderna & escalável</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { label: 'React 19', emoji: '⚛️' },
              { label: 'Vite', emoji: '⚡' },
              { label: 'Supabase', emoji: '🟢' },
              { label: 'TypeScript', emoji: '📝' },
              { label: 'Tailwind CSS', emoji: '🎨' },
              { label: 'React Router', emoji: '🧭' },
              { label: 'Realtime', emoji: '⚡' },
              { label: 'RLS Security', emoji: '🔒' },
              { label: 'Vercel Deploy', emoji: '🚀' },
            ].map(tech => (
              <div
                key={tech.label}
                className="flex items-center gap-2 px-4 py-2 bg-[#131629] border border-[#2a2f52] rounded-xl text-sm text-slate-300"
              >
                <span>{tech.emoji}</span>
                {tech.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 rounded-3xl p-12">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-6 neon-cyan">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black mb-4">
              Pronto para se conectar?
            </h2>
            <p className="text-slate-400 mb-8">
              Junte-se a milhares de pessoas em comunidades incríveis. É grátis!
            </p>
            <Link
              to="/auth"
              className="btn-cyan text-base px-10 py-4 rounded-2xl inline-flex items-center gap-2"
            >
              <Star className="w-5 h-5" />
              Começar agora — é grátis!
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#2a2f52] text-center text-sm text-slate-600">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold gradient-text">Trend Hub</span>
        </div>
        <p>© 2025 Trend Hub. Todos os direitos reservados.</p>
        <div className="flex justify-center gap-4 mt-2">
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacidade</span>
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Termos</span>
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Suporte</span>
        </div>
      </footer>
    </div>
  );
};
