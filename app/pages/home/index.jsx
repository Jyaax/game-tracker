import { Navbar } from '../../components/Navbar';
import { useState, useEffect } from 'react';
import { getPopularGames } from '../../lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Welcome to GameTracker</h1>

        {error ? (
          <div className="text-destructive">{error}</div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-6">
              Popular Games Right Now
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <Card key={game.id}>
                  <CardHeader>
                    <CardTitle>{game.name}</CardTitle>
                    <CardDescription>
                      {game.genres?.map((genre) => (
                        <Badge variant="outline" key={genre.id}>
                          {genre.name}
                        </Badge>
                      ))}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={game.background_image}
                      alt={game.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <p className="text-muted-foreground">
                      Rating: {game.rating}/5
                    </p>
                    <p className="text-muted-foreground">
                      Released: {game.released}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
