import { test, expect } from '@playwright/test';

test.describe('Local Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/play/local');
  });

  test('should display the local game page', async ({ page }) => {
    await expect(page.getByText('Player 1 - Choose Your Move')).toBeVisible();
    await expect(page.getByText('Player 2 - Choose Your Move')).toBeVisible();
  });

  test('should display all five move emojis for both players', async ({
    page,
  }) => {
    const moveEmojis = ['✊', '✋', '✌️', '🦎', '🖖'];

    for (const emoji of moveEmojis) {
      const elements = page.getByText(emoji);
      const count = await elements.count();
      expect(count).toBeGreaterThanOrEqual(2);
    }
  });

  test('should display score board', async ({ page }) => {
    await expect(page.getByText('PLAYER 1', { exact: true })).toBeVisible();
    await expect(page.getByText('PLAYER 2', { exact: true })).toBeVisible();
  });

  test('should have navigation links', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Play/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Rules/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /About/ })).toBeVisible();
  });

  test('should navigate back to home', async ({ page }) => {
    await page.getByRole('link', { name: /Play/ }).click();

    await expect(page).toHaveURL('/');
  });

  test('should auto-play when both players select moves', async ({ page }) => {
    // Player 1 selects rock
    await page.getByText('✊').first().click({ force: true });

    // Player 2 selects scissors (second set of emojis)
    await page.getByText('✌️').nth(1).click({ force: true });

    // Move selector re-enables after countdown + result auto-reset
    await expect(page.getByText('Player 1 - Choose Your Move')).toBeVisible({
      timeout: 10000,
    });
  });
});
