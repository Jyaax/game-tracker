import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const ScreenshotsCarousel = ({ screenshots }) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
        {screenshots.map((screenshot) => (
          <CarouselItem
            key={screenshot.id}
            className="md:basis-1/2 lg:basis-1/3"
          >
            <div className="flex items-center justify-center h-64">
              <img
                src={screenshot.image}
                alt={screenshot.name}
                className="max-h-full w-auto object-contain"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
