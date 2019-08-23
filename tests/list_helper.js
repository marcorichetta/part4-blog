const Blog = require('../models/blog')

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]

const initialBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
]

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {

    if (!blogs) {
        return 0
    }

    // Add every blog's likes to the total
    const likes = blogs.reduce( function(total, blog) {
        return total + blog.likes
    }, 0)

    return likes
}

const favoriteBlog = (blogs) => {

    // [ 1, 2, 3, 4 ]
    const blogLikes = blogs.map(blog => blog.likes)

    // Use spread operator (...)
    const favoriteIndex = Math.max(...blogLikes)

    const favoriteBlogIndex = blogLikes.indexOf(favoriteIndex)

    const favorite = blogs[favoriteBlogIndex]

    const result = {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes,
    }

    return result
}

// Returns the blogs stored in the database
const blogsInDb = async () => {
    const blogs = await Blog.find({})

    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs,
    listWithOneBlog,
    dummy,
    totalLikes,
    favoriteBlog,
    blogsInDb
}
