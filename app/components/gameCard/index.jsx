import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CirclePlus, LibraryBig, Heart } from "lucide-react";

export const GameCard = ({ game }) => (
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
        <div className="flex items-center gap-2 mt-2">
          <div className="group relative flex items-center">
            <div className="absolute right-full mr-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[10px] group-hover:translate-x-0">
              <LibraryBig
                className="h-5 w-5 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                strokeWidth={1.5}
                onClick={() => {
                  console.log("Add to library:", game.name);
                }}
              />
              <Heart
                className="h-5 w-5 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                // fill="#ff0000"
                strokeWidth={1.5}
                onClick={() => {
                  console.log("Add to wishlist:", game.name);
                }}
              />
            </div>
            <CirclePlus
              className="h-5 w-5 cursor-pointer transition-transform hover:scale-110 active:scale-95"
              strokeWidth={1.5}
              onClick={() => {
                console.log("Add to...", game.name);
              }}
            />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
