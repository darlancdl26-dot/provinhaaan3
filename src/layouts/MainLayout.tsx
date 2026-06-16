import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Users, TrendingUp, MessageCircle, User, LogOut,
  Search, Plus, Bell, Menu, X, Zap, Hash
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Avatar } from '../components/ui/Avatar';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import toast from 'react-hot-toast';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { path: '/feed', icon: <Home className="w-5 h-5" />, label: 'Feed' },
    { path: '/explore', icon: <Hash className="w-5 h-5" />, label: 'Explorar' },
    { path: '/communities', icon: <Users className="w-5 h-5" />, label: 'Comunidades' },
    { path: '/trends', icon: <TrendingUp className="w-5 h-5" />, label: 'Trends' },
    { path: '/messages', icon: <MessageCircle className="w-5 h-5" />, label: 'Mensagens' },
    { path: `/profile/${profile?.username}`, icon: <User className="w-5 h-5" />, label: 'Perfil' },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast.success('Até logo!');
    navigate('/auth');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="min-h-screen bg-[#0F122A] flex">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full z-50 transition-transform duration-300
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
          w-72 bg-[#131629] border-r border-[#2a2f52] flex flex-col
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#2a2f52]">
          <div className="flex items-center justify-between">
              <Link to="/feed" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Trend Hub</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[#2a2f52]">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="nexus-input pl-12 text-sm py-2"
              />
            </div>
          </form>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive(item.path)
                    ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          {/* Left sidebar community list */}
          <LeftSidebar />
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-[#2a2f52]">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${profile?.username}`}>
              <Avatar src={profile?.avatar_url} size="md" ring />
            </Link>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{profile?.full_name}</p>
              <p className="text-xs text-slate-500 truncate">@{profile?.username}</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={handleSignOut}
                className="p-2 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 bg-[#0F122A]/95 backdrop-blur border-b border-[#2a2f52] px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl hover:bg-white/5 text-slate-400"
          >
            <Menu className="w-5 h-5" />
          </button>
            <Link to="/feed" className="flex items-center gap-2 flex-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold gradient-text">Trend Hub</span>
          </Link>
          <Link to="/feed" className="p-2 rounded-xl hover:bg-white/5 text-slate-400">
            <Bell className="w-5 h-5" />
          </Link>
          <Link to="/messages" className="p-2 rounded-xl hover:bg-white/5 text-slate-400">
            <MessageCircle className="w-5 h-5" />
          </Link>
        </div>

        {/* Content area with sidebars */}
        <div className="flex flex-1 max-w-7xl mx-auto w-full px-0 lg:px-6 py-0 lg:py-6 gap-6">
          {/* Feed */}
          <div className="flex-1 min-w-0">
            {children}
          </div>

          {/* Right sidebar - desktop only */}
          <div className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-6">
              <RightSidebar />
            </div>
          </div>
        </div>

        {/* Mobile bottom nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#131629]/95 backdrop-blur border-t border-[#2a2f52] z-30">
          <div className="flex items-center justify-around py-2">
            {navItems.slice(0, 5).map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-colors ${
                  isActive(item.path) ? 'text-cyan-400' : 'text-slate-500'
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            ))}
            <Link
              to="/communities"
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center"
            >
              <Plus className="w-5 h-5 text-white" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
