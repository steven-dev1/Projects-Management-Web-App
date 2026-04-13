import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";
import { inviteMemberSchema } from "@/lib/schemas";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id: boardId } = await context.params;
  const supabase = await createServerSupabaseClient();
  const rawBody = await req.json();
  const parsed = inviteMemberSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 422 });
  }

  const { email, role } = parsed.data;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: board } = await supabase.from("boards").select("name").eq("id", boardId).single();

  const { data: inviter } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();

  const { data: existing } = await supabase
    .from("invitations")
    .select("id")
    .eq("board_id", boardId)
    .eq("email", email)
    .eq("status", "pending")
    .single();

  if (existing) {
    return NextResponse.json({ error: "Ya existe una invitación para ese email" }, { status: 400 });
  }

  // Crear la invitación
  const { data: invitation, error } = await supabase
    .from("invitations")
    .insert({ board_id: boardId, email, role, invited_by: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitation.token}`;

  const sendEmail = async () => {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: { name: "Projects M.", email: "stevencuentas334@gmail.com" },
        to: [{ email }],
        subject: `${inviter?.full_name} te invitó a ${board?.name}`,
        htmlContent: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #18181b;">Tienes una invitación</h2>
          <p style="color: #71717a;">
            <strong>${inviter?.full_name}</strong> te invitó a colaborar en el board 
            <strong>${board?.name}</strong> en Projects M.
          </p>
          <a href="${inviteUrl}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #006fee; color: white; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Aceptar invitación
          </a>
          <p style="color: #a1a1aa; font-size: 12px; margin-top: 24px;">
            Este link expira en 7 días.
          </p>
        </div>
      `,
      }),
    });

    const data = await response.json();
    console.log("Brevo response:", JSON.stringify(data));
    if (!response.ok) throw new Error(data.message);
  };

  await sendEmail();

  return NextResponse.json({ success: true });
}
