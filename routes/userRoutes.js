const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

//user registration
router.post('/register', async (req, res) => {
    const {name, email, password} = req.body;
    const emailFormat = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if(name === '' || email === '' || password === '') {
        return res.send({message: 'Enter username, email id and password'});
    }

    if(name.length < 3) {
        return res.send({message: 'Username should have at least 3 characters'});
    }

    if(!email.match(emailFormat)) {
        return res.send({message: 'Enter correct email'});
    }

    const userExist = await User.findOne({email: email});

    if(userExist) {
        return res.send({message: `User with email ${email} already exists`});
    }

    if(password.length < 5) {
        return res.send({message: 'Password should have at least 5 characters'});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    await user.save();

    const token = jwt.sign({_id: user._id}, process.env.SECRET_KEY);

    res.setHeader('x-auth-token', token)
        .setHeader('access-control-expose-headers', 'x-auth-token')
        .send(user);
});


//user login
router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    if(email === '' || password === '') {
        return res.send({message: 'Enter email id and password'});
    }

    const userExist = await User.findOne({email: email});

    if(!userExist) {
        return res.send({message: `User with email ${email} does not exist`});
    }

    const isMatch = await bcrypt.compare(password, userExist.password);
    if(!isMatch) {
        return res.send({message: 'Incorrect password'});
    }

    const token = jwt.sign({_id: userExist._id}, process.env.SECRET_KEY);
    res.setHeader('x-auth-token', token)
        .setHeader('access-control-expose-headers', 'x-auth-token')
        .send(userExist);
})

module.exports = router;