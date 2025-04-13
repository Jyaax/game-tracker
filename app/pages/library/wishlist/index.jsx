import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { gameService } from "@/api/database/games";
import { rawgApi } from "@/api/rawg/games";
import { Loader2 } from "lucide-react";

export const Wishlist = () => {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setError(null);
        const wishlistData = await gameService.getWishlist(user.id);

        const gamesData = [];
        for (const item of wishlistData) {
          try {
            const gameDetails = await rawgApi.getGameDetails(item.id_game);
            gamesData.push(gameDetails);
          } catch (gameError) {
            console.error(`Error fetching game ${item.id_game}:`, gameError);
          }
        }
        setGames(gamesData);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setError("Unable to load your wishlist");
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
    return (
      <div className="flex items-center justify-center h-64">
        <p>{error}</p>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Your wishlist is empty</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <p>{game.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
