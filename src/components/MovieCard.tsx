import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, Globe } from 'lucide-react';
import type { Movie } from '../types/Movie';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear() || 'N/A';
  };

  const formatGenres = (genres: string) => {
    return genres.split(',').slice(0, 2).join(', ');
  };

    return (
    <Link to={`/movie/${movie.id}`}>
        <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-gray-600 transition-all duration-300 hover:scale-105 cursor-pointer group">
        <div className="h-56 bg-gray-800 flex items-center justify-center p-6 group-hover:bg-gray-750 transition-colors duration-300">
            <h3 className="text-white text-xl font-bold text-center leading-tight">
            {movie.title}
            </h3>
        </div>
        
        <div className="p-5">
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-white font-semibold">
                {movie.vote_average?.toFixed(1) || 'N/A'}
                </span>
            </div>
            <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300 font-medium">
                {formatDate(movie.release_date)}
                </span>
            </div>
            </div>

            <div className="flex items-center space-x-2 mb-4">
            <Globe className="w-5 h-5 text-green-400" />
            <span className="text-gray-300 uppercase font-medium tracking-wide">
                {movie.original_language}
            </span>
            </div>

            <div className="mb-4">
            <p className="text-blue-400 font-semibold text-sm">
                {formatGenres(movie.genre)}
            </p>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">
            {movie.overview?.substring(0, 120)}...
            </p>

            <div className="flex justify-between items-center pt-3 border-t border-gray-700">
            <span className="text-xs text-gray-400 font-medium">
                {movie.vote_count} votes
            </span>
            <span className="text-xs text-gray-400 font-medium">
                Pop: {movie.popularity?.toFixed(0)}
            </span>
            </div>
        </div>
        </div>
    </Link>
    );
};

export default MovieCard;