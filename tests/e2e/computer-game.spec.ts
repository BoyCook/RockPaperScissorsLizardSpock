import { test, expect } from '@playwright/test';

test.describe('Computer Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/play/computer');
  });

  test('should display the computer game page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('vs Computer');
    await expect(page.locator('text=Test your luck against the AI')).toBeVisible();
  });

  test('should display all five moves', async ({ page }) => {
    const moves = ['Rock', 'Paper', 'Scissors', 'Lizard', 'Spock'];

    for (const move of moves) {
      await expect(page.getByText(move, { exact: true })).toBeVisible();
    }
  });

  test('should play a game against computer', async ({ page }) => {
    await page.getByText('Rock').click();

    await page.getByRole('button', { name: 'Play!' }).click();

    await expect(page.locator('text=Computer chose:')).toBeVisible();

    const resultVisible = await Promise.race([
      page.locator('text=You Wins!').isVisible().catch(() => false),
      page.locator('text=Computer Wins!').isVisible().catch(() => false),
      page.locator("text=It's a Draw!").isVisible().catch(() => false),
    ]);

    expect(resultVisible).toBeTruthy();
  });

  test('should show computer move after playing', async ({ page }) => {
    await page.getByText('Paper').click();
    await page.getByRole('button', { name: 'Play!' }).click();

    await expect(page.locator('text=Computer chose:')).toBeVisible();

    const computerMoves = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
    const computerMoveText = await page.locator('text=Computer chose:').locator('..').textContent();

    const hasValidMove = computerMoves.some((move) =>
      computerMoveText?.toLowerCase().includes(move)
    );
    expect(hasValidMove).toBeTruthy();
  });

  test('should track scores', async ({ page }) => {
    await page.getByText('Rock').click();
    await page.getByRole('button', { name: 'Play!' }).click();

    await page.waitForTimeout(500);

    const scores = page.locator('text=/^[0-9]+$/');
    const count = await scores.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('should allow playing multiple rounds', async ({ page }) => {
    await page.getByText('Rock').click();
    await page.getByRole('button', { name: 'Play!' }).click();

    await page.getByRole('button', { name: 'Play Again' }).click();

    await expect(page.getByRole('button', { name: 'Play!' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Play!' })).toBeDisabled();
  });

  test('should disable Play button when no move selected', async ({ page }) => {
    const playButton = page.getByRole('button', { name: 'Play!' });
    await expect(playButton).toBeDisabled();

    await page.getByText('Spock').click();
    await expect(playButton).toBeEnabled();
  });
});
