import sequelize from "../config/database.config.js";
import { DataTypes } from "sequelize";

const Employee = sequelize.define("Employee", {
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: {
            msg: 'First Name is required'
        },
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: {
            msg: 'Last Name is required'
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        isEmail: {
            msg: 'Email is required'
        },
    },
    birthdate: {
        type: DataTypes.DATE,
        allowNull: false,
        notEmpty: {
            msg: 'Birthdate is required'
        },
    },
    salary: {
        type: DataTypes.BIGINT,
        allowNull: false,
        notEmpty: {
            msg: 'Salary is required'
        },
    },
},{
    tableName: 'employee'
});


export {Employee}