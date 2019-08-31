const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:', request.path)
    logger.info('Body:', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return response.status(400).send({
            error: 'Malformatted id'
        })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({
            error: error.message
        })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        })
    }

    logger.error(error.message)

    next(error)
}

/**
 * Separa el token del header `authorization`
 * @param {*} request 
 */
const tokenExtractor = (request, response, next) => {
    /* NO OMITIR los argumentos (req, res, next) por más que no se usen */
    
    const authorization = request.get('authorization');

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)

        /* Se debe llamar a next() cuando la función no termine con el ciclo 
        de request-response. next() le pasa el control a la siguiente función del middleware */
    }
    next();
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor
}