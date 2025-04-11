import { supabase } from './supabase';

export const favoritesService = {
  async getFavorites(userId) {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  },

  async addFavorite(userId, gameId) {
    const { data, error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, game_id: gameId }]);

    if (error) throw error;
    return data;
  },

  async removeFavorite(userId, gameId) {
    const { data, error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('game_id', gameId);

    if (error) throw error;
    return data;
  },

  async isFavorite(userId, gameId) {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .eq('game_id', gameId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },
};
