import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000/api/movies';

function MovieApp() {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({ title: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const res = await axios.get(API);
      setMovies(res.data);
    } catch (error) {
      console.error('Failed to load movies:', error);
    }
  };

  const addMovie = async () => {
    if (!newMovie.title || !newMovie.description) return;
    try {
      await axios.post(API, newMovie);
      setNewMovie({ title: '', description: '' });
      loadMovies();
    } catch (error) {
      console.error('Failed to add movie:', error);
    }
  };

  const deleteMovie = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      loadMovies();
    } catch (error) {
      console.error('Failed to delete movie:', error);
    }
  };

  const rateMovie = async (id, rating) => {
    try {
      await axios.post(`${API}/${id}/rate`, { rating });
      loadMovies();
    } catch (error) {
      console.error('Failed to rate movie:', error);
    }
  };

  const searchMovies = async () => {
    if (searchTerm.trim() === '') return loadMovies();
    try {
      const res = await axios.get(`${API}/search?q=${searchTerm}`);
      setMovies(res.data);
    } catch (error) {
      console.error('Failed to search movies:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>🎬 Movie Database</h1>

      {/* Add Movie */}
      <div className="mb-3">
        <input
          value={newMovie.title}
          onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
          placeholder="Title"
          className="form-control mb-2"
        />
        <input
          value={newMovie.description}
          onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
          placeholder="Description"
          className="form-control mb-2"
        />
        <button onClick={addMovie} className="btn btn-primary">Add Movie</button>
      </div>

      {/* Search */}
      <div className="mb-3">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Movies"
          className="form-control"
        />
        <button onClick={searchMovies} className="btn btn-secondary mt-2">Search</button>
      </div>

      {/* Movie List */}
      <ul className="list-group">
        {movies.map((movie) => (
          <li key={movie.id} className="list-group-item">
            <strong>{movie.title}</strong> - {movie.description}<br />
            ⭐ Rating: {movie.rating || 'N/A'}<br />
            Rate:
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => rateMovie(movie.id, star)}
                className="btn btn-sm btn-outline-warning mx-1"
              >
                {star}⭐
              </button>
            ))}
            <br />
            <button
              onClick={() => deleteMovie(movie.id)}
              className="btn btn-sm btn-danger mt-2"
            >
              🗑️ Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MovieApp;
