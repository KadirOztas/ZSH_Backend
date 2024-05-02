import sequelize from "../config/database.config.js";
import { DataTypes } from "sequelize";

const User = sequelize.define(
	"User",
	{
		firstname: {
			type: DataTypes.STRING,
			allowNull: false,
			notEmpty: {
				msg: "First Name is required",
			},
		},
		lastname: {
			type: DataTypes.STRING,
			allowNull: false,
			notEmpty: {
				msg: "Last Name is required",
			},
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			isEmail: {
				msg: "Email is required",
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			notEmpty: {
				msg: "Password is required",
			},
		},
		role: {
			type: DataTypes.ENUM,
			values: ["admin", "volunteer", "user"],
			allowNull: false,
			defaultValue: "user",
		},
	},
	{
		tableName: "user",
	}
);

export { User };
