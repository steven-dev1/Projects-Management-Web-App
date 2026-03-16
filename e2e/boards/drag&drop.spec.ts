import { test, expect, Locator, Page } from "@playwright/test";
import { login } from "../helpers/auth";
import { resetTestBoard } from "../helpers/board";

async function dragTo(
  page: Page,
  source: Locator,
  target: Locator,
  position: "center" | "after" | "before" = "center",
) {
  const grip = source.locator(".cursor-grab").first();
  const gripCount = await grip.count();
  const dragSource = gripCount > 0 ? grip : source;

  const sourceBox = await dragSource.boundingBox();
  const targetBox = await target.boundingBox();
  if (!sourceBox || !targetBox) return;

  const startX = sourceBox.x + sourceBox.width / 2;
  const startY = sourceBox.y + sourceBox.height / 2;

  const targetX = targetBox.x + targetBox.width / 2;
  const targetY =
    position === "after"
      ? targetBox.y + targetBox.height - 2
      : position === "before"
        ? targetBox.y + 2
        : targetBox.y + targetBox.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.waitForTimeout(300);
  await page.mouse.move(startX + 5, startY + 5, { steps: 5 });
  await page.waitForTimeout(100);
  await page.mouse.move(targetX, targetY, { steps: 30 });
  await page.waitForTimeout(500);
  await page.mouse.up();
  await page.waitForTimeout(1500);
}

test.describe("Drag and Drop", () => {
  test.beforeEach(async ({ page }) => {
    await resetTestBoard();
    await login(page);
    await page.goto(`/boards/${process.env.TEST_BOARD_ID}`);
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("[data-type='column']", { timeout: 15000 });
    await page.waitForSelector("[data-type='card']", { timeout: 15000 });
  });

  test("debería mover una card de la primera lista a la segunda", async ({ page }) => {
    const lists = page.locator("[data-type='column']");
    const firstList = lists.filter({ hasText: "Lista 1" });
    const secondList = lists.filter({ hasText: "Lista 2" });

    const card = firstList.locator("[data-type='card']").first();
    await expect(card).toBeVisible({ timeout: 8000 });
    const cardTitle = (await card.textContent())?.trim();

    await dragTo(page, card, secondList);

    await expect(secondList.getByText(cardTitle!, { exact: true })).toBeVisible({ timeout: 8000 });
    await expect(firstList.getByText(cardTitle!, { exact: true })).not.toBeVisible();
  });

  test("debería mover varias cards a diferentes listas", async ({ page }) => {
    const lists = page.locator("[data-type='column']");
    const firstList = lists.filter({ hasText: "Lista 1" });
    const secondList = lists.filter({ hasText: "Lista 2" });
    const thirdList = lists.filter({ hasText: "Lista 3" });

    const firstCard = firstList.locator("[data-type='card']").first();
    await expect(firstCard).toBeVisible({ timeout: 8000 });
    const firstCardTitle = (await firstCard.textContent())?.trim();
    await dragTo(page, firstCard, secondList);
    await expect(secondList.getByText(firstCardTitle!, { exact: true })).toBeVisible({ timeout: 8000 });

    await page.waitForTimeout(500);

    const secondCard = firstList.locator("[data-type='card']").first();
    await expect(secondCard).toBeVisible({ timeout: 8000 });
    const secondCardTitle = (await secondCard.textContent())?.trim();
    await dragTo(page, secondCard, thirdList);
    await expect(thirdList.getByText(secondCardTitle!, { exact: true })).toBeVisible({ timeout: 8000 });
  });

  test("debería reordenar cards en la misma lista", async ({ page }) => {
    const targetList = page.locator("[data-type='column']").filter({ hasText: "Lista 1" });
    await expect(targetList).toBeVisible({ timeout: 8000 });

    const firstCard = targetList.locator("[data-type='card']").nth(0);
    const secondCard = targetList.locator("[data-type='card']").nth(1);

    await expect(firstCard).toBeVisible({ timeout: 8000 });
    await expect(secondCard).toBeVisible({ timeout: 8000 });

    const firstCardTitle = (await firstCard.textContent())?.trim();
    const secondCardTitle = (await secondCard.textContent())?.trim();

    await dragTo(page, firstCard, secondCard, "center");

    await page.reload();
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("[data-type='card']", { timeout: 15000 });

    const reloadedList = page.locator("[data-type='column']").filter({ hasText: "Lista 1" });
    await expect(reloadedList.locator("[data-type='card']").nth(1)).toBeVisible({ timeout: 8000 });

    const newFirstCardTitle = (await reloadedList.locator("[data-type='card']").nth(0).textContent())?.trim();
    const newSecondCardTitle = (await reloadedList.locator("[data-type='card']").nth(1).textContent())?.trim();

    expect(newFirstCardTitle).toBe(secondCardTitle);
    expect(newSecondCardTitle).toBe(firstCardTitle);
  });

  test("debería mover una lista a otra posición", async ({ page }) => {
    const lists = page.locator("[data-type='column']");
    const firstList = lists.nth(0);
    const secondList = lists.nth(1);

    const firstListTitle = (await firstList.locator("h3").first().textContent())?.trim();
    const secondListTitle = (await secondList.locator("h3").first().textContent())?.trim();

    // Hacer drag directamente desde el grip de la primera lista a la segunda
    const gripHandle = firstList.locator(".cursor-grab").first();
    const gripBox = await gripHandle.boundingBox();
    const targetBox = await secondList.boundingBox();
    if (!gripBox || !targetBox) return;

    await page.mouse.move(gripBox.x + gripBox.width / 2, gripBox.y + gripBox.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(500); // más tiempo presionado
    // Movimiento inicial más pronunciado para activar el drag
    await page.mouse.move(gripBox.x + gripBox.width / 2 + 10, gripBox.y + gripBox.height / 2, { steps: 10 });
    await page.waitForTimeout(200);
    // Luego al destino
    await page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2,
      { steps: 50 }, // más steps para movimiento más suave
    );
    await page.waitForTimeout(800);
    await page.mouse.up();
    await page.waitForTimeout(2000);

    const beforeReloadFirst = (
      await page.locator("[data-type='column']").nth(0).locator("h3").first().textContent()
    )?.trim();
    const beforeReloadSecond = (
      await page.locator("[data-type='column']").nth(1).locator("h3").first().textContent()
    )?.trim();
    console.log("Antes de recargar:", beforeReloadFirst, beforeReloadSecond);

    await page.reload();
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("[data-type='column']", { timeout: 15000 });

    const newLists = page.locator("[data-type='column']");
    const newFirstListTitle = (await newLists.nth(0).locator("h3").first().textContent())?.trim();
    const newSecondListTitle = (await newLists.nth(1).locator("h3").first().textContent())?.trim();

    expect(newFirstListTitle).toBe(secondListTitle);
    expect(newSecondListTitle).toBe(firstListTitle);
  });
});
