import {User} from "../model/user.model.js";

import jwt from "jsonwebtoken";

import config from "../config/auth.config.js";
import logger from "../config/log.config.js";

const register = async ({email, firstname, lastname, password}) => {
    logger.info(`Registering user... in service ${email}`);
    try{
    const user =
        await User.create({email, firstname, lastname, password});
        logger.info(`User is registered and activation email send ${email}`);
        return user;
    }catch (error) {
        logger.error(`Error creating user... ${error.message}`);
        throw new Error('Error creating user');
    }
}

const login = async (email, password) => {
    const user =
        await User.findOne({where: {email, password}});
    if(user == null) {
        throw new Error('User not found');
    }

    const token = jwt.sign({ id: user.id },
        config.secret,
        {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 86400, // 24 hours
        });

    return token;
}


export default {register, login}