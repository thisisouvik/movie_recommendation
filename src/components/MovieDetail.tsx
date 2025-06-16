import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Globe, Users, TrendingUp, Loader2 } from 'lucide-react';
import MovieCard from './MovieCard';
import type { Movie } from '../types/Movie';
import { movieService } from '../services/movieService';

interface MovieDetailProps {
  userId: string;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ userId }) => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const movieData = await movieService.getMovie(parseInt(id));
        setMovie(movieData);

        // Track movie view
        await movieService.trackMovieView(userId, parseInt(id));

        // Fetch recommendations
        setRecommendationsLoading(true);
        const recs = await movieService.getContentRecommendations(parseInt(id));
        setRecommendations(recs);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
        setRecommendationsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        <span className="ml-2 text-gray-300">Loading movie details...</span>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-xl">Movie not found</p>
        <Link to="/" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
          Go back to movies
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() || 'N/A';
  };

  const formatGenres = (genres: string) => {
    return genres.split(',').map(g => g.trim()).join(' • ');
  };

    return (
    <div className="max-w-7xl mx-auto px-4">
        {/* Back button */}
        <Link
        to="/"
        className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors group"
        >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Movies
        </Link>

        {/* Movie Details */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
        <div className="md:flex">
            {/* Movie Poster/Header */}
            <div className="md:w-2/5">
            <div className="h-96 md:h-full bg-gray-800 flex items-center justify-center p-8 border-r border-gray-700">
                <h1 className="text-white text-3xl md:text-4xl font-bold text-center leading-tight">
                {movie.title}
                </h1>
            </div>
            </div>

            {/* Movie Info */}
            <div className="md:w-3/5 p-8">
            {/* Rating and Stats */}
            <div className="flex flex-wrap items-center gap-6 mb-8 p-4 bg-gray-800 rounded-xl border border-gray-700">
                <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-400/10 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                </div>
                <div>
                    <span className="text-2xl font-bold text-white">
                    {movie.vote_average?.toFixed(1) || 'N/A'}
                    </span>
                    <span className="text-gray-400 ml-1">/ 10</span>
                </div>
                </div>

                <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-400/10 rounded-lg">
                    <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                    <span className="text-white font-semibold">
                    {movie.vote_count?.toLocaleString()}
                    </span>
                    <div className="text-sm text-gray-400">votes</div>
                </div>
                </div>

                <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-400/10 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                    <span className="text-white font-semibold">
                    {movie.popularity?.toFixed(0)}
                    </span>
                    <div className="text-sm text-gray-400">popularity</div>
                </div>
                </div>
            </div>

            {/* Movie Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-gray-800 rounded-xl border border-gray-700">
                <div className="flex items-center space-x-3 mb-3">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-400 font-medium">Release Date</span>
                </div>
                <p className="text-white font-semibold text-lg">
                    {formatDate(movie.release_date)}
                </p>
                </div>

                <div className="p-4 bg-gray-800 rounded-xl border border-gray-700">
                <div className="flex items-center space-x-3 mb-3">
                    <Globe className="w-5 h-5 text-green-400" />
                    <span className="text-gray-400 font-medium">Language</span>
                </div>
                <p className="text-white font-semibold text-lg uppercase tracking-wide">
                    {movie.original_language}
                </p>
                </div>
            </div>

            {/* Genres */}
            <div className="mb-8 p-4 bg-gray-800 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                Genres
                </h3>
                <p className="text-blue-400 font-semibold text-lg">
                {formatGenres(movie.genre)}
                </p>
            </div>

            {/* Overview */}
            <div className="p-4 bg-gray-800 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                Overview
                </h3>
                <p className="text-gray-300 leading-relaxed text-base">
                {movie.overview || 'No overview available.'}
                </p>
            </div>
            </div>
        </div>
        </div>

        {/* Recommendations */}
        <div className="mt-12">
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-3 h-3 bg-blue-400 rounded-full mr-4"></span>
            You might also like
        </h2>
        
        {recommendationsLoading ? (
            <div className="flex items-center justify-center py-16 bg-gray-900 rounded-2xl border border-gray-700">
            <div className="p-3 bg-blue-400/10 rounded-xl mr-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
            <span className="text-gray-300 text-lg">Loading recommendations...</span>
            </div>
        ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {recommendations.slice(0, 10).map((recMovie) => (
                <MovieCard key={recMovie.id} movie={recMovie} />
            ))}
            </div>
        ) : (
            <div className="text-center py-16 bg-gray-900 rounded-2xl border border-gray-700">
            <p className="text-gray-400 text-lg">No recommendations available.</p>
            </div>
        )}
        </div>
    </div>
    );
};

export default MovieDetail;