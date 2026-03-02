import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createServerSupabaseClient();
  const { data: session } = await supabase.auth.getSession();
  if(session) {
    redirect("/dashboard");
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      
    </div>
  );
}
