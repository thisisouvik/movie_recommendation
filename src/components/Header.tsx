import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Film, X, Filter } from 'lucide-react';
import { movieService } from '../services/movieService';

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
  onGenreFilter: (genre: string) => void;
  selectedGenre: string;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onGenreFilter, selectedGenre }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await movieService.getGenres();
        setGenres(genreList.slice(0, 20)); // Limit to first 20 genres performance ke liye
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  const clearGenreFilter = () => {
    onGenreFilter('');
    setIsFilterOpen(false);
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link 
            to="/" 
            className="flex items-center space-x-3 text-2xl font-bold text-white hover:text-blue-400 transition-colors group"
          >
            <div className="p-2 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
              <Film className="w-8 h-8 text-blue-400" />
            </div>
            <span className="hidden sm:block">MovieRecom</span>
          </Link>

          <div className="flex items-center space-x-4 flex-1 max-w-3xl mx-4 lg:mx-8">
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>

            <div className="hidden md:block relative">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedGenre}
                  onChange={(e) => onGenreFilter(e.target.value)}
                  className="appearance-none pl-12 pr-10 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all min-w-[160px]"
                >
                  <option value="">All Genres</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
                {selectedGenre && (
                  <button
                    type="button"
                    onClick={clearGenreFilter}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            

            {/* Genre Filter - Mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`p-3 rounded-xl border transition-all ${
                  selectedGenre || isFilterOpen
                    ? 'bg-blue-500/10 border-blue-400 text-blue-400'
                    : 'bg-gray-800 border-gray-600 text-gray-400 hover:text-white hover:border-gray-500'
                }`}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Genre Filter Dropdown */}
        {isFilterOpen && (
          <div className="md:hidden pb-4">
            <div className="bg-gray-800 border border-gray-600 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-medium">Filter by Genre</span>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <select
                value={selectedGenre}
                onChange={(e) => {
                  onGenreFilter(e.target.value);
                  setIsFilterOpen(false);
                }}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
              {selectedGenre && (
                <button
                  onClick={clearGenreFilter}
                  className="mt-2 w-full py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;