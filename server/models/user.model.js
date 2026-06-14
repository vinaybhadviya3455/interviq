import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        // optional — Google users won't have one
    },
    credits: {
        type: Number,
        default: 100
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordTokenExpiry: {
        type: Date,
        default: null
    },

    // ── Email verification (OTP + link) ────────────────────────────────────
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    },
    verifyToken: {
        type: String,
        default: null
    },
    verifyTokenExpiry: {
        type: Date,
        default: null
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema)

export default User
