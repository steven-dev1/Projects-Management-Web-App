'use client'
import { Button } from "@heroui/react";
import { XCircle } from "lucide-react";
import Link from "next/link";

export const InviteError = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <XCircle size={48} className="text-red-400" />
      <h2 className="text-xl font-semibold text-zinc-700">Invitación inválida</h2>
      <p className="text-zinc-500 text-sm">{message}</p>
      <Link href="/dashboard">
        <Button color="primary">Ir al dashboard</Button>
      </Link>
    </div>
  );
};