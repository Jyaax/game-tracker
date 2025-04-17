import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameManagementDialog } from "@/components/gameManagementDialog";
import { useState, useEffect } from "react";
import { gameService } from "@/api/database/games";
import { useAuth } from "@/contexts/AuthContext";
import { Bookmark, BookOpen, BookX, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const GameActions = ({ game, onUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const checkGameStatus = async () => {
    if (!user || !game) return;

    try {
      const [libraryCheck, wishlistCheck] = await Promise.all([
        gameService.checkGameInLibrary(user.id, game.id),
        gameService.checkGameInWishlist(user.id, game.id),
      ]);

      setIsInLibrary(!!libraryCheck);
      setIsInWishlist(!!wishlistCheck);
    } catch (error) {
      console.error("Error checking game status:", error);
    }
  };

  useEffect(() => {
    checkGameStatus();
  }, [user, game]);

  const handleDialogOpenChange = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      checkGameStatus();
      if (onUpdate) onUpdate();
    }
  };

  const handleAddToLibrary = async () => {
    try {
      await gameService.addToLibrary(user.id, game.id);
      setIsInLibrary(true);
      if (isInWishlist) {
        await gameService.removeFromWishlist(user.id, game.id);
        setIsInWishlist(false);
      }
      toast({
        title: "Success",
        description: "Game added to library",
      });
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error adding to library:", error);
      toast({
        title: "Error",
        description: "Failed to add game to library",
        variant: "destructive",
      });
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await gameService.addToWishlist(user.id, game.id);
      setIsInWishlist(true);
      toast({
        title: "Success",
        description: "Game added to wishlist",
      });
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to add game to wishlist",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromLibrary = async () => {
    try {
      await gameService.removeFromLibrary(user.id, game.id);
      setIsInLibrary(false);
      toast({
        title: "Success",
        description: "Game removed from library",
      });
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error removing from library:", error);
      toast({
        title: "Error",
        description: "Failed to remove game from library",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromWishlist = async () => {
    try {
      await gameService.removeFromWishlist(user.id, game.id);
      setIsInWishlist(false);
      toast({
        title: "Success",
        description: "Game removed from wishlist",
      });
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to remove game from wishlist",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Game</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {isInLibrary ? (
              <Button className="w-full" onClick={handleRemoveFromLibrary}>
                <BookX className="mr-2 h-4 w-4" />
                Remove from Library
              </Button>
            ) : (
              <Button className="flex-1" onClick={handleAddToLibrary}>
                <BookOpen className="mr-2 h-4 w-4" />
                Add to Library
              </Button>
            )}
            <Button
              variant="outline"
              className="w-10 p-0"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {!isInLibrary && (
            <Button
              variant={"outline"}
              className="w-full"
              onClick={
                isInWishlist ? handleRemoveFromWishlist : handleAddToWishlist
              }
            >
              {isInWishlist ? (
                <>
                  <BookX className="mr-2 h-4 w-4" />
                  Remove from Wishlist
                </>
              ) : (
                <>
                  <Bookmark className="mr-2 h-4 w-4" />
                  Add to Wishlist
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>

      <GameManagementDialog
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        game={game}
        user={user}
        onUpdate={onUpdate}
      />
    </Card>
  );
};
