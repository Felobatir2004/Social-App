import authRouter from "./Modules/Auth/auth.controller.js"
import userRouter from "./Modules/User/user.controller.js"
import postRouter from "./Modules/Post/post.conroller.js"
import commentRouter from "./Modules/comment/comment.controller.js"
import adminRouter from "./Modules/Admin/admin.controller.js"
import connectDB from "./DB/connection.js"
import { globalErrorHandler, notFoundHandler } from "./utils/error handling/asyncHandler.js"
import cors from "cors";
import morgan from "morgan"
const bootstrap = async (app, express)=>{

    await connectDB()


    app.use(morgan("combined"));
  /*  
    const whitelist = ["http://localhost:3000","http://localhost:5200"];

    app.use((req,res,next)=>{
        if(whitelist.includes(req.headers("origin"))){
            return next(new Error("Blocked by cors"));
        }
        res.headers("Access-Control-Allow-Origin", req.headers("origin"));
        res.headers("Access-Control-Allow-Methods", "*");
        res.headers("Access-Control-Allow-Headers", "*");
        res.headers("Access-Control-Private-Network",true);

        return next()
    })
   */
    app.use(express.json());
    app.use("/uploads", express.static("uploads"));
    app.use(cors())

    app.get("/",(req,res)=> res.send("Hello world"))

    app.use("/auth",authRouter)
    app.use("/user",userRouter)
    app.use("/post",postRouter)
    app.use("/comment",commentRouter)
    app.use("/admin",adminRouter)
    app.all("*",notFoundHandler)
    app.use(globalErrorHandler)
}

export default bootstrap