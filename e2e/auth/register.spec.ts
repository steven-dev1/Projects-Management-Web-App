import { test, expect } from "@playwright/test";

test.describe("Registro", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/signup");
  });

  test("debería mostrar el formulario de registro", async ({ page }) => {
    await expect(page.getByLabel("Nombre completo")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Contraseña")).toBeVisible();
    await expect(page.getByRole("button", { name: "Crear cuenta" })).toBeVisible();
  });

  test("debería mostrar error con email ya registrado", async ({ page }) => {
    await page.getByLabel("Nombre completo").fill("Usuario Test");
    await page.getByLabel("Email").fill(process.env.TEST_EMAIL!);
    await page.getByLabel("Contraseña").fill("password123");
    await page.getByRole("button", { name: "Crear cuenta" }).click();

    await expect(page.locator(".bg-red-50")).toBeVisible();
  });

  test("no debería registrar sin nombre completo", async ({ page }) => {
    await page.getByLabel("Email").fill("nuevo@email.com");
    await page.getByLabel("Contraseña").fill("password123");
    await page.getByRole("button", { name: "Crear cuenta" }).click();

    await expect(page).not.toHaveURL("/signin");
  });

  test("no debería registrar con contraseña menor a 6 caracteres", async ({ page }) => {
    await page.getByLabel("Nombre completo").fill("Usuario Test");
    await page.getByLabel("Email").fill("nuevo@email.com");
    await page.getByLabel("Contraseña").fill("123");
    await page.getByRole("button", { name: "Crear cuenta" }).click();

    await expect(page).not.toHaveURL("/signin");
  });

  test("debería tener link al login", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Iniciar sesión" })).toBeVisible();
  });

  test("debería navegar al login al hacer click en el link", async ({ page }) => {
    await page.getByRole("link", { name: "Iniciar sesión" }).click();
    await expect(page).toHaveURL("/signin");
  });
});