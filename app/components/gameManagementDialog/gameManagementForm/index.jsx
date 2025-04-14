import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const gameStatusEnum = z.enum([
  "not_started",
  "in_progress",
  "completed",
  "abandoned",
  "paused",
]);

const categoryEnum = z.enum(["wishlist", "library"]);

const formSchema = z.object({
  category: categoryEnum,
  status: gameStatusEnum.default("not_started"),
  started_at: z.date().nullable(),
  ended_at: z.date().nullable(),
  rating: z.number().min(0).max(10).nullable(),
  times_played: z.number().int().min(0).default(0),
  platine: z.boolean().default(false),
  commentary: z.string().max(1000).nullable(),
  platforms: z.array(z.string()).nullable(),
  added_at: z.date().default(() => new Date()),
});

export const GameManagementForm = () => {
  //   const form = useForm({
  //     resolver: zodResolver(formSchema),
  //     defaultValues: {
  //       status: "",
  //       email: "",
  //       password: "",
  //       confirmPassword: "",
  //       birthDate: "",
  //     },
  //   });
  return <div>GameManagementForm</div>;
};
