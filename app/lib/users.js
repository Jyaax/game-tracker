import { supabase } from './supabase';

export const usersService = {
  async getUsers() {
    console.log('Supabase client:', supabase);
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Supabase response:', { data, error });
    return data;
  },
};
