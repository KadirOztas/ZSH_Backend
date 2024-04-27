import jwt from "jsonwebtoken";

import config from "../config/auth.config.js";
import logger from "../config/log.config.js";

const verifyToken = (req, res, next) => {

    return next()

    let token = req.session.token;

    if (!token) {
        logger.error('No token provided!');
        return res.status(401).send({
            message: "No token provided!",
        });
    }

    jwt.verify(token,
        config.secret,
        (err, decoded) => {
            if (err) {
                logger.error('Unauthorized!');
                return res.status(401).send({
                    message: "Unauthorized!",
                });
            }
            req.userId = decoded.id;
            logger.info('User is authorized', req.userId);
            next();
        });
};


export {verifyToken}