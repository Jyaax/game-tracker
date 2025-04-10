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
      <p>AAAAAAAAAAAAAAAAh</p>
    </div>
  );
}
