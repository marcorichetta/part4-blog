require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

// Make it accessible from other files
module.exports = {
    MONGODB_URI,
    PORT
}