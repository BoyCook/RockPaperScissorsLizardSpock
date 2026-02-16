import { test, expect } from '@playwright/test';

test.describe('Computer Game Route', () => {
  test('should redirect /play/computer to homepage', async ({ page }) => {
    await page.goto('/play/computer');

    await expect(page).toHaveURL('/');
    await expect(page.getByText('Choose Your Move')).toBeVisible();
  });
});
