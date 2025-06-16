import React, { useState, useEffect } from 'react';
import { Heart, TrendingUp, Loader2 } from 'lucide-react';
import MovieCard from './MovieCard';
import type { Movie } from '../types/Movie';
import { movieService } from '../services/movieService';

interface RecommendationsProps {
  userId: string;
}

const Recommendations: React.FC<RecommendationsProps> = ({ userId }) => {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const recs = await movieService.getUserRecommendations(userId);
        setRecommendations(recs);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  if (loading) {
    return (
      <div className="mb-12">
        <div className="flex items-center space-x-2 mb-6">
          <Heart className="w-6 h-6 text-red-400" />
          <h2 className="text-2xl font-bold text-white">Recommended for You</h2>
        </div>
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          <span className="ml-2 text-gray-300">Loading recommendations...</span>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="mb-12">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Popular Movies</h2>
        </div>
        <p className="text-gray-400 text-center py-6">
          Start watching movies to get personalized recommendations!
        </p>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center space-x-2 mb-6">
        <Heart className="w-6 h-6 text-red-400" />
        <h2 className="text-2xl font-bold text-white">Recommended for You</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {recommendations.slice(0, 10).map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Recommendations;