import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from   './components/Header';
import MovieList from    './components/MovieList';
import MovieDetail from    './components/MovieDetail';
import Recommendations from     './components/Recommendations';
import type { Movie } from './types/Movie';
import { movieService } from   './services/movieService';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [userId] = useState(() => {
    // userid generation lofic
    let id = localStorage.getItem('movie_user_id');
    if (!id) {
      id = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('movie_user_id', id);
    }
    return id;
  });

  const fetchMovies = async (page: number = 1, search: string = '', genre: string = '') => {
    try {
      setLoading(true);
      const response = await movieService.getMovies(page, 20, search, genre);
      setMovies(response.movies);
      setTotalPages(response.total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(1, searchTerm, selectedGenre);
  }, [searchTerm, selectedGenre]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleGenreFilter = (genre: string) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    fetchMovies(page, searchTerm, selectedGenre);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header 
          onSearch={handleSearch}
          onGenreFilter={handleGenreFilter}
          selectedGenre={selectedGenre}
        />
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <>
                  <Recommendations userId={userId} />
                  <MovieList 
                    movies={movies}
                    loading={loading}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              } 
            />
            <Route 
              path="/movie/:id" 
              element={<MovieDetail userId={userId} />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;