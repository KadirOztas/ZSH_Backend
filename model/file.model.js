import sequelize from "../config/database.config.js";
import { DataTypes } from "sequelize";

const File = sequelize.define("File", {
    originalname: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: {
            msg: 'Name is required'
        },
    },
    size: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    mimetype: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: {
            msg: 'Mimetype is required'
        },
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: {
            msg: 'filename is required'
        },
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: {
            msg: 'path is required'
        },
    }
},{
    tableName: 'file'
});


export {File}