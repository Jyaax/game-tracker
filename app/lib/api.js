const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

export async function searchGames(query) {
  const response = await fetch(
    `${BASE_URL}/games?key=${API_KEY}&search=${query}&page_size=10`
  );
  return response.json();
}

export async function getGameDetails(id) {
  const response = await fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`);
  return response.json();
}

export async function getPopularGames() {
  const response = await fetch(
    `${BASE_URL}/games?key=${API_KEY}&ordering=-rating&exclude_additions=true&exclude_tags=sex,nudity&platforms=4&page_size=10`
  );
  return response.json();
}
