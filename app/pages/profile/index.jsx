import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const ProfilePage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getUserData() {
      const { data } = await supabase.from('users').select();
      console.log(data);
      if (data.length > 0) {
        setUsers(data[0]);
        setLoading(false);
      }
    }

    getUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-destructive">Error: {error}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold mb-6">Users</h1>
      <div className="grid gap-4">
        <p>{users.pseudo}</p>
      </div>
    </div>
  );
};
