"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/dist/client/components/navigation";



const LoginDialog = ({ open, setOpen, openSignup }: any) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();


 
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
    const response = await fetch("http://localhost:8081/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.text();

    if (!response.ok) {
      
      setError(data);
      return;
    }

    
    const user = JSON.parse(data);

    localStorage.setItem("user", JSON.stringify(user));

    setOpen(false);

    if (user.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }

  } catch (err) {
    console.error(err);
    setError("Unable to connect to the server.");
  } finally {
    setLoading(false);
  }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-6 py-2 rounded-lg  text-white bg-gradient-to-br from-blue-300 via-purple-500 to-cyan-900 hover:scale-105 transition hover:text-white transition">
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center mb-2  ">
            Login Account
          </DialogTitle>

          <DialogDescription className="text-center text-sm text-gray-500">
            Sign in to your Employee Management System to manage employees, departments, attendance, and payroll.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          <input
            type="email"
            placeholder="📧 Email"
            className="w-full rounded-md border p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="🔒 Password"
            className=" h-12 w-full rounded-md border p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <p className="text-red-700 text-center font-semibold">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full bg-gradient-to-r from-blue-700 via-purple-600 to-cyan-600 hover:scale-105 transition text-white rounded-lg py-2"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 mb-3 flex items-center justify-center gap-3 hover:gray-100 hover:scale-105 transition"
          >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
          </Button>

          <div className="text-center text-sm">
            Don't have an account?{" "}
            <span
              className=" font-semibold text-purple-700 cursor-pointer hover:text-purple-800 hover:underline"
              onClick={openSignup}
            >
              SignUp
            </span>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-sm font-semibold text-purple-600 hover:underline hover:text-purple-800"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default LoginDialog;