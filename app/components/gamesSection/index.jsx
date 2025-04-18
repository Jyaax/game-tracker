import { GameCard } from "@/components/gameCard";
import { Skeleton } from "@/components/ui/skeleton";
import InfiniteScroll from "react-infinite-scroll-component";

export const GamesSection = ({
  games,
  hasMore,
  onLoadMore,
  loading,
  cardSize = "medium",
}) => {
  const getGridClasses = () => {
    switch (cardSize) {
      case "small":
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";
      case "medium":
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";
      case "large":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3";
      default:
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";
    }
  };

  const getSkeletonHeight = () => {
    switch (cardSize) {
      case "small":
        return "h-[120px]";
      case "medium":
        return "h-[140px]";
      case "large":
        return "h-[150px]";
      default:
        return "h-[140px]";
    }
  };

  return (
    <InfiniteScroll
      dataLength={games.length}
      next={onLoadMore}
      hasMore={hasMore}
      loader={
        <div className={`grid ${getGridClasses()} gap-x-3 gap-y-4`}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="space-y-3">
              <Skeleton
                className={`${getSkeletonHeight()} w-full rounded-md`}
              />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      }
    >
      <div className={`grid ${getGridClasses()} gap-x-3 gap-y-4`}>
        {games.map((game) => (
          <GameCard key={game.id} game={game} size={cardSize} />
        ))}
      </div>
    </InfiniteScroll>
  );
};
