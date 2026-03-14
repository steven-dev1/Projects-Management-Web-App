import { test, expect } from "@playwright/test";
import { login } from "../../helpers/auth";

test.describe("Crear card", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`/boards/${process.env.TEST_BOARD_ID}`);
    await page.waitForLoadState("networkidle");
  });

  test("debería mostrar el botón de añadir tarjeta", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Añadir tarjeta" }).first()).toBeVisible();
  });

  test("debería abrir el modal de crear card", async ({ page }) => {
    await page.getByRole("button", { name: "Añadir tarjeta" }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("debería crear una card con nombre válido", async ({ page }) => {
    await page.getByRole("button", { name: "Añadir tarjeta" }).first().click();
    await page.getByLabel("Nombre de la tarea").fill("Card e2e");
    await page.getByRole("button", { name: "Crear" }).last().click();

    await expect(page.getByText("Card e2e")).toBeVisible();
  });

  test("no debería crear una card sin nombre", async ({ page }) => {
    await page.getByRole("button", { name: "Añadir tarjeta" }).first().click();
    await page.getByRole("button", { name: "Crear" }).last().click();

    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("debería crear una card con descripción", async ({ page }) => {
    await page.getByRole("button", { name: "Añadir tarjeta" }).first().click();
    await page.getByLabel("Nombre de la tarea").fill("Card con descripción e2e");
    await page.getByLabel("Descripción (Opcional)").fill("Esta es una descripción de prueba");
    await page.getByRole("button", { name: "Crear" }).last().click();

    await expect(page.getByText("Card con descripción e2e")).toBeVisible();
  });

  test("debería cerrar el modal al cancelar", async ({ page }) => {
    await page.getByRole("button", { name: "Añadir tarjeta" }).first().click();
    await page.getByRole("button", { name: "Cancelar" }).click();

    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});