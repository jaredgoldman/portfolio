import { test, expect } from '@playwright/test';
import { mockApiRoutes, waitForLoader, navigateToCard } from './helpers.js';

test.describe('Project Modal', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto('/');
    await waitForLoader(page);
    await navigateToCard(page, 2); // welcome -> bio -> projects
  });

  test('modal opens when clicking a project title', async ({ page }) => {
    const heading = page.locator('.project-title_heading').first();
    await heading.waitFor({ state: 'visible', timeout: 5000 });
    await heading.click();

    await expect(page.locator('#project-modal')).toBeVisible({ timeout: 3000 });
  });

  test('modal closes when clicking the close button', async ({ page }) => {
    const heading = page.locator('.project-title_heading').first();
    await heading.waitFor({ state: 'visible', timeout: 5000 });
    await heading.click();

    await expect(page.locator('#project-modal')).toBeVisible({ timeout: 3000 });
    await page.locator('#modal-close').click();
    await expect(page.locator('#project-modal')).not.toBeVisible({ timeout: 2000 });
  });

  test('modal has a non-empty title when open', async ({ page }) => {
    const heading = page.locator('.project-title_heading').first();
    await heading.waitFor({ state: 'visible', timeout: 5000 });
    await heading.click();

    await expect(page.locator('#project-modal')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('.modal-title')).not.toBeEmpty();
  });
});
