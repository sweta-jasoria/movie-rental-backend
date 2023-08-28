const express = require('express');
const router = express.Router();
const Genre = require('../models/Genre');

//get all genres
router.get('/', async (req, res) => {
    try {
        const genres = await Genre.find().exec();
        res.json(genres);
    }
    catch(err) {
        console.log(err);
    }
});

module.exports = router;
