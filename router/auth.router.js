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

router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		await authService.login(email, password, res);
	} catch (error) {
		logger.error("Login error caught in router: ", error.message);
	}
});


router.post('/logout', verifyToken, authService.logout);
router.post("/login-admin", authService.loginAdmin);
export {router}