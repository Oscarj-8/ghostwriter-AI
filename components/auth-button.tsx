import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function AuthButton({ user }: { user: User | null }) {
  if (user) {
    return (
<Button
  asChild
  className="bg-white group text-black hover:bg-neutral-200"
>
  <Link href="/dashboard">
    <div className="flex items-center">
      Return to Dashboard 
      <ArrowRight className="ml-2 w-4 h-4 transition-all duration-300 ease-in-out group-hover:ml-8" />
    </div>
  </Link>
</Button>
    )
  }

  return (
    <Button asChild className="">
      <Link href="/login">Initialize Ghostwriter</Link>
    </Button>
  );
}

export default AuthButton;
