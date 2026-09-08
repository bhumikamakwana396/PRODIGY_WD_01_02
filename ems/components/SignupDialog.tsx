"use client";

import { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


const SignupDialog = ({ open, setOpen, openLogin }: any) => {

 const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:8081/user/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          phoneNumber: phoneNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Account created successfully.");

        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setPhoneNumber("");

        // Open Login Dialog after 1 second
        setTimeout(() => {
          setOpen(false);
          openLogin();
        }, 1000);
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
                <Button className="px-6 py-2 rounded-lg  text-white bg-gradient-to-br from-blue-300 via-purple-500 to-cyan-900 hover:scale-105 transition hover:text-white transition">
                   <UserPlus className="mr-2 h-4 w-4" />
                        SignUp
                </Button>
              </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Create Account
          </DialogTitle>

          <DialogDescription className="text-center text-sm text-gray-500">
            Create your Employee Management System account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">

           <input
              placeholder="👤FirstName*"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border rounded p-2"
              required
            />

            <input
              placeholder="🧑LastName*"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border rounded p-2"
              required
            />

          <input
            type="email"
            placeholder="📧Email*"
            className="h-12 w-full rounded-md border p-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="🔒Password*"
            className="h-12 w-full rounded-md border p-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
           <input
              placeholder="📞Phone Number*"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
             {message && (
              <p className="text-purple-700 text-center">{message}</p>
            )}

            {error && (
              <p className="text-red-500 text-center">{error}</p>
            )}

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-lg bg-gradient-to-r from-blue-700 via-purple-600 to-cyan-600 text-white hover:scale-105 transition"
          >
           
            {loading ? "Creating..." : "Create Account"}
          </Button>

          <div className="flex items-center">
            <div className="flex-1 border-t"></div>
            <span className="mx-3 text-sm text-gray-500">OR</span>
            <div className="flex-1 border-t"></div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full flex items-center justify-center gap-3 hover:scale-105 transition"
          >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
          </Button>

         
          <div className="text-center text-sm">
              Already have an account?{" "}
              <span
                className=" font-semibold text-purple-700 cursor-pointer hover:text-purple-800 hover:underline"
                onClick={openLogin}
              >
                Login
              </span>
            </div>

        </form>
      </DialogContent>
    </Dialog>
  );
};
export default SignupDialog;