import { Navbar } from '../../components/Navbar';
import { useState, useEffect } from 'react';
import { getPopularGames } from '../../lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const HomePage = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadGames() {
      try {
        const data = await getPopularGames();
        console.log('jeux:', data.results);
        setGames(data.results.slice(0, 20));
      } catch (err) {
        console.error('Erreur:', err);
        setError(
          'Impossible de charger les jeux. Vérifiez votre clé API dans .env'
        );
      }
    }

    loadGames();
  }, []);

  return (
    <>
      <Navbar />

      <h1>Welcome to GameTracker</h1>

      {error ? (
        <div>{error}</div>
      ) : (
        <>
          <h2>Popular Games Right Now</h2>
          {games.map((game) => (
            <Card>
              <CardHeader>
                <CardTitle>{game.name}</CardTitle>
                <CardDescription>
                  {genres.map((genre) => (
                    <p>{genre.name}</p>
                  ))}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Rating: {game.rating}/5</p>
                <p>Released: {game.released}</p>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </>
  );
};
