import { useState, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const useFollows = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const follow = useCallback(async (userIdToFollow: string) => {
    if (!user || user.id === userIdToFollow) return { error: new Error('Cannot follow yourself') };
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('follows')
        .insert({ follower_id: user.id, following_id: userIdToFollow });
      
      if (error) throw error;
      toast.success('Seguindo!');
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao seguir';
      toast.error(message);
      return { error: err as Error };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const unfollow = useCallback(async (userIdToUnfollow: string) => {
    if (!user) return { error: new Error('Not authenticated') };
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userIdToUnfollow);
      
      if (error) throw error;
      toast.success('Deixou de seguir');
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deixar de seguir';
      toast.error(message);
      return { error: err as Error };
    } finally {
      setLoading(false);
    }
  }, [user]);

  return { follow, unfollow, loading };
};
