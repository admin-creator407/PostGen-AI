import api from './axios';
import { Post, Stats } from '../types';

export const getPosts = async (search?: string, favorite?: boolean): Promise<Post[]> => {
  const params: Record<string, any> = {};
  if (search) params.search = search;
  if (favorite) params.favorite = 'true';
  const response = await api.get('/posts', { params });
  return response.data;
};

export const generatePost = async (data: { topic: string; tone: string; length: string }): Promise<Post> => {
  const response = await api.post('/posts/generate', data);
  return response.data;
};

export const rewritePost = async (originalPost: string): Promise<Post> => {
  const response = await api.post('/posts/rewrite', { originalPost });
  return response.data;
};

export const generateCarousel = async (topic: string): Promise<Post> => {
  const response = await api.post('/posts/carousel', { topic });
  return response.data;
};

export const toggleFavoritePost = async (id: string): Promise<Post> => {
  const response = await api.patch(`/posts/${id}/favorite`);
  return response.data;
};

export const deletePost = async (id: string): Promise<{ message: string; id: string }> => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};

export const getStats = async (): Promise<Stats> => {
  const response = await api.get('/posts/stats');
  return response.data;
};
