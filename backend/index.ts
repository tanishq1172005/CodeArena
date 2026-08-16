import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authMiddleware } from './src/middleware/auth.middleware'

dotenv.config({
    path:'./.env'
})

const app =express()
app.use(express.json())
app.use(cors({
    origin:'*'
}))

import userRouter from './src/routes/user.route'
app.use('/api/v1/auth',userRouter)

import questionRouter from './src/routes/question.route'
app.use('/api/v1/questions',authMiddleware,questionRouter)

import submissionRouter from './src/routes/submission.route'
app.use('/api/v1/submission',authMiddleware,submissionRouter)

const port = process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`Listening at port :${port}`)
})