import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string;
          bio: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name: string;
          bio?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          username?: string;
          full_name?: string;
          bio?: string | null;
          avatar_url?: string | null;
        };
      };
      communities: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          image_url: string | null;
          status: 'active' | 'ended' | 'featured';
          rules: string | null;
          creator_id: string;
          members_count: number;
          created_at: string;
        };
      };
      posts: {
        Row: {
          id: string;
          content: string;
          type: 'text' | 'image' | 'video';
          media_url: string | null;
          author_id: string;
          community_id: string | null;
          likes_count: number;
          comments_count: number;
          created_at: string;
        };
      };
      comments: {
        Row: {
          id: string;
          content: string;
          author_id: string;
          post_id: string;
          created_at: string;
        };
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          created_at: string;
        };
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
      };
      community_members: {
        Row: {
          id: string;
          user_id: string;
          community_id: string;
          joined_at: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          participant1_id: string;
          participant2_id: string;
          last_message: string | null;
          last_message_at: string | null;
          created_at: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          created_at: string;
        };
      };
    };
  };
};
