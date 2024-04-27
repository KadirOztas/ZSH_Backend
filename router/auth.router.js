import express  from "express";
import authService from "../service/auth.service.js";
import {verifyToken} from "../utility/auth.utility.js";
import logger from "../config/log.config.js";

const router = express.Router();

router.post('/register', async (req, res, next) => {
    logger.info('Registering user...', req.body.email);
    const user = req.body;
    await authService.register(user);
    logger.info('User has registered successfully', req.body.email);
    res.send('Register');
})

router.post('/login',async (req, res) => {
    const {email, password} = req.body;
    const token  = await authService.login(email, password);

    req.session.token = token;
    res.send('login successfull');
});

router.post('/logout', verifyToken, (req, res) => {
    req.session = null;
    res.send('logout successfull');
});

export {router}