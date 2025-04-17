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
  const [sorting, setSorting] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

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
            id_user: item.id_user,
            id_game: item.id_game,
            name: gameDetails.name,
            background_image: gameDetails.background_image,
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
          onRefresh={() => setRefreshKey((prev) => prev + 1)}
        />
      </CardContent>
    </Card>
  );
};
