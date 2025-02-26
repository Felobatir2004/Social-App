import { Router } from "express";
import {authentication} from "../../middlewares/auth.middleware.js"
import * as userService from "./user.service.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import * as userValidation from "./user.validation.js"
import { validation } from "../../middlewares/validation.middleware.js";
import { fileValidation, upload } from "../../utils/fileUploading/multerUpload.js";
import { uploadCloud } from "../../utils/fileUploading/multerCloud.js";
const router = Router()

router.get("/profile",authentication(),asyncHandler(userService.getProfile))

router.get(
    "/profile/:profile",
    authentication(),
    validation(userValidation.shareProfileSchema),
    asyncHandler(userService.shareProfile)
)
router.patch(
    "/profile/email",
    validation(userValidation.updateEmailSchema),
    authentication(),
    asyncHandler(userService.updateEmail)
)

router.patch(
    "/profile/reset_email",
    validation(userValidation.resetEmailSchema),
    authentication(),
    asyncHandler(userService.resetEmail)
)
router.patch(
    "/updatePassword",
    validation(userValidation.updatePasswordSchema),

    authentication(),
    asyncHandler(userService.updatePassword)
)

router.post(
    "/profilePicture",
    authentication(),
    upload(fileValidation.images , "upload/user").single("image"),
    asyncHandler(userService.uploadImageDisk)
)

router.post(
    "/uploadCloud",
    authentication(),
    uploadCloud().single("image"),
    asyncHandler(userService.uploadImageOnCloud)
)

router.post(
    "/multipleImage",
    authentication(),
    upload().array("image",3),
    asyncHandler(userService.uploadmultipleImage)
)
router.delete(
    "/deleteProfilePicture", 
    authentication(),
    upload(fileValidation.images , "upload/user").single("image"),
    asyncHandler(userService.deleteProfilePicture)
)

router.delete(
    "/deleteProfilePictureCloud", 
    authentication(),
    uploadCloud().single("image"),
    asyncHandler(userService.deleteImageOnCloud)
)
export default router