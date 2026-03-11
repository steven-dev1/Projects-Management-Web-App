export const RichTextViewer = ({ content, onClick }: { content: string; onClick: () => void }) => {
  if (!content || content === "<p></p>") {
    return (
      <div
        onClick={onClick}
        className="text-zinc-400 text-sm cursor-pointer hover:bg-zinc-100 rounded p-2 -mx-2 min-h-15 transition-colors"
      >
        Añade una descripción...
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="cursor-pointer prose prose-sm max-w-none hover:bg-zinc-100 rounded p-2 -mx-2 transition-colors"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};