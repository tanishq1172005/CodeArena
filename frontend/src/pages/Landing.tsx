import { Code, ArrowRight, Terminal, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-xl tracking-tight bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              CodeArena
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate("/login")}
              className="text-slate-300 hover:text-white hover:bg-slate-800"
            >
              Login
            </Button>

            <Button
              onClick={() => navigate("/register")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="bg-blue-600/20 border-blue-500/30 text-blue-300 mb-6">
              🚀 Coding Interview Preparation
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Level Up Your
              <span className="block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Coding Skills
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-400">
              Solve programming challenges, improve problem-solving skills, and
              prepare for technical interviews—all in one modern platform.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate("/signup")}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 bg-slate-900 hover:bg-slate-800"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-slate-900 border-slate-800 hover:border-blue-500/50 transition">
              <CardHeader>
                <Terminal className="h-10 w-10 text-blue-500 mb-3" />
                <CardTitle className="text-blue-200">Solve Problems</CardTitle>
                <CardDescription className="text-slate-400">
                  Practice coding questions in JavaScript, Python, and C++.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900 border-slate-800 hover:border-blue-500/50 transition">
              <CardHeader>
                <Trophy className="h-10 w-10 text-yellow-500 mb-3" />
                <CardTitle className="text-blue-200">Interview Ready</CardTitle>
                <CardDescription className="text-slate-400">
                  Build confidence with algorithmic and real interview-style
                  challenges.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900 border-slate-800 hover:border-blue-500/50 transition">
              <CardHeader>
                <Users className="h-10 w-10 text-green-500 mb-3" />
                <CardTitle className="text-blue-200">Community Driven</CardTitle>
                <CardDescription className="text-slate-400">
                  Create questions, solve challenges, and learn with other
                  developers.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-slate-800 bg-slate-900/40">
          <div className="max-w-4xl mx-auto px-6 py-20">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="py-14 text-center">
                <h2 className="text-3xl font-bold text-blue-200">
                  Ready to Start Coding?
                </h2>

                <p className="text-slate-400 mt-4 max-w-xl mx-auto">
                  Join thousands of developers solving programming challenges
                  every day.
                </p>

                <Button
                  className="mt-8 bg-blue-600 hover:bg-blue-700"
                  size="lg"
                  onClick={() => navigate("/register")}
                >
                  Create Free Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} CodeArena. Built with ❤️ using React &
        shadcn/ui.
      </footer>
    </div>
  );
}