// models/TMDB.js
const axios = require('axios');

class TMDB {
  static validateApiKey() {
    if (!process.env.TMDB_API_KEY) {
      throw new Error('TMDB API key is not configured');
    }
  }

  static async makeRequest(endpoint, params = {}) {
    this.validateApiKey();
    const BASE_URL = "https://api.themoviedb.org/3";
    
    try {
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('TMDB API Error:', {
          status: error.response.status,
          data: error.response.data,
          endpoint,
          params: { ...params, api_key: '[REDACTED]' }
        });
        throw new Error(`TMDB API error: ${error.response.data.status_message || error.message}`);
      }
      throw error;
    }
  }

  static async searchMovies(query, language = 'en-US') {
    const data = await this.makeRequest('/search/movie', { language, query });
    return data.results;
  }

  static async getMovieDetails(movieId, language = 'en-US') {
    return await this.makeRequest(`/movie/${movieId}`, {
      language,
      append_to_response: 'videos,credits,similar,watch/providers'
    });
  }

  static async getGenres(language = 'en-US') {
    const data = await this.makeRequest('/genre/movie/list', { language });
    return data.genres;
  }

  static async discoverMovies(params) {
    const data = await this.makeRequest('/discover/movie', params);
    return data;
  }

  static async getMoodRecommendations(mood, language = 'en-US') {
    const moodGenreMap = {
      happy: [35, 12, 16, 10402],
      sad: [18, 10749, 10751],
      anxious: [99, 36, 10402],
      bored: [28, 878, 53, 9648],
      motivated: [10752, 37, 80, 36],
    };

    if (!moodGenreMap[mood]) {
      throw new Error(`Invalid mood: ${mood}`);
    }

    const data = await this.makeRequest('/discover/movie', {
      language,
      sort_by: 'popularity.desc',
      with_genres: moodGenreMap[mood].join(','),
      page: 1
    });
    
    return data.results.slice(0, 10);
  }

  static async getPersonDetails(personId, language = 'en-US') {
    return await this.makeRequest(`/person/${personId}`, {
      language,
      append_to_response: 'combined_credits'
    });
  }
}

module.exports = TMDB;