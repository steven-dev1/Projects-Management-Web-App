import { test, expect } from "@playwright/test";
import { login } from "../helpers/auth";

test.describe("Flujo completo", () => {
  test("login + crear board + crear lista + crear card + editar card + checklist + label", async ({ page }) => {
    // Login
    await login(page);
    await expect(page).toHaveURL("/dashboard");

    // Crear board
    await page.getByRole("button", { name: "Crear" }).click();
    await page.getByLabel("Nombre del proyecto").fill("Board flujo completo e2e");
    await page.getByRole("button", { name: "Crear" }).last().click();
    await expect(page).toHaveURL(/\/boards\/.+/);

    // Crear lista
    await page.getByRole("button", { name: "Crear lista" }).click();
    await page.getByLabel("Nombre de la tarea").fill("Lista flujo completo e2e");
    await page.getByRole("button", { name: "Crear" }).last().click();
    await expect(page.getByText("Lista flujo completo e2e")).toBeVisible();

    // Crear card
    await page.getByRole("button", { name: "Añadir tarjeta" }).first().click();
    await page.getByLabel("Nombre de la tarea").fill("Card flujo completo e2e");
    await page.getByRole("button", { name: "Crear" }).last().click();
    await expect(page.getByText("Card flujo completo e2e")).toBeVisible();

    // Abrir card detail modal
    await page.getByText("Card flujo completo e2e").click();
    await expect(page.getByRole("dialog")).toBeVisible();

    // Editar título de la card
    await page.getByRole("heading", { name: "Card flujo completo e2e" }).click();
    await page.getByRole("textbox").first().fill("Card editada e2e");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: "Card editada e2e" })).toBeVisible();

    // Agregar checklist
    await page.getByRole("button", { name: "Agregar checklist" }).click();
    await page.getByLabel("Título").fill("Mi checklist e2e");
    await page.getByRole("button", { name: "Crear" }).last().click();
    await expect(page.getByText("Mi checklist e2e")).toBeVisible();

    // Agregar item al checklist
    await page.getByRole("button", { name: "Agregar item" }).click();
    await page.getByPlaceholder("Escribe un item...").fill("Item e2e");
    await page.keyboard.press("Enter");
    await expect(page.getByText("Item e2e")).toBeVisible();

    // Toggle label
    await page
      .getByRole("button")
      .filter({ has: page.locator(".text-white") })
      .first()
      .click();

    // Cerrar modal
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});
