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
			unique: true,
			validate: {
				isEmail: {
					msg: "Email must be valid",
				},
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
			values: ["user", "admin", "volunteer"],
			allowNull: false,
			defaultValue: "user",
		},

		kanton: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		language: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		tableName: "users",
	}
);

export { User };
