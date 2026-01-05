export const driverSocketHandler = () => {
	socket.on("ride:accepted", (data) => {
		console.log("Driver accept the ride");
	});
};
