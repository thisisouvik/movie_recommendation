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

    
};

export default MovieCard;