import { test, expect } from "@playwright/test";

test.describe("Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/signin");
  });

  test("debería mostrar el formulario de login", async ({ page }) => {
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Contraseña")).toBeVisible();
    await expect(page.getByRole("button", { name: "Iniciar sesión" })).toBeVisible();
  });

  test("debería mostrar error con credenciales incorrectas", async ({ page }) => {
    await page.getByLabel("Email").fill("wrong@email.com");
    await page.getByLabel("Contraseña").fill("wrongpassword");
    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    await expect(page.locator(".bg-red-50")).toBeVisible();
  });

  test("debería redirigir al dashboard con credenciales correctas", async ({ page }) => {
    await page.getByLabel("Email").fill(process.env.TEST_EMAIL!);
    await page.getByLabel("Contraseña").fill(process.env.TEST_PASSWORD!);
    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    await expect(page).toHaveURL("/dashboard", { timeout: 15000 });
  });

  test("debería tener link al registro", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Crear cuenta gratis" })).toBeVisible();
  });
});
