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

export const GameCard = ({ game }) => {
  const { user, isAuthenticated } = useAuth();

  return (
    <Card key={game.id}>
      <CardHeader>
        <CardTitle>{game.name}</CardTitle>
        <CardDescription>
          {game.genres?.map((genre) => (
            <Badge variant="outline" key={genre.id}>
              {genre.name}
            </Badge>
          ))}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <img
          src={game.background_image}
          alt={game.name}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <p className="text-muted-foreground">Rating: {game.rating}/5</p>
        <p className="text-muted-foreground">Released: {game.released}</p>
        <div className="flex justify-between items-center">
          <Link to={`/games/${game.id}`} className="block w-fit">
            <Button variant="outline" className="mt-4">
              More info
            </Button>
          </Link>
          {isAuthenticated && <ActionsButtons game={game} user={user} />}
        </div>
      </CardContent>
    </Card>
  );
};
