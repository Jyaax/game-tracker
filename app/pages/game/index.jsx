import { useEffect, useState } from "react";
import { rawgApi } from "@/api/rawg/games";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ScreenshotsCarousel } from "./screenshotsCarousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { SeriesCarousel } from "./seriesCarousel";
import { GameDetails } from "./gameDetails";

export const GamePage = () => {
  const { id } = useParams();
  const [gameData, setGameData] = useState({
    details: null,
    trailers: null,
    stores: null,
    screenshots: null,
    series: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchGameData = async () => {
    try {
      const details = await rawgApi.getGameDetails(id);
      const trailers = await rawgApi.getGameTrailers(id);
      const stores = await rawgApi.getGameStores(id);
      const screenshots = await rawgApi.getGameScreenshots(id);
      const series = await rawgApi.getGameSeries(id);

      setGameData({
        details,
        trailers: trailers?.results || [],
        stores: stores?.results || [],
        screenshots: screenshots?.results || [],
        series: series?.results || [],
      });
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-96 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!gameData.details) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Game not found</h1>
      </div>
    );
  }

  const { details } = gameData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">{details.name}</h1>
          <div className="flex flex-wrap gap-2">
            {details.genres?.map((genre) => (
              <Badge key={genre.id} variant="secondary">
                {genre.name}
              </Badge>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <img
              src={details.background_image}
              alt={details.name}
              className="w-full h-[400px] object-cover object-top rounded-t-md"
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: details.description }}
                  />
                </ScrollArea>
              </CardContent>
            </Card>

            <SeriesCarousel series={gameData.series} />
          </div>

          <GameDetails
            details={details}
            stores={gameData.stores}
            onUpdate={fetchGameData}
          />
        </div>

        {gameData.screenshots?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-[1200px] mx-auto">
                <ScreenshotsCarousel
                  screenshots={gameData.screenshots}
                  trailers={gameData.trailers}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
