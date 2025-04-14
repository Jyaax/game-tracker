const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

export const rawgApi = {
  // Fetch popular games
  getPopularGames: async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/games?key=${API_KEY}&ordering=-added&exclude_additions=true&exclude_tags=sex,nudity&platforms=4&page_size=10`
      );
      return await response.json();
    } catch (error) {
      throw new Error("Failed to fetch popular games");
    }
  },

  // Search games
  searchGames: async (query) => {
    try {
      const response = await fetch(
        `${BASE_URL}/games?key=${API_KEY}&search=${query}&page_size=20`
      );
      return await response.json();
    } catch (error) {
      throw new Error("Failed to search games");
    }
  },

  // Fetch game details
  getGameDetails: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`);
      return await response.json();
    } catch (error) {
      throw new Error("Failed to fetch game details");
    }
  },

  // Get game screenshots
  getGameScreenshots: async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/games/${id}/screenshots?key=${API_KEY}`
      );
      return await response.json();
    } catch (error) {
      throw new Error("Failed to fetch game screenshots");
    }
  },

  // Get game trailers
  getGameTrailers: async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/games/${id}/movies?key=${API_KEY}`
      );
      return await response.json();
    } catch (error) {
      throw new Error("Failed to fetch game trailers");
    }
  },

  // Get game stores
  getGameStores: async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/games/${id}/stores?key=${API_KEY}`
      );
      return await response.json();
    } catch (error) {
      throw new Error("Failed to fetch game stores");
    }
  },
};
