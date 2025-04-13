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
import { supabase } from "@/api/database/supabase";
import { useState } from "react";

const formSchema = z
  .object({
    pseudo: z.string().min(1, "Pseudo is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    birthDate: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const SignUpForm = ({ onSwitchToLogin }) => {
  const { signUp } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pseudo: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const { data: authData, error: authError } = await signUp(
        values.email,
        values.password
      );

      if (authError) {
        console.error("Auth error:", authError);
        throw authError;
      }

      if (!authData?.user?.id) {
        throw new Error("User creation failed - no user ID returned");
      }

      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        pseudo: values.pseudo,
        birth_dt: values.birthDate || null,
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        throw new Error("Failed to create user profile");
      }

      setIsSuccess(true);
      form.reset();
    } catch (error) {
      console.error("Signup error:", error);
      if (error.message.includes("User already registered")) {
        form.setError("root", {
          message: "This email is already registered. Please log in instead.",
        });
      } else if (error.message.includes("Invalid email")) {
        form.setError("email", {
          message: "Please enter a valid email address",
        });
      } else {
        form.setError("root", { message: error.message });
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-4">
        <div className="text-green-600 bg-green-50 p-4 rounded-md">
          <h3 className="font-semibold">Account created!</h3>
          <p className="text-sm mt-2">
            Check your email and click the confirmation link to activate your
            account.
          </p>
        </div>
        <Button
          variant="link"
          onClick={() => {
            setIsSuccess(false);
            form.reset();
            onSwitchToLogin();
          }}
          className="w-full"
        >
          Go to login
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="pseudo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Pseudo <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter your pseudo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email <span className="text-red-500">*</span>
              </FormLabel>
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
              <FormLabel>
                Password <span className="text-red-500">*</span>
              </FormLabel>
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Confirm Password <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
          Sign Up
        </Button>
      </form>
    </Form>
  );
};
