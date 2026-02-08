import { User } from "@supabase/supabase-js";
import Link from "next/link";

const MainHeader = ({ user }: { user: User | null }) => {
  return (
    <div className="flex flex-col items-start place-self-end">
      <Link href="/">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Ghostwriter.AI
        </h1>
      </Link>
      <p className="text-muted-foreground mt-1">
        Autonomous Marketing Agent for Real Estate Agents
      </p>
      {user && (
        <p className="text-muted-foreground mt-1">
          Hello Welcome, <span className="font-bold">{user.user_metadata.full_name}</span>
        </p>
      )}
    </div>
  );
};

export default MainHeader;
