import { User } from "../model/user.model.js";

const getVolunteers = async () => {
	try {
		const volunteers = await User.findAll({
			where: {
				role: "volunteer",
			},
		});
		return volunteers;
	} catch (error) {
		console.error("Error fetching volunteers:", error);
		throw error;
	}
};



export { getVolunteers };
