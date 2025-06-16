import React from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import MovieCard from './MovieCard';
import type { Movie } from '../types/Movie';

interface MovieListProps {
  movies: Movie[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MovieList: React.FC<MovieListProps> = ({
  movies,
  loading,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        <span className="ml-2 text-gray-300">Loading movies...</span>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-xl">No movies found</p>
      </div>
    );
  }

  const renderPaginationButtons = () => {
    const buttons = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
        // Show all pages if total pages <= 7
        for (let i = 1; i <= totalPages; i++) {
        buttons.push(
            <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === i
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            >
            {i}
            </button>
        );
        }
    } else {
        // Always show first 3 pages
        for (let i = 1; i <= 3; i++) {
        buttons.push(
            <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === i
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            >
            {i}
            </button>
        );
        }

        // Add ellipsis if there's a gap
        if (currentPage > 6 || totalPages > 6) {
        buttons.push(
            <span key="ellipsis1" className="px-2 py-2 text-gray-500">
            ...
            </span>
        );
        }

        // Show current page and neighbors if not in first 3 or last 3
        if (currentPage > 3 && currentPage <= totalPages - 3) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            if (i > 3 && i <= totalPages - 3) {
            buttons.push(
                <button
                key={i}
                onClick={() => onPageChange(i)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === i
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                >
                {i}
                </button>
            );
            }
        }

        // Add ellipsis before last pages
        if (currentPage < totalPages - 3) {
            buttons.push(
            <span key="ellipsis2" className="px-2 py-2 text-gray-500">
                ...
            </span>
            );
        }
        }

        // Always show last 3 pages
        for (let i = Math.max(totalPages - 2, 4); i <= totalPages; i++) {
        if (i > 3) {
            buttons.push(
            <button
                key={i}
                onClick={() => onPageChange(i)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === i
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
                {i}
            </button>
            );
        }
        }
    }

    return buttons;
    };

    return (
    <div>
        <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <span className="w-3 h-3 bg-blue-400 rounded-full mr-4"></span>
            All Movies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mt-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-5 py-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
            </button>

            <div className="flex items-center space-x-2 mx-4">
                {renderPaginationButtons()}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center px-5 py-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
            </button>
            </div>

            <div className="text-center text-gray-400 font-medium">
            Page <span className="text-white font-semibold">{currentPage}</span> of{' '}
            <span className="text-white font-semibold">{totalPages}</span>
            </div>
        </div>
        )}
    </div>
    );
};

export default MovieList;