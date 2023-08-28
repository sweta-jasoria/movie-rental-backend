const mongoose = require('mongoose');
const Genre = require('./Genre');

const movieSchema = new mongoose.Schema({
    title: {type: String},
    genre: [{type: mongoose.Schema.Types.ObjectId, ref: 'Genre'}],
    numberInStock: {type: Number},
    dailyRentalRate: {type: Number},
    liked: {type: Boolean}
});

module.exports = mongoose.model('Movie', movieSchema);