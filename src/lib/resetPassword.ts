import { addToast } from "@heroui/react";
import { createClient } from "./supabaseClient";
import { PasswordResetData } from "@/types";

const supabase = createClient();

export async function resetPassword(newPassword: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Usuario no autenticado" };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: true,
  };
}

export const handleChangePassword = async (
  formData: FormData,
  e: React.SyntheticEvent,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  email?: string,
) => {
  e.preventDefault();
  const data = Object.fromEntries(formData) as unknown as PasswordResetData;
  setError(null);

  if(!email) {
    addToast({
      title: "Error",
      description: "No se pudo recuperar el correo electrónico o el usuario no está autenticado",
      color: "danger",
    });
    return;
  }

  const passwordMatch = confirmPasswordMatch(
    data.new_password,
    data.confirm_password,
  );
  if (!passwordMatch) {
    addToast({
      title: "Error",
      description: "Las contraseñas no coinciden",
      color: "danger",
    });
    return;
  }

  if (data.new_password.length < 6) {
    setError("La contraseña debe tener al menos 6 caracteres");
    return;
  }

  setLoading(true);

  try {
    const currentPasswordError = await validateCurrentPassword(
        data.current_password,
        email,
    )
    if (currentPasswordError !== true) {
        setError(currentPasswordError)
        setLoading(false)
        return
    }
    const result = await resetPassword(data.new_password);
    if (result.success) {
      addToast({
        title: "Contraseña actualizada",
        color: "success",
        icon: "Check",
      });
    } else {
      addToast({ title: "Error al actualizar contraseña", color: "danger" });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    addToast({ title: "Error al actualizar contraseña", color: "danger" });
  }

  setLoading(false);
};

export const confirmPasswordMatch = (
  password: string,
  confirmPassword: string,
) => {
  if (password !== confirmPassword) {
    return false;
  }
  return true;
};

export const validateCurrentPassword = async (
  currentPassword: string,
  email: string,
) => {
  try {
    console.log("Email:", email);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: currentPassword,
    });

    if (signInError) {
      throw new Error("La contraseña actual es incorrecta");
    }

    return true;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Error desconocido al validar contraseña actual";
    return message;
  }
};
