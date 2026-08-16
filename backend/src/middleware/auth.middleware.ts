import jwt,{type JwtPayload} from 'jsonwebtoken'

interface CustomJwtPayload extends JwtPayload{
    id?:string
    userId?:string
}

export const authMiddleware = async(req:any,res:any,next:any) => {
    try{    
        const headers = req.headers.authorization;
        if(!headers || !headers.startsWith('Bearer ')){
            return res.status(411).json({message:"Unauthorized"})
        }
        const token = headers.split(' ')[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRET!) as CustomJwtPayload
        const id = decoded.id || decoded.userId
        req.userId = id
        next()
    }catch(err){
        return res.status(403).json({message:"Some error occured"})
    }
}