// app/settings/page.tsx
import AvatarForm from "@/components/Settings/AvatarForm"
import TabsComponent from "@/components/Settings/Tabs"
import MaxWidth from "@/components/UI/MaxWidth"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {},
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/signin")
  }

  return (
    <MaxWidth>
      <div className="flex flex-col items-center gap-8 py-8">
        <AvatarForm />
        <TabsComponent />
      </div>
    </MaxWidth>
  )
}