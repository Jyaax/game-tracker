import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { gameService } from "@/api/database/games";
import { useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

const formSchema = z.object({
  id_user: z.string().uuid(),
  id_game: z.number(),
  status: z.enum([
    "not_started",
    "in_progress",
    "completed",
    "dropped",
    "paused",
    "casual_play",
    "next_up",
  ]),
  platine: z.boolean().default(false),
  commentary: z.string().nullable().default(null),
  platforms: z.string().nullable().default(null),
  started_at: z.date().nullable().default(null),
  ended_at: z.date().nullable().default(null),
  rating: z.number().min(0).max(10).nullable().default(null),
  times_played: z.number().min(0).nullable().default(0),
});

const platforms = [
  "Steam",
  "Epic Games",
  "GOG",
  "Origin",
  "Ubisoft Connect",
  "Battle.net",
  "Physical",
  "Other",
];

const DatePicker = ({ field, label }) => (
  <FormItem className="flex flex-col">
    <FormLabel>{label}</FormLabel>
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value ? (
              format(field.value, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
    <FormMessage />
  </FormItem>
);

export const GameManagementForm = ({
  game,
  user,
  onClose,
  onUpdate,
  category,
}) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_user: user.id,
      id_game: game.id,
      status: "not_started",
      platine: false,
      commentary: null,
      platforms: null,
      started_at: null,
      ended_at: null,
      rating: null,
      times_played: 0,
    },
  });

  // Check if the game exists in the library
  useEffect(() => {
    const checkExistingGame = async () => {
      try {
        if (!game || !game.id) {
          console.error("Invalid game data:", { game });
          return;
        }

        // Only check for existing game if we're in the library category
        if (category === "library") {
          const existingGame = await gameService.checkGameInLibrary(
            user.id,
            game.id
          );
          if (existingGame) {
            console.log("Loading existing game data:", existingGame);
            // Format dates correctly
            const startedAt = existingGame.started_at
              ? new Date(existingGame.started_at)
              : null;
            const endedAt = existingGame.ended_at
              ? new Date(existingGame.ended_at)
              : null;

            const platforms = existingGame.platforms
              ? typeof existingGame.platforms === "string"
                ? existingGame.platforms
                : JSON.stringify(existingGame.platforms)
              : null;

            const formData = {
              id_user: user.id,
              id_game: game.id,
              status: existingGame.status || "not_started",
              platine: existingGame.platine || false,
              commentary: existingGame.commentary || null,
              platforms: platforms,
              started_at: startedAt,
              ended_at: endedAt,
              rating: existingGame.rating || null,
              times_played: existingGame.times_played || 0,
            };

            console.log("Setting form data:", formData);
            form.reset(formData, {
              keepDefaultValues: false,
            });
            return;
          }
        }

        // If we're in wishlist or no existing game found, use default values
        console.log("Using default values");
        form.reset({
          id_user: user.id,
          id_game: game.id,
          status: "not_started",
          platine: false,
          commentary: null,
          platforms: null,
          started_at: null,
          ended_at: null,
          rating: null,
          times_played: 0,
        });
      } catch (error) {
        console.error("Error loading game data:", error);
        form.setError("root", {
          message: "Error loading game data",
        });
      }
    };

    checkExistingGame();
  }, [game, game?.id, user.id, form, category]);

  const onSubmit = async (values) => {
    try {
      // Format dates to YYYY-MM-DD
      const formatDate = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      // Use id_game for Supabase operations (it's the RAWG ID)
      const gameId = game?.id;
      if (!gameId) {
        console.error("Game ID is missing:", game);
        form.setError("root", {
          message: "Game ID is missing",
        });
        return;
      }

      console.log("Using game ID for Supabase:", gameId);

      const dataToSave = {
        ...values,
        id_game: gameId,
        status: values.status || "not_started",
        platine: values.platine || false,
        commentary: values.commentary || null,
        platforms: values.platforms || null,
        started_at: formatDate(values.started_at),
        ended_at: formatDate(values.ended_at),
        rating: values.rating || null,
        times_played: values.times_played || 0,
      };

      console.log("Saving game data:", dataToSave);

      // If coming from wishlist, add to library first
      if (category === "wishlist") {
        console.log("Adding to library:", gameId);
        await gameService.addToLibrary(user.id, gameId, dataToSave);
        // Then remove from wishlist
        try {
          // Get the wishlist entry first to get its ID
          const wishlistEntry = await gameService.checkGameInWishlist(
            user.id,
            gameId
          );
          if (wishlistEntry) {
            console.log("Removing from wishlist:", wishlistEntry.id);
            await gameService.removeFromWishlist(user.id, wishlistEntry.id);
          }
        } catch (error) {
          console.error("Error removing from wishlist:", error);
        }
      } else {
        // Otherwise update the library
        try {
          // Since we're in the library category, we know the game exists
          await gameService.updateLibrary(user.id, gameId, dataToSave);
        } catch (error) {
          console.error("Error updating library:", error);
          form.setError("root", {
            message: "Error updating library",
          });
          return;
        }
      }

      // Force refresh the data
      if (onUpdate) {
        onUpdate(gameId);
      }

      onClose(false);
    } catch (error) {
      console.error("Error saving game:", error);
      form.setError("root", {
        message: "Error saving game",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full">
        <img
          src={game.background_image}
          alt={game.name}
          className="w-full h-48 object-cover object-top rounded-md"
        />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-6"
        >
          {form.formState.errors.root && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded-md">
              {form.formState.errors.root.message}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="not_started">Not Started</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="dropped">Dropped</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="casual_play">Casual Play</SelectItem>
                      <SelectItem value="next_up">Next to play</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="platforms"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Platforms</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between h-10",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? field.value
                                .split(",")
                                .map((platform) => platform.trim())
                                .join(", ")
                            : "Select platforms"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search platform..." />
                        <CommandEmpty>No platform found.</CommandEmpty>
                        <CommandGroup>
                          {platforms.map((platform) => (
                            <CommandItem
                              key={platform}
                              onSelect={() => {
                                const currentValue = field.value
                                  ? field.value.split(",")
                                  : [];
                                const newValue = currentValue.includes(platform)
                                  ? currentValue.filter((p) => p !== platform)
                                  : [...currentValue, platform];
                                field.onChange(newValue.join(","));
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value?.includes(platform)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {platform}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="platine"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-center h-[100px]">
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer mb-0">
                      Platine
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="started_at"
              render={({ field }) => (
                <DatePicker field={field} label="Started at" />
              )}
            />

            <FormField
              control={form.control}
              name="ended_at"
              render={({ field }) => (
                <DatePicker field={field} label="Ended at" />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating (0-10)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      {...field}
                      value={field.value === null ? "" : field.value}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? null
                            : parseInt(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="times_played"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Times Played</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      value={field.value ?? 0}
                      onChange={(e) => {
                        const value = e.target.value
                          ? parseInt(e.target.value)
                          : 0;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="commentary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commentary</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-80 self-end">
            Apply
          </Button>
        </form>
      </Form>
    </div>
  );
};
