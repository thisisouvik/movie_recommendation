from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

class MovieRecommender:
    def __init__(self):
        self.movies_df = None
        self.tfidf_matrix = None
        self.similarity_matrix = None
        self.user_history = {}
        self.load_data()
        
    def load_data(self):
        try:
            # Load the dataset
            self.movies_df = pd.read_csv('../dataset.csv')
            
            # processing keliye
            self.movies_df['overview'] = self.movies_df['overview'].fillna('')
            self.movies_df['genre'] = self.movies_df['genre'].fillna('')
            self.movies_df['combined_features'] = (
                self.movies_df['genre'] + ' ' + 
                self.movies_df['overview'] + ' ' + 
                self.movies_df['original_language']
            )
            
            # Create TF-IDF matrix for content-based filtering
            tfidf = TfidfVectorizer(stop_words='english', max_features=5000)
            self.tfidf_matrix = tfidf.fit_transform(self.movies_df['combined_features'])
            
            # similarity matrix
            self.similarity_matrix = cosine_similarity(self.tfidf_matrix)
            
            print(f"Loaded {len(self.movies_df)} movies successfully")
            
        except Exception as e:
            print(f"Error loading data: {e}")
            
    def get_content_based_recommendations(self, movie_id, num_recommendations=10):
        try:
            movie_idx = self.movies_df[self.movies_df['id'] == movie_id].index[0]
            sim_scores = list(enumerate(self.similarity_matrix[movie_idx]))
            sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
            sim_scores = sim_scores[1:num_recommendations+1]  # 1 kyuki the first is the movie itself excluded hai
            
            movie_indices = [i[0] for i in sim_scores]
            recommendations = self.movies_df.iloc[movie_indices].to_dict('records')
            
            return recommendations
        except:
            return []
    
    def get_collaborative_recommendations(self, user_id, num_recommendations=10):
        if user_id not in self.user_history:
            return self.get_popular_movies(num_recommendations)
            
        user_movies = self.user_history[user_id]
        
        # Get genres and features from user ke previosu views
        watched_movies = self.movies_df[self.movies_df['id'].isin(user_movies)]
        
        if watched_movies.empty:
            return self.get_popular_movies(num_recommendations)
        
        avg_rating = watched_movies['vote_average'].mean()
        preferred_genres = ' '.join(watched_movies['genre'].tolist())
        
        # Find similar movies based on user preferences
        genre_matches = self.movies_df[
            (~self.movies_df['id'].isin(user_movies)) &
            (self.movies_df['vote_average'] >= avg_rating - 1.0)
        ]
        
        # Score movies based on genre similarity and popularity pandaaaas
        
        recommendations = genre_matches.nlargest(num_recommendations, ['popularity', 'vote_average'])
        
        return recommendations.to_dict('records')
    
    def get_popular_movies(self, num_recommendations=10):
        popular = self.movies_df.nlargest(num_recommendations, ['popularity', 'vote_average'])
        return popular.to_dict('records')
    
    def update_user_history(self, user_id, movie_id):
        if user_id not in self.user_history:
            self.user_history[user_id] = []
        
        if movie_id not in self.user_history[user_id]:
            self.user_history[user_id].append(movie_id)
            
        # Keep only last 50 movies to prevent memory issues
        if len(self.user_history[user_id]) > 50:
            self.user_history[user_id] = self.user_history[user_id][-50:]


recommender = MovieRecommender()



# ab flask implementation
@app.route('/api/movies', methods=['GET'])
def get_movies():
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        search = request.args.get('search', '').lower()
        genre = request.args.get('genre', '')
        
        movies = recommender.movies_df.copy()
        
        if search:
            movies = movies[
                movies['title'].str.lower().str.contains(search, na=False) |
                movies['overview'].str.lower().str.contains(search, na=False)
            ]
        
        if genre:
            movies = movies[movies['genre'].str.contains(genre, case=False, na=False)]
        
        # Pagination
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        
        paginated_movies = movies.iloc[start_idx:end_idx]
        
        return jsonify({
            'movies': paginated_movies.to_dict('records'),
            'total': len(movies),
            'page': page,
            'per_page': per_page,
            'total_pages': (len(movies) + per_page - 1) // per_page
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/movie/<int:movie_id>', methods=['GET'])
def get_movie(movie_id):
    try:
        movie = recommender.movies_df[recommender.movies_df['id'] == movie_id]
        if movie.empty:
            return jsonify({'error': 'Movie not found'}), 404
        
        return jsonify(movie.iloc[0].to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recommendations/content/<int:movie_id>', methods=['GET'])
def get_content_recommendations(movie_id):
    try:
        recommendations = recommender.get_content_based_recommendations(movie_id, 10)
        return jsonify({'recommendations': recommendations})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recommendations/user/<user_id>', methods=['GET'])
def get_user_recommendations(user_id):
    try:
        recommendations = recommender.get_collaborative_recommendations(user_id, 10)
        return jsonify({'recommendations': recommendations})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/track', methods=['POST'])
def track_movie_view():
    try:
        data = request.json
        user_id = data.get('user_id')
        movie_id = data.get('movie_id')
        
        if not user_id or not movie_id:
            return jsonify({'error': 'user_id and movie_id required'}), 400
        
        recommender.update_user_history(user_id, movie_id)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/genres', methods=['GET'])
def get_genres():
    try:
        all_genres = []
        for genres_str in recommender.movies_df['genre'].dropna():
            genres = [g.strip() for g in genres_str.split(',')]
            all_genres.extend(genres)
        
        unique_genres = sorted(list(set(all_genres)))
        return jsonify({'genres': unique_genres})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)