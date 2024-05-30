import sequelize from "../config/database.config.js";
import { DataTypes } from "sequelize";

const User = sequelize.define(
	"User",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		firstname: {
			type: DataTypes.STRING(255),
			allowNull: false,
			notEmpty: {
				msg: "First Name is required",
			},
		},
		lastname: {
			type: DataTypes.STRING(255),
			allowNull: false,
			notEmpty: {
				msg: "Last Name is required",
			},
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true,
			validate: {
				isEmail: {
					msg: "Email must be valid",
				},
			},
		},
		password: {
			type: DataTypes.STRING(255),
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
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		language: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
	},
	{
		tableName: "users",
	}
);

export { User };
