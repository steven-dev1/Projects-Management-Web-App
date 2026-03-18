import { inviteMember } from "@/store/features/boards/inviteThunks";
import { useAppDispatch } from "@/store/hooks";
import { addToast, Button, Divider, Input, Modal, ModalBody, ModalContent, ModalHeader, Select, SelectItem } from "@heroui/react";
import { useState } from "react";

export const InviteModal = ({ boardId, isOpen, onClose }: {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await dispatch(inviteMember({ boardId, email, role })).unwrap();
      addToast({ title: "Invitación enviada", color: "success", icon: "Check" });
      setEmail("");
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al enviar invitación";
      addToast({ title: message, color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} placement="top-center">
      <ModalContent>
        <ModalHeader>Invitar miembro</ModalHeader>
        <Divider />
        <ModalBody className="py-4 flex flex-col gap-4">
          <Input
            label="Email"
            placeholder="correo@ejemplo.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleInvite(); }}
          />
          <Select
            label="Rol"
            defaultSelectedKeys={["member"]}
            onSelectionChange={(keys) => setRole(Array.from(keys)[0] as string)}
          >
            <SelectItem key="member">Miembro</SelectItem>
            <SelectItem key="admin">Admin</SelectItem>
          </Select>
          <div className="flex justify-end gap-2">
            <Button variant="flat" onPress={onClose}>Cancelar</Button>
            <Button color="primary" onPress={handleInvite} isLoading={loading}>
              Enviar invitación
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};