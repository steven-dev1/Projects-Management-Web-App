import { Eye, EyeOff } from "lucide-react";

export const ToggleVisibilityButton = ({
  isVisible,
  toggle,
}: {
  isVisible: boolean;
  toggle: () => void;
}) => (
  <button
    type="button"
    onClick={toggle}
    className="focus:outline-none cursor-pointer"
    aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
  >
    {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
);