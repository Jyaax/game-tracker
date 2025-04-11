import { useState, useEffect } from 'react';
import { getPopularGames } from '../../lib/api';
import { GameCard } from '@/components/gameCard';
import { Skeleton } from '@/components/ui/skeleton';

export const HomePage = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGames() {
      try {
        const data = await getPopularGames();
        setGames(data.results.slice(0, 20));
      } catch (err) {
        console.error('Erreur:', err);
        setError(
          'Impossible de charger les jeux. Vérifiez votre clé API dans .env'
        );
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Welcome to GameTracker</h1>

      {error ? (
        <div className="text-destructive">{error}</div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-6">
            All time popular games
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="space-y-4">
                    <Skeleton className="h-48 w-full rounded-md" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
              : games.map((game) => <GameCard key={game.id} game={game} />)}
          </div>
        </>
      )}
    </>
  );
};
