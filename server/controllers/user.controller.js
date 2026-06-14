import User from "../models/user.model.js"
import Interview from "../models/interview.model.js"
import Payment from "../models/payment.model.js"

export const  getCurrentUser = async(req,res) => {

    try {
        const userID = req.userID
        const user = await User.findById(userID)

        if(!user){
            return res.status(404).json({message:"user does not found"})
        }

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:`failed to get current user ${error}`})
    }

}


// ── Delete Account ────────────────────────────────────────────────────────────

export const deleteAccount = async (req, res) => {
    try {
        const userID = req.userID

        const user = await User.findById(userID)
        if (!user) {
            return res.status(404).json({ message: "User does not exist" })
        }

        // Clean up data associated with this user
        await Interview.deleteMany({ userID })
        await Payment.deleteMany({ userID })
        await User.findByIdAndDelete(userID)

        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        })

        return res.status(200).json({ message: "Account deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: `Delete Account Error: ${error}` })
    }
}