import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { gameService } from "@/api/database/games";
import { rawgApi } from "@/api/rawg/games";

import { Loader2 } from "lucide-react";

export const Wishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setError(null);
        const wishlistData = await gameService.getWishlist(user.id);
        setWishlist(wishlistData);

        const gamesData = [];
        for (const item of wishlistData) {
          try {
            const gameDetails = await rawgApi.getGameDetails(item.id_game);
            gamesData.push(gameDetails);
          } catch (gameError) {
            console.error(
              `Erreur lors de la récupération du jeu ${item.id_game}:`,
              gameError
            );
          }
        }
        setGames(gamesData);
      } catch (error) {
        console.error("Erreur lors de la récupération de la wishlist:", error);
        setError("Impossible de charger votre liste de souhaits");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (games.length === 0) {
    return <div>Votre liste de souhaits est vide</div>;
  }

  return (
    <ul>
      {games.map((game) => (
        <li key={game.id}>{game.name}</li>
      ))}
    </ul>
  );
};
