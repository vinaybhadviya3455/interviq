
import jwt from "jsonwebtoken"
const isAuth = async (req,res,next) => {
    try {
        let {token} = req.cookies

        if(!token){
            return res.status(400).json({message:"user does not have a token"})
        }

       const verifyToken = jwt.verify(token,process.env.JWT_SECRET)

       if(!verifyToken){
            return res.status(400).json({message:"user does not have a token"})
        }

        req.userID =  verifyToken.userID

        next()
    } catch (error) {
        return res.status(500).json({message:`isAuth Error ${error}`})
    }
}

export default isAuth
   