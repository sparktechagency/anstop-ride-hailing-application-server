import { z } from "zod";
import { SupportValidation } from "./support.validation";

export type TCreateSupportDto = z.infer<typeof SupportValidation.createSchema>