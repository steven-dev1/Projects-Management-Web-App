'use client'
import { Button, Divider, Form, Input, Spinner } from "@heroui/react";
import { useState } from "react";
import { ToggleVisibilityButton } from "./ToggleVisibilityButton";
import { Save } from "lucide-react";
import { handleChangePassword } from "@/lib/resetPassword";
import { useAppSelector } from "@/store/hooks";

export default function ResetPasswordForm() {
    const { user } = useAppSelector(state => state.auth)
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <h2 className="text-xl font-bold">Cambiar contraseña</h2>
      <Divider className="my-4"/>
      <Form className="w-full flex flex-col items-center justify-center" onSubmit={(e) => handleChangePassword(new FormData(e.currentTarget), e, setLoading, setError, user?.email)}>
        <Input
          label="Contraseña actual"
          labelPlacement="inside"
          name="current_password"
          type={showCurrent ? "text" : "password"}
          placeholder="******"
          isRequired
          endContent={
            <ToggleVisibilityButton
              isVisible={showCurrent}
              toggle={() => setShowCurrent(!showCurrent)}
            />
          }
        />
        <Input
          label="Nueva contraseña"
          labelPlacement="inside"
          name="new_password"
          type={showNew ? "text" : "password"}
          placeholder="******"
          isRequired
          minLength={6}
          endContent={
            <ToggleVisibilityButton
              isVisible={showNew}
              toggle={() => setShowNew(!showNew)}
            />
          }
        />
        <Input
          label="Confirmar nueva contraseña"
          labelPlacement="inside"
          name="confirm_password"
          type={showConfirm ? "text" : "password"}
          placeholder="******"
          isRequired
          minLength={6}
          endContent={
            <ToggleVisibilityButton
              isVisible={showConfirm}
              toggle={() => setShowConfirm(!showConfirm)}
            />
          }
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <Button type="submit" color="secondary" className="flex items-center gap-2">
          {loading ? <Spinner color="default" size="sm" /> : <><Save size={18} /> Cambiar contraseña</>}
        </Button>
      </Form>
    </>
  );
}
