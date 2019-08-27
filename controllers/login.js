const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response, next) => {
    const body = request.body

    const user = await User.findOne({ username: body.username })

    // If user => null, passwordCorrect => false
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash)
    
    // Check for valid user AND password
    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'Invalid username or password'
        })
    }

    // Save the user requesting the token
    const userForToken = {
        username: user.username,
        id: user._id,
    }

    // Create and sign the token
    const token = jwt.sign(userForToken, process.env.SECRET)

    response
        .status(200)
        .send({
            token,
            username: user.username,
            name: user.name
        })
})

module.exports = loginRouter