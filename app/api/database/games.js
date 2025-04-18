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
      console.error("Error checking game in library:", error);
      return null;
    }
  },

  // Check if a game exists in the wishlist
  checkGameInWishlist: async (userId, gameId) => {
    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select("*")
        .eq("id_user", userId)
        .eq("id_game", gameId);

      if (error) return null;
      return data?.[0] || null;
    } catch (error) {
      console.error("Error checking game in wishlist:", error);
      return null;
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
          status: data.status || "not_started",
          platine: data.platine || false,
          commentary: data.commentary || null,
          platforms: data.platforms || null,
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
        .update(data)
        .eq("id_user", userId)
        .eq("id_game", gameId)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error("Error updating library:", error);
      throw new Error("Unable to update library");
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

  updateGameVisibility: async (userId, gameId, hidden) => {
    const { data, error } = await supabase
      .from("library")
      .update({ hidden })
      .eq("id_user", userId)
      .eq("id_game", gameId)
      .select();

    if (error) throw error;
    return data;
  },

  updateWishlistVisibility: async (userId, gameId, hidden) => {
    const { data, error } = await supabase
      .from("wishlist")
      .update({ hidden })
      .eq("id_user", userId)
      .eq("id_game", gameId)
      .select();

    if (error) throw error;
    return data;
  },
};
