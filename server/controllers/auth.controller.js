import bcrypt from "bcryptjs"
import crypto from "crypto"
import genToken from "../config/token.js"
import User from "../models/user.model.js"
import {
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendPasswordChangedEmail,
} from "../services/email.service.js"


// ── Helpers ───────────────────────────────────────────────────────────────────

const setCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
}

const generateSecureToken = () => crypto.randomBytes(32).toString("hex")


// ── Google OAuth ──────────────────────────────────────────────────────────────

export const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body

        let user = await User.findOne({ email })

        if (!user) {
            user = await User.create({ name, email })
            try { await sendWelcomeEmail(user) } catch (_) { /* non-fatal */ }
        }

        const token = await genToken(user._id)
        setCookie(res, token)

        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({ message: `Google Auth Error: ${error.message}` })
    }
}


// ── Register ──────────────────────────────────────────────────────────────────

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }

        const existing = await User.findOne({ email })
        if (existing) {
            return res.status(400).json({ message: "Email is already registered" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({ name, email, password: hashedPassword })

        try { await sendWelcomeEmail(user) } catch (_) { /* non-fatal */ }

        const token = await genToken(user._id)
        setCookie(res, token)

        return res.status(201).json(user)

    } catch (error) {
        return res.status(500).json({ message: `Register Error: ${error.message}` })
    }
}


// ── Login ─────────────────────────────────────────────────────────────────────

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        if (!user.password) {
            return res.status(400).json({ message: "This account uses Google sign-in. Please continue with Google." })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        const token = await genToken(user._id)
        setCookie(res, token)

        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({ message: `Login Error: ${error.message}` })
    }
}


// ── Logout ────────────────────────────────────────────────────────────────────

export const logOut = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({ message: "Logout Successfully" })
    } catch (error) {
        return res.status(500).json({ message: `Logout Error: ${error.message}` })
    }
}


// ── Forgot Password ───────────────────────────────────────────────────────────

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(200).json({ message: "If an account with that email exists, a reset link has been sent." })
        }

        // Google account — no password exists
        if (!user.password) {
            return res.status(400).json({ message: "This account uses Google sign-in. Please use the Google button to log in — no password is needed." })
        }

        const resetToken = generateSecureToken()
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

        user.resetPasswordToken = resetToken
        user.resetPasswordTokenExpiry = resetTokenExpiry
        await user.save()

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`

        try { await sendPasswordResetEmail(user, resetUrl) } catch (e) {
            console.error("Password reset email failed:", e.message)
        }

        return res.status(200).json({ message: "If an account with that email exists, a reset link has been sent." })

    } catch (error) {
        return res.status(500).json({ message: `Forgot Password Error: ${error.message}` })
    }
}


// ── Reset Password ────────────────────────────────────────────────────────────

export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body

        if (!token || !password) {
            return res.status(400).json({ message: "Token and new password are required" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiry: { $gt: new Date() },
        })

        if (!user) {
            return res.status(400).json({ message: "This reset link is invalid or has expired. Please request a new one." })
        }

        user.password = await bcrypt.hash(password, 10)
        user.resetPasswordToken = null
        user.resetPasswordTokenExpiry = null
        await user.save()

        try { await sendPasswordChangedEmail(user) } catch (_) { /* non-fatal */ }

        return res.status(200).json({ message: "Password updated successfully. You can now log in." })

    } catch (error) {
        return res.status(500).json({ message: `Reset Password Error: ${error.message}` })
    }
}


// ── Validate Reset Token ──────────────────────────────────────────────────────

export const validateResetToken = async (req, res) => {
    try {
        const { token } = req.query

        if (!token) {
            return res.status(400).json({ valid: false, message: "No token provided" })
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiry: { $gt: new Date() },
        })

        if (!user) {
            return res.status(400).json({ valid: false, message: "This link is invalid or has expired." })
        }

        return res.status(200).json({ valid: true })

    } catch (error) {
        return res.status(500).json({ message: `Validate Token Error: ${error.message}` })
    }
}