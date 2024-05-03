import sequelize from "../config/database.config.js";
import { DataTypes } from "sequelize";

const Volunteer = sequelize.define(
	"Volunteer",
	{
		firstname: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "First Name is required",
				},
			},
		},
		lastname: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Last Name is required",
				},
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
			validate: {
				notEmpty: {
					msg: "Password is required",
				},
			},
		},
		role: {
			type: DataTypes.ENUM,
			values: ["volunteer"],
			allowNull: false,
			defaultValue: "volunteer",
		},
		kanton: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		isAvailable: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		tableName: "volunteers",
	}
);

export { Volunteer };
