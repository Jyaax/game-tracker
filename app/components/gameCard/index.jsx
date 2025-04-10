import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    </CardContent>
  </Card>
);
