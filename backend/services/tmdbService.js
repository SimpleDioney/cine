// services/tmdbService.js
const axios = require('axios');

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: process.env.TMDB_API_KEY
  }
});

class TMDBService {
  static async handleRequest(requestFn, errorMessage) {
    try {
      const response = await requestFn();
      return response.data;
    } catch (error) {
      console.error(`${errorMessage}:`, error.message);
      console.error('Stack:', error.stack);
      throw new Error(`${errorMessage}: ${error.message}`);
    }
  }

  static async searchMovies(query, language) {
    return this.handleRequest(
      () => tmdb.get('/search/movie', { params: { query, language } }),
      'Failed to search movies'
    );
  }

  static async getMovieDetails(movieId, language) {
    return this.handleRequest(
      () => tmdb.get(`/movie/${movieId}`, { params: { language } }),
      'Failed to get movie details'
    );
  }

  static async getGenres(language) {
    const response = await this.handleRequest(
      () => tmdb.get('/genre/movie/list', { params: { language } }),
      'Failed to get genres'
    );
    return response.genres;
  }

  static async discoverMovies(params) {
    return this.handleRequest(
      () => tmdb.get('/discover/movie', { params }),
      'Failed to discover movies'
    );
  }

  static async getMoodRecommendations(mood, language) {
    return this.handleRequest(
      () => tmdb.get('/discover/movie', { params: { with_genres: mood, language } }),
      'Failed to get mood recommendations'
    );
  }

  static async getPersonDetails(personId, language) {
    return this.handleRequest(
      () => tmdb.get(`/person/${personId}`, { params: { language } }),
      'Failed to get person details'
    );
  }
}

module.exports = {
  tmdb,
  TMDBService
};