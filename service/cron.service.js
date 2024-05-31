import { schedule } from "node-cron";
import { Volunteer } from "../model/volunteer.model.js";

schedule("30 17 * * *", async () => {
	try {
		await Volunteer.updateMany({}, { isAvailable: false });
	} catch (error) {
		console.error("Error updating volunteer availability:", error);
	}
});

