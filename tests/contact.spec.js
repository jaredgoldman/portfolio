import { test, expect } from '@playwright/test';
import { mockApiRoutes, waitForLoader, navigateToCard } from './helpers.js';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto('/');
  });

  test('navigate to contact card via keyboard', async ({ page }) => {
    await waitForLoader(page);
    await navigateToCard(page, 3); // welcome -> bio -> projects -> contact
  });

  test('contact form is visible on contact card', async ({ page }) => {
    await waitForLoader(page);
    await navigateToCard(page, 3);
    await expect(page.locator('#contact')).toBeVisible();
  });

  test('submitting empty form does not navigate away (HTML5 required validation)', async ({ page }) => {
    await waitForLoader(page);
    await navigateToCard(page, 3);

    const urlBefore = page.url();

    // Browser's required validation should block submission when fields are empty
    await page.locator('.form-submit').click();

    await page.waitForTimeout(300);

    expect(page.url()).toBe(urlBefore);
    await expect(page.locator('#contact')).toBeVisible();
  });
});
