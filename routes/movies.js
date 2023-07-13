const express = require('express');
const movieController = require('../controllers/movies');
const {
  validateCreateMovie,
  validateMovieId,
} = require('../middlewares/validation');

const router = express.Router();

router.get('/', movieController.getAllMovie);
router.post('/', validateCreateMovie, movieController.createMovie);
router.delete('/:movieId', validateMovieId, movieController.deleteMovieById);

module.exports = router;
