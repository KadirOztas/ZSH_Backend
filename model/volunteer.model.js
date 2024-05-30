import sequelize from "../config/database.config.js";
import { DataTypes } from "sequelize";

const Volunteer = sequelize.define(
	"Volunteer",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
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
		language: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "en",
		},
	},
	{
		tableName: "volunteers",
	}
);

export { Volunteer };
