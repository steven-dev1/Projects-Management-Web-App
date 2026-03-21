export const RichTextViewer = ({
  content,
  onClick,
  isBoardClosed,
}: {
  content: string;
  onClick?: () => void;
  isBoardClosed: boolean;
}) => {
  if (!content || content === "<p></p>") {
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
      className={`${!isBoardClosed && "hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"} prose prose-sm dark:prose-invert max-w-none overflow-x-auto w-full rounded-lg p-2 -mx-2 transition-colors
        prose-p:text-zinc-700 dark:prose-p:text-zinc-300
        prose-strong:text-zinc-800 dark:prose-strong:text-zinc-200
        prose-em:text-zinc-700 dark:prose-em:text-zinc-300
        prose-code:text-zinc-800 dark:prose-code:text-zinc-200
        prose-li:text-zinc-700 dark:prose-li:text-zinc-300`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
