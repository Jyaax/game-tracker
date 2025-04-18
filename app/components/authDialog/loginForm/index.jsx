import { useAuth } from "@/contexts/AuthContext";
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

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginForm = () => {
  const { login } = useAuth();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await login(values.email, values.password);
      if (response.error) {
        throw new Error(response.error.message);
      }
      form.reset();
    } catch (error) {
      if (error.message.includes("Invalid login credentials")) {
        form.setError("root", {
          message: "Incorrect email or password. Please try again.",
        });
      } else if (error.message.includes("Email not confirmed")) {
        form.setError("root", {
          message: "Please confirm your email before logging in",
        });
      } else {
        form.setError("root", { message: "An error occurred during login" });
      }
      return;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <div className="text-sm text-red-500 bg-red-50 p-2 rounded-md">
            {form.formState.errors.root.message}
          </div>
        )}
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </Form>
  );
};
