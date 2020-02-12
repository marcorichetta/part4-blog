require('dotenv').config()

let port = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

// Change the DB URI for tests
if (process.env.NODE_ENV === 'test') {
    MONGODB_URI = process.env.TEST_MONGODB_URI
}

if (port == null || port == "") {
    port = 8000;
}

// Make it accessible from other files
module.exports = {
    MONGODB_URI,
    PORT
}