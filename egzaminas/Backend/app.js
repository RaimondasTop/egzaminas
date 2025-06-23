const express = require('express');
const bookRouter = require('./routes/bookRoutes');
const categoriesRouter = require('./routes/categoriesRoutes.js');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require("./utils/appError");
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use(cookieParser());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use((req, res, next) =>{
    console.log("Hello from mid");
    next();
});

app.use((req, res, next) =>{
    console.log(req.requestTime);
    next();
});

app.use('/api/v1/books', bookRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/users', userRouter);

app.all(/(.*)/, (req, res, next) => {
    const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
    next(err);
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    const message = err.message || 'Something went very wrong!';
    
    res.status(statusCode).json({
        status: status,
        message: message,
    });
});

app.use((err, req, res, next) => {
    const errMessage = err.message || "Internal server Error";
    const statusCode = err.statusCode || 500;
    const errStatus = err.status || "error";
  
    res.status(statusCode).json({
      status: errStatus,
      message: errMessage,
      stack: err.stack,
    });
});

module.exports = app;