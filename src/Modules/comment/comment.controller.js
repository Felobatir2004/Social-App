import { Router } from "express";
import * as commentService from "./comment.service.js";
import * as commentValidation from "./comment.validation.js" 
import { allowTo, authentication } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import {uploadCloud} from "../../utils/fileUploading/multerCloud.js"
import {validation} from "../../middlewares/validation.middleware.js"
const router = Router({mergeParams:true})

// /post/:postId/comment
//create comment
router.post(
    "/",
    authentication(),
    allowTo(["User"]),
    uploadCloud().single("image"),
    validation(commentValidation.createCommentSchema),
    asyncHandler(commentService.createComment)
)

//update comment
router.patch(
    "/:commentId",
    authentication(),
    allowTo(["User"]),
    uploadCloud().single("image"),
    validation(commentValidation.updateCommentSchema),
    asyncHandler(commentService.updateComment)
)


router.patch(
    "/softDelete/:commentId",
    authentication(),
    allowTo(["User","Admin"]),
    validation(commentValidation.softDeleteCommentSchema),
    asyncHandler(commentService.softDeleteComment)
)

//mergeparams

// /post/:postId/comment
router.get(
    "/",
    authentication(),
    allowTo(["User","Admin"]),
    validation(commentValidation.getAllCommentSchema),
    asyncHandler(commentService.getAllComments)
)

router.patch(
    "/like_unlike/:commentId",
    authentication(),
    allowTo(["User"]),
    validation(commentValidation.likeAndUnlikeCommentSchema),
    asyncHandler(commentService.likeAndUnlikeComment)
)

// add reply
// post/:postId/comment/:commentId/reply
router.post(
    "/:commentId/reply",
    authentication(),
    allowTo(["User"]),
    uploadCloud().single("image"),
    validation(commentValidation.addReplySchema),
    asyncHandler(commentService.addReply)
)

router.delete(
    "/:commentId",
    authentication(),
    allowTo(["User","Admin"]),
    validation(commentValidation.deleteCommentSchema),
    asyncHandler(commentService.deleteComment)
)


export default router