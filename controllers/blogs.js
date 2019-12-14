const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {

    const blogs = await Blog
        .find({})
        .populate('user', {
            username: 1,
            name: 1
        })

    response.json(blogs.map(blog => blog.toJSON()))

    /* Before async / await
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        }) */
})

// 4.15: bloglist expansion, step4
blogsRouter.get('/:id', async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id)

        if (blog) {
            response.json(blog.toJSON())
        } else {
            response.status(404).end()
        }
    } catch (exception) {
        next(exception)
    }
})

// Route to create new blogs
blogsRouter.post('/', async (request, response, next) => {
    const body = request.body

    try {

        // Verify and decode the token
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!request.token || !decodedToken.id) {
            return response.status(401).json({
                error: 'missing or invalid token'
            })
        }

        // Find the user with the token information
        const user = await User.findById(decodedToken.id)

        // Create a new blog object
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user._id // _id because is retrieved from Mongo
        })

        // If title AND url are missing, return 400
        if (!blog.title && !blog.url) {
            response.status(400).end()
        }

        const savedBlog = await blog.save()

        // Add and save the blog to the user's blogs
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        response.status(201).json(savedBlog.toJSON())

    } catch (exception) {
        next(exception)
    }

})

/**
 * Route to add comments to the posts
 */
blogsRouter.post('/:id', async (request, response, next) => {
    const body = request.body

    // Extract the comment from the body
    const newComment = body.newComment

    // Concat the new comment to the old ones and 
    // and save them into an object to be sent
    const blogComment = {
        comments: body.comments.concat(newComment)
    }

    try {
        const updatedBlog = await Blog.
            // new: true returns the updated object in the response
            findByIdAndUpdate(request.params.id, blogComment, { new: true }) 

        response.json(updatedBlog.toJSON())

    } catch (exception) {
        next(exception)
    }
})

/**
 * Route to update blogs likes
 */
blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    // Right now it only updates the likes
    const blog = {
        likes: body.likes
    }

    try {
        const updatedBlog = await Blog.
            // new: true returns the updated object in the response
            findByIdAndUpdate(request.params.id, blog, { new: true })

        response.json(updatedBlog.toJSON())

    } catch (exception) {
        next(exception)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {

        // Verify and decode the token
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!request.token || !decodedToken.id) {
            return response.status(401).json({
                error: 'missing or invalid token'
            })
        }

        // Find the user with the token information
        const userId = decodedToken.id

        // Find the blog to delete
        const blogToDelete = await Blog.findById(request.params.id)

        // The user in the blog is an object
        if (blogToDelete.user.toString() === userId) {

            await Blog.findByIdAndRemove(blogToDelete._id)

            // After deletion, send 204 No Content
            response.status(204).end()

        } else {
            return response.status(401).json({
                error: 'You are not allowed to delete this post.'
            })
        }

    } catch (exception) {
        next(exception)
    }
})

module.exports = blogsRouter