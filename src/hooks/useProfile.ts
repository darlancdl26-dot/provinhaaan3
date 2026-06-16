import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { Profile } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useProfile = (username?: string) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!username) { setLoading(false); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;
      setProfile(data);

      // Fetch counts
      const [{ count: fc }, { count: fgc }] = await Promise.all([
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', data.id),
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', data.id),
      ]);
      setFollowersCount(fc || 0);
      setFollowingCount(fgc || 0);

      if (user && user.id !== data.id) {
        const { data: follow } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', user.id)
          .eq('following_id', data.id)
          .single();
        setIsFollowing(!!follow);
      }
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [username, user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const toggleFollow = async () => {
    if (!user || !profile || user.id === profile.id) return;

    if (isFollowing) {
      setIsFollowing(false);
      setFollowersCount(prev => Math.max(0, prev - 1));
      await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', profile.id);
    } else {
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
      await supabase.from('follows').insert({ follower_id: user.id, following_id: profile.id });
    }
  };

  return { profile, loading, followersCount, followingCount, isFollowing, toggleFollow, refetch: fetchProfile };
};

export const useSearchProfiles = (query: string) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setProfiles([]); return; }
    
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
          .limit(10);
        setProfiles(data || []);
      } catch {
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  return { profiles, loading };
};
