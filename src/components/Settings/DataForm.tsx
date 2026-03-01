"use client";
import { capitalizeWords } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToast, Button, Form, Input } from "@heroui/react";
import { Save } from "lucide-react";
import { UpdateUserProfileData } from "@/types";
import { updateUserData } from "@/store/slices/AuthSlice";
import SkeletonDataForm from "./SkeletonDataForm";
import SelectsDataForm from "./SelectsDataForm";

export default function DataForm() {
  const dispatch = useAppDispatch();
  const { user, profile, preferences, isLoading } = useAppSelector(
    (state) => state.auth,
  );
  const capitalizeName = capitalizeWords(profile?.full_name ?? "");

  const handleSubmit = async (formData: FormData, e: React.SyntheticEvent) => {
    e.preventDefault();
    const data = Object.fromEntries(
      formData,
    ) as unknown as UpdateUserProfileData;
    const newFullName = data.full_name?.trim() || "";
    const newLanguage = data.language || "";
    const newTimezone = data.timezone || "";

    const hasChanges =
      (newFullName && newFullName !== profile?.full_name) ||
      (newLanguage && newLanguage !== preferences?.language) ||
      (newTimezone && newTimezone !== preferences?.timezone);

    if (!data.full_name || !data.language || !data.timezone) {
      console.error("Faltan campos requeridos");
      return;
    }
    try {
      if (!hasChanges) {
        addToast({
          title: "No hay cambios para guardar",
          timeout: 5000,
          color: "warning",
          icon: "Info",
        });
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await dispatch(updateUserData(data)).unwrap();
      addToast({
        title: "Datos actualizados",
        color: "success",
        icon: "Check",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (rejectedValueOrError) {
      addToast({ title: "Error al actualizar datos", color: "danger" });
    }
  };

  if (isLoading) {
    return <SkeletonDataForm />;
  }
  return (
    <Form
      className="w-full flex flex-col items-center justify-center sm:w-1/2 lg:w-1/3"
      onSubmit={(e) => handleSubmit(new FormData(e.currentTarget), e)}
    >
      <Input
        label="Nombre completo"
        labelPlacement="inside"
        name="full_name"
        defaultValue={capitalizeName}
        placeholder="John Doe"
        isRequired
        type="text"
      />
      <Input
        label="Email"
        labelPlacement="inside"
        variant="bordered"
        name="full_name"
        defaultValue={user?.email}
        placeholder="John Doe"
        isDisabled
        type="text"
      />
      <SelectsDataForm />
      <Button type="submit" color="secondary" startContent={<Save size={18} />}>
        Guardar
      </Button>
    </Form>
  );
}
