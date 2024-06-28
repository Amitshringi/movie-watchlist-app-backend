const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    releaseYear: Number,
    genre: String,
    watched: { type: Boolean, default: false },
    rating: Number,
    review: String
});

module.exports = mongoose.model('Movie', MovieSchema);
