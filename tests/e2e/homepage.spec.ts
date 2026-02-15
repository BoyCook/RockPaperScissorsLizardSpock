import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display the homepage', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText(
      'Rock Paper Scissors Lizard Spock'
    );
  });

  test('should have links to all game modes', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Play Local' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'vs Computer' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Play Online' })).toBeVisible();
  });

  test('should navigate to local game', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Play Local' }).click();

    await expect(page).toHaveURL('/play/local');
    await expect(page.locator('h1')).toContainText('Local Game');
  });

  test('should navigate to computer game', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'vs Computer' }).click();

    await expect(page).toHaveURL('/play/computer');
    await expect(page.locator('h1')).toContainText('vs Computer');
  });
});
