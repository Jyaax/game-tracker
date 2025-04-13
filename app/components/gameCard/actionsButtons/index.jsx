import { CirclePlus, LibraryBig, Heart } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { gameService } from "@/api/database/games";

export const ActionsButtons = ({ game, user }) => {
  const handleAddToWishlist = async () => {
    try {
      await gameService.addToWishlist(user.id, game.id);
      console.log("Game added to wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 mt-2">
        <div className="group relative flex items-center">
          <div className="absolute right-full mr-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[10px] group-hover:translate-x-0">
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Heart
                  className="h-5 w-5 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                  // fill="#ff0000"
                  strokeWidth={1.5}
                  onClick={handleAddToWishlist}
                />
              </TooltipTrigger>
              <TooltipContent>Add to wishlist</TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <LibraryBig
                  className="h-5 w-5 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                  strokeWidth={1.5}
                  onClick={() => {
                    console.log("Add to library:", game.name);
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>Add to library</TooltipContent>
            </Tooltip>
          </div>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <CirclePlus
                className="h-5 w-5 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                strokeWidth={1.5}
                onClick={() => {
                  console.log("Add to...", game.name);
                }}
              />
            </TooltipTrigger>
            <TooltipContent>More actions...</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};
