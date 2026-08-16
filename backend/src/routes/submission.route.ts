import {Router} from 'express'
import { getSubmission, postSubmission } from '../controllers/submission.controller'

const router = Router()

router.post('/',postSubmission)
router.get('/:submissionId',getSubmission)

export default router