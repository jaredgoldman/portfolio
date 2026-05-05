import { expect } from '@playwright/test';

/**
 * Duration to wait after a card scroll before the IntersectionObserver
 * and chevron state settle. Slightly longer than CARD_TRANSITION_DURATION (350ms).
 */
export const SCROLL_SETTLE_MS = 600;

/**
 * CSS media-query breakpoint below which the pill indicator is hidden.
 * Must match the value in styles/shared.scss.
 */
export const MOBILE_BREAKPOINT = 600;

/**
 * Register mock API routes so the app can initialize without a real backend.
 * Must be called before page.goto().
 */
export async function mockApiRoutes(page) {
  await page.route('**/api/portfolio-bio**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: { id: 1, attributes: { text: '<p>Test bio text.</p>' } },
      }),
    })
  );

  await page.route('**/api/recommendations**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [] }),
    })
  );

  await page.route('**/api/projects**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [
          {
            id: 1,
            attributes: {
              title: 'Test Project',
              description: '<p>A test project for E2E testing.</p>',
              date: '2024-01-01',
              deployed: 'https://example.com',
              github: 'https://github.com/example/test',
              image: { data: null },
            },
          },
        ],
      }),
    })
  );
}

/**
 * Wait for the loader overlay to finish fading out.
 * The app's JS keeps the loader visible until resources load, then fades it
 * out over 1.25s. Interaction is safe once opacity drops to near zero.
 */
export async function waitForLoader(page) {
  await page.waitForFunction(
    () => {
      const loader = document.querySelector('.loader-overlay');
      if (!loader) return true;
      return parseFloat(window.getComputedStyle(loader).opacity) < 0.05;
    },
    { timeout: 8000 }
  );
}

/**
 * Navigate forward by pressing ArrowRight `steps` times, waiting for each
 * card URL to register before proceeding to the next press.
 *
 * Card order: welcome(0) -> bio(1) -> projects(2) -> contact(3)
 */
const CARD_NAMES = ['welcome', 'bio', 'projects', 'contact'];

export async function navigateToCard(page, steps) {
  for (let i = 0; i < steps; i++) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(SCROLL_SETTLE_MS);
  }
  await expect(page).toHaveURL(new RegExp(CARD_NAMES[steps]), { timeout: 5000 });
}
