import { Page } from "@playwright/test";

export async function login(page: Page) {
  await page.goto("/signin");
  await page.getByLabel("Email").fill(process.env.TEST_EMAIL!);
  await page.getByLabel("Contraseña").fill(process.env.TEST_PASSWORD!);
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
  await page.waitForURL("/dashboard");
}
