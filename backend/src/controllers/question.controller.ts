import z from 'zod'
import { prisma } from '../../db'
import type { Request, Response } from 'express'

const questionSchema = z.object({
    language:z.string(),
    question:z.string(),
    answer:z.string()
})

export const addQuestion = async(req:Request,res:Response)=>{
    try{
        const {success,data} = questionSchema.safeParse(req.body)

        if(!success){
            return res.status(400).json({message:"Invalid input"})
        }

        const question = await prisma.question.create({
            data:{
                language:data.language,
                question:data.question,
                answer:data.answer
            }
        })

        return res.status(200).json({message:"question added successfully",question})

    }catch(err:any){
         return res.status(500).json({message:"Internal Server Error",err:err.message})
    }
}

export const getQuestion = async(req:Request,res:Response)=>{
    try{
        const questions = await prisma.question.findMany();
        return res.json(questions)
    }catch(err:any){
         return res.status(500).json({message:"Internal Server Error",err:err.message})
    }
}