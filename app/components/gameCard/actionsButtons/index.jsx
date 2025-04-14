import { CirclePlus, LibraryBig, Heart, BookX } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { gameService } from "@/api/database/games";
import { useState, useEffect } from "react";

export const ActionsButtons = ({ game, user }) => {
  const [library, setLibrary] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const libraryData = await gameService.getLibrary(user.id);
        setLibrary(libraryData);
      } catch (error) {
        console.error("Error fetching library:", error);
      }
    };

    const fetchWishlist = async () => {
      try {
        const wishlistData = await gameService.getWishlist(user.id);
        setWishlist(wishlistData);
      } catch (error) {
        console.error("Error fetching library:", error);
      }
    };

    fetchLibrary();
    fetchWishlist();
  }, [user]);

  const handleAddToWishlist = async () => {
    try {
      await gameService.addToWishlist(user.id, game.id);
      setWishlist([...wishlist, { id_game: game.id }]);
      console.log("Game added to wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const handleRemoveFromWishlist = async () => {
    try {
      await gameService.removeFromWishlist(user.id, game.id);
      setWishlist(wishlist.filter((item) => item.id_game !== game.id));
      console.log("Game removed from wishlist!");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const handleAddToLibrary = async () => {
    try {
      await gameService.addToLibrary(user.id, game.id);
      setLibrary([...library, { id_game: game.id }]);
      console.log("Game added to library!");
    } catch (error) {
      console.error("Error adding to library:", error);
    }
  };

  const handleRemoveFromLibrary = async () => {
    try {
      await gameService.removeFromLibrary(user.id, game.id);
      setLibrary(library.filter((item) => item.id_game !== game.id));
      console.log("Game removed from library!");
    } catch (error) {
      console.error("Error removing from library:", error);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 mt-2">
        <div className="group relative flex items-center">
          <div className="absolute right-full mr-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[10px] group-hover:translate-x-0">
            {wishlist.some((item) => item.id_game === game.id) ? (
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Heart
                    className="h-5 w-5 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    fill="#ff0000"
                    strokeWidth={1.5}
                    stroke="#ff0000"
                    onClick={handleRemoveFromWishlist}
                  />
                </TooltipTrigger>
                <TooltipContent>Remove from wishlist</TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Heart
                    className="h-5 w-5 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    strokeWidth={1.5}
                    onClick={handleAddToWishlist}
                  />
                </TooltipTrigger>
                <TooltipContent>Add to wishlist</TooltipContent>
              </Tooltip>
            )}
            {library.some((item) => item.id_game === game.id) ? (
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <BookX
                    className="h-5 w-5 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    strokeWidth={1.5}
                    onClick={handleRemoveFromLibrary}
                  />
                </TooltipTrigger>
                <TooltipContent>Remove from library</TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <LibraryBig
                    className="h-5 w-5 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    strokeWidth={1.5}
                    onClick={handleAddToLibrary}
                  />
                </TooltipTrigger>
                <TooltipContent>Add to library</TooltipContent>
              </Tooltip>
            )}
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
