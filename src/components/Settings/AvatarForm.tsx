"use client"

import { useState } from "react"
import { uploadAvatar } from "@/lib/updateAvatar"
import Image from "next/image"
import { useAppSelector } from "@/store/hooks"

export default function AvatarForm() {
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { profile } = useAppSelector(state => state.auth)

  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    // Validaciones
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imágenes")
      return
    }

    if (file.size > 4 * 1024 * 1024) {
      setError("Máximo 4MB")
      return
    }

    // Preview instantáneo
    setPreview(URL.createObjectURL(file))
    setUploading(true)

    const result = await uploadAvatar(file)

    if (result?.error) {
      setError(result.error)
    }

    if (result?.url) {
      setPreview(result.url)
    }

    setUploading(false)
  }

  return (
    <div className="flex flex-col gap-4 max-w-sm">
      <div className="w-32 h-32 rounded-full overflow-hidden border">
        { preview ? (
          <Image
            src={ preview ?? profile?.avatar_url ?? "/avatar.png" }
            width={500}
            height={500}
            alt="Avatar"
            className="w-full h-full object-cover animate-pulse"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm">
            Sin avatar
          </div>
        )}
      </div>

      <label className="cursor-pointer inline-block">
        <span className="px-4 py-2 bg-black text-white rounded">
          {uploading ? "Subiendo..." : "Cambiar avatar"}
        </span>
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