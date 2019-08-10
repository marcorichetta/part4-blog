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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}
