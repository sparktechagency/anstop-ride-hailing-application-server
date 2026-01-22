import { z } from "zod";
import { withdrawalRequestValidation } from "./withdrawalRequest.validation";

export type TCreateWithdrawalRequestDto = z.infer<typeof withdrawalRequestValidation.createSchema>["body"];
export type TRejectWithdrawalRequestDto = z.infer<typeof withdrawalRequestValidation.rejectSchema>["body"]