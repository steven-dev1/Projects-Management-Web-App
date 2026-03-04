import { Button } from "@heroui/react";
import { UserPlus } from "lucide-react";

export default function ShareButton() {
  return <Button variant="light" color="default" startContent={<UserPlus size={18}/>}>Compartir</Button>
}