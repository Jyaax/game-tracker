import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { SquarePen, Trash, Sparkles, Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { DeleteDialog } from "./deleteDialog";
import { GameManagementDialog } from "@/components/gameManagementDialog";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { gameService } from "@/api/database/games";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor("background_image", {
    header: "",
    cell: ({ row, table }) => {
      const image = row.getValue("background_image");
      const isHidden = row.original.hidden;
      const game = row.original;
      const onRefresh = table.options.meta?.onRefresh;
      const { user } = useAuth();

      const handleToggleVisibility = async () => {
        try {
          await gameService.updateGameVisibility(user.id, game.id, !isHidden);
          if (onRefresh) onRefresh(game.id);
        } catch (error) {
          console.error("Error toggling game visibility:", error);
        }
      };

      return (
        <div className="flex items-center justify-center space-x-3">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleVisibility}
                >
                  {isHidden ? (
                    <EyeClosed className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isHidden ? "Show game" : "Hide game"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <img
            src={image}
            alt={row.getValue("name")}
            className="h-10 w-10 rounded-md object-cover"
          />
        </div>
      );
    },
    size: "11%",
  }),
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Link to={`/games/${row.original.id}`} className="block w-fit">
        {row.getValue("name")}
      </Link>
    ),
    size: "39%",
  }),
  columnHelper.accessor("rating", {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Rating
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const rating = row.getValue("rating");
      return rating === null ? "-" : rating;
    },
    size: "12%",
  }),
  columnHelper.accessor("times_played", {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Times played
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.getValue("times_played") || "-",
    size: "12%",
  }),
  columnHelper.accessor("platine", {
    header: "Platine",
    cell: ({ row }) => {
      const isPlatine = row.getValue("platine");
      return isPlatine ? (
        <Sparkles
          className="h-4 w-4 fill-yellow-400 stroke-yellow-400"
          strokeWidth={1.5}
        />
      ) : null;
    },
    size: "8%",
  }),
  columnHelper.accessor("actions", {
    header: "Actions",
    cell: ({ row, table }) => {
      const [openGameDialog, setOpenGameDialog] = useState(false);
      const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
      const game = row.original;
      const onRefresh = table.options.meta?.onRefresh;
      const { user } = useAuth();

      const handleGameDialogOpenChange = (open) => {
        setOpenGameDialog(open);
        if (!open && onRefresh) {
          onRefresh();
        }
      };

      return (
        <div className="flex items-center justify-center space-x-2">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpenGameDialog(true)}
                >
                  <SquarePen className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit game</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <GameManagementDialog
            open={openGameDialog}
            onOpenChange={handleGameDialogOpenChange}
            game={game}
            user={user}
            category="library"
            onUpdate={(gameId) => {
              if (onRefresh) onRefresh(gameId);
            }}
          />
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpenDeleteDialog(true)}
                >
                  <Trash
                    className="h-4 w-4 fill-red-400 stroke-red-400"
                    strokeWidth={2}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove from library</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DeleteDialog
            open={openDeleteDialog}
            onOpenChange={setOpenDeleteDialog}
            game={game}
            onRefresh={onRefresh}
          />
        </div>
      );
    },
    size: "18%",
  }),
];
