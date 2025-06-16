export interface Movie {
  id: number;
  title: string;
  genre: string;
  original_language: string;
  overview: string;
  popularity: number;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

export interface MoviesResponse {
  movies: Movie[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface RecommendationsResponse {
  recommendations: Movie[];
}