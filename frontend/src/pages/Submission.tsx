import { getQuestions, getSubmission, submitCode } from "@/features/authSlice"
import type { AppDispatch, RootState } from "@/store/store"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  CheckCircle2,
  CircleDot,
  Code2,
  Loader2,
  RefreshCw,
  XCircle,
  ArrowLeft,
  Play,
  Terminal,
} from "lucide-react"

export default function Submission() {
  const [searchParams] = useSearchParams()
  const questionId = searchParams.get("id")

  const [code, setCode] = useState("")

  const {
    questions,
    currentSubmission,
    loading,
    error,
    message,
  } = useSelector((state: RootState) => state.auth)

  const dispatch = useDispatch<AppDispatch>()

  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate("/login")
      return
    }

    if (!questions) {
      dispatch(getQuestions(token))
    }
  }, [token, navigate, dispatch, questions])

  useEffect(() => {
    if (!currentSubmission?.id) return

    const status = currentSubmission.status

    if (status === "Success" || status === "Failed") return

    const interval = setInterval(() => {
      dispatch(getSubmission(currentSubmission.id))
    }, 3000)

    return () => clearInterval(interval)
  }, [currentSubmission, dispatch])

  const question = Array.isArray(questions)
    ? questions.find((q: any) => q.id === questionId)
    : null

  const pollBackend = async (submissionId: string) => {
    dispatch(getSubmission(currentSubmission!.id))

    if (currentSubmission?.status === "Processing") {
      await new Promise((r) => setTimeout(r, 3000))
      pollBackend(currentSubmission.id)
    }
  }

  const addSubmission = async (e: React.SubmitEvent) => {
    e.preventDefault()

    const language = question?.language as string

    if (!questionId) {
      toast.error("Invalid Question Id")
      return
    }

    if (!code.trim()) {
      toast.error("Code cannot be empty")
      return
    }

    dispatch(
      submitCode({
        questionId,
        code,
        language,
      })
    )
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-slate-800 bg-slate-900 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>

            <CardTitle className="text-xl text-slate-100">
              Loading Question...
            </CardTitle>

            <CardDescription className="text-slate-400">
              We are fetching the question details.
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Button
              onClick={() => navigate("/")}
              className="w-full border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Questions
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const submissionStatus = currentSubmission?.status

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* =========================================================
          LEFT SIDE - QUESTION
      ========================================================= */}
      <div className="flex min-w-0 flex-1 flex-col border-r border-slate-800 bg-slate-950">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800">
              <Code2 className="h-5 w-5 text-slate-300" />
            </div>

            <div>
              <h1 className="text-sm font-semibold text-slate-100">
                Coding Challenge
              </h1>

              <p className="text-xs text-slate-500">
                Problem Statement
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className="border-slate-700 bg-slate-900 text-slate-400"
          >
            {question.language}
          </Badge>
        </header>

        {/* Question Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Question
              </p>

              <h2 className="text-2xl font-bold leading-tight text-white">
                {question.question}
              </h2>
            </div>

            {/* Optional question metadata */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Card className="border-slate-800 bg-slate-900/50">
                <CardContent className="p-4">
                  <p className="text-xs text-slate-500">Language</p>
                  <p className="mt-1 font-medium text-slate-200">
                    {question.language}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/50">
                <CardContent className="p-4">
                  <p className="text-xs text-slate-500">Question ID</p>
                  <p className="mt-1 truncate font-medium text-slate-200">
                    {questionId}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/50">
                <CardContent className="p-4">
                  <p className="text-xs text-slate-500">Submission</p>
                  <p className="mt-1 font-medium text-slate-200">
                    {submissionStatus || "Not submitted"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          RIGHT SIDE - CODE EDITOR
      ========================================================= */}
      <div className="flex min-w-0 flex-1 flex-col bg-slate-900">
        {/* Editor Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-5">
          <div className="flex items-center gap-3">
            <Terminal className="h-5 w-5 text-slate-400" />

            <div>
              <p className="text-sm font-medium text-slate-200">
                Code Editor
              </p>

              <p className="text-xs text-slate-500">
                Write your solution below
              </p>
            </div>
          </div>

          {/* Submission Status */}
          {submissionStatus === "Success" && (
            <Badge className="gap-1.5 border-green-800 bg-green-950/50 text-green-400 hover:bg-green-950/50">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Success
            </Badge>
          )}

          {submissionStatus === "Failed" && (
            <Badge className="gap-1.5 border-red-800 bg-red-950/50 text-red-400 hover:bg-red-950/50">
              <XCircle className="h-3.5 w-3.5" />
              Failed
            </Badge>
          )}

          {submissionStatus === "Processing" && (
            <Badge className="gap-1.5 border-yellow-800 bg-yellow-950/50 text-yellow-400 hover:bg-yellow-950/50">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Processing
            </Badge>
          )}

          {!submissionStatus && (
            <Badge
              variant="outline"
              className="gap-1.5 border-slate-700 text-slate-500"
            >
              <CircleDot className="h-3.5 w-3.5" />
              Ready
            </Badge>
          )}
        </header>

        {/* Editor */}
        <form
          onSubmit={addSubmission}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 p-4">
            <div className="relative h-full overflow-hidden rounded-xl border border-slate-800 bg-[#0b0f14] shadow-inner">
              {/* Fake editor top bar */}
              <div className="flex h-10 items-center border-b border-slate-800 bg-slate-900/80 px-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                </div>

                <div className="ml-4 text-xs text-slate-500">
                  solution.{question.language?.toLowerCase() || "txt"}
                </div>
              </div>

              <textarea
                rows={10}
                cols={40}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Write your solution here..."
                spellCheck={false}
                className="h-[calc(100%-2.5rem)] w-full resize-none border-0 bg-transparent p-5 font-mono text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-700 focus:ring-0"
              />
            </div>
          </div>

          {/* Submit Bar */}
          <div className="flex shrink-0 items-center justify-between border-t border-slate-800 bg-slate-900 px-5 py-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Autosave disabled
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="min-w-32 bg-white text-slate-950 hover:bg-slate-200"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4 fill-current" />
                  Submit Code
                </>
              )}
            </Button>
          </div>
        </form>

        {/* =========================================================
            OUTPUT
        ========================================================= */}
        <div className="shrink-0 border-t border-slate-800 bg-black">
          <div className="flex h-11 items-center justify-between border-b border-slate-800 px-5">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-slate-500" />

              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Output
              </span>
            </div>

            {submissionStatus === "Processing" && (
              <div className="flex items-center gap-2 text-xs text-yellow-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Running...
              </div>
            )}
          </div>

          <div className="max-h-48 min-h-24 overflow-y-auto p-5 font-mono text-sm">
            {currentSubmission?.output ? (
              <pre className="whitespace-pre-wrap text-slate-300">
                {currentSubmission.output}
              </pre>
            ) : (
              <p className="text-slate-700">
                Output will appear here after you submit your code.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}