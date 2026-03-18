"use client";
import { BoardList, UpdateListPayload } from "@/store/features/boards/BoardsTypes";
import { updateList } from "@/store/features/boards/ListsThunks";
import { useAppDispatch } from "@/store/hooks";
import { addToast, Button, Form, Input, Spinner } from "@heroui/react";
import { useState } from "react";
import { ColorPicker } from "./ColorPicker";
import { useTheme } from "next-themes";
import { resolveListColor } from "@/lib/utils";

export const EditListForm = ({ list, onClose }: { list: BoardList; onClose: () => void }) => {
  const dispatch = useAppDispatch();
  const [selectedColor, setSelectedColor] = useState<string>(list.background_color!);
  const [loading, setLoading] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const previewColor = resolveListColor(selectedColor, isDark);

  const handleSubmit = async (formData: FormData, e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(formData) as unknown as UpdateListPayload;
    const { title } = data;
    if (!title) return;
    setLoading(true);
    try {
      await dispatch(
        updateList({
          listId: list.id!,
          title,
          background_color: selectedColor,
        }),
      ).unwrap();
      onClose();
    } catch {
      addToast({ title: "Error al actualizar la tarjeta", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={(e) => handleSubmit(new FormData(e.currentTarget), e)}>
      <Input name="title" defaultValue={list.title} label="Título" placeholder="Escribe el título de la lista" />
      <div className="w-full">
        <p className="text-sm text-zinc-500 mb-2">Color de fondo</p>
        <ColorPicker value={selectedColor} onChange={setSelectedColor} />
      </div>
      {previewColor && (
        <div
          className="w-full h-8 rounded-lg transition-colors duration-200 bg-amber-500/10"
          style={{ backgroundColor: previewColor }}
        />
      )}
      <div className="flex items-center gap-2">
        <Button variant="flat" onPress={onClose}>
          Cancelar
        </Button>
        <Button variant="flat" type="submit">
          {loading ? <Spinner color="default" size="sm" /> : "Guardar"}
        </Button>
      </div>
    </Form>
  );
};
