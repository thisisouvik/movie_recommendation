import type { Movie, MoviesResponse, RecommendationsResponse } from '../types/Movie';

const API_BASE_URL = 'http://localhost:5000/api';

class MovieService {
  async getMovies(page: number = 1, perPage: number = 20, search: string = '', genre: string = ''): Promise<MoviesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      ...(search && { search }),
      ...(genre && { genre })
    });

    const response = await fetch(`${API_BASE_URL}/movies?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    return response.json();
  }

  async getMovie(id: number): Promise<Movie> {
    const response = await fetch(`${API_BASE_URL}/movie/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch movie');
    }
    return response.json();
  }

  async getContentRecommendations(movieId: number): Promise<Movie[]> {
    const response = await fetch(`${API_BASE_URL}/recommendations/content/${movieId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch content recommendations');
    }
    const data: RecommendationsResponse = await response.json();
    return data.recommendations;
  }

  async getUserRecommendations(userId: string): Promise<Movie[]> {
    const response = await fetch(`${API_BASE_URL}/recommendations/user/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user recommendations');
    }
    const data: RecommendationsResponse = await response.json();
    return data.recommendations;
  }

  async trackMovieView(userId: string, movieId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, movie_id: movieId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to track movie view');
    }
  }

  async getGenres(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/genres`);
    if (!response.ok) {
      throw new Error('Failed to fetch genres');
    }
    const data = await response.json();
    return data.genres;
  }
}

export const movieService = new MovieService();