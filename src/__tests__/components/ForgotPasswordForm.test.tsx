import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const { mockResetPasswordForEmail } = vi.hoisted(() => ({
  mockResetPasswordForEmail: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: mockResetPasswordForEmail,
    },
  },
}));

import ForgotPasswordForm from "@/components/Auth/ForgotPasswordForm";

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    mockResetPasswordForEmail.mockResolvedValue({ error: null });
  });

  it("debería renderizar el formulario correctamente", () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByText("¿Olvidaste tu contraseña?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("tu@email.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /enviar link/i })).toBeInTheDocument();
  });

  it("debería mostrar el estado de email enviado cuando funciona", async () => {
    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText("tu@email.com"), {
      target: { value: "test@email.com" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /enviar link/i }).closest("form")!);

    await waitFor(() => {
      expect(screen.getByText("Revisa tu email")).toBeInTheDocument();
    });
  });

  it("debería llamar a resetPasswordForEmail con el email correcto", async () => {
    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText("tu@email.com"), {
      target: { value: "test@email.com" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /enviar link/i }).closest("form")!);

    await waitFor(() => {
      expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
        "test@email.com",
        expect.objectContaining({ redirectTo: expect.stringContaining("/reset-password") })
      );
    });
  });

  it("debería mostrar error si Supabase falla", async () => {
    mockResetPasswordForEmail.mockResolvedValueOnce({
      error: { message: "Email no encontrado" },
    });

    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText("tu@email.com"), {
      target: { value: "test@email.com" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /enviar link/i }).closest("form")!);

    await waitFor(() => {
      expect(screen.getByText("Email no encontrado")).toBeInTheDocument();
    });
  });

  it("debería mostrar link para volver al inicio de sesión", () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByRole("link", { name: /volver al inicio de sesión/i })).toBeInTheDocument();
  });
});