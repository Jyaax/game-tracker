import { supabase } from "@/api/database/supabase";

export const gameService = {
  // Fetch the wishlist of a user
  getWishlist: async (userId) => {
    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select("*")
        .eq("id_user", userId);

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error("Failed to fetch wishlist");
    }
  },

  // Add a game to the wishlist
  addToWishlist: async (userId, gameId, data = {}) => {
    try {
      const { data: result, error } = await supabase
        .from("wishlist")
        .insert({
          id_user: userId,
          id_game: gameId,
          wished_at: new Date(),
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Remove a game from the wishlist
  removeFromWishlist: async (userId, gameId) => {
    try {
      const { data, error } = await supabase
        .from("wishlist")
        .delete()
        .eq("id_user", userId)
        .eq("id_game", gameId);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error in removeFromWishlist:", error);
      throw error;
    }
  },

  // Fetch the library of a user
  getLibrary: async (userId, gameId) => {
    try {
      const { data, error } = await supabase
        .from("library")
        .select("*")
        .eq("id_user", userId);

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Check if a game exists in the library and return its data
  checkGameInLibrary: async (userId, gameId) => {
    try {
      const { data, error } = await supabase
        .from("library")
        .select("*")
        .eq("id_user", userId)
        .eq("id_game", gameId);

      if (error) return null;
      return data?.[0] || null;
    } catch (error) {
      return null;
    }
  },

  // Add a game to the library
  addToLibrary: async (userId, gameId, data = {}) => {
    try {
      await supabase
        .from("wishlist")
        .delete()
        .eq("id_user", userId)
        .eq("id_game", gameId);

      const { data: result, error } = await supabase
        .from("library")
        .insert({
          id_user: userId,
          id_game: gameId,
          status: data.status || "not_started",
          platine: data.platine || false,
          commentary: data.commentary || null,
          platforms: data.platforms ? JSON.parse(data.platforms) : null,
          started_at: data.started_at || null,
          ended_at: data.ended_at || null,
          rating: data.rating || null,
          times_played: data.times_played || 0,
          added_at: new Date(),
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Update a game in the library
  updateLibrary: async (userId, gameId, data) => {
    try {
      const exists = await gameService.checkGameInLibrary(userId, gameId);
      if (!exists) {
        return await gameService.addToLibrary(userId, gameId, data);
      }

      const { data: result, error } = await supabase
        .from("library")
        .update({
          status: data.status,
          platine: data.platine,
          commentary: data.commentary,
          platforms: data.platforms ? JSON.parse(data.platforms) : null,
          started_at: data.started_at,
          ended_at: data.ended_at,
          rating: data.rating,
          times_played: data.times_played,
        })
        .eq("id_user", userId)
        .eq("id_game", gameId)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Remove a game from the library
  removeFromLibrary: async (userId, gameId) => {
    try {
      const { data, error } = await supabase
        .from("library")
        .delete()
        .eq("id_user", userId)
        .eq("id_game", gameId);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error in removeFromLibrary:", error);
      throw error;
    }
  },
};
