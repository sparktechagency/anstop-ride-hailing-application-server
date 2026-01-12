import jwt, { SignOptions } from "jsonwebtoken";
import { TRole } from "../user/user.interface";

export const GenerateToken = (
    jwtPayload: { _id: string, role: TRole[] },
    secret: string,
    expiresIn: SignOptions["expiresIn"],
): string => {
    const options: SignOptions = {
        expiresIn,
    };

    return jwt.sign(jwtPayload, secret, options);
};