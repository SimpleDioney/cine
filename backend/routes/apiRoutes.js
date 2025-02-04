// apiRoutes.js
const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');

// Search and movie details
router.get('/search', moviesController.searchMovies);
router.get('/movies/:movieId/:language', moviesController.getMovieDetails);
router.get('/movies/:movieId/portuguese-title', moviesController.getPortugueseTitle);

// Genre routes
router.get('/genres', moviesController.getGenres);

// Discovery routes
router.get('/discover/most-viewed', moviesController.getMostViewed);
router.get('/discover/box-office', moviesController.getBoxOffice);
router.get('/discover/top-rated', moviesController.getTopRated);
router.get('/discover/random', moviesController.getRandomMovies);

// Mood-based recommendations
router.get('/mood/:mood/:language', moviesController.getMoodRecommendations);

// Atores
router.get('/person/:personId', moviesController.getPersonDetails);


// Rede Canais integration
router.post('/find-rede-canais-movie', moviesController.findRedeCanaisMovie);

module.exports = router;