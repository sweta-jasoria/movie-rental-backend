const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cors({
    origin: ['http://localhost:3001']
}));


//mongoose connection
mongoose.connect('mongodb://0.0.0.0:27017/movie')
    .then(() => console.log('Connected to mongodb'))
    .catch((err) => console.log('Could not connect to mongodb', err));

//routes
const movieRoutes = require('./routes/movieRoutes');
const genreRoutes = require('./routes/genreRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/movies', movieRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/user', userRoutes);

app.listen(3000, () => {
    console.log('Listening on port 3000');
});



















