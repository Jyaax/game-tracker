import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { gameService } from "@/api/database/games";
import { rawgApi } from "@/api/rawg/games";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "./table";
import { columns } from "./columns";

export const Library = () => {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchLibrary = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const libraryData = await gameService.getLibrary(user.id);
      const gamesWithDetails = await Promise.all(
        libraryData.map(async (item) => {
          const gameDetails = await rawgApi.getGameDetails(item.id_game);

          let libraryPlatforms = [];
          if (item.platforms) {
            if (typeof item.platforms === "string") {
              libraryPlatforms = item.platforms.split(",").map((p) => p.trim());
            } else if (Array.isArray(item.platforms)) {
              libraryPlatforms = item.platforms;
            }
          }

          return {
            id: gameDetails.id,
            id_user: item.id_user,
            id_game: item.id_game,
            status: item.status,
            rating: item.rating,
            started_at: item.started_at,
            ended_at: item.ended_at,
            times_played: item.times_played,
            platforms: libraryPlatforms,
            platine: item.platine,
            commentary: item.commentary,

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
    fetchLibrary();
  }, [user, refreshKey]);

  const statusGroups = {
    "In progress": games.filter((game) => game.status === "in_progress"),
    "Next up": games.filter((game) => game.status === "next_up"),
    "Not started": games.filter((game) => game.status === "not_started"),
    Completed: games.filter((game) => game.status === "completed"),
    Paused: games.filter((game) => game.status === "paused"),
    Dropped: games.filter((game) => game.status === "dropped"),
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
                  onRefresh={() => setRefreshKey((prev) => prev + 1)}
                />
              </div>
            )
        )}
      </CardContent>
    </Card>
  );
};
