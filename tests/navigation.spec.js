import { test, expect } from '@playwright/test';
import {
  mockApiRoutes,
  waitForLoader,
  navigateToCard,
  SCROLL_SETTLE_MS,
  MOBILE_BREAKPOINT,
} from './helpers.js';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto('/');
  });

  test('page loads with correct title and first card visible', async ({ page }) => {
    await expect(page).toHaveTitle(/Jared Goldman/);
    await expect(page.locator('#card-welcome')).toBeVisible();
  });

  test('pill indicator is visible on page load', async ({ page }) => {
    const viewportWidth = page.viewportSize()?.width ?? 1280;
    if (viewportWidth <= MOBILE_BREAKPOINT) {
      // Hidden on small viewports via CSS media query
      await expect(page.locator('#pill-indicator')).toBeHidden();
    } else {
      await expect(page.locator('#pill-indicator')).toBeVisible();
    }
  });

  test('navigate forward via next chevron shows bio card', async ({ page }) => {
    await waitForLoader(page);
    // The chevron has a pulsing animation — use force to bypass stability check
    await page.locator('#next-chev').waitFor({ state: 'visible' });
    await page.locator('#next-chev').click({ force: true });

    await expect(page).toHaveURL(/bio/, { timeout: 5000 });
  });

  test('navigate backward via prev chevron returns to welcome', async ({ page }) => {
    await waitForLoader(page);
    await page.locator('#next-chev').waitFor({ state: 'visible' });
    await page.locator('#next-chev').click({ force: true });
    await expect(page).toHaveURL(/bio/, { timeout: 5000 });

    // Wait for scroll + IntersectionObserver to clear focused class from card-welcome
    await page.waitForTimeout(SCROLL_SETTLE_MS);

    await page.locator('#prev-chev').waitFor({ state: 'visible' });
    await page.locator('#prev-chev').click({ force: true });

    await expect(page).toHaveURL(/welcome/, { timeout: 5000 });
  });

  test('keyboard ArrowRight moves to next card', async ({ page }) => {
    await waitForLoader(page);
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(/bio/, { timeout: 5000 });
  });

  test('keyboard ArrowLeft moves back to previous card', async ({ page }) => {
    await waitForLoader(page);
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(/bio/, { timeout: 5000 });

    // Wait for scroll + IntersectionObserver to update card focus state
    await page.waitForTimeout(SCROLL_SETTLE_MS);

    await page.keyboard.press('ArrowLeft');
    await expect(page).toHaveURL(/welcome/, { timeout: 5000 });
  });

  test('URL updates after navigating to bio card', async ({ page }) => {
    await waitForLoader(page);
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(/bio/, { timeout: 5000 });
  });

  test('prev chevron is hidden on first card', async ({ page }) => {
    await waitForLoader(page);
    await expect(page.locator('#prev-chev')).not.toHaveClass(/visible/);
  });

  test('next chevron is hidden on last card', async ({ page }) => {
    await waitForLoader(page);
    await navigateToCard(page, 3); // welcome -> bio -> projects -> contact
    await expect(page.locator('#next-chev')).not.toHaveClass(/visible/);
  });

  test('dark/light mode toggle changes CSS variables on document', async ({ page }) => {
    await waitForLoader(page);

    const getCssVar = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--primary-background-color')
        .trim();

    const before = await page.evaluate(getCssVar);

    // The checkbox input is styled to opacity:0 — click the visible label instead
    await page.locator('label.switch').click();

    const after = await page.evaluate(getCssVar);
    expect(before).not.toBe(after);
  });
});
