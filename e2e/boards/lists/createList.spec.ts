import { test, expect } from "@playwright/test";
import { login } from "../../helpers/auth";

test.describe("Crear lista", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`/boards/${process.env.TEST_BOARD_ID}`);
    await page.waitForLoadState("networkidle");
  });

  test("debería mostrar el botón de crear lista", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Crear lista" })).toBeVisible();
  });

  test("debería abrir el modal de crear lista", async ({ page }) => {
    await page.getByRole("button", { name: "Crear lista" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("debería crear una lista con nombre válido", async ({ page }) => {
    await page.getByRole("button", { name: "Crear lista" }).click();
    await page.getByLabel("Nombre de la tarea").fill("Lista e2e");
    await page.getByRole("button", { name: "Crear" }).last().click();

    await expect(page.getByText("Lista e2e")).toBeVisible();
  });

  test("no debería crear una lista sin nombre", async ({ page }) => {
    await page.getByRole("button", { name: "Crear lista" }).click();
    await page.getByRole("button", { name: "Crear" }).last().click();

    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("debería cerrar el modal al cancelar", async ({ page }) => {
    await page.getByRole("button", { name: "Crear lista" }).click();
    await page.getByRole("button", { name: "Cancelar" }).click();

    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});
