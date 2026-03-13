import { createClient } from "./supabaseClient";

export async function uploadAvatar(file: File) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Usuario no autenticado" };

  const filePath = `${user.id}/avatar.png`;

  const { error } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true });

  if (error) return { error: error.message };

  // Obtener URL pública permanente
  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

  const publicUrlWithCache = `${data.publicUrl}?t=${Date.now()}`;

  // Guardar la URL completa en profiles
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrlWithCache })
    .eq("id", user.id);

  if (updateError) return { error: updateError.message };

  return {
    success: true,
    path: filePath,
    url: data.publicUrl,
  };
}
