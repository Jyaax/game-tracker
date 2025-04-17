import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { gameService } from "@/api/database/games";
import { useAuth } from "@/contexts/AuthContext";

export const DeleteDialog = ({ open, onOpenChange, game, onRefresh }) => {
  const { user } = useAuth();

  const handleDelete = async () => {
    try {
      await gameService.removeFromLibrary(user.id, game.id_game);
      onOpenChange(false);
      if (typeof onRefresh === "function") {
        onRefresh();
      }
    } catch (error) {
      console.error("Error deleting game:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Game</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {game.name} from your library?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
