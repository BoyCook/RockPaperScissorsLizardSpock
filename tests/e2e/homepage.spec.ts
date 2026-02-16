import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display the homepage', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText(
      'Rock Paper Scissors Lizard Spock'
    );
  });

  test('should have links to game modes', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: /Local Game/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /vs Computer/ })).toBeVisible();
  });

  test('should have links to rules and about pages', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: /Game Rules/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /About/ })).toBeVisible();
  });

  test('should navigate to local game', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /Local Game/ }).click();

    await expect(page).toHaveURL('/play/local');
    await expect(page.locator('h1')).toContainText('Local Game');
  });

  test('should navigate to computer game', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /vs Computer/ }).click();

    await expect(page).toHaveURL('/play/computer');
    await expect(page.locator('h1')).toContainText('vs Computer');
  });

  test('should navigate to rules page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /Game Rules/ }).click();

    await expect(page).toHaveURL('/rules');
    await expect(page.locator('h1')).toContainText('Game Rules');
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /About/ }).click();

    await expect(page).toHaveURL('/about');
    await expect(page.locator('h1')).toContainText('About');
  });
});
