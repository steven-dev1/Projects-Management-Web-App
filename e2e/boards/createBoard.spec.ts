import { test, expect } from "@playwright/test";
import { login } from "../helpers/auth";

test.describe("Crear board", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("debería abrir el modal de crear board", async ({ page }) => {
    await page.getByRole("button", { name: "Crear" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("debería crear un board con nombre válido", async ({ page }) => {
    await page.getByRole("button", { name: "Crear" }).click();
    await page.getByLabel("Nombre del proyecto").fill("Board de prueba e2e");
    await page.getByRole("button", { name: "Crear" }).last().click();

    await expect(page.getByText("Board de prueba e2e")).toBeVisible();
  });

  test("no debería crear un board sin nombre", async ({ page }) => {
    await page.getByRole("button", { name: "Crear" }).click();
    await page.getByRole("button", { name: "Crear" }).last().click();

    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("debería navegar al board después de crearlo", async ({ page }) => {
    await page.getByRole("button", { name: "Crear" }).click();
    await page.getByLabel("Nombre del proyecto").fill("Board navegación e2e");
    await page.getByRole("button", { name: "Crear" }).last().click();

    await expect(page).toHaveURL(/\/boards\/.+/);
  });
});