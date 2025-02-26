import { Router } from "express";
import * as postService from "./post.service.js";
import * as postValidation from "./post.validation.js" 
import { allowTo, authentication } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import {uploadCloud} from "../../utils/fileUploading/multerCloud.js"
import {validation} from "../../middlewares/validation.middleware.js"
import commentRouter from "../comment/comment.controller.js"
const router = Router()

router.use("/:postId/comment",commentRouter)

router.post(
    "/create",
    authentication(),
    allowTo(["User"]),
    uploadCloud().array("images",5),
    validation(postValidation.createPostSchema),
    asyncHandler(postService.createPost)
)

router.patch(
    "/update/:postId",
    authentication(),
    allowTo(["User"]),
    uploadCloud().array("images",5),
    validation(postValidation.updatePostSchema),
    asyncHandler(postService.updatePost)
)

router.patch(
    "/softDelete/:postId",
    authentication(),
    allowTo(["User","Admin"]),
    uploadCloud().array("images",5),
    validation(postValidation.softDeletePostSchema),
    asyncHandler(postService.softDeletePost)
)

router.patch(
    "/restorePost/:postId",
    authentication(),
    allowTo(["User","Admin"]),
    uploadCloud().array("images",5),
    validation(postValidation.restorePostSchema),
    asyncHandler(postService.restorePost)
)

router.get(
    "/getSinglePost/:postId",
    authentication(),
    allowTo(["User","Admin"]),
    validation(postValidation.getSinglePostSchema),
    asyncHandler(postService.getSinglePost)
)

router.get(
    "/activePosts",
    authentication(),
    allowTo(["User","Admin"]),
    asyncHandler(postService.activePosts)
)

router.get(
    "/freezedPosts",
    authentication(),
    allowTo(["User","Admin"]),
    asyncHandler(postService.freezedPosts)
)


router.patch(
    "/like_unlike/:postId",
    authentication(),
    allowTo(["User"]),
    validation(postValidation.likeAndUnlikePostSchema),
    asyncHandler(postService.likeAndUnlike)
)


export default router