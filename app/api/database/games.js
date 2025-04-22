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

      if (error) {
        console.error("Error in addToWishlist:", error);
        throw error;
      }
      return result;
    } catch (error) {
      console.error("Error in addToWishlist:", error);
      throw error;
    }
  },

  // Remove a game from the wishlist by its database entry ID
  removeFromWishlist: async (userId, entryId) => {
    try {
      const { data, error } = await supabase
        .from("wishlist")
        .delete()
        .eq("id_user", userId)
        .eq("id", entryId);
      if (error) {
        console.error("Error in removeFromWishlist:", error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error("Error in removeFromWishlist:", error);
      throw error;
    }
  },

  // Fetch the library of a user
  getLibrary: async (userId) => {
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

      if (error) {
        console.error("Error in checkGameInLibrary:", error);
        return null;
      }

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

      if (error) {
        console.error("Error in checkGameInWishlist:", error);
        return null;
      }

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
        })
        .select()
        .single();

      if (error) {
        console.error("Error in addToLibrary:", error);
        throw error;
      }
      return result;
    } catch (error) {
      console.error("Error in addToLibrary:", error);
      throw error;
    }
  },

  // Remove a game from the library by its database entry ID
  removeFromLibrary: async (userId, entryId) => {
    try {
      const { data, error } = await supabase
        .from("library")
        .delete()
        .eq("id_user", userId)
        .eq("id", entryId);
      if (error) {
        console.error("Error in removeFromLibrary:", error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error("Error in removeFromLibrary:", error);
      throw error;
    }
  },

  // Update a game in the library
  updateLibrary: async (userId, gameId, data) => {
    try {
      const { data: result, error } = await supabase
        .from("library")
        .update({
          status: data.status || "not_started",
          platine: data.platine || false,
          commentary: data.commentary || null,
          platforms: data.platforms || null,
          started_at: data.started_at || null,
          ended_at: data.ended_at || null,
          rating: data.rating || null,
          times_played: data.times_played || 0,
        })
        .eq("id_user", userId)
        .eq("id_game", gameId)
        .select();

      if (error) {
        console.error("Error in updateLibrary:", error);
        throw error;
      }
      return result;
    } catch (error) {
      console.error("Error in updateLibrary:", error);
      throw error;
    }
  },

  updateGameVisibility: async (userId, entryId, hidden) => {
    try {
      const { data, error } = await supabase
        .from("library")
        .update({ hidden })
        .eq("id_user", userId)
        .eq("id", entryId)
        .select();

      if (error) {
        console.error("Error in updateGameVisibility:", error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error("Error updating game visibility:", error);
      throw error;
    }
  },

  updateWishlistVisibility: async (userId, entryId, hidden) => {
    try {
      const { data, error } = await supabase
        .from("wishlist")
        .update({ hidden })
        .eq("id_user", userId)
        .eq("id", entryId)
        .select();

      if (error) {
        console.error("Error in updateWishlistVisibility:", error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error("Error updating wishlist visibility:", error);
      throw error;
    }
  },
};
