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
import { useEffect, useRef } from "react";

const formSchema = z.object({
  searchQuery: z.string().min(1, "Search query is required"),
});

export const SearchForm = ({ onSubmit, loading, initialSearch = "" }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchQuery: initialSearch,
    },
  });
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="searchQuery"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder="Search for a game..."
                  {...field}
                  ref={inputRef}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} className="self-end">
          {loading ? "Searching..." : "Search"}
        </Button>
      </form>
    </Form>
  );
};
