import express, { Request, Response } from "express";
import cors from "cors";
import router from "./routes/route";
import globalErrorHandler from "./middleware/global-error-handler";
import notFoundRoute from "./middleware/not-found-route";
import path from "path";

const app = express();

// express middleware

app.use(
	cors({
		origin: ["http://localhost:3000"],
		credentials: true,
		methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");

app.set("trust proxy", 1);

// serve socket.html file
// Get the absolute path to the public folder
const publicPath = path.resolve(__dirname, "../public");

const uploadPath = path.resolve(__dirname, "../uploads");
app.use("/uploads", express.static(uploadPath));

// Serve static files from root-level "public"
app.use(express.static(publicPath));

// Serve socket-client.html at "/"
app.get("/", (req, res) => {
	// res.sendFile(path.join(publicPath, "socket.html"));
	res.send("SERVER CONNECTED");
});
app.get("/test", (req: Request, res: Response) => {
	res.json({ message: "SERVER CONNECTED" });
});

// routes

app.use("/api/v1", router);

// global error handler
app.use(globalErrorHandler);
// not found
app.use(notFoundRoute);

export default app;
