import type { AppDispatch } from "@/store/store";
import { API_PATH, BASE_URL } from "@/utils/apiPath";
import { createSlice } from "@reduxjs/toolkit";
import axios from 'axios'


interface CurrentSubmission{
    id:string
    code:string
    language:string
    questionId:string
    status:string
    output:string
}

interface Question{
    id:string
    language:string
    question:string
    answer:string
}

interface AuthState{
    loading:boolean
    error: string|null
    message:string|null
    isAuthenticated:boolean
    questions: Question[] | null
    currentSubmission: CurrentSubmission | null
}

const initialState:AuthState = {
        loading:false,
        error:null,
        message:null,
        isAuthenticated:false,
        questions:null,
        currentSubmission:null
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        registerRequest(state){
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        registerSuccess(state,action){
            state.loading = false;
            state.message = action.payload.message;
        },registerFailed(state,action){
            state.loading = false;
            state.error = action.payload;
        },loginRequest(state){
            state.loading = true;
            state.error = null;
            state.message = null;
        },loginSuccess(state,action){
            state.loading = false;
            state.message = action.payload.message;
            const token = localStorage.getItem("token")
            if(token) state.isAuthenticated = true;
        },loginFailed(state,action){
            state.loading=false;
            state.error = action.payload
        },logout(state,action){
            state.loading = false;
            state.message = action.payload;
            state.isAuthenticated = false;
            localStorage.removeItem("token")
        },resetAuthSlice(state){
            state.error = null;
            state.loading = false;
            state.message = null;
            state.currentSubmission = null;
        },getQuestionRequest(state){
            state.loading = true;
            state.error=null;
            state.message=null;
        },getQuestionSuccess(state,action){
            state.loading=false;
            state.message=action.payload.message;
            state.questions = action.payload;
        },getQuestionFailed(state,action){
            state.loading=false;
            state.error=action.payload
        },addQuestionRequest(state){
            state.loading = true;
            state.error=null;
            state.message=null;
        },addQuestionSuccess(state,action){
            state.loading=false;
            state.message=action.payload.message;
        },addQuestionFailed(state,action){
            state.loading=false;
            state.error = action.payload;
        },addSubmissionRequest(state){
            state.loading = true;
            state.error=null;
            state.message=null;
            state.currentSubmission = null;
        },addSubmissionSuccess(state,action){
            state.loading=false;
            state.message=action.payload.message;
            state.currentSubmission = action.payload; // Contains submission id
        },addSubmissionFailed(state,action){
            state.loading=false;
            state.error = action.payload;
        },getSubmissionRequest(state){
            state.loading = true;
            state.error=null;
        },getSubmissionSuccess(state,action){
            state.loading=false;
            state.message = action.payload.message
            state.currentSubmission = action.payload.submission;
        },getSubmissionFailed(state,action){
            state.loading=false;
            state.error = action.payload;
        }
    }
})

export const resetAuthSlice = () => (dispatch:AppDispatch) => {
    dispatch(authSlice.actions.resetAuthSlice())
}

export const register = (data: any) => async(dispatch:AppDispatch)=>{
    dispatch(authSlice.actions.registerRequest())
    await axios.post(`${BASE_URL}${API_PATH.AUTH.REGISTER}`, data)
    .then(res=>{
        dispatch(authSlice.actions.registerSuccess(res.data))
    }).catch(error=>{
        dispatch(authSlice.actions.registerFailed(error.response?.data?.message || error.message))
    })
}

export const login = (data: any) => async(dispatch:AppDispatch)=>{
    dispatch(authSlice.actions.loginRequest())
    await axios.post(`${BASE_URL}${API_PATH.AUTH.LOGIN}`, data)
    .then(res=>{
        dispatch(authSlice.actions.loginSuccess(res.data))
        const token = res.data.token;
        localStorage.setItem("token",token)
    }).catch(err=>{
        dispatch(authSlice.actions.loginFailed(err.response?.data?.message || err.message))
    })
}

export const getQuestions = (token:any) => async(dispatch:AppDispatch)=>{
    dispatch(authSlice.actions.getQuestionRequest())
    await axios.get(`${BASE_URL}${API_PATH.QUESTION.GET}`,{
        headers:{
            'Authorization':`Bearer ${token}`
        }
    })
    .then(res=>{
        dispatch(authSlice.actions.getQuestionSuccess(res.data))
    }).catch(err=>{
        dispatch(authSlice.actions.getQuestionFailed(err.response?.data?.message))
    })
}

export const addQuestion = (data:any) => async(dispatch:AppDispatch)=>{
    dispatch(authSlice.actions.addQuestionRequest())
    const token = localStorage.getItem("token")
    await axios.post(`${BASE_URL}${API_PATH.QUESTION.ADD}`,data,{
        headers:{
            'Authorization':`Bearer ${token}`
        }
    })
    .then(res=>{
        dispatch(authSlice.actions.addQuestionSuccess(res.data))
        // Refresh questions list
        dispatch(getQuestions(token))
    }).catch(err=>{
        dispatch(authSlice.actions.addQuestionFailed(err.response?.data?.message))
    })
}

export const submitCode = (data: { questionId: string; code: string, language:string }) => async (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.addSubmissionRequest())
    const token = localStorage.getItem("token")
    await axios.post(`${BASE_URL}${API_PATH.SUBMISSION.ADD}`, data, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => {
        dispatch(authSlice.actions.addSubmissionSuccess(res.data))
    }).catch(err => {
        dispatch(authSlice.actions.addSubmissionFailed(err.response?.data?.message || err.message))
    })
}

export const getSubmission = (submissionId: string) => async (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.getSubmissionRequest())
    const token = localStorage.getItem("token")
    await axios.get(`${BASE_URL}${API_PATH.SUBMISSION.GET}/${submissionId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => {
        dispatch(authSlice.actions.getSubmissionSuccess(res.data))
    }).catch(err => {
        dispatch(authSlice.actions.getSubmissionFailed(err.response?.data?.message || err.message))
    })
}

export const {logout} = authSlice.actions

export default authSlice.reducer
