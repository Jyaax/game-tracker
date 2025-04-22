import { CirclePlus, BookOpen, Bookmark, BookX } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { gameService } from "@/api/database/games";
import { useState, useEffect } from "react";
import { GameManagementDialog } from "@/components/gameManagementDialog";

export const ActionsButtons = ({ game: gameData, user }) => {
  const [library, setLibrary] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get the game object and its RAWG ID
  const game = gameData?.game || gameData;
  const rawgId = game?.id;

  const fetchLibrary = async () => {
    try {
      if (!rawgId) {
        console.error("RAWG ID is missing:", game);
        return;
      }
      const libraryData = await gameService.checkGameInLibrary(user.id, rawgId);
      setLibrary(libraryData ? [libraryData] : []);
    } catch (error) {
      console.error("Error fetching library:", error);
    }
  };

  const fetchWishlist = async () => {
    try {
      if (!rawgId) {
        console.error("RAWG ID is missing:", game);
        return;
      }
      const wishlistData = await gameService.getWishlist(user.id);
      setWishlist(wishlistData);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  useEffect(() => {
    if (!rawgId) {
      console.error("RAWG ID is missing:", game);
      return;
    }
    fetchLibrary();
    fetchWishlist();
  }, [user, rawgId]);

  const handleAddToWishlist = async () => {
    try {
      if (!rawgId) {
        console.error("RAWG ID is missing:", game);
        return;
      }
      await gameService.addToWishlist(user.id, rawgId);
      setWishlist([...wishlist, { id_game: rawgId }]);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const handleRemoveFromWishlist = async () => {
    try {
      const wishlistItem = wishlist.find((item) => item.id_game === rawgId);
      if (!wishlistItem) {
        console.error("Game not found in wishlist");
        return;
      }
      await gameService.removeFromWishlist(user.id, wishlistItem.id);
      setWishlist(wishlist.filter((item) => item.id !== wishlistItem.id));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const handleAddToLibrary = async () => {
    try {
      if (!rawgId) {
        console.error("RAWG ID is missing:", game);
        return;
      }
      console.log("Adding to library:", rawgId);
      await gameService.addToLibrary(user.id, rawgId);
      setLibrary([...library, { id_game: rawgId }]);
      handleRemoveFromWishlist();
    } catch (error) {
      console.error("Error adding to library:", error);
    }
  };

  const handleRemoveFromLibrary = async () => {
    try {
      const libraryItem = library.find((item) => item.id_game === rawgId);
      if (!libraryItem) {
        console.error("Game not found in library");
        return;
      }
      await gameService.removeFromLibrary(user.id, libraryItem.id);
      setLibrary(library.filter((item) => item.id !== libraryItem.id));
    } catch (error) {
      console.error("Error removing from library:", error);
    }
  };

  if (!rawgId) {
    console.error("RAWG ID is missing:", game);
    return null;
  }

  const isInWishlist = wishlist.some((item) => item.id_game === rawgId);
  const isInLibrary = library.some((item) => item.id_game === rawgId);

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 mt-2">
        <div className="group relative flex items-center">
          <div className="absolute right-full mr-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[10px] group-hover:translate-x-0">
            {!library.some((item) => item.id_game === rawgId) &&
              (wishlist.some((item) => item.id_game === rawgId) ? (
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <Bookmark
                      className="h-5 w-5 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                      fill="#ffffff"
                      strokeWidth={1.5}
                      stroke="#ffffff"
                      onClick={handleRemoveFromWishlist}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Remove from wishlist</TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <Bookmark
                      className="h-5 w-5 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                      strokeWidth={1.5}
                      onClick={handleAddToWishlist}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Add to wishlist</TooltipContent>
                </Tooltip>
              ))}
            {library.some((item) => item.id_game === rawgId) ? (
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
                  <BookOpen
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
                onClick={() => setIsDialogOpen(true)}
              />
            </TooltipTrigger>
            <TooltipContent>Manage game</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <GameManagementDialog
        game={game}
        user={user}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={
          isInWishlist ? "wishlist" : isInLibrary ? "library" : "wishlist"
        }
        onUpdate={() => {
          fetchLibrary();
          fetchWishlist();
        }}
      />
    </TooltipProvider>
  );
};
