import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { gameService } from "@/api/database/games";
import { rawgApi } from "@/api/rawg/games";
import { Loader2 } from "lucide-react";

export const Library = () => {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        setError(null);
        const libraryData = await gameService.getLibrary(user.id);

        const gamesWithDetails = await Promise.all(
          libraryData.map(async (item) => {
            try {
              const details = await rawgApi.getGameDetails(item.id_game);
              return { ...item, rawg: details };
            } catch (e) {
              return { ...item, rawg: null };
            }
          })
        );
        console.log(gamesWithDetails);
        setGames(gamesWithDetails);
      } catch (error) {
        console.error("Error fetching library:", error);
        setError("Unable to load your library");
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
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
        <p>Your library is empty</p>
      </div>
    );
  }

  return (
    <div>
      {[
        { label: "Not Started", status: "not_started" },
        { label: "Completed", status: "completed" },
        { label: "Paused", status: "paused" },
        { label: "Next on list", status: "next_up" },
        { label: "In Progress", status: "in_progress" },
        { label: "Dropped", status: "dropped" },
      ].map(({ label, status }) => {
        const filteredGames = games.filter((game) => game.status === status);
        if (filteredGames.length === 0) return null;
        return (
          <div key={status} className="mb-8">
            <h2 className="text-xl font-bold mb-2">{label}</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGames.map((game) => (
                <li key={game.id_game}>
                  <p>
                    {game.rawg?.name || "Nom inconnu"} | {game.rawg?.rating} |{" "}
                    {game.times_played}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
