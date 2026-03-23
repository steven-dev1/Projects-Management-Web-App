import { sanitizeHtml } from "@/lib/sanitize";
import { useAppSelector } from "@/store/hooks";

export const RichTextViewer = ({
  content,
  onClick,
}: {
  content: string;
  onClick?: () => void
}) => {

  const safeContent = sanitizeHtml(content);
  const isBoardClosed = useAppSelector((state) => state.boards.currentBoard?.status === "archived");

  if (!safeContent || safeContent === "<p></p>") {
    return (
      <div
        onClick={onClick}
        className={`${!isBoardClosed && "hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"} text-zinc-400 text-sm rounded-lg p-2 -mx-2 min-h-15 transition-colors`}
      >
        {isBoardClosed ? "Esta tarjeta no tiene descripción" : "Añade una descripción..."}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`${!isBoardClosed && "hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"} prose border dark:border-zinc-700 border-zinc-50 prose-sm custom-scrollbar dark:prose-invert max-w-none overflow-x-hidden wrap-words w-full rounded-lg p-2 -mx-2 max-h-96 overflow-y-auto transition-colors
        prose-p:text-zinc-700 dark:prose-p:text-zinc-300
        prose-pre:whitespace-pre-wrap
        prose-strong:text-zinc-800 dark:prose-strong:text-zinc-200
        prose-em:text-zinc-700 dark:prose-em:text-zinc-300
        prose-code:text-zinc-800 dark:prose-code:text-zinc-200

        prose-li:text-zinc-700 dark:prose-li:text-zinc-300`}
      dangerouslySetInnerHTML={{ __html: safeContent }}
    />
  );
};
