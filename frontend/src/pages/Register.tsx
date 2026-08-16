import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, resetAuthSlice } from "../features/authSlice";
import { useEffect, useState } from "react";
import type { AppDispatch, RootState } from "@/store/store";
import { Code, Loader } from "lucide-react";
import { toast } from "react-hot-toast";
export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, message, error } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    dispatch(resetAuthSlice());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      navigate("/login");
      dispatch(resetAuthSlice());
    }
  }, [message, navigate, dispatch]);

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(register({ username, password }));
  };
  return (
    <div className="flex flex-col gap-4 w-screen h-screen items-center justify-center bg-slate-950">
      <div className="flex items-center gap-3">
        <Code className="h-6 w-6 text-blue-500" />
      <span className="font-bold text-xl tracking-tight bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              CodeArena
            </span>
      </div>
      <Card className="w-full max-w-sm bg-slate-900/50 text-slate-100">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Enter username and password to sign up
          </CardDescription>
          <CardAction>
            <Button variant={"link"} className="bg-slate-100">
              <Link to={"/login"}>Login</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe12"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="*********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              {loading ? (
                <Loader className="w-full items-center bg-gray-900 text-white h-7 border-black border-2 " />
              ) : (
                <Button type="submit" className="w-full bg-blue-500">
                  Sign Up
                </Button>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </CardFooter>
      </Card>
    </div>
  );
}
