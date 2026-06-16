import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import { Conversation, Message } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useConversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (error) throw error;

      if (data) {
        const enriched = await Promise.all(
          data.map(async (conv: Conversation) => {
            const otherId = conv.participant1_id === user.id 
              ? conv.participant2_id 
              : conv.participant1_id;
            
            const { data: otherUser } = await supabase
              .from('profiles')
              .select('id, username, full_name, avatar_url')
              .eq('id', otherId)
              .single();
            
            return { ...conv, other_user: otherUser || undefined };
          })
        );
        setConversations(enriched as Conversation[]);
      }
    } catch (err) {
      console.error('Conversations error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const createOrGetConversation = async (otherUserId: string): Promise<string | null> => {
    if (!user) return null;
    try {
      // Check if conversation exists
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .or(
          `and(participant1_id.eq.${user.id},participant2_id.eq.${otherUserId}),and(participant1_id.eq.${otherUserId},participant2_id.eq.${user.id})`
        )
        .single();

      if (existing) return existing.id;

      // Create new
      const { data: newConv, error } = await supabase
        .from('conversations')
        .insert({ participant1_id: user.id, participant2_id: otherUserId })
        .select('id')
        .single();

      if (error) throw error;
      fetchConversations();
      return newConv.id;
    } catch {
      return null;
    }
  };

  return { conversations, loading, createOrGetConversation, refetch: fetchConversations };
};

export const useMessages = (conversationId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const subscriptionRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true);
    try {
      const { data } = await supabase
        .from('messages')
        .select('*, sender:profiles!messages_sender_id_fkey(id, username, full_name, avatar_url)')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      setMessages(data || []);
    } catch (err) {
      console.error('Messages error:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;
    fetchMessages();

    // Subscribe to realtime messages
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, async (payload) => {
        const newMsg = payload.new as Message;
        // Fetch sender info
        const { data: sender } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .eq('id', newMsg.sender_id)
          .single();
        setMessages(prev => [...prev, { ...newMsg, sender: sender || undefined }] as Message[]);
      })
      .subscribe();

    subscriptionRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, fetchMessages]);

  const sendMessage = async (content: string) => {
    if (!user || !conversationId) return;
    try {
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
      });

      // Update conversation last_message
      await supabase
        .from('conversations')
        .update({ last_message: content, last_message_at: new Date().toISOString() })
        .eq('id', conversationId);
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  return { messages, loading, sendMessage };
};
