import type { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addQuestion, getQuestions, resetAuthSlice, logout } from "@/features/authSlice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, Plus, Code, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

export default function Questions() {
  const [answer, setAnswer] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [language, setLanguage] = useState("js");
  const [openModal, setOpenModal] = useState(false);
  
  const { message, questions, loading, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      dispatch(getQuestions(token));
    }
  }, [token, navigate, dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
      setOpenModal(false);
      setAnswer("");
      setQuestionText("");
      setLanguage("js");
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [message, error, dispatch]);

  const handleCreateQuestion = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!questionText.trim() || !answer.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    dispatch(addQuestion({
      language,
      question: questionText,
      answer
    }));
  };

  const handleLogout = () => {
    dispatch(logout("Logged out successfully"));
    navigate("/login");
  };

  const questionsList = Array.isArray(questions) ? questions : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="h-6 w-6 text-blue-500" />
          <span className="font-bold text-xl tracking-tight bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            CodeArena
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setOpenModal(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> Create Question
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-slate-400 hover:text-slate-100 hover:bg-slate-850 flex items-center gap-1.5"
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Practice Problems</h1>
          <p className="text-slate-400">Select a problem to start coding and submit your solution.</p>
        </div>

        {questionsList.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800 p-8 text-center flex flex-col items-center justify-center">
            <BookOpen className="h-12 w-12 text-slate-600 mb-4" />
            <h3 className="text-lg font-semibold mb-1 text-slate-200">No questions available</h3>
            <p className="text-slate-450 mb-4 text-sm">Be the first to create a programming question!</p>
            <Button onClick={() => setOpenModal(true)} className="bg-blue-655 hover:bg-blue-755 text-white">
              Create Question
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {questionsList.map((q: any) => (
              <Card key={q.id} className="bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="secondary" className="bg-slate-800 text-blue-450 border border-slate-700">
                      {q.language.toUpperCase()}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-200 line-clamp-2 mt-2">
                    {q.question.split("\n")[0] || "Coding Question"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                    {q.question}
                  </p>
                  <Button 
                    onClick={() => navigate(`/submission?id=${q.id}`)}
                    className="w-full bg-slate-800 hover:bg-blue-600 text-slate-100 hover:text-white border border-slate-700 hover:border-transparent transition-all"
                  >
                    Solve Challenge
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Create Question Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-slate-900 border-slate-800 w-full max-w-lg">
            <CardHeader>
              <CardTitle className="text-xl">Create New Question</CardTitle>
              <CardDescription>Add a new programming problem for users to solve.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateQuestion} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="language">Programming Language</Label>
                  <Select onValueChange={(val) => setLanguage(val)} defaultValue={language}>
                    <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-100">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                      <SelectItem value="js">JavaScript (Node.js)</SelectItem>
                      <SelectItem value="py">Python (Python 3)</SelectItem>
                      <SelectItem value="cpp">C++ (GCC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="question">Question Description</Label>
                  <Textarea
                    id="question"
                    placeholder="Describe the problem, input format, output format, and constraints..."
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="bg-slate-950 border-slate-800 min-h-[120px] text-slate-100 placeholder-slate-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="answer">Expected Output / Answer</Label>
                  <Input
                    id="answer"
                    placeholder="Enter expected stdout or correct answer..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setOpenModal(false)}
                    className="text-slate-400 hover:text-slate-100"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
