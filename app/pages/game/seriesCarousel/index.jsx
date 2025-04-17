import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const SeriesCarousel = ({ series }) => {
  const navigate = useNavigate();

  if (!series?.length) return null;

  const handleGameClick = (gameId) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/games/${gameId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Games in the same series</CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-[800px] mx-auto"
        >
          <CarouselContent>
            {series.map((game) => (
              <CarouselItem key={game.id} className="md:basis-1/2 lg:basis-1/3">
                <div
                  onClick={() => handleGameClick(game.id)}
                  className="group cursor-pointer"
                >
                  <Card className="overflow-hidden transition-all hover:scale-105 border-none">
                    <CardContent className="p-0">
                      <img
                        src={game.background_image}
                        alt={game.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-2">
                        <h3 className="font-medium group-hover:text-primary transition-colors">
                          {game.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(game.released).getFullYear()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-center gap-2 mt-4">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </CardContent>
    </Card>
  );
};
