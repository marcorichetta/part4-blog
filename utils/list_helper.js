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

module.exports = {
    dummy,
    totalLikes
}
