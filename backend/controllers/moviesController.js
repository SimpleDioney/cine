// moviesController.js
const TMDBService = require('../services/tmdbService');

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
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMostViewed = async (req, res) => {
  try {
    const { language, year, genres } = req.query;
    const movies = await TMDBService.discoverMovies({
      language,
      year,
      genres,
      sortBy: 'popularity.desc'
    });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBoxOffice = async (req, res) => {
  try {
    const { language, genres } = req.query;
    const movies = await TMDBService.discoverMovies({
      language,
      genres,
      sortBy: 'revenue.desc'
    });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTopRated = async (req, res) => {
  try {
    const { language, genres } = req.query;
    const movies = await TMDBService.discoverMovies({
      language,
      genres,
      sortBy: 'vote_average.desc',
      minVotes: 1000
    });
    res.json(movies);
  } catch (error) {
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