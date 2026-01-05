import jwt, { SignOptions } from "jsonwebtoken";
import { TRoles } from "../../shared/shared.interface";

export const GenerateToken = (
    jwtPayload: { _id: string, role: TRoles },
    secret: string,
    expiresIn: SignOptions["expiresIn"],
): string => {
    const options: SignOptions = {
        expiresIn,
    };

    return jwt.sign(jwtPayload, secret, options);
};