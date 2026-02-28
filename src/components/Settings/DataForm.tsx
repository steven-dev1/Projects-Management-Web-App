"use client";
import { capitalizeWords } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Button, Form, Input} from "@heroui/react";
import SelectsDataForm from "./SelectsDataForm";
import SkeletonDataForm from "./SkeletonDataForm";
import { Save } from "lucide-react";
import { UpdateUserProfileData } from "@/types";
import { updateUserData } from "@/store/slices/AuthSlice";

export default function DataForm() {
const dispatch = useAppDispatch();
  const { user, profile, isLoading } = useAppSelector(
    (state) => state.auth,
  );
  const capitalizeName = capitalizeWords(profile?.full_name ?? "");

  const handleSubmit = async (formData: FormData) => {
  const data = Object.fromEntries(formData) as unknown as UpdateUserProfileData;

  if (!data.full_name || !data.language || !data.timezone) {
    console.error("Faltan campos requeridos");
    return;
  }

  dispatch(updateUserData(data));
};

  if (isLoading) {
    return (
      <SkeletonDataForm />
    );
  }
  return (
    <Form
      className="w-full flex flex-col items-center justify-center sm:w-1/2 lg:w-1/3"
      onSubmit={(e) => handleSubmit(new FormData(e.currentTarget))}
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
      <Button type="submit" color="secondary" startContent={<Save size={18} />}>Guardar</Button>
    </Form>
  );
}
