import { useState, useEffect } from "react";
import { supabase } from "@/api/database/supabase";

export const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getUserData() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError) throw authError;

        if (user) {
          const { data, error: dbError } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();

          if (dbError) throw dbError;
          setUser({
            ...user,
            ...data,
          });
        }
      } catch (err) {
        setError(err.message);
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }

    getUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-destructive">Error: {error}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold mb-6">Profile</h1>
      <div className="grid gap-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">User Profile</h2>
          <p>Email: {user?.email}</p>
          <p>Pseudo: {user?.pseudo}</p>
          <p>Created at: {new Date(user?.created_at).toLocaleDateString()}</p>
          <p>
            Last sign in: {new Date(user?.last_sign_in_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};
