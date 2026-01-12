import z from "zod";
import { UserValidation } from "./user.validation";

export type TSaveAddressDto = z.infer<typeof UserValidation.saveAddressSchema>["body"];
export type TSaveAddressQuery = z.infer<typeof UserValidation.saveAddressSchema>["query"];