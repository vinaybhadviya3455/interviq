import express from "express"
import {
    googleAuth,
    register,
    login,
    logOut,
    forgotPassword,
    resetPassword,
    validateResetToken,
} from "../controllers/auth.controller.js"

const authRouter = express.Router()

authRouter.post("/google", googleAuth)
authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.get("/logout", logOut)
authRouter.post("/forgot-password", forgotPassword)
authRouter.post("/reset-password", resetPassword)
authRouter.get("/validate-reset-token", validateResetToken)

export default authRouter
