"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "../actions/login";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import useTogglePassword from "@/hooks/toggle-password";
import { useActionState } from "react";

const initialState = { error: undefined };

export default function LoginPage() {
  const { showPassword, togglePassword } = useTogglePassword();
  const [state, formAction] = useActionState(login, initialState);

  return (
    <div className="flex h-screen bg-black w-full items-center justify-center flex-col gap-4 px-4">
      <Card className="w-full max-w-sm bg-neutral-900/50 border-white/5 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Login to Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email"
                className="border-0 bg-white/5 px-3 py-1 text-white placeholder:text-white/50 focus:ring-0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative group">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  className="pr-10 border-0 bg-white/5 px-3 py-1 text-white placeholder:text-white/50 focus:ring-0"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 group-focus-within:text-black"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {state?.error && (
              <p className="text-red-500 text-sm">{state.error}</p>
            )}
            <SubmitButton />
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t an account?{" "}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
      <Link href={"/"} className="text-white flex items-center gap-2 group"> <ArrowLeft className="ml-2 w-4 h-4 transition-all duration-300 ease-in-out group-hover:mr-4" /> back to home</Link>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Signing in..." : "Sign in"}
    </Button>
  );
}