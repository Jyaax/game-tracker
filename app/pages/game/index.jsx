import { useEffect, useState } from "react";
import { rawgApi } from "@/api/rawg/games";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ScreenshotsCarousel } from "./screenshotsCarousel";
import { StoreLink } from "./storeLink";

export const GamePage = () => {
  const { id } = useParams();
  const [gameData, setGameData] = useState({
    details: null,
    trailers: null,
    stores: null,
    screenshots: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGameData() {
      try {
        const details = await rawgApi.getGameDetails(id);
        const trailers = await rawgApi.getGameTrailers(id);
        const stores = await rawgApi.getGameStores(id);
        const screenshots = await rawgApi.getGameScreenshots(id);

        setGameData({
          details,
          trailers: trailers?.results,
          stores: stores?.results,
          screenshots: screenshots?.results,
        });
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGameData();
  }, [id]);

  if (loading) {
    return <p>Loading game data...</p>;
  }

  const { details } = gameData;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{details.name}</h1>

      <div className="flex flex-col gap-8">
        <img
          src={details.background_image}
          alt={details.name}
          className="w-full max-w-2xl h-auto object-cover rounded-md"
        />

        <div className="space-y-4">
          <div dangerouslySetInnerHTML={{ __html: details.description }} />
        </div>

        <div className="flex flex-wrap gap-2">
          {details.genres.map((genre) => (
            <Badge key={genre.id}>{genre.name}</Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {details.platforms.map((platform) => (
            <Badge key={platform.platform.id}>{platform.platform.name}</Badge>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-semibold">Developers</h2>
            <p>{details.developers.map((d) => d.name).join(", ")}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Publishers</h2>
            <p>{details.publishers.map((p) => p.name).join(", ")}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Release Date</h2>
            <p>{details.released || "Not released yet"}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Rating</h2>
            <p>{details.rating}/5</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Available on</h2>
            <div className="flex flex-wrap gap-2">
              {gameData.stores?.map((store) => (
                <StoreLink key={store.id} url={store.url} />
              ))}
            </div>
          </div>
        </div>
        {gameData.screenshots.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold">Screenshots</h2>
            <ScreenshotsCarousel
              screenshots={gameData.screenshots}
              trailers={gameData.trailers}
            />
          </div>
        )}
      </div>
    </div>
  );
};
