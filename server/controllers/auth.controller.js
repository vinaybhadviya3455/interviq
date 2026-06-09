import bcrypt from "bcryptjs"
import genToken from "../config/token.js"
import User from "../models/user.model.js"


// ── Helpers ──────────────────────────────────────────────────────────────────

const setCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
}


// ── Google OAuth ──────────────────────────────────────────────────────────────

export const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body

        let user = await User.findOne({ email })

        if (!user) {
            user = await User.create({ name, email })
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