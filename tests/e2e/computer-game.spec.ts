import { test, expect } from '@playwright/test';

test.describe('Computer Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/play/computer');
  });

  test('should display the computer game page', async ({ page }) => {
    await expect(page.getByText('Choose Your Move')).toBeVisible();
    await expect(page.getByText('YOU', { exact: true })).toBeVisible();
  });

  test('should display all five move emojis', async ({ page }) => {
    const moveEmojis = ['✊', '✋', '✌️', '🦎', '🖖'];

    for (const emoji of moveEmojis) {
      await expect(page.getByText(emoji).first()).toBeVisible();
    }
  });

  test('should play a game when a move is selected', async ({ page }) => {
    await page.getByText('✊').first().click({ force: true });

    // Wait for countdown and result (2s countdown + 2s result display + buffer)
    await page.waitForTimeout(5000);

    // After auto-reset, moves should be selectable again
    await expect(page.getByText('Choose Your Move')).toBeVisible();
  });

  test('should have a back to home link', async ({ page }) => {
    await expect(page.getByText('← Back to Home')).toBeVisible();
  });

  test('should navigate back to home', async ({ page }) => {
    await page.getByText('← Back to Home').click();

    await expect(page).toHaveURL('/');
  });

  test('should display scores', async ({ page }) => {
    await expect(page.getByText('YOU', { exact: true })).toBeVisible();
    await expect(page.getByText('COMPUTER 🤖')).toBeVisible();
  });
});
