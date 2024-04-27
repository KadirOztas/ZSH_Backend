import {Employee} from "./employee.model.js";
import {User} from "./user.model.js";
import {File} from "./file.model.js";

Employee.hasMany(File);
File.belongsTo(Employee);

export {Employee, User, File}