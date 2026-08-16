import {Router} from 'express'
import { addQuestion, getQuestion } from '../controllers/question.controller';

const router = Router()

router.post('/add',addQuestion)

router.get('/',getQuestion)

export default router