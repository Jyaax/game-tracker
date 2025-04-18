import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionsButtons } from "./actionsButtons";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { GameManagementDialog } from "@/components/gameManagementDialog";

const sizeClasses = {
  small: {
    card: "w-[200px]",
    image: "h-[120px]",
    title: "text-sm",
    description: "text-xs min-h-[1.25rem]",
    content: "text-xs",
  },
  medium: {
    card: "w-[240px]",
    image: "h-[140px]",
    title: "text-base",
    description: "text-sm min-h-[1.5rem]",
    content: "text-sm",
  },
  large: {
    card: "w-[420px]",
    image: "h-[150px]",
    title: "text-lg",
    description: "text-base min-h-[1.75rem]",
    content: "text-base",
  },
};

export const GameCard = ({ game, onUpdate, size = "medium" }) => {
  const { user, isAuthenticated } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const sizeClass = sizeClasses[size];

  const handleDialogOpenChange = (open) => {
    setIsDialogOpen(open);
    if (!open && onUpdate) {
      onUpdate();
    }
  };

  return (
    <Card className={sizeClass.card}>
      <CardHeader>
        <CardTitle className={`${sizeClass.title} truncate`}>
          {game.name}
        </CardTitle>
        <CardDescription className={`${sizeClass.description} line-clamp-1`}>
          {game.genres?.slice(0, 2).map((genre) => (
            <Badge variant="outline" key={genre.id} className="mr-1">
              {genre.name}
            </Badge>
          ))}
          {game.genres?.length > 2 && (
            <Badge variant="outline" className="mr-1">
              +{game.genres.length - 2}
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <img
          src={game.background_image}
          alt={game.name}
          className={`w-full ${sizeClass.image} object-cover rounded-md mb-4`}
        />
        <p className={`text-muted-foreground ${sizeClass.content}`}>
          Rating: {game.rating}/5
        </p>
        <p className={`text-muted-foreground ${sizeClass.content}`}>
          Released: {game.released}
        </p>
        <div className="flex justify-between items-center">
          <Link to={`/games/${game.id}`} className="block w-fit">
            <Button variant="outline" className="mt-4">
              More info
            </Button>
          </Link>
          {isAuthenticated && <ActionsButtons game={game} user={user} />}
        </div>
      </CardContent>
      {isAuthenticated && (
        <GameManagementDialog
          game={game}
          user={user}
          open={isDialogOpen}
          onOpenChange={handleDialogOpenChange}
          onUpdate={onUpdate}
        />
      )}
    </Card>
  );
};
