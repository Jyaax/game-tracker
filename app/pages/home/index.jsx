import { useState, useEffect } from "react";
import { rawgApi } from "@/api/rawg/games";
import { GameCard } from "@/components/gameCard";
import { Skeleton } from "@/components/ui/skeleton";
import InfiniteScroll from "react-infinite-scroll-component";

export const HomePage = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreGames = async () => {
    try {
      const data = await rawgApi.getPopularGames(page + 1);
      setGames((prevGames) => [...prevGames, ...data.results]);
      setPage((prevPage) => prevPage + 1);
      setHasMore(data.results.length > 0);
    } catch (err) {
      console.error("Error:", err);
      setError("Unable to load more games");
    }
  };

  useEffect(() => {
    async function loadGames() {
      try {
        const data = await rawgApi.getPopularGames(1);
        setGames(data.results);
        setHasMore(data.results.length > 0);
      } catch (err) {
        console.error("Error:", err);
        setError("Unable to load games. Please check your API key in .env");
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Welcome to GameTracker</h1>

      {error ? (
        <div className="text-destructive">{error}</div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-6">
            All time popular games
          </h2>
          <InfiniteScroll
            dataLength={games.length}
            next={fetchMoreGames}
            hasMore={hasMore}
            loader={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="space-y-4">
                    <Skeleton className="h-48 w-full rounded-md" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </InfiniteScroll>
        </>
      )}
    </>
  );
};
