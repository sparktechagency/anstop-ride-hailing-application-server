import { z } from "zod";

const createReviewSchema = z.object({
    body: z.object({
        rideId: z.string({
            required_error: "Ride ID is required",
        }),
        revieweeId: z.string({
            required_error: "Reviewee ID is required",
        }),
        rating: z
            .number({
                required_error: "Rating is required",
            })
            .min(1)
            .max(5),
        comment: z.string({
            required_error: "Comment is required",
        }),
    }).strict(),
});

export const ReviewValidation = {
    createReviewSchema,
};
