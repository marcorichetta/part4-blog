const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {

    const blogs = await Blog.find({})
    response.json(blogs.map(blog => blog.toJSON()))

    /* Before async / await
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        }) */
})

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

blogsRouter.post('/', async (request, response, next) => {
    const blog = new Blog(request.body)

    // If title AND url are missing, return 400
    if (!blog.title && !blog.url) {
        response.status(400).end()
    } else {

        try {
            const savedBlog = await blog.save()
            response.status(201).json(savedBlog.toJSON())
        } catch (exception) {
            next(exception)
        }

    }
})

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
        await Blog.findByIdAndRemove(request.params.id)
        // After deletion, send 204 No Content
        response.status(204).end()
    } catch (exception) {
        next(exception)
    }
})

module.exports = blogsRouter