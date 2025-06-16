# Movie Recommendation System 🎬

A simple yet effective **Movie Recommendation System** using content-based filtering and cosine similarity. This project recommends movies similar to a user-selected movie by analyzing features like genres, cast, and movie overviews. Built with Python and designed for clarity and extensibility, it demonstrates a foundational approach to personalized recommendations.

---

## 🚀 Features

- **Content-Based Filtering**: Recommends movies based on matching content attributes (genres, cast, overview).
- **Cosine Similarity**: Measures the similarity between movies using feature vectors.
- **User-Friendly Interface**: Run from the command line or integrate with a basic web interface.
- **Extensible**: Modular codebase for easy experimentation and extension.
- **Handles TMDB Dataset**: Uses The Movie Database (TMDB) data from Kaggle.

---

## 🧠 Algorithms Used

- **Content-Based Filtering**: Generates a feature vector for each movie using its genres, cast, and overview.
- **Text Vectorization**: Uses TF-IDF or CountVectorizer to convert text features into numerical vectors.
- **Cosine Similarity**: Calculates similarity scores between movies based on their feature vectors.

---

## 📁 Project Structure

```
movie-recommendation-system/
│
├── data/
│   └── tmdb_5000_movies.csv
│   └── tmdb_5000_credits.csv
├── src/
│   ├── recommender.py
│   └── utils.py
├── examples/
│   └── sample_output.txt
├── requirements.txt
├── README.md
└── LICENSE
```

---

## 🗃️ Dataset Information

- **Source:** [TMDB 5000 Movie Dataset on Kaggle](https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata)
- **Files Used:**
  - `tmdb_5000_movies.csv`
  - `tmdb_5000_credits.csv`
- **Description:** Contains metadata for over 5,000 movies, including genres, cast, crew, keywords, and overviews.

---

## ⚙️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/movie-recommendation-system.git
   cd movie-recommendation-system
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Download the dataset:**
   - Download the TMDB 5000 Movie Dataset from [Kaggle](https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata).
   - Place `tmdb_5000_movies.csv` and `tmdb_5000_credits.csv` in the `data/` directory.

---

## 💡 Usage

**Basic Command-Line Example:**

```bash
python src/recommender.py --movie "The Dark Knight" --top_n 5
```

**Sample Output:**

```
Top 5 recommendations for 'The Dark Knight':
1. Batman Begins
2. Batman v Superman: Dawn of Justice
3. Superman Returns
4. The Prestige
5. Man of Steel
```

---

## 🖥️ Technologies Used

- **Python 3.7+**
- **Pandas** (data manipulation)
- **NumPy** (numerical operations)
- **scikit-learn** (vectorization & similarity)
- **Jupyter Notebook** (optional, for exploration)

---

## 🔬 Sample Output

```
Top 5 recommendations for 'Inception':
1. Interstellar
2. The Prestige
3. The Dark Knight
4. Memento
5. Shutter Island
```

---

## 🚧 Future Improvements

- Add collaborative filtering for personalized user recommendations.
- Implement a web interface using Flask or Streamlit.
- Integrate additional metadata (e.g., keywords, directors, release year).
- Deploy as a REST API.
- Improve feature engineering with NLP techniques (e.g., word embeddings).

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or pull request for suggestions, bug fixes, or improvements.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

**Happy Recommending! 🎥**