import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  searchQuery: z.string().min(2, {
    message: "Game must be at least 2 characters.",
  }),
});

export const SearchForm = ({ onSubmit, loading, initialSearch = "" }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchQuery: initialSearch,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="searchQuery"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search for a game</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input placeholder="Search for a game..." {...field} />
                </FormControl>
                <Button type="submit" disabled={loading} className="self-end">
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
