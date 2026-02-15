import { test, expect } from '@playwright/test';

test.describe('Local Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/play/local');
  });

  test('should display the local game page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Local Game');
    await expect(page.locator('text=Two players on the same device')).toBeVisible();
  });

  test('should display all five moves for both players', async ({ page }) => {
    const moves = ['Rock', 'Paper', 'Scissors', 'Lizard', 'Spock'];

    for (const move of moves) {
      const moveElements = page.getByText(move, { exact: true });
      const count = await moveElements.count();
      expect(count).toBe(2);
    }
  });

  test('should play a complete game', async ({ page }) => {
    await page.getByText('Rock').first().click();
    await page.getByText('Scissors').nth(1).click();

    await page.getByRole('button', { name: 'Play!' }).click();

    await expect(page.locator('text=Rock crushes scissors')).toBeVisible();
    await expect(page.locator('text=Player 1 Wins!')).toBeVisible();
  });

  test('should handle a draw', async ({ page }) => {
    await page.getByText('Rock').first().click();
    await page.getByText('Rock').nth(1).click();

    await page.getByRole('button', { name: 'Play!' }).click();

    await expect(page.locator("text=It's a Draw!")).toBeVisible();
  });

  test('should track scores across multiple rounds', async ({ page }) => {
    await page.getByText('Rock').first().click();
    await page.getByText('Scissors').nth(1).click();
    await page.getByRole('button', { name: 'Play!' }).click();

    await expect(page.locator('text=1').first()).toBeVisible();

    await page.getByRole('button', { name: 'Play Again' }).click();

    await page.getByText('Paper').first().click();
    await page.getByText('Rock').nth(1).click();
    await page.getByRole('button', { name: 'Play!' }).click();

    const player1Scores = page.locator('text=2').first();
    await expect(player1Scores).toBeVisible();
  });

  test('should reset game with New Game button', async ({ page }) => {
    await page.getByText('Rock').first().click();
    await page.getByText('Scissors').nth(1).click();
    await page.getByRole('button', { name: 'Play!' }).click();

    await page.getByRole('button', { name: 'New Game' }).click();

    const scoreElements = page.locator('text=0');
    const count = await scoreElements.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('should disable Play button when moves not selected', async ({ page }) => {
    const playButton = page.getByRole('button', { name: 'Play!' });
    await expect(playButton).toBeDisabled();

    await page.getByText('Rock').first().click();
    await expect(playButton).toBeDisabled();

    await page.getByText('Scissors').nth(1).click();
    await expect(playButton).toBeEnabled();
  });
});
