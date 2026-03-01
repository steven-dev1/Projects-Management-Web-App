"use client"

import { useState } from "react"
import { uploadAvatar } from "@/lib/updateAvatar"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { addToast, Avatar, Spinner } from "@heroui/react"
import { refreshAvatarUrl } from "@/store/slices/AuthSlice"

export default function AvatarForm() {
  const dispatch = useAppDispatch()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { profile } = useAppSelector(state => state.auth)

  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imágenes")
      return
    }

    if (file.size > 4 * 1024 * 1024) {
      setError("Máximo 4MB")
      return
    }
    setUploading(true)

    const result = await uploadAvatar(file)

    if (result?.error) {
      setError(result.error)
    }

    setUploading(false)
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await dispatch(refreshAvatarUrl()).unwrap()
      addToast({ title: "Avatar actualizado", color: "success", icon: "Check" })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (rejectedValueOrError) {
      addToast({ title: "Error al actualizar avatar", color: "danger" })
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-sm">
        { profile?.avatar_url ? (
          <Avatar isBordered className="w-36 h-36" src={profile.avatar_url} size="lg" />
        ) : (
          <div className="w-36 h-36 flex items-center justify-center text-sm bg-zinc-200 rounded-full animate-pulse">
            
          </div>
        )}

      <label className="cursor-pointer inline-block">
        <div className="px-4 py-2 bg-morado hover:bg-morado-lighter transition-all duration-100 text-white rounded-xl flex items-center justify-center">
          {uploading ? <Spinner color="default" size="sm" /> : "Cambiar avatar"}
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  )
}