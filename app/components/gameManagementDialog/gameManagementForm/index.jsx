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

export const GameManagementForm = ({ game, user, onClose, onUpdate }) => {
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
        if (!game || typeof game.id === "undefined") {
          console.error("Invalid game data:", { game });
          return;
        }
        const existingGame = await gameService.checkGameInLibrary(
          user.id,
          game.id
        );
        if (existingGame) {
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
            status: existingGame.status,
            platine: existingGame.platine,
            commentary: existingGame.commentary,
            platforms: platforms,
            started_at: startedAt,
            ended_at: endedAt,
            rating: existingGame.rating,
            times_played: existingGame.times_played,
          };

          form.reset(formData, {
            keepDefaultValues: false,
          });
        }
      } catch (error) {
        console.error("Error loading game data:", error);
        form.setError("root", {
          message: "Error loading game data",
        });
      }
    };

    checkExistingGame();
  }, [game, game?.id, user.id]);

  const onSubmit = async (values) => {
    try {
      const dataToSave = {
        ...values,
        id_game: game.id,
      };

      const result = await gameService.updateLibrary(
        user.id,
        game.id,
        dataToSave
      );

      if (onUpdate) {
        onUpdate(result);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {form.formState.errors.root && (
          <div className="text-sm text-red-500 bg-red-50 p-2 rounded-md">
            {form.formState.errors.root.message}
          </div>
        )}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
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
                  <SelectItem value="next_up">Next to play</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="platine"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Platine</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="platforms"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Platforms</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
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
          name="started_at"
          render={({ field }) => (
            <DatePicker field={field} label="Started at" />
          )}
        />

        <FormField
          control={form.control}
          name="ended_at"
          render={({ field }) => <DatePicker field={field} label="Ended at" />}
        />

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
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
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
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <Button type="submit" className="w-full">
          Apply
        </Button>
      </form>
    </Form>
  );
};
