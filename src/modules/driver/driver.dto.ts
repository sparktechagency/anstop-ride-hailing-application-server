import { z } from "zod";
import { DriverValidation } from "./driver.validation";

export type TOnboardDriverDto = z.infer<typeof DriverValidation.OnboardingSchema>["body"];