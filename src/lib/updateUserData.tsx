// import { createClient } from "./supabaseClient"
// import { fetchUserAndProfile } from "@/store/slices/AuthSlice"

// export async function updateUserData(data: any) {
//   const supabase = createClient()

//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   if (!user) {
//     return { error: "Usuario no autenticado" }
//   }

//   const { error } = await supabase
//     .from("user_preferences")
//     .update(data)
//     .eq("id", user.id)

//   if (error) {
//     return { error: error.message }
//   }

//   dispatch(fetchUserAndProfile())

//   return {
//     success: true,
//   }
// }
