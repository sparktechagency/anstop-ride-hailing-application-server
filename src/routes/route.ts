import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { RideRequestRoutes } from "../modules/rideRequest/rideRequest.route";
import { SharedRoutes } from "../shared/shared.route";
import { NotificationRoutes } from "../modules/notification/notification.route";
import { LegalDocumentRoutes } from "../modules/legalDocument/legalDocument.route";
import { RideRoutes } from "../modules/ride/ride.route";
import { MessageRoutes } from "../modules/messaging/message/message.route";
import { DriverRoutes } from "../modules/driver/driver.route";
import { TransactionRoutes } from "../modules/transaction/transaction.route";
import { SupportRoutes } from "../modules/support/support.route";
import { WithdrawalRequestRoutes } from "../modules/withdrawalRequest/withdrawalRequest.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { ReviewRoutes } from "../modules/review/review.route";

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
		path: "/ride-requests",
		route: RideRequestRoutes,
	},
	{
		path: "/shared",
		route: SharedRoutes,
	},
	{
		path: "/notifications",
		route: NotificationRoutes,
	},
	{
		path: "/legal-documents",
		route: LegalDocumentRoutes,
	},
	// {
	// 	path: "/rides",
	// 	route: RideRoutes,
	// },
	{
		path: "/messages",
		route: MessageRoutes,
	},
	{
		path: "/drivers",
		route: DriverRoutes,
	},
	{
		path: "/transactions",
		route: TransactionRoutes,
	},
	{
		path: "/supports",
		route: SupportRoutes,
	},
	{
		path: "/notifications",
		route: NotificationRoutes
	},
	{
		path: "/withdrawal-requests",
		route: WithdrawalRequestRoutes
	},
	{
		path: "/admin",
		route: AdminRoutes
	},
	{
		path: "/reviews",
		route: ReviewRoutes
	}
];

routesInfo.forEach((route) => {
	if (!route.route) {
		console.error(`❌ Route handler for ${route.path} is undefined. Check the export in the corresponding route file.`);
		throw new Error(`Route handler for ${route.path} is undefined`);
	}
	router.use(route.path, route.route);
});

export default router;
