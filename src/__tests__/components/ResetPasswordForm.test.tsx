import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const { mockGetSession, mockOnAuthStateChange, mockUpdateUser } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockOnAuthStateChange: vi.fn(),
  mockUpdateUser: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
      updateUser: mockUpdateUser,
    },
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import ResetPasswordForm from "@/components/Auth/ResetPasswordForm";

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockOnAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
    mockUpdateUser.mockResolvedValue({ error: null });
  });

  it("debería mostrar spinner mientras verifica la sesión", () => {
    mockGetSession.mockReturnValue(new Promise(() => {}));
    const { container } = render(<ResetPasswordForm />);
    expect(container.querySelector('[aria-label="Loading"]')).toBeInTheDocument();
  });

  it("debería mostrar link inválido si no hay sesión", async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    render(<ResetPasswordForm />);

    await waitFor(() => {
      expect(screen.getByText("Link inválido o expirado")).toBeInTheDocument();
    });
  });

  it("debería mostrar el formulario si hay sesión válida", async () => {
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: "user-1" } } } });
    render(<ResetPasswordForm />);

    await waitFor(() => {
      expect(screen.getByText("Restablecer contraseña")).toBeInTheDocument();
    });
  });

  it("debería mostrar error si las contraseñas no coinciden", async () => {
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: "user-1" } } } });
    render(<ResetPasswordForm />);

    await waitFor(() => screen.getByText("Restablecer contraseña"));

    const inputs = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(inputs[0], { target: { value: "password123" } });
    fireEvent.change(inputs[1], { target: { value: "diferente123" } });
    fireEvent.submit(screen.getByRole("button", { name: /guardar contraseña/i }).closest("form")!);

    await waitFor(() => {
      expect(screen.getByText("Las contraseñas no coinciden")).toBeInTheDocument();
    });
  });

  it("debería mostrar error si la contraseña es menor a 6 caracteres", async () => {
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: "user-1" } } } });
    render(<ResetPasswordForm />);

    await waitFor(() => screen.getByText("Restablecer contraseña"));

    const inputs = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(inputs[0], { target: { value: "123" } });
    fireEvent.change(inputs[1], { target: { value: "123" } });
    fireEvent.submit(screen.getByRole("button", { name: /guardar contraseña/i }).closest("form")!);

    await waitFor(() => {
      expect(screen.getByText("La contraseña debe tener al menos 6 caracteres")).toBeInTheDocument();
    });
  });

  it("debería mostrar contraseña actualizada cuando funciona", async () => {
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: "user-1" } } } });
    render(<ResetPasswordForm />);

    await waitFor(() => screen.getByText("Restablecer contraseña"));

    const inputs = screen.getAllByPlaceholderText("••••••••");

    fireEvent.change(inputs[0], {
      target: { value: "nuevapassword123" },
    });
    fireEvent.change(inputs[1], {
      target: { value: "nuevapassword123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /guardar contraseña/i }).closest("form")!);

    await waitFor(() => {
      expect(screen.getByText("Contraseña actualizada")).toBeInTheDocument();
    });
  });
});
