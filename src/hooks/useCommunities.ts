import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { Community } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useCommunities = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCommunities = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*, creator:profiles!communities_creator_id_fkey(id, username, avatar_url, full_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (user && data) {
        const ids = data.map((c: Community) => c.id);
        const { data: memberships } = await supabase
          .from('community_members')
          .select('community_id')
          .eq('user_id', user.id)
          .in('community_id', ids);
        
        const memberIds = new Set(memberships?.map((m: { community_id: string }) => m.community_id) || []);
        setCommunities(data.map((c: Community) => ({ ...c, is_member: memberIds.has(c.id) })));
      } else {
        setCommunities(data || []);
      }
    } catch (err) {
      console.error('Error fetching communities:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  const createCommunity = async (data: {
    title: string;
    description: string;
    category: string;
    image_url?: string;
    status: 'active' | 'ended' | 'featured';
    rules?: string;
  }) => {
    if (!user) return { error: new Error('Not authenticated'), data: null };
    try {
      const { data: newCommunity, error } = await supabase
        .from('communities')
        .insert({
          ...data,
          creator_id: user.id,
          members_count: 1,
        })
        .select('*, creator:profiles!communities_creator_id_fkey(*)')
        .single();

      if (error) throw error;

      // Auto-join
      await supabase.from('community_members').insert({
        user_id: user.id,
        community_id: newCommunity.id,
      });

      const community = { ...newCommunity, is_member: true };
      setCommunities(prev => [community, ...prev]);
      return { error: null, data: community };
    } catch (err) {
      return { error: err as Error, data: null };
    }
  };

  const updateCommunity = async (id: string, updates: Partial<Community>) => {
    try {
      const { error } = await supabase
        .from('communities')
        .update(updates)
        .eq('id', id)
        .eq('creator_id', user?.id);

      if (error) throw error;
      setCommunities(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const deleteCommunity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('communities')
        .delete()
        .eq('id', id)
        .eq('creator_id', user?.id);

      if (error) throw error;
      setCommunities(prev => prev.filter(c => c.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const joinCommunity = async (communityId: string) => {
    if (!user) return;
    try {
      await supabase.from('community_members').insert({ user_id: user.id, community_id: communityId });
      await supabase.from('communities').update({ members_count: supabase.rpc('increment') }).eq('id', communityId);
      setCommunities(prev => prev.map(c =>
        c.id === communityId ? { ...c, is_member: true, members_count: c.members_count + 1 } : c
      ));
    } catch (err) {
      console.error('Join error:', err);
    }
  };

  const leaveCommunity = async (communityId: string) => {
    if (!user) return;
    try {
      await supabase.from('community_members').delete().eq('user_id', user.id).eq('community_id', communityId);
      setCommunities(prev => prev.map(c =>
        c.id === communityId ? { ...c, is_member: false, members_count: Math.max(0, c.members_count - 1) } : c
      ));
    } catch (err) {
      console.error('Leave error:', err);
    }
  };

  const myCommunities = communities.filter(c => c.is_member);
  const featuredCommunities = communities.filter(c => c.status === 'featured');

  return {
    communities,
    myCommunities,
    featuredCommunities,
    loading,
    createCommunity,
    updateCommunity,
    deleteCommunity,
    joinCommunity,
    leaveCommunity,
    refetch: fetchCommunities,
  };
};

export const useCommunity = (id: string) => {
  const { user } = useAuth();
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('communities')
          .select('*, creator:profiles!communities_creator_id_fkey(*)')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (user) {
          const { data: membership } = await supabase
            .from('community_members')
            .select('id')
            .eq('user_id', user.id)
            .eq('community_id', id)
            .single();
          setCommunity({ ...data, is_member: !!membership });
        } else {
          setCommunity(data);
        }
      } catch {
        setCommunity(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetch();
  }, [id, user]);

  return { community, loading, setCommunity };
};
