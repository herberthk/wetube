import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test('should search for movies and display results', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByRole('searchbox', { name: 'Search for videos' });
    await searchInput.fill('Action');
    await searchInput.press('Enter');

    // Wait for navigation
    await expect(page).toHaveURL(/\/search\/Action/);
    
    // Check if results are displayed
    await expect(page.getByRole('article')).toHaveCount(12);
  });

  test('should show no results message when search has no matches', async ({ page }) => {
    await page.goto('/search/nonexistentmoviexxxyyy');
    const notFoundSection = page.getByRole('main', { name: 'Movie not found' });
    const heading = notFoundSection.getByRole('heading', { name: 'Movie not found' });
    await expect(heading).toBeVisible();
  });

  test('should maintain search term in URL after refresh', async ({ page }) => {
    const searchTerm = 'Drama';
    await page.goto(`/search/${searchTerm}`);
    await page.reload();
    
    await expect(page).toHaveURL(`/search/${searchTerm}`);
  });
});