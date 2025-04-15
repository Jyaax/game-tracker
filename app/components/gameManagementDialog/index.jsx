import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

  const handleOpenChange = (newOpen) => {
    if (!newOpen && document.activeElement?.type === "submit") {
      return;
    }
    onOpenChange(newOpen);
  };

  const handleClose = (shouldClose) => {
    console.log("handleClose called with:", shouldClose);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Game</DialogTitle>
          <DialogDescription>
            Add or update this game in your library.
          </DialogDescription>
        </DialogHeader>
        <GameManagementForm
          game={game}
          user={user}
          category={category}
          onClose={handleClose}
          onUpdate={onUpdate}
        />
      </DialogContent>
    </Dialog>
  );
};
