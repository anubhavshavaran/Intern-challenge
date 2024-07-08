const express = require('express');
const errorController = require('./utils/errorController');

const app = express();
app.use(express.json({ limit: '10kb' }));

const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');

app.use('/api/users', userRouter);

app.use('/api/helloworld', (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: 'Hello World!'
    });
});

app.all('*', (req, res, next) => {
    next(new AppError(`${req.url} not found on the server!`), 404);
});

app.use(errorController);

module.exports = app;