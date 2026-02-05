"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signup } from "../actions/signup";
import { useState } from "react";
import useTogglePassword from "@/hooks/toggle-password";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const { showPassword, togglePassword } = useTogglePassword();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await signup(formData);
    } catch (error) {
      console.error("Signup failed", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen bg-black w-full items-center flex-col gap-4 justify-center px-4">
      <Card className="w-full max-w-sm bg-neutral-900/50 border-white/5 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Start automating your real estate newsletters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Abdulahi Muhammed"
                required
                className="border-0 bg-white/5 px-3 py-1 text-white placeholder:text-white/50 focus:ring-0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="realtor@example.com"
                required
                className="border-0 bg-white/5 px-3 py-1 text-white placeholder:text-white/50 focus:ring-0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="pr-10 border-0 bg-white/5 px-3 py-1 text-white placeholder:text-white/50 focus:ring-0"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Log In
            </Link>
          </div>
        </CardContent>
      </Card>
      <Link href={"/"} className="text-white flex items-center gap-2 group"> <ArrowLeft className="ml-2 w-4 h-4 transition-all duration-300 ease-in-out group-hover:mr-4" /> back to home</Link>
    </div>
  );
}
