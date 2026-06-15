import bcrypt from "bcryptjs"
import crypto from "crypto"
import genToken from "../config/token.js"
import User from "../models/user.model.js"
import {
    sendWelcomeEmail,
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendPasswordChangedEmail,
} from "../services/email.service.js"


// ── Helpers ───────────────────────────────────────────────────────────────────

const setCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
}

const generateSecureToken = () => crypto.randomBytes(32).toString("hex")

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString()

const OTP_EXPIRY_MS = 10 * 60 * 1000 // 10 minutes
const VERIFY_LINK_EXPIRY_MS = 24 * 60 * 60 * 1000 // 24 hours

// Generates and saves a fresh OTP + verification link token for a user,
// then emails both to them.
const issueAndSendVerification = async (user) => {
    const otp = generateOTP()
    const verifyToken = generateSecureToken()

    user.otp = otp
    user.otpExpiry = new Date(Date.now() + OTP_EXPIRY_MS)
    user.verifyToken = verifyToken
    user.verifyTokenExpiry = new Date(Date.now() + VERIFY_LINK_EXPIRY_MS)
    await user.save()

    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000"
    const verifyUrl = `${backendUrl}/api/auth/verify-email?token=${verifyToken}`
    await sendVerificationEmail(user, otp, verifyUrl)
}


// ── Google OAuth ──────────────────────────────────────────────────────────────

export const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body

        let user = await User.findOne({ email })

        if (!user) {
            user = await User.create({ name, email, isVerified: true })
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

        const user = await User.create({ name, email, password: hashedPassword, isVerified: false })

        try {
            await issueAndSendVerification(user)
        } catch (e) {
            console.error("Verification email failed:", e.message)
        }

        // No login/cookie yet — user must verify via OTP or email link first.
        return res.status(201).json({
            requiresVerification: true,
            email: user.email,
            message: "Account created. We've sent a verification code and link to your email.",
        })

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

        if (!user.isVerified) {
            return res.status(403).json({
                requiresVerification: true,
                email: user.email,
                message: "Please verify your email before logging in. Enter the OTP sent to your email or click the verification link.",
            })
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


// ── Complete verification (shared by OTP + link) ──────────────────────────────

const completeVerification = async (user, res) => {
    user.isVerified = true
    user.otp = null
    user.otpExpiry = null
    user.verifyToken = null
    user.verifyTokenExpiry = null
    await user.save()

    try { await sendWelcomeEmail(user) } catch (_) { /* non-fatal */ }

    const token = await genToken(user._id)
    setCookie(res, token)
}


// ── Verify via OTP ──────────────────────────────────────────────────────────────

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "No account found with this email" })
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "This account is already verified. Please log in." })
        }

        if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
            return res.status(400).json({ message: "OTP has expired. Please request a new one." })
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP. Please try again." })
        }

        await completeVerification(user, res)

        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({ message: `Verify OTP Error: ${error.message}` })
    }
}


// ── Verify via Email Link ─────────────────────────────────────────────────────

export const verifyEmailLink = async (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"

    try {
        const { token } = req.query

        if (!token) {
            return res.redirect(`${frontendUrl}/?verify=error`)
        }

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: new Date() },
        })

        if (!user) {
            return res.redirect(`${frontendUrl}/?verify=error`)
        }

        if (user.isVerified) {
            return res.redirect(`${frontendUrl}/?verify=already`)
        }

        await completeVerification(user, res)

        return res.redirect(`${frontendUrl}/?verify=success`)

    } catch (error) {
        return res.redirect(`${frontendUrl}/?verify=error`)
    }
}


// ── Resend OTP / Verification Link ────────────────────────────────────────────

export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "No account found with this email" })
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "This account is already verified. Please log in." })
        }

        try {
            await issueAndSendVerification(user)
        } catch (e) {
            return res.status(500).json({ message: "Failed to send verification email. Please try again." })
        }

        return res.status(200).json({ message: "A new verification code and link have been sent to your email." })

    } catch (error) {
        return res.status(500).json({ message: `Resend OTP Error: ${error.message}` })
    }
}