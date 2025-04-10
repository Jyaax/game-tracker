import { Navbar } from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { getGameDetails } from '@/lib/api';

export function GamePage({ gameId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGameData() {
      try {
        const data = await getGameDetails(gameId);
        setData(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGameData();
  }, [gameId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <p>Loading games...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <p>AAAAAAAAAAAAAAAAh</p>
    </div>
  );
}
