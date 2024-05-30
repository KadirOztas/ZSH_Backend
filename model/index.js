import { User } from "./user.model.js";
import { File } from "./file.model.js";
import { Email } from "./email.model.js";
import { Volunteer } from "./volunteer.model.js";

User.hasMany(File, {
	foreignKey: "userId",
	onDelete: "CASCADE",
});

Volunteer.hasMany(File, {
	foreignKey: "volunteerId",
	onDelete: "CASCADE",
});

export { User, File, Email, Volunteer };
