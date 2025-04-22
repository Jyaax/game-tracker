import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GameManagementForm } from "./gameManagementForm";

export const GameManagementDialog = ({
  game,
  user,
  category = "wishlist",
  open,
  onOpenChange,
  onUpdate,
}) => {
  if (!game || !user) {
    return null;
  }

  // Get the actual game object if it's nested
  const gameData = game.game || game;

  const handleOpenChange = (newOpen) => {
    if (!newOpen && document.activeElement?.type === "submit") {
      return;
    }
    onOpenChange(newOpen);
  };

  const handleClose = (shouldClose) => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="md:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Manage Game</DialogTitle>
          <DialogDescription>
            Add or update this game in your library.
          </DialogDescription>
        </DialogHeader>
        <GameManagementForm
          game={gameData}
          user={user}
          category={category}
          onClose={handleClose}
          onUpdate={onUpdate}
        />
      </DialogContent>
    </Dialog>
  );
};
