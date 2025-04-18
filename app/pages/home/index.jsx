import { useState, useEffect } from "react";
import { rawgApi } from "@/api/rawg/games";
import { CardSizeSelector } from "@/components/cardSizeSelector";
import { GamesSection } from "@/components/gamesSection";

export const HomePage = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [cardSize, setCardSize] = useState("medium");

  const handleSizeChange = (size) => {
    setCardSize(size);
  };

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome to GameTracker</h1>
        <CardSizeSelector onSizeChange={handleSizeChange} />
      </div>

      {error ? (
        <div className="text-destructive">{error}</div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-6">
            All time popular games
          </h2>
          <GamesSection
            games={games}
            hasMore={hasMore}
            onLoadMore={fetchMoreGames}
            loading={loading}
            cardSize={cardSize}
          />
        </>
      )}
    </div>
  );
};
