import './loadEnv.js';

import express from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import morgan from 'morgan';

const app = express();

app.use(morgan(process.env.ACCESS_LOG_FORMAT))
app.use(cors());
app.use(
    cookieSession({
        name: process.env.COOKIE_SESSION_NAME,
        secret: process.env.COOKIE_SECRET,
        httpOnly: true
    })
);
app.use(express.json());
app.use(express.urlencoded({extended: true}));


import {router as employeeRouter} from './router/employee.router.js';
app.use('/employees', employeeRouter);

import {router as fileRouter} from './router/file.router.js';
app.use('/files', fileRouter);

import {router as userRouter} from './router/user.router.js';
app.use('/users', userRouter);

import {router as authRouter} from './router/auth.router.js';
import logger from './config/log.config.js';
app.use('/auth', authRouter);

app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace
    res.status(500).send('Something broke!'); // Send a generic error response
  });

process.on('uncaughtException', err => {
    logger.error(`Uncaught Exception ${err.message}`);    
    process.exit(0);
})

app.listen(process.env.SERVER_PORT, ()=> logger.info('Server is running on port 9010'));