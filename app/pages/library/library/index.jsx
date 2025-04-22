import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { gameService } from "@/api/database/games";
import { rawgApi } from "@/api/rawg/games";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "../table";
import { columns } from "./columns";

export const Library = () => {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([{ id: "name", desc: false }]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRowUpdate = async (gameId) => {
    try {
      const updatedGame = await gameService.checkGameInLibrary(user.id, gameId);
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

  const fetchLibrary = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const libraryData = await gameService.getLibrary(user.id);
      const gamesWithDetails = await Promise.all(
        libraryData.map(async (item) => {
          const gameDetails = await rawgApi.getGameDetails(item.id_game);
          return {
            id: gameDetails.id,
            entry_id: item.id,
            id_user: item.id_user,
            id_game: gameDetails.id,
            name: gameDetails.name,
            background_image: gameDetails.background_image,
            status: item.status || "not_started",
            platine: item.platine || false,
            commentary: item.commentary || null,
            platforms: item.platforms || null,
            started_at: item.started_at || null,
            ended_at: item.ended_at || null,
            rating: item.rating || null,
            times_played: item.times_played || 0,
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
    fetchLibrary();
  }, [user, refreshKey]);

  const statusGroups = {
    "In progress": games.filter((game) => game.status === "in_progress"),
    "Next up": games.filter((game) => game.status === "next_up"),
    Completed: games.filter((game) => game.status === "completed"),
    "Not started": games.filter((game) => game.status === "not_started"),
    Paused: games.filter((game) => game.status === "paused"),
    Dropped: games.filter((game) => game.status === "dropped"),
    "Casual play": games.filter((game) => game.status === "casual_play"),
  };

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!games.length) return <div>Your library is empty</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Library</CardTitle>
        <Input
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </CardHeader>
      <CardContent className="space-y-8">
        {Object.entries(statusGroups).map(
          ([status, games]) =>
            games.length > 0 && (
              <div key={status} className="space-y-4">
                <h2 className="text-lg font-semibold">{status}</h2>
                <DataTable
                  columns={columns}
                  data={games.filter((game) =>
                    game.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )}
                  sorting={sorting}
                  setSorting={setSorting}
                  onRefresh={handleRowUpdate}
                />
              </div>
            )
        )}
      </CardContent>
    </Card>
  );
};
