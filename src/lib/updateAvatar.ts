import { createClient } from "./supabaseClient"
export async function uploadAvatar(file: File) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Usuario no autenticado" }
  }

  const filePath = `${user.id}/avatar.png`

  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      upsert: true,
    })

  if (error) {
    return { error: error.message }
  }

  const { data } = await supabase.storage
    .from("avatars")
    .createSignedUrl(filePath, 60 * 5)

  return {
    success: true,
    path: filePath,
    url: data?.signedUrl,
  }
}