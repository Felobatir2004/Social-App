import { Router } from "express";
import * as authService from "./auth.service.js";
import * as authValidation from "./auth.validation.js"
import { validation } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
const router = Router()

router.post(
    "/login",
    validation(authValidation.loginSchema),
    asyncHandler(authService.login)
)

router.post(
    "/register",
    validation(authValidation.registerSchema),
    asyncHandler(authService.register)
)
router.get(
    "/refresh_token",
    asyncHandler(authService.refresh_token)
)
router.patch(
    "/verifyEmail",
    validation(authValidation.confirmEmailSchema),
    asyncHandler(authService.verifyEmail)
)
router.patch(
    "/forget_password",
    validation(authValidation.forgetPasswordSchema),
    asyncHandler(authService.forget_password)
)
router.patch(
    "/reset_password",
    validation(authValidation.resetPasswordSchema),
    asyncHandler(authService.reset_password)
)
router.post(
    "/loginWithGmail",
    asyncHandler(authService.loginWithGmail)
)


export default router