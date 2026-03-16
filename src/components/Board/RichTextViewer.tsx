export const RichTextViewer = ({
  content,
  onClick,
  isBoardClosed,
}: {
  content: string;
  onClick: () => void;
  isBoardClosed: boolean;
}) => {
  if (!content || content === "<p></p>") {
    return (
      <div
        onClick={onClick}
        className={`${!isBoardClosed && "hover:bg-zinc-100 cursor-pointer"} text-zinc-400 text-sm rounded p-2 -mx-2 min-h-15 transition-colors`}
      >
        {isBoardClosed ? "Esta tarjeta no tiene descripción" : "Añade una descripción..."}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`${!isBoardClosed && "hover:bg-zinc-100 cursor-pointer"} prose prose-sm max-w-none  rounded p-2 -mx-2 transition-colors`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
