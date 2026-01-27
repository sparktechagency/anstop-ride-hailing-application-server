import { USER_ROLES } from "../../modules/user/user.constant"
import { User } from "../../modules/user/user.model"


const createAdminIfNotExist = async () => {
    const admin = await User.findOne({ role: {$in: [USER_ROLES.ADMIN]} })
    if (!admin) {
        await User.create({
            name: "Admin",
            email: "anstopadmin@yopmail.com",
            profilePicture: "https://images.unsplash.com/photo-1714332818313-627551693dbc?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            password: "admin@anstop",
            role: [USER_ROLES.ADMIN],
            isEmailVerified: true,
            location: {
                type: "Point",
                coordinates: [0, 0]
            }
        })
        console.log("Admin created successfully");
    }else{
        console.log("Admin already exists");
    }
}

export default createAdminIfNotExist;
