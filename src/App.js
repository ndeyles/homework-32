import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchTerm) {
      setMovies([]);
      setError(null);
      return;
    }
    const delayDebounce = setTimeout(() => {
      const searchMovies = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            `https://www.omdbapi.com/?s=${searchTerm}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`
          );
          const data = await response.json();
          if (data.Response === 'True') {
            setMovies(data.Search);
          } else {
            setError(data.Error);
            setMovies([]);
          }
        } catch (err) {
          setError('Произошла ошибка при поиске фильмов');
          setMovies([]);
        } finally {
          setLoading(false);
        }
      };
      searchMovies();
    }, 500); // 500 мс задержка
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <div className="App">
      <h1>Поиск фильмов</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Введите название фильма"
      />
      {loading && <p>Загрузка...</p>}
      {error && <p className="error">{error}</p>}
      <div className="movies">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="movie-card">
            <img
              src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450'}
              alt={movie.Title}
            />
            <h3>{movie.Title}</h3>
            <p>{movie.Year}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App; 