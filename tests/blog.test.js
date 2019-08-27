const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

/*  
    Esto se ejecutará antes de los tests
    La "DB" se mantiene en el mismo estado
*/
beforeEach(async () => {

    // Delete everything in the test DB
    await Blog.deleteMany({})

    // Create new blog posts
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()

})

describe('4.8 - 4.12 tests', () => {

    // 4.8
    test('blog returns the correct amount of blogs in JSON format', async () => {
        const response = await api.get('/api/blogs')

        // Esto se ejecuta después de que se complete el GET request
        expect(response.type).toBe('application\/json')
        expect(response.body.length).toBe(helper.initialBlogs.length)
    })

    // 4.9
    test('Verifies the blog identifier is named id', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body[0].id).toBeDefined()
    })

    //4.10
    test('Check that a blog is successfully created', async () => {

        const newBlog = {
            title: 'Test Blog',
            author: 'Marco Richetta',
            url: 'http://localhost:1337',
            likes: 99,
        }

        // Check the blog is received
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201) // 201 - Created
            .expect('Content-Type', /application\/json/)

        // Check that 1 blog is added to the DB
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

        // Check the blog content is correctly added
        const contents = blogsAtEnd.map(b => b.title)
        expect(contents).toContain('Test Blog')
    })

    //4.11
    test('if likes not given, likes == 0', async () => {

        const blogWithoutLikes = {
            title: 'Test Blog',
            author: 'Marco Richetta',
            url: 'http://localhost:1337'
        }

        // Send the blog
        await api
            .post('/api/blogs')
            .send(blogWithoutLikes)
            .expect(201)
            .expect('Content-Type', /application\/json/)


        // Save the blogs in DB
        const blogsAtEnd = await helper.blogsInDb()

        // Map only the likes to the results array
        const results = blogsAtEnd.map(b => b.likes)
        expect(results[2]).toBe(0)
    })

    //4.12
    test('If title and url are missing == 400 Bad Request', async () => {

        const badBlog = {
            author: 'Marco Richetta',
            likes: 123
        }

        // Send the malformatted blog
        await api
            .post('/api/blogs')
            .send(badBlog)
            .expect(400)
    })
})

describe('4.13 - 4.14 tests', () => {

    test('deleting a single post', async () => {

        // Get blogs in DB
        const blogsAtStart = await helper.blogsInDb()

        // Select 1st blog
        const blogToDelete = blogsAtStart[0]

        // Delete it
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        // Get blogs after deletion and compare with original DB
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1)

        // Map blogs' titles into contents
        const contents = blogsAtEnd.map(b => b.title)
        // Check the deleted blog isn't in contents
        expect(contents).not.toContain(blogToDelete.title)
    })

    test('updating the likes of a post', async () => {
        
        // Get blogs from DB
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        // Body to be sent
        updatedInfo = {
            likes: 999
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedInfo)
            .expect(200)

        // Check the updated blog
        const blogsAtEnd = await helper.blogsInDb()
        const updatedBlog = blogsAtEnd[0]

        expect(updatedBlog.likes).toBe(999)
    })
})

describe('total likes', () => {

    test('sum total likes', () => {
        const result = helper.totalLikes(helper.initialBlogs)

        expect(result).toBe(12)
    })

    test('only one blog', () => {
        const result = helper.totalLikes(helper.listWithOneBlog)

        expect(result).toBe(5)
    })

    test('empty list', () => {
        const result = helper.totalLikes()

        expect(result).toBe(0)
    })
})

describe('favorite blog', () => {

    test('return blog with most likes', () => {
        const result = helper.favoriteBlog(helper.initialBlogs)

        expected = {
            title: "React patterns",
            author: "Michael Chan",
            likes: 7,
        }

        expect(result).toEqual(expected)
    })

})

test('dummy returns one', () => {
    const blogs = []

    const result = helper.dummy(blogs)
    expect(result).toBe(1)
})

afterAll(() => {
    mongoose.connection.close()
})