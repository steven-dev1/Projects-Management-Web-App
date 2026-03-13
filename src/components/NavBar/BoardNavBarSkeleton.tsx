export default function BoardNavbarSkeleton() {
  return (
    <div className="w-full border-b border-b-zinc-200 bg-white px-4 py-2 animate-pulse">
      <div className="flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-zinc-200" />
          <div className="h-5 w-28 rounded-md bg-zinc-200 hidden sm:block" />
        </div>

        {/* Center */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="h-10 w-64 rounded-lg bg-zinc-200" />
          <div className="h-10 w-36 rounded-lg bg-zinc-200" />
        </div>

        {/* Right */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-zinc-200" />
        </div>

      </div>
    </div>
  );
}