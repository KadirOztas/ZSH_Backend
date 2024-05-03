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
			const volunteers = await Volunteer.findAll({ where: { kanton: kanton } });
			return volunteers;
		} catch (error) {
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
