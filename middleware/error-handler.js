function errorHandler(err, req, res, next) {
    console.log(err)
    switch (true) {
        case typeof err === 'string':
            // custom application error
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            return res.status(statusCode).json({ message: err });

        // case Array.isArray(err):
        //     // custom application error
        //     return res.status(400).json(err);
        case err.name === 'ValidationError':
            // mongoose validation error
            return res.status(400).json({ message: err.message });

        case err === 'Invalid token':
            // mongoose validation error
            return res.status(401).json({ message: err.message });
        case err.name === 'UnauthorizedError':
            // jwt authentication error
            try {
                return res.status(401).json({ message: err.message });
            }catch (e) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

        default:
            return res.status(500).json({ message: err.message });
    }
}

module.exports = errorHandler;