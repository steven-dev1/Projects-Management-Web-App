export default function SkeletonBoardHeader() {
  return (
    <div className="flex gap-4 items-center justify-between py-2 px-8 border-b border-zinc-200 animate-pulse">
      <div className="flex gap-4 items-center">
        <div className="h-7 w-44 bg-zinc-200 dark:bg-zinc-700 rounded-md" />
        <div className="h-9 w-9 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
      </div>
      <div className="flex items-center gap-4">
        <div className="h-9 w-28 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
        <div className="flex -space-x-3">
          <div className="h-10 w-10 bg-zinc-200 dark:bg-zinc-700 rounded-full border-2 border-white dark:border-zinc-800" />
          <div className="h-10 w-10 bg-zinc-200 dark:bg-zinc-700 rounded-full border-2 border-white dark:border-zinc-800" />
        </div>
      </div>
    </div>
  );
}
