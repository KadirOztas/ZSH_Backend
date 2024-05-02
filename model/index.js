import {Employee} from "./employee.model.js";
import {User} from "./user.model.js";
import {File} from "./file.model.js";
import { Email } from "./email.model.js";
Employee.hasMany(File);
File.belongsTo(Employee);

export {Employee, User, File, Email}