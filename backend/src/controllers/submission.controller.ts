import { createClient } from "redis"
import z from 'zod'
import { prisma } from "../../db"
import type { Request, Response } from 'express';

const client = createClient({
    url:process.env.REDIS_URL
})
client.connect()

const submissionSchema = z.object({
    questionId : z.string(),
    code:z.string(),
    language: z.string()
})

export const postSubmission = async(req:Request,res:Response)=>{
    try{
        const {success,data} = submissionSchema.safeParse(req.body)
        if(!success){
            return res.status(400).json({message:"Invalid input"})
        }

        const response = await prisma.submission.create({
            data:{
                language:data.language,
                code:data.code,
                questionId:data.questionId,
                status:"Processing"  
            }
        })

        const code = data.code;
        const language = data.language
        client.lPush("problems",JSON.stringify({submissionId:response.id,code,language}))

        res.json({message:"Processing",id:response.id})

    }catch(err:any){
        return res.status(500).json({message:"Internal Server Error",err:err.message})
    } 
}

export const getSubmission = async(req:Request,res:Response)=>{
    try{
        const response = await prisma.submission.findFirst({
            where:{
                id:req.params.submissionId as string
            }
        })

        if(!response){
            return res.status(400).json({message:"Invalid id"})
        }

        res.status(200).json({
            submission:response
        })
    }catch(err:any){
        return res.status(500).json({message:"Internal Server Error",err:err.message})
    }
}