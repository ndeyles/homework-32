import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';

interface Movie {
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
  imdbID: string;
}

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchMovies = async () => {
      if (searchTerm.length < 3) {
        setMovies([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&s=${searchTerm}`
        );

        if (response.data.Response === 'True') {
          setMovies(response.data.Search);
          setError(null);
        } else {
          setMovies([]);
          setError(response.data.Error || 'Фильмы не найдены');
        }
      } catch (err) {
        setError('Произошла ошибка при поиске фильмов');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchMovies, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Поиск фильмов
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Введите название фильма"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.imdbID}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="300"
                image={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}
                alt={movie.Title}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {movie.Title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Год: {movie.Year}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Тип: {movie.Type}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default App; 