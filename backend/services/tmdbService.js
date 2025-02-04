// services/tmdbService.js
const TMDB = require('../models/TMDB');

class TMDBService {
  static async handleRequest(requestFn, errorMessage) {
    try {
      return await requestFn();
    } catch (error) {
      console.error(`${errorMessage}:`, error.message);
      console.error('Stack:', error.stack);
      throw new Error(`${errorMessage}: ${error.message}`);
    }
  }

  static async searchMovies(query, language) {
    return this.handleRequest(
      () => TMDB.searchMovies(query, language),
      'Failed to search movies'
    );
  }

  static async getMovieDetails(movieId, language) {
    return this.handleRequest(
      () => TMDB.getMovieDetails(movieId, language),
      'Failed to get movie details'
    );
  }

  static async getGenres(language) {
    return this.handleRequest(
      () => TMDB.getGenres(language),
      'Failed to get genres'
    );
  }

  static async discoverMovies(params) {
    return this.handleRequest(
      () => TMDB.discoverMovies(params),
      'Failed to discover movies'
    );
  }

  static async getMoodRecommendations(mood, language) {
    return this.handleRequest(
      () => TMDB.getMoodRecommendations(mood, language),
      'Failed to get mood recommendations'
    );
  }

  static async getPersonDetails(personId, language) {
    return this.handleRequest(
      () => TMDB.getPersonDetails(personId, language),
      'Failed to get person details'
    );
  }
}

module.exports = TMDBService;