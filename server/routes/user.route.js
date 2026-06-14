import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { getCurrentUser, deleteAccount } from "../controllers/user.controller.js"



const userRouter = express.Router()

userRouter.get("/current-user",isAuth,getCurrentUser)
userRouter.delete("/delete-account",isAuth,deleteAccount)



export default userRouter