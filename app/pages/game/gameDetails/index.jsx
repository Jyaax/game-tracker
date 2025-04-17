import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StoreLink } from "../storeLink";
import { GameActions } from "../gameActions";

export const GameDetails = ({ details, stores }) => {
  return (
    <div className="space-y-8">
      <GameActions game={details} />

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Release Date
            </h3>
            <p>{details.released || "Not released yet"}</p>
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Rating
            </h3>
            <p>{details.rating}/5</p>
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Developers
            </h3>
            <p>
              {details.developers?.map((d) => d.name).join(", ") || "Unknown"}
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Publishers
            </h3>
            <p>
              {details.publishers?.map((p) => p.name).join(", ") || "Unknown"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {details.platforms?.map((platform) => (
              <Badge key={platform.platform.id} variant="outline">
                {platform.platform.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {stores?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available on</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stores.map((store) => (
                <StoreLink key={store.id} url={store.url} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
