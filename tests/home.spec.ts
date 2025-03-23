import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the header with search functionality', async ({ page }) => {
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('link', { name: 'WeTube Home' })).toBeVisible();
    await expect(page.getByRole('searchbox', { name: 'Search for videos' })).toBeVisible();
  });

  test('should display movie cards', async ({ page }) => {
    await expect(page.getByRole('article')).toHaveCount(12);
  });

  test('should navigate to movie details when clicking a movie card', async ({ page }) => {
    const firstMovie = page.getByRole('article').first();
    const movieTitle = await firstMovie.getByRole('heading').textContent();
    await firstMovie.click();
    await expect(page).toHaveURL(new RegExp(`/movie/${encodeURIComponent(movieTitle || '')}`));
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.keyboard.press('Tab');
    const textLink = page.getByText('WeTube', { exact: true });
    await expect(textLink).toBeVisible();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('searchbox')).toBeFocused();
  });
});