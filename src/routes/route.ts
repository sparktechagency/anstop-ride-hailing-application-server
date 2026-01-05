import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { RideRequestRoutes } from "../modules/rideRequest/rideRequest.route";
import { AccountRoutes } from "../modules/account/account.route";
import { SharedRoutes } from "../shared/shared.route";
import { DriverRoutes } from "../modules/driver/driver.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { NotificationRoutes } from "../modules/notification/notification.route";
import { RiderRoutes } from "../modules/rider/rider.route";

const router = Router();

const routesInfo = [
	{
		path: "/auth",
		route: AuthRoutes,
	},
	{
		path: "/users",
		route: UserRoutes,
	},
	{
		path: "/riders",
		route: RiderRoutes,
	},
	{
		path: "/drivers",
		route: DriverRoutes,
	},
	{
		path: "/admins",
		route: AdminRoutes,
	},
	{
		path: "/ride-requests",
		route: RideRequestRoutes,
	},
	{
		path: "/accounts",
		route: AccountRoutes,
	},
	{
		path: "/shared",
		route: SharedRoutes,
	},
	{
		path: "/notifications",
		route: NotificationRoutes,
	},
];

routesInfo.forEach((route) => {
	if (!route.route) {
		console.error(`❌ Route handler for ${route.path} is undefined. Check the export in the corresponding route file.`);
		throw new Error(`Route handler for ${route.path} is undefined`);
	}
	router.use(route.path, route.route);
});

export default router;
