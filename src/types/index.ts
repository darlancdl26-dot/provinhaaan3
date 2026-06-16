export interface Profile {
  id: string;
  username: string;
  full_name: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at?: string;
  followers_count?: number;
  following_count?: number;
  is_following?: boolean;
}

export interface Community {
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
  creator?: Profile;
  is_member?: boolean;
}

export interface Post {
  id: string;
  content: string;
  type: 'text' | 'image' | 'video';
  media_url: string | null;
  author_id: string;
  community_id: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  author?: Profile;
  community?: Community;
  is_liked?: boolean;
  show_likes?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author_id: string;
  post_id: string;
  created_at: string;
  author?: Profile;
  replies?: Reply[];
  replies_count?: number;
}

export interface Reply {
  id: string;
  content: string;
  author_id: string;
  comment_id: string;
  created_at: string;
  author?: Profile;
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface CommunityMember {
  id: string;
  user_id: string;
  community_id: string;
  joined_at: string;
}

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message: string | null;
  last_message_at: string | null;
  created_at: string;
  other_user?: Profile;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: Profile;
}

export type PostType = 'text' | 'image' | 'video';
export type CommunityStatus = 'active' | 'ended' | 'featured';
export type CommunityCategory = 
  | 'tecnologia'
  | 'musica'
  | 'arte'
  | 'games'
  | 'fitness'
  | 'culinaria'
  | 'viagens'
  | 'moda'
  | 'ciencia'
  | 'humor'
  | 'outros';
