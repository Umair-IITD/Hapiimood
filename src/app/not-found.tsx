import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center">
      <div className="bg-mesh opacity-30" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-4 text-[120px] font-bold leading-none tracking-tighter text-white/5 select-none">
          404
        </div>
        
        <div className="-mt-16 mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 shadow-2xl shadow-primary/10">
          <Search className="h-10 w-10 text-primary" />
        </div>

        <h1 className="mb-3 text-3xl font-bold tracking-tight text-white">
          This space doesn&apos;t exist
        </h1>
        <p className="mb-8 max-w-md text-text-muted">
          The page you&apos;re searching for has moved, or perhaps it was never here. Let&apos;s take you somewhere safe.
        </p>

        <Link href="/" className="btn-primary flex items-center gap-2 px-8">
          <Home className="h-4 w-4" />
          Return to Sanctuary
        </Link>
      </div>
    </div>
  );
}
