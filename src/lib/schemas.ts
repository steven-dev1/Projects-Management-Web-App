import { z } from "zod";

export const inviteMemberSchema = z.object({
  email: z.email("Email inválido"),
  role: z.enum(["admin", "member"]).default("member"),
});