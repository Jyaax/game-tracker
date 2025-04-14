import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const ScreenshotsCarousel = ({ screenshots, trailers }) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
        {trailers?.map((trailer) => (
          <CarouselItem key={trailer.id} className="md:basis-1/2 lg:basis-1/3">
            <div className="flex flex-col aspect-video">
              <video
                controls
                className="h-full w-full object-cover rounded-lg"
                poster={trailer.preview}
              >
                <source src={trailer.data.max} type="video/mp4" />
                <source src={trailer.data["480"]} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p className="text-sm text-center mt-2 line-clamp-2">
                {trailer.name}
              </p>
            </div>
          </CarouselItem>
        ))}
        {screenshots.map((screenshot) => (
          <CarouselItem
            key={screenshot.id}
            className="md:basis-1/2 lg:basis-1/3"
          >
            <Dialog>
              <DialogTrigger className="w-full">
                <div className="flex items-center justify-center aspect-video">
                  <img
                    src={screenshot.image}
                    alt={screenshot.name}
                    className="h-full w-full object-cover rounded-lg hover:opacity-90 transition-opacity"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0">
                <img
                  src={screenshot.image}
                  alt={screenshot.name}
                  className="w-full h-auto rounded-lg"
                />
              </DialogContent>
            </Dialog>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
