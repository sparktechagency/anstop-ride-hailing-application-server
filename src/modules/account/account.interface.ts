import { TUserName } from "../../shared/shared.interface";

export type TGetMEResponse = {
    username: TUserName;
    phoneNumber: string;
    email: string;
    avatar: string;
    totalRides: number;
    accountAge: number; // in milliseconds
}