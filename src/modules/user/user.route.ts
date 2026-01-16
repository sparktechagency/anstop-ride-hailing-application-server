import { Router } from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middleware/auth";
import requestValidator from "../../middleware/request-validator";
import { UserValidation } from "./user.validation";
import ExtractFilePaths from "../../middleware/extractFilePath";
import fileUploadHandler from "../../utils/UploadAssets";


const UPLOADS_FOLDER = "uploads/files";
const upload = fileUploadHandler(UPLOADS_FOLDER);

const router = Router();

router.post("/fcm-token", auth("COMMON"), requestValidator(UserValidation.setFcmTokenSchema), UserControllers.setFcmToken);

router.post("/address", auth("COMMON"), requestValidator(UserValidation.saveAddressSchema), UserControllers.saveAddress);

router.get("/address", auth("COMMON"), requestValidator(UserValidation.getAddressSchema), UserControllers.getSavedAddress);

router.post("/current-location", auth("COMMON"), requestValidator(UserValidation.setCurrentLocationSchema), UserControllers.setCurrentLocation)

router.post("/upload-files", auth("COMMON"), upload.array("files", 10), requestValidator(UserValidation.uploadFilesSchema), ExtractFilePaths, UserControllers.uploadFiles)


router.get("/my-profile", auth("COMMON"), UserControllers.getMyProfile)

router.patch("/profile", auth("COMMON"), requestValidator(UserValidation.updateProfileSchema), UserControllers.updateProfile)

router.get("/balance", auth("COMMON"), UserControllers.getBalance)

export const UserRoutes = router;