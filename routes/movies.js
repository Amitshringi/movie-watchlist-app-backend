const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const upload = require('../config/multer');

// Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one movie
router.get('/:id', getMovie, (req, res) => {
  res.json(res.movie);
});

// Create a movie
router.post('/', upload.single('image'), async (req, res) => {
  const movie = new Movie({
    title: req.body.title,
    description: req.body.description,
    releaseYear: req.body.releaseYear,
    genre: req.body.genre,
    imageUrl: req.file ? req.file.path : null,
    watched: req.body.watched || false,
    rating: req.body.rating || 0,
    review: req.body.review || ''
  });

  try {
    const newMovie = await movie.save();
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a movie
router.patch('/:id', getMovie, upload.single('image'), async (req, res) => {
  if (req.body.title != null) {
    res.movie.title = req.body.title;
  }
  if (req.body.description != null) {
    res.movie.description = req.body.description;
  }
  if (req.body.releaseYear != null) {
    res.movie.releaseYear = req.body.releaseYear;
  }
  if (req.body.genre != null) {
    res.movie.genre = req.body.genre;
  }
  if (req.file) {
    res.movie.imageUrl = req.file.path;
  }
  if (req.body.watched != null) {
    res.movie.watched = req.body.watched;
  }
  if (req.body.rating != null) {
    res.movie.rating = req.body.rating;
  }
  if (req.body.review != null) {
    res.movie.review = req.body.review;
  }

  try {
    const updatedMovie = await res.movie.save();
    res.json(updatedMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a movie
router.delete('/:id', getMovie, async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle watched status
router.patch('/:id/toggleWatched', async (req, res) => {
  try {
      const movie = await Movie.findById(req.params.id);
      if (!movie) return res.status(404).json({ message: 'Movie not found' });

      movie.watched = !movie.watched;
      await movie.save();
      res.json(movie);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});

// Update movie rating
router.patch('/:id/rate', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    movie.rating = req.body.rating;
    await movie.save();
    res.json(movie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update movie review
router.patch('/:id/review', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    movie.review = req.body.review;
    await movie.save();
    res.json(movie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Middleware function to get movie by id
async function getMovie(req, res, next) {
  let movie;
  try {
    movie = await Movie.findById(req.params.id);
    if (movie == null) {
      return res.status(404).json({ message: 'Movie not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.movie = movie;
  next();
}

module.exports = router;
