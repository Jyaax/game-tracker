import { supabase } from './supabase';

export const usersService = {
  async getUsers() {
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    return data;
  },
};
