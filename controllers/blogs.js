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

module.exports = blogsRouter