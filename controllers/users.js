const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({})
        
        /*
         * the ids referencing `blog` objects
         * in the `blogs` field of the user document
         * will be replaced by the referenced blog documents.
         */
        .populate('blogs', {
            title: 1,
            author: 1,
            url: 1,
            likes: 1
        })

    response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response, next) => {
    try {
        const body = request.body

        // Hash password
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        // Create User object
        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash,
        })

        const savedUser = await user.save()

        // Send response
        response.json(savedUser)

    } catch (exception) {
        next(exception)        
    }
})

module.exports = usersRouter