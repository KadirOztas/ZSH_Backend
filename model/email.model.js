import sequelize from "../config/database.config.js";
import { DataTypes } from "sequelize";

const Email = sequelize.define(
	"Email",
	{
		from: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		to: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		subject: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		sentAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		tableName: "emails",
	}
);

export { Email };
