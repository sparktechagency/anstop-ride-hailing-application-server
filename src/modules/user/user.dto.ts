import z from "zod";
import { UserValidation } from "./user.validation";

export type TSaveAddressDto = z.infer<typeof UserValidation.saveAddressSchema>["body"];
export type TSaveAddressQuery = z.infer<typeof UserValidation.saveAddressSchema>["query"];
export type TUpdateProfileDto = z.infer<typeof UserValidation.updateProfileSchema>["body"]
export type TChangeUserStatusDto = z.infer<typeof UserValidation.changeUserStatusSchema>["body"]
export type TGetDriverDetailsDto = z.infer<typeof UserValidation.getDriverDetailsSchema>["params"]