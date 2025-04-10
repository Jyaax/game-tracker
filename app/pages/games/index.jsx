import { Navbar } from '../../components/Navbar';
import { useEffect, useState } from 'react';
import { getPopularGames } from '../../lib/api';

export function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGames() {
      try {
        const data = await getPopularGames();
        setGames(data.results);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <p>Loading games...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Popular Games</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div key={game.id} className="border rounded-lg p-4">
              <img
                src={game.background_image}
                alt={game.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h2 className="text-xl font-semibold">{game.name}</h2>
              <p className="text-muted-foreground">Rating: {game.rating} / 5</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
