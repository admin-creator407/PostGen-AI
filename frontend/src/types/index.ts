export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  userId: string;
  topic: string;
  tone: 'professional' | 'casual' | 'storytelling' | 'thought-leadership' | 'custom-rewrite' | 'carousel';
  length: 'short' | 'medium' | 'long' | 'na';
  generatedContent: string;
  hashtags: string[];
  promptUsed?: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface Stats {
  totalPosts: number;
  favoritePosts: number;
  postsThisWeek: number;
  mostUsedTone: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
