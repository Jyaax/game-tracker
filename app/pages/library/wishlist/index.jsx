import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { gameService } from "@/api/database/games";
import { rawgApi } from "@/api/rawg/games";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "../table";
import { columns } from "./columns";

export const Wishlist = () => {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([{ id: "name", desc: false }]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRowUpdate = async (gameId) => {
    try {
      const updatedGame = await gameService.checkGameInWishlist(
        user.id,
        gameId
      );
      if (!updatedGame) {
        setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
        return;
      }

      const gameDetails = await rawgApi.getGameDetails(updatedGame.id_game);
      setGames((prevGames) =>
        prevGames.map((game) =>
          game.id === gameId
            ? {
                ...game,
                ...updatedGame,
                id: gameDetails.id,
                id_game: gameDetails.id,
                name: gameDetails.name,
                background_image: gameDetails.background_image,
              }
            : game
        )
      );
    } catch (error) {
      console.error("Error updating game:", error);
    }
  };

  const fetchWishlist = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const wishlistData = await gameService.getWishlist(user.id);
      const gamesWithDetails = await Promise.all(
        wishlistData.map(async (item) => {
          const gameDetails = await rawgApi.getGameDetails(item.id_game);
          return {
            id: gameDetails.id,
            entry_id: item.id,
            id_user: item.id_user,
            id_game: gameDetails.id,
            name: gameDetails.name,
            background_image: gameDetails.background_image,
            status: "not_started",
            platine: false,
            commentary: null,
            platforms: null,
            started_at: null,
            ended_at: null,
            rating: null,
            times_played: 0,
          };
        })
      );
      setGames(gamesWithDetails);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user, refreshKey]);

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!games.length) return <div>Your wishlist is empty</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Wishlist</CardTitle>
        <Input
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={filteredGames}
          sorting={sorting}
          setSorting={setSorting}
          onRefresh={handleRowUpdate}
        />
      </CardContent>
    </Card>
  );
};
