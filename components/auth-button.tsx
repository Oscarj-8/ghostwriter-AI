import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RainbowButton } from "./ui/rainbow-button";

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
    <RainbowButton asChild className="h-12">
      <Link href="/login" className="flex items-center">
        Initialize Ghostwriter
        <ArrowRight className="ml-2 w-4 h-4 transition-all duration-300 ease-in-out group-hover:ml-8" />
      </Link>
    </RainbowButton>
  );
}

export default AuthButton;
