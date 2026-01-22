/* eslint-disable no-console */
import mongoose from "mongoose";
import app from "./app";
import { config } from "./config";
import { Server } from "socket.io";
import authenticateUser from "./socket/middleware";
import { SocketHandler } from "./socket";
import "./firebase/index";
import http from "http";
import seedLegalDocs from "./utils/seedLegalDocs";
import { seedRides } from "./modules/ride/seed/seedRide";
import seedConversation from "./modules/ride/seed/seed-conversation";
import createAdminIfNotExist from "./utils/email/seedAdmin";
// import { findNearestDrivers } from "./modules/rideRequest/rideRequest.service";


let server: http.Server;

async function main(): Promise<void> {
	try {
		const connectionInstance = await mongoose.connect(config.db_uri!);
		console.log(
			"Database is successfully connected!! Status:",
			config.db_uri,
			connectionInstance.connections[0].readyState === 1
				? "online"
				: "offline"
		);
		server = app.listen(config.port, () => {
			console.log("server running on port", config.port);
		});

		const io = new Server(server, {
			pingTimeout: 60000,
			cors: {
				origin: [
					"http://localhost:3000",
					"http://localhost:5173",
					"http://10.0.80.220:3000",
					"http://10.0.80.220:7002",
					"http://10.0.80.220:4173",
					"http://localhost:7003",
				],
				methods: ["GET", "POST"],
				credentials: true,
			},
		});

		io.use(authenticateUser);

		(globalThis as any).io = io;

		SocketHandler(io);

		// await createAdminIfNotExist();
		await createAdminIfNotExist();
		await seedLegalDocs();
		// await findNearestDrivers([ 0, 0]);
		// await seedConversation()
		// await seedRides();
	} catch (error) {
		console.log("Oops! Connection failed", error);
	}
}
main();

// process.on("SIGTERM", () => {
// 	console.log("SIGTERM received. Shutting down gracefully...");
// 	if (server) {
// 		server.close(() => {
// 			console.log("HTTP server closed.");
// 			process.exit(0); // Gracefully exit
// 		});
// 	} else {
// 		process.exit(0); // Exit anyway if no server
// 	}
// });

