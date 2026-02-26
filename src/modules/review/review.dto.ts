import { z } from "zod";
import { ReviewValidation } from "./review.validation";

export type CreateReviewDto = z.infer<typeof ReviewValidation.createReviewSchema>["body"];
