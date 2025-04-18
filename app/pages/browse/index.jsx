import { useState, useEffect } from "react";
import { rawgApi } from "@/api/rawg/games";
import { SearchForm } from "./searchForm";
import { useSearchParams } from "react-router-dom";
import { CardSizeSelector } from "@/components/cardSizeSelector";
import { GamesSection } from "@/components/gamesSection";

export const BrowsePage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [cardSize, setCardSize] = useState("large");

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

  useEffect(() => {
    if (initialSearch) {
      onSubmit({ searchQuery: initialSearch });
    }
  }, [initialSearch]);

  return (
    <div className="h-full">
      <div className="container h-full">
        {games.length === 0 ? (
          <div className="h-full flex items-center justify-center absolute inset-0">
            <div className="w-full max-w-md">
              <SearchForm
                onSubmit={onSubmit}
                loading={loading}
                initialSearch={initialSearch}
              />
              {error && <div className="text-destructive mt-4">{error}</div>}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <div className="w-full">
                <SearchForm
                  onSubmit={onSubmit}
                  loading={loading}
                  initialSearch={initialSearch}
                />
                {error && <div className="text-destructive mt-4">{error}</div>}
              </div>
              <div className="flex justify-end">
                <CardSizeSelector onSizeChange={setCardSize} />
              </div>
            </div>
            <GamesSection
              games={games}
              hasMore={false}
              onLoadMore={() => {}}
              loading={loading}
              cardSize={cardSize}
            />
          </div>
        )}
      </div>
    </div>
  );
};
