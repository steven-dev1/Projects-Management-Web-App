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
      className={`${!isBoardClosed && "hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"} prose prose-sm max-w-none  rounded-lg p-2 -mx-2 transition-colors`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
