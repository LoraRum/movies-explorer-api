const Movie = require('../models/movie');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');
const BadRequest = require('../errors/BadRequest');

module.exports.getAllMovie = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id }).populate('owner');
    res.status(200).json(movies);
  } catch (err) {
    next(err);
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
    const newMovie = await Movie.create({ ...req.body, owner: req.user._id });
    const movie = await Movie.findById(newMovie._id).populate(['owner']);

    res.status(201).send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errorMessage = err.message;
      next(new BadRequest(errorMessage));
    } else {
      next(err);
    }
  }
};

module.exports.deleteMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);

    if (!movie) {
      next(new NotFound('Movie not found'));
    } else if (movie.owner.toString() !== req.user._id) {
      next(new Forbidden('Deletion is not permitted'));
    } else {
      const deletedMovie = await Movie.findByIdAndDelete(id);

      if (!deletedMovie) {
        next(new NotFound('Movie not found'));
      } else {
        res.status(200).json(deletedMovie);
      }
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Incorrect data provided'));
    } else {
      next(err);
    }
  }
};
