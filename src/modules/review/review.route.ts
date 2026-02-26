import { Router } from "express";
import { ReviewController } from "./review.controller";
import auth from "../../middleware/auth";
import requestValidator from "../../middleware/request-validator";
import { ReviewValidation } from "./review.validation";

const router = Router();

router.post(
    "/",
    auth("COMMON"),
    requestValidator(ReviewValidation.createReviewSchema),
    ReviewController.createReview
);

router.get("/user/:userId", auth("COMMON"), ReviewController.getReviewsForUser);

router.get("/ride/:rideId", auth("COMMON"), ReviewController.getReviewsForRide);

export const ReviewRoutes = router;
