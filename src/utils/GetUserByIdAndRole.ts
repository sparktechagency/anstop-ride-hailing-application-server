import { Admin } from "../modules/admin/admin.model";
import { Driver } from "../modules/driver/driver.model";
import { User } from "../modules/user/user.model";
import { TRoles, UserRoles } from "../shared/shared.interface";

export const GetUserByIdAndRole = async (userId: string, role: TRoles) => {
	if (role === UserRoles.Rider) return await User.findById(userId);
	if (role === UserRoles.Driver) return await Driver.findById(userId);
	if (role === UserRoles.Admin) return await Admin.findById(userId);

	if (role !== UserRoles.Driver && role !== UserRoles.Rider) {
		throw new Error("Invalid role");
	}
};
