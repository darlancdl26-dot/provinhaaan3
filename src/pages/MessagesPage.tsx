import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, MessageCircle, Search, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useConversations, useMessages } from '../hooks/useMessages';
import { useSearchProfiles } from '../hooks/useProfile';
import { Avatar } from '../components/ui/Avatar';
import { useAuth } from '../contexts/AuthContext';
import { Conversation } from '../types';

export const MessagesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { conversations, loading, createOrGetConversation } = useConversations();
  const [selectedConv, setSelectedConv] = useState<string | null>(searchParams.get('conv'));
  const [selectedConvData, setSelectedConvData] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { profiles: searchResults } = useSearchProfiles(searchQuery);
  const { messages, sendMessage } = useMessages(selectedConv);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (selectedConv && conversations.length > 0) {
      const conv = conversations.find(c => c.id === selectedConv);
      if (conv) {
        setSelectedConvData(conv);
        setMobileView('chat');
      }
    }
  }, [selectedConv, conversations]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    await sendMessage(messageText.trim());
    setMessageText('');
  };

  const handleSelectUser = async (profileId: string) => {
    const convId = await createOrGetConversation(profileId);
    if (convId) {
      setSelectedConv(convId);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleSelectConv = (conv: Conversation) => {
    setSelectedConv(conv.id);
    setSelectedConvData(conv);
    setMobileView('chat');
  };

  return (
    <div className="max-w-4xl mx-auto px-0 lg:px-4 py-0 lg:py-0 h-[calc(100vh-120px)] lg:h-[calc(100vh-48px)]">
      <div className="flex h-full bg-[#131629] border border-[#2a2f52] rounded-none lg:rounded-2xl overflow-hidden">
        
        {/* Conversations list */}
        <div className={`
          w-full lg:w-80 flex-shrink-0 border-r border-[#2a2f52] flex flex-col
          ${mobileView === 'chat' ? 'hidden lg:flex' : 'flex'}
        `}>
          {/* Header */}
          <div className="p-4 border-b border-[#2a2f52]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-cyan-400" />
                <h2 className="font-bold text-white">Mensagens</h2>
              </div>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar usuário..."
                  className="nexus-input pl-12 text-sm py-2"
                  autoFocus
                />
                {searchQuery && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-[#1a1f3a] border border-[#2a2f52] rounded-xl mt-1 z-20 shadow-xl max-h-48 overflow-y-auto">
                    {searchResults.map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleSelectUser(p.id)}
                        className="flex items-center gap-3 w-full p-3 hover:bg-white/5 transition-colors"
                      >
                        <Avatar src={p.avatar_url} size="sm" />
                        <div className="text-left">
                          <p className="text-sm font-semibold text-white">{p.full_name}</p>
                          <p className="text-xs text-slate-500">@{p.username}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="skeleton w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-3 w-24" />
                      <div className="skeleton h-3 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center p-8">
                <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">Nenhuma conversa ainda</p>
                <p className="text-xs text-slate-500 mt-1">Clique em 🔍 para iniciar uma conversa</p>
              </div>
            ) : (
              conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConv(conv)}
                  className={`flex items-center gap-3 w-full p-4 transition-colors text-left ${
                    selectedConv === conv.id
                      ? 'bg-cyan-500/10 border-r-2 border-cyan-400'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <Avatar src={conv.other_user?.avatar_url} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {conv.other_user?.full_name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {conv.last_message || 'Nenhuma mensagem'}
                    </p>
                  </div>
                  {conv.last_message_at && (
                    <span className="text-[10px] text-slate-600 flex-shrink-0">
                      {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: false, locale: ptBR })}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className={`flex-1 flex flex-col ${mobileView === 'list' ? 'hidden lg:flex' : 'flex'}`}>
          {selectedConv && selectedConvData ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b border-[#2a2f52] flex items-center gap-3">
                <button
                  onClick={() => setMobileView('list')}
                  className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-slate-400"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <Avatar src={selectedConvData.other_user?.avatar_url} size="sm" />
                <div>
                  <p className="font-semibold text-white text-sm">
                    {selectedConvData.other_user?.full_name}
                  </p>
                  <p className="text-xs text-slate-500">@{selectedConvData.other_user?.username}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-slate-500">Nenhuma mensagem ainda. Diga olá! 👋</p>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isOwn = msg.sender_id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}
                      >
                        {!isOwn && (
                          <Avatar src={msg.sender?.avatar_url} size="xs" />
                        )}
                        <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                          <div
                            className={`px-4 py-2.5 text-sm ${
                              isOwn ? 'msg-bubble-own text-white' : 'msg-bubble-other text-slate-200'
                            }`}
                          >
                            {msg.content}
                          </div>
                          <span className="text-[10px] text-slate-600 px-1">
                            {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: ptBR })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <form onSubmit={handleSend} className="p-4 border-t border-[#2a2f52] flex gap-3">
                <input
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  placeholder="Escreva uma mensagem..."
                  className="nexus-input flex-1 text-sm"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="p-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-10 h-10 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Suas mensagens</h3>
                <p className="text-slate-400 text-sm">
                  Selecione uma conversa ou inicie uma nova
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
