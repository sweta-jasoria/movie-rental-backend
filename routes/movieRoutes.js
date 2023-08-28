const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const auth = require('../middleware/authMiddleware');

//get movies with all genres
router.get('/', async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    const pageSize = 4;
    const skip = (page - 1) * pageSize;
    const total = await Movie.estimatedDocumentCount();
    const totalPages = Math.ceil(total / pageSize);

    try{
        const data = await Movie.find()
                                .populate('genre')
                                .skip(skip)
                                .limit(pageSize);

        res.json({
            data,
            count: total,
            page,
            totalPages
        });
    }
    catch(error) {
        console.error(error);
    }
});

//get movies with particular genre
router.get('/:id', async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    const pageSize = 4;
    const skip = (page - 1) * pageSize;
    const total = await Movie.countDocuments({genre: {_id: req.params.id}});
    const totalPages = Math.ceil(total / pageSize);

    try {
        const data = await Movie.find({genre: {_id: req.params.id}})
                                .populate('genre')
                                .skip(skip)
                                .limit(pageSize);

        res.json({
            data,
            page,
            count: total,
            totalPages
        });
    }
    catch(error) {
        console.error(error);
    }
});

//search movies
router.get('/searchMovies/:searchText', async (req, res) => {
    const searchText = req.params.searchText;
    let page = parseInt(req.query.page) || 1;
    const pageSize = 4;
    const skip = (page - 1) * pageSize;
    const total = await Movie.countDocuments({title: {$regex: new RegExp(searchText, 'i')}});
    const totalPages = Math.ceil(total / pageSize);

    try {
        const data = await Movie.find({title: {$regex: new RegExp(searchText, 'i')}})
                                .populate('genre')
                                .skip(skip)
                                .limit(pageSize);
        res.json({
            data,
            page,
            count: total,
            totalPages
        })
    }
    catch(error) {
        console.error(error);
    }
})

//like particular movie
router.put('/likeMovie/:id', auth, async (req, res) => {
    try {
        const userId = req.user;

        if(!userId) {
            res.send('Login to like movie');
        }

        const movieLiked = await Movie.findByIdAndUpdate(req.params.id, {$set: {liked: req.body.liked}});
        res.json(movieLiked);
    }
    catch(error) {
        console.error(error);
    }
});


//delete particular movie
router.delete('/deleteMovie/:id', auth, async (req, res) => {
    try {
        const userId = req.user;

        if(!userId) {
            return res.send('Login to delete movie');
        }

        const movieDeleted = await Movie.findByIdAndRemove(req.params.id);
        res.json(movieDeleted);
    }
    catch(error) {
        console.error(error);
    }
});

module.exports = router;