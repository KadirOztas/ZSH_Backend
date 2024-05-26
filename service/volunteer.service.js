import { allVolunteers } from "../data/volunteers.js";
import { Volunteer } from "../model/volunteer.model.js";

const VolunteerService = {
	async getAllVolunteers() {
		try {
			const volunteers = await Volunteer.findAll();
			return volunteers;
		} catch (error) {
			throw new Error("Error while fetching volunteers: " + error.message);
		}
	},
	async getVolunteersByKanton(kanton) {
		try {
			console.log("Fetching volunteers for kanton: ", kanton);
			const volunteers = await Volunteer.findAll({
				where: { kanton: kanton },
				attributes: ["firstname", "lastname", "kanton", "language"],
			});
			console.log("Found volunteers: ", volunteers);
			return volunteers;
		} catch (error) {
			console.error(
				"Error while fetching volunteers by kanton: ",
				error.message
			);
			throw new Error(
				"Error while fetching volunteers by kanton: " + error.message
			);
		}
	},

	async createVolunteer(data) {
		try {
			const volunteer = await Volunteer.create(data);
			return volunteer;
		} catch (error) {
			throw new Error("Error while creating volunteer: " + error.message);
		}
	},

	async getVolunteerById(id) {
		try {
			const volunteer = await Volunteer.findByPk(id);
			if (!volunteer) {
				throw new Error("Volunteer not found");
			}
			return volunteer;
		} catch (error) {
			throw new Error("Error while fetching volunteer: " + error.message);
		}
	},

	async updateVolunteer(id, data) {
		try {
			const volunteer = await Volunteer.findByPk(id);
			if (!volunteer) {
				throw new Error("Volunteer not found");
			}
			await volunteer.update(data);
			return volunteer;
		} catch (error) {
			throw new Error("Error while updating volunteer: " + error.message);
		}
	},
	async updateVolunteerAvailability(userId, volunteerId, isAvailable) {
		try {
			const volunteer = await Volunteer.findByPk(volunteerId);
			if (!volunteer) {
				throw new Error("Volunteer not found");
			}
			if (volunteer.id !== userId) {
				throw new Error("Unauthorized to change this data");
			}
			await volunteer.update({ isAvailable });
			return volunteer;
		} catch (error) {
			throw new Error(
				"Error updating volunteer availability: " + error.message
			);
		}
	},
	async deleteVolunteer(id) {
		try {
			const volunteer = await Volunteer.findByPk(id);
			if (!volunteer) {
				throw new Error("Volunteer not found");
			}
			await volunteer.destroy();
			return volunteer;
		} catch (error) {
			throw new Error("Error while deleting volunteer: " + error.message);
		}
	},
	async getAllVolunteerDetailsByKanton(kanton) {
		try {
			console.log("Fetching detailed volunteers for kanton: ", kanton);
			const volunteers = await Volunteer.findAll({
				where: { kanton: kanton },
				attributes: [
					"id",
					"firstname",
					"lastname",
					"email",
					"phone",
					"isAvailable",
					"language",
				],
			});
			console.log("Found detailed volunteers: ", volunteers);
			return volunteers;
		} catch (error) {
			console.error(
				"Error while fetching detailed volunteers by kanton: ",
				error.message
			);
			throw new Error(
				"Error while fetching detailed volunteers by kanton: " + error.message
			);
		}
	},
};
const populateVolunteers = async () => {
	try {
		for (const kantonData of allVolunteers) {
			const { kanton, volunteers } = kantonData;

			for (const volunteerData of volunteers) {
				await Volunteer.create({
					firstname: volunteerData.firstname,
					lastname: volunteerData.lastname,
					email: volunteerData.email,
					password: volunteerData.password,
					role: volunteerData.role,
					kanton: kanton,
					phone: volunteerData.phone,
					isAvailable: volunteerData.isAvailable,
					language: volunteerData.language,
				});
			}
		}
		console.log("All volunteers have been populated successfully.");
	} catch (error) {
		console.error("Error populating volunteers:", error.message);
	}
};

populateVolunteers();
export default VolunteerService;
