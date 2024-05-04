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
		const result = await authService.login(email, password, res);
		res.send("login successful");
	} catch (error) {
		logger.error("Login error: ", error.message);
		res.status(500).send("Login failed");
	}
});

router.post('/logout', verifyToken, (req, res) => {
    req.session = null;
    res.send('logout successfull');
});
router.post("/login-admin", authService.loginAdmin);
export {router}