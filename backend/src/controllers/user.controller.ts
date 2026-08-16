import z from 'zod'
import { prisma } from "../../db";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import type { Request, Response } from 'express';

const signupSchema = z.object({
    username:z.string().toLowerCase(),
    password:z.string()
})

const generateToken = (userId:string)  => {
    return jwt.sign({userId},process.env.JWT_SECRET!)
}

export const register = async(req:Request,res:Response)=>{
    try{
        const {success,data} = signupSchema.safeParse(req.body)
        if(!success){
            return res.status(400).json({message:"please enter username and password correctly"})
        }

        const userExists = await prisma.user.findUnique({
            where:{
                username:data.username
            }
        })
        if(userExists){
            return res.status(400).json({message:"User already exists"})
        }

        const hashedPassword = await bcrypt.hash(data.password,10)

        const user = await prisma.user.create({
            data:{
                username:data.username,
                password:hashedPassword
            }
        })

        return res.status(200).json({message:"User created",user})
    }catch(err:any){
        return res.status(500).json({message:"Internal Server Error",err:err.message})
    }
}

export const login = async(req:Request,res:Response)=>{
    try{
        const {success,data} = signupSchema.safeParse(req.body)
        if(!success){
            return res.status(400).json({message:"please enter username and password correctly"})
        }

        const user = await prisma.user.findUnique({
            where:{
                username:data.username
            }
        })

        if(!user){
            return res.status(400).json({message:"invalid username or password"})
        }

        const comparePassword = await bcrypt.compare(data.password,user.password)
        if(!comparePassword){
            return res.status(400).json({message:"invalid username or password"})
        }

        const token = generateToken(user.id)
        return res.status(200).json({message:"Signed up succesfully",token})
    }catch(err:any){
        return res.status(500).json({message:"Internal Server Error",err:err.message})
    } 
}