import { test, expect } from '@playwright/test';

test.describe('Homepage - vs Computer Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the game UI with scores', async ({ page }) => {
    await expect(page.getByText('YOU', { exact: true })).toBeVisible();
    await expect(page.getByText('COMPUTER 🤖')).toBeVisible();
    await expect(page.getByText('VS').first()).toBeVisible();
  });

  test('should display all five move emojis', async ({ page }) => {
    const moveEmojis = ['✊', '✋', '✌️', '🦎', '🖖'];

    for (const emoji of moveEmojis) {
      await expect(page.getByText(emoji).first()).toBeVisible();
    }
  });

  test('should display choose your move prompt', async ({ page }) => {
    await expect(page.getByText('Choose Your Move')).toBeVisible();
  });

  test('should play a game when a move is selected', async ({ page }) => {
    await page.getByText('✊').first().click({ force: true });

    // Move selector re-enables after countdown + result auto-reset
    await expect(page.getByText('Choose Your Move')).toBeVisible({
      timeout: 10000,
    });
  });

  test('should have navigation links', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Local Game/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Rules/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /About/ })).toBeVisible();
  });

  test('should navigate to local game', async ({ page }) => {
    await page.getByRole('link', { name: /Local Game/ }).click();

    await expect(page).toHaveURL('/play/local');
  });

  test('should navigate to rules page', async ({ page }) => {
    await page.getByRole('link', { name: /Rules/ }).click();

    await expect(page).toHaveURL('/rules');
    await expect(page.locator('h1')).toContainText('Game Rules');
  });

  test('should navigate to about page', async ({ page }) => {
    await page.getByRole('link', { name: /About/ }).click();

    await expect(page).toHaveURL('/about');
    await expect(page.locator('h1')).toContainText('About');
  });
});
