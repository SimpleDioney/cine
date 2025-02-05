// moviesController.js
const { TMDBService, tmdb } = require('../services/tmdbService');

exports.searchMovies = async (req, res) => {
  try {
    const { query, language } = req.query;
    const results = await TMDBService.searchMovies(query, language);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMovieDetails = async (req, res) => {
  try {
    const { movieId, language } = req.params;
    const details = await TMDBService.getMovieDetails(movieId, language);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPortugueseTitle = async (req, res) => {
  try {
    const { movieId } = req.params;
    const title = await TMDBService.getPortugueseTitle(movieId);
    res.json({ title });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGenres = async (req, res) => {
  try {
    const { language } = req.query;
    const genres = await TMDBService.getGenres(language);
    
    // Garante que estamos enviando um array
    if (Array.isArray(genres)) {
      res.json(genres);
    } else {
      console.error('Unexpected genres format:', genres);
      res.status(500).json({ error: 'Invalid genres format' });
    }
  } catch (error) {
    console.error('Error in getGenres:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getMostViewed = async (req, res) => {
  try {
    const { language, with_genres } = req.query;
    const response = await TMDBService.discoverMovies({
      language,
      with_genres,
      sort_by: 'popularity.desc',
      'primary_release_date.gte': '2025-01-01',
      'primary_release_date.lte': '2025-12-31',
      include_adult: false,
      include_video: false,
      page: 1
    });
    res.json(response);
  } catch (error) {
    console.error('Error in getMostViewed:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getBoxOffice = async (req, res) => {
  try {
    const { language, with_genres } = req.query;
    const response = await TMDBService.discoverMovies({
      language,
      with_genres,
      sort_by: 'revenue.desc',
      'vote_count.gte': 100,
      include_adult: false,
      include_video: false,
      page: 1
    });
    res.json(response);
  } catch (error) {
    console.error('Error in getBoxOffice:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getTopRated = async (req, res) => {
  try {
    const { language, with_genres } = req.query;
    const response = await TMDBService.discoverMovies({
      language,
      with_genres,
      sort_by: 'vote_average.desc',
      'vote_count.gte': 1000,
      include_adult: false,
      include_video: false,
      page: 1
    });
    res.json(response);
  } catch (error) {
    console.error('Error in getTopRated:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getRandomMovies = async (req, res) => {
  try {
    const { language, genres, page } = req.query;
    const movies = await TMDBService.discoverMovies({
      language,
      genres,
      page,
      sortBy: 'popularity.desc'
    });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMoodRecommendations = async (req, res) => {
  try {
    const { mood, language } = req.params;
    const recommendations = await TMDBService.getMoodRecommendations(mood, language);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPersonDetails = async (req, res) => {
  try {
    const { personId } = req.params;
    const { language } = req.query;
    const details = await TMDBService.getPersonDetails(personId, language);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findRedeCanaisMovie = async (req, res) => {
  try {
    const { title, year, language, tmdbId } = req.body;
    const movie = await TMDBService.findRedeCanaisMovie({
      title,
      year,
      language,
      tmdbId
    });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};