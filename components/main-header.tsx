import Link from 'next/link';

const MainHeader = () => {
  return (
    <div>
      <Link href="/">
      <h1 className="text-4xl font-extrabold tracking-tight">Ghostwriter.AI</h1>
      </Link>
      <p className="text-muted-foreground mt-1">
        Autonomous Marketing Agent for Real Estate Agents
      </p>
    </div>
  );
}

export default MainHeader