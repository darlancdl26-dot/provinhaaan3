import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import { Post } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const usePosts = (communityId?: string, authorId?: string) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          author:profiles!posts_author_id_fkey(*),
          community:communities(id, title, image_url, category)
        `)
        .order('created_at', { ascending: false });

      if (communityId) {
        query = query.eq('community_id', communityId);
      }
      if (authorId) {
        query = query.eq('author_id', authorId);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;

      // Check liked status
      if (user && data) {
        const postIds = data.map((p: Post) => p.id);
        const { data: likes } = await supabase
          .from('likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postIds);

        const likedIds = new Set(likes?.map((l: { post_id: string }) => l.post_id) || []);
        const postsWithLikes = data.map((p: Post) => ({ ...p, is_liked: likedIds.has(p.id) }));
        setPosts(postsWithLikes);
      } else {
        setPosts(data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching posts');
    } finally {
      setLoading(false);
    }
  }, [communityId, authorId, user]);

  // Track pending like/unlike actions to avoid double-counting between optimistic updates and realtime events
  const pendingLikes = useRef<Set<string>>(new Set());

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Real-time subscription for likes: update likes_count and is_liked on INSERT/DELETE
  useEffect(() => {
    const channel = supabase
      .channel('public:likes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'likes' }, (payload) => {
        const like = payload.new as { id: string; user_id: string; post_id: string };
        // ignore events originating from our pending optimistic action
        if (pendingLikes.current.has(like.post_id) && like.user_id === user?.id) return;
        setPosts(prev => prev.map(p => {
          if (p.id === like.post_id) {
            const newCount = (p.likes_count || 0) + 1;
            const isCurrentUser = like.user_id === user?.id;
            return { ...p, likes_count: newCount, is_liked: isCurrentUser ? true : p.is_liked };
          }
          return p;
        }));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'likes' }, (payload) => {
        const like = payload.old as { id: string; user_id: string; post_id: string };
        if (pendingLikes.current.has(like.post_id) && like.user_id === user?.id) return;
        setPosts(prev => prev.map(p => {
          if (p.id === like.post_id) {
            const newCount = Math.max(0, (p.likes_count || 0) - 1);
            const isCurrentUser = like.user_id === user?.id;
            return { ...p, likes_count: newCount, is_liked: isCurrentUser ? false : p.is_liked };
          }
          return p;
        }));
      });

    channel.subscribe();

    return () => {
      try {
        channel.unsubscribe();
        // removeChannel may not exist in older clients; ignore errors
        // @ts-ignore
        supabase.removeChannel && supabase.removeChannel(channel);
      } catch (e) {
        // ignore
      }
    };
  }, [user]);

  const createPost = async (postData: {
    content: string;
    type: 'text' | 'image' | 'video';
    media_url?: string;
    community_id?: string;
  }) => {
    if (!user) return { error: new Error('Not authenticated') };
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          ...postData,
          author_id: user.id,
          likes_count: 0,
          comments_count: 0,
        })
        .select(`
          *,
          author:profiles!posts_author_id_fkey(*),
          community:communities(id, title, image_url, category)
        `)
        .single();

      if (error) throw error;
      setPosts(prev => [{ ...data, is_liked: false }, ...prev]);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('author_id', user?.id);

      if (error) throw error;
      setPosts(prev => prev.filter(p => p.id !== postId));
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;
    
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const isLiked = post.is_liked;

    // Optimistic update
    // mark as pending to avoid double increment from realtime
    pendingLikes.current.add(postId);
    setPosts(prev => prev.map(p => 
      p.id === postId 
        ? { ...p, is_liked: !isLiked, likes_count: isLiked ? p.likes_count - 1 : p.likes_count + 1 }
        : p
    ));

    try {
      if (isLiked) {
        await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', postId);
        await supabase.from('posts').update({ likes_count: post.likes_count - 1 }).eq('id', postId);
      } else {
        await supabase.from('likes').insert({ user_id: user.id, post_id: postId });
        await supabase.from('posts').update({ likes_count: post.likes_count + 1 }).eq('id', postId);
      }
      // done with pending action
      pendingLikes.current.delete(postId);
    } catch (err) {
      // Revert optimistic update
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, is_liked: isLiked, likes_count: post.likes_count } : p
      ));
      pendingLikes.current.delete(postId);
    }
  };

  const createComment = async (postId: string, content: string) => {
    if (!user) return { error: new Error('Not authenticated'), data: null };
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({ content, author_id: user.id, post_id: postId })
        .select('*, author:profiles!comments_author_id_fkey(*)')
        .single();

      if (error) throw error;

      // Update comments count
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p
      ));

      return { error: null, data };
    } catch (err) {
      return { error: err as Error, data: null };
    }
  };

  const deleteComment = async (commentId: string, postId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('author_id', user?.id);

      if (error) throw error;

      // Update comments count
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, comments_count: Math.max(0, p.comments_count - 1) } : p
      ));

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return { posts, loading, error, createPost, deletePost, toggleLike, createComment, deleteComment, refetch: fetchPosts };
};

export const useFeedPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      // Get following IDs
      const { data: follows } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);
      
      const followingIds = follows?.map((f: { following_id: string }) => f.following_id) || [];
      
      // Get community IDs
      const { data: memberships } = await supabase
        .from('community_members')
        .select('community_id')
        .eq('user_id', user.id);
      
      const communityIds = memberships?.map((m: { community_id: string }) => m.community_id) || [];

      // Fetch posts from followed users and communities
      let query = supabase
        .from('posts')
        .select(`
          *,
          author:profiles!posts_author_id_fkey(*),
          community:communities(id, title, image_url, category)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      const conditions = [];
      if (followingIds.length > 0) conditions.push(`author_id.in.(${followingIds.join(',')})`);
      if (communityIds.length > 0) conditions.push(`community_id.in.(${communityIds.join(',')})`);
      conditions.push(`author_id.eq.${user.id}`);

      if (conditions.length > 0) {
        query = query.or(conditions.join(','));
      }

      const { data } = await query;

      if (data) {
        const postIds = data.map((p: Post) => p.id);
        const { data: likes } = await supabase
          .from('likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postIds);

        const likedIds = new Set(likes?.map((l: { post_id: string }) => l.post_id) || []);
        setPosts(data.map((p: Post) => ({ ...p, is_liked: likedIds.has(p.id) })));
      }
    } catch (err) {
      console.error('Feed error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  // Real-time subscription for likes in feed
  useEffect(() => {
    const channel = supabase
      .channel('public:likes:feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'likes' }, (payload) => {
        const like = payload.new as { id: string; user_id: string; post_id: string };
        setPosts(prev => prev.map(p => {
          if (p.id === like.post_id) {
            const newCount = (p.likes_count || 0) + 1;
            const isCurrentUser = like.user_id === user?.id;
            return { ...p, likes_count: newCount, is_liked: isCurrentUser ? true : p.is_liked };
          }
          return p;
        }));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'likes' }, (payload) => {
        const like = payload.old as { id: string; user_id: string; post_id: string };
        setPosts(prev => prev.map(p => {
          if (p.id === like.post_id) {
            const newCount = Math.max(0, (p.likes_count || 0) - 1);
            const isCurrentUser = like.user_id === user?.id;
            return { ...p, likes_count: newCount, is_liked: isCurrentUser ? false : p.is_liked };
          }
          return p;
        }));
      });

    channel.subscribe();
    return () => {
      try {
        channel.unsubscribe();
        // @ts-ignore
        supabase.removeChannel && supabase.removeChannel(channel);
      } catch (e) {
        // ignore
      }
    };
  }, [user]);

  const toggleLike = async (postId: string) => {
    if (!user) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const isLiked = post.is_liked;

    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, is_liked: !isLiked, likes_count: isLiked ? p.likes_count - 1 : p.likes_count + 1 }
        : p
    ));

    try {
      if (isLiked) {
        await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', postId);
        await supabase.from('posts').update({ likes_count: post.likes_count - 1 }).eq('id', postId);
      } else {
        await supabase.from('likes').insert({ user_id: user.id, post_id: postId });
        await supabase.from('posts').update({ likes_count: post.likes_count + 1 }).eq('id', postId);
      }
    } catch {
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, is_liked: isLiked, likes_count: post.likes_count } : p
      ));
    }
  };

  const deletePost = async (postId: string) => {
    await supabase.from('posts').delete().eq('id', postId).eq('author_id', user?.id);
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  return { posts, loading, toggleLike, deletePost, refetch: fetchFeed };
};
