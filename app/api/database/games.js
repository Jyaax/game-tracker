import { supabase } from "@/api/database/supabase";

export const gameService = {
  // Add a game to the wishlist
  addToWishlist: async (userId, gameId) => {
    try {
      const { data, error } = await supabase.from("wishlist").insert({
        id_user: userId,
        id_game: gameId,
        wished_at: new Date(),
      });

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(`Failed to add game to wishlist: ${error.message}`);
      }
      return data;
    } catch (error) {
      console.error("Error in addToWishlist:", error);
      throw error;
    }
  },

  // Fetch the wishlist of a user
  getWishlist: async (userId) => {
    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select("*")
        .eq("id_user", userId);

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(`Failed to fetch wishlist: ${error.message}`);
      }
      return data;
    } catch (error) {
      console.error("Error in getWishlist:", error);
      throw error;
    }
  },

  // Add a game to the library
  addToLibrary: async (userId, gameId, data = {}) => {
    try {
      const { data: result, error } = await supabase
        .from("library")
        .insert({
          id_user: userId,
          id_game: gameId,
          status: data.status || "not_started", // not_started, in_progress, completed, abandoned, paused,
          completion: data.completion || false,
          platine: data.platine || false,
          playtime: data.playtime || null,
          commentary: data.commentary || null,
          platforms: data.platforms || null,
          added_at: data.added_at || new Date(),
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      throw new Error("Failed to add game to library");
    }
  },

  // Fetch the library of a user
  getLibrary: async (userId) => {
    try {
      const { data, error } = await supabase
        .from("library")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error("Failed to fetch library");
    }
  },
};
