import { useEffect, useState } from 'react';
import { getGameDetails } from '@/lib/api';
import { useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export const GamePage = () => {
  const { id } = useParams();
  const [gameData, setGameData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGameData() {
      try {
        const data = await getGameDetails(id);
        setGameData(data);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGameData();
  }, [id]);

  if (loading) {
    return <p>Loading games...</p>;
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-6">{gameData.name}</h1>
      <div className="container mx-auto px-4 py-8">
        <h1>{gameData.name}</h1>
        <p>{gameData.alternative_names}</p>
        <img
          src={gameData.background_image}
          alt={gameData.name}
          className="w-96 h-auto object-cover rounded-md mb-4"
        />
        <div dangerouslySetInnerHTML={{ __html: gameData.description }} />
        {gameData.developers.map((developer) => (
          <p key={developer.id}>{developer.name}</p>
        ))}
        {gameData.genres.map((genre) => (
          <Badge key={genre.id}>{genre.name}</Badge>
        ))}
        {gameData.platforms.map((platform) => (
          <Badge key={platform.platform.id}>{platform.platform.name}</Badge>
        ))}
        <p>{gameData.playtime}</p>
        {gameData.publishers.map((publisher) => (
          <p key={publisher.id}>{publisher.name}</p>
        ))}
        <p>{gameData.rating}</p>
        {gameData.ratings.map((rating) => (
          <p key={rating.id}>
            {rating.title} ({rating.percent})
          </p>
        ))}
        {gameData.tags.map((tag) => (
          <Badge key={tag.id}>{tag.name}</Badge>
        ))}
        <p>{gameData.released ? gameData.released : 'Not released yet'}</p>
      </div>
    </>
  );
};
