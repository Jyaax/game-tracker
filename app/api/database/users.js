import { supabase } from "./supabase";

export const userService = {
  // Create a user
  createUser: async (userData) => {
    try {
      const { data, error } = await supabase.from("users").insert(userData);

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error("Failed to create user");
    }
  },

  // Fetch a user
  getUser: async (userId) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error("Failed to fetch user");
    }
  },
};
