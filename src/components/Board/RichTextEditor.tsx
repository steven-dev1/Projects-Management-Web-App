import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button, Divider, Tooltip } from "@heroui/react";
import { Bold, Code, Italic, List, ListOrdered, Strikethrough } from "lucide-react";

export const RichTextEditor = ({ content, onSave, onCancel }: {
  content: string;
  onSave: (html: string) => void;
  onCancel: () => void;
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Añade una descripción más detallada..." }),
    ],
    content, // recibe HTML directamente
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[100px] p-2",
      },
    },
  });

  return (
    <div className="flex flex-col gap-2">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-1 border border-zinc-200 rounded-lg bg-zinc-50">
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBold().run()}
          isActive={editor?.isActive("bold")}
          tooltip="Negrita"
        >
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          isActive={editor?.isActive("italic")}
          tooltip="Cursiva"
        >
          <Italic size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          isActive={editor?.isActive("strike")}
          tooltip="Tachado"
        >
          <Strikethrough size={14} />
        </ToolbarButton>
        <Divider orientation="vertical" className="h-5 mx-1" />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          isActive={editor?.isActive("bulletList")}
          tooltip="Lista"
        >
          <List size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          isActive={editor?.isActive("orderedList")}
          tooltip="Lista numerada"
        >
          <ListOrdered size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          isActive={editor?.isActive("codeBlock")}
          tooltip="Código"
        >
          <Code size={14} />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div className="border border-zinc-200 rounded-lg focus-within:border-zinc-400 transition-colors">
        <EditorContent editor={editor} />
      </div>

      <div className="flex gap-2">
        <Button size="sm" color="primary" onPress={() => onSave(editor?.getHTML() ?? "")}>
          Guardar
        </Button>
        <Button size="sm" variant="flat" onPress={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};

// Botón reutilizable para la toolbar
const ToolbarButton = ({ onClick, isActive, tooltip, children }: {
  onClick: () => void;
  isActive?: boolean;
  tooltip: string;
  children: React.ReactNode;
}) => (
  <Tooltip content={tooltip} showArrow placement="top">
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${
        isActive ? "bg-zinc-200 text-zinc-800" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
      }`}
    >
      {children}
    </button>
  </Tooltip>
);