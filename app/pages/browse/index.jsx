import { useState } from "react";
import { GameCard } from "@/components/gameCard";
import { rawgApi } from "@/api/rawg/games";
import { SearchForm } from "./searchForm";

export const BrowsePage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const searchData = await rawgApi.searchGames(data.searchQuery);
      setGames(searchData.results.slice(0, 20));
    } catch (err) {
      console.error("Error:", err);
      setError("Unable to load games. Please check your API key in .env");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full">
      <div className="container h-full">
        {games.length === 0 ? (
          <div className="h-full flex items-center justify-center absolute inset-0">
            <div className="w-full max-w-md">
              <SearchForm onSubmit={onSubmit} loading={loading} />
              {error && <div className="text-destructive mt-4">{error}</div>}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <SearchForm onSubmit={onSubmit} loading={loading} />
              {error && <div className="text-destructive mt-4">{error}</div>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
