import { test, expect } from '@playwright/test';

test.describe('Movie Details Page', () => {
  const SAMPLE_MOVIE_TITLE = 'The Godfather'; // Replace with a movie title you know exists

  test.beforeEach(async ({ page }) => {
    await page.goto(`/movie/${encodeURIComponent(SAMPLE_MOVIE_TITLE)}`);
  });

  test('should display movie details', async ({ page }) => {
    const heading = page.getByRole('heading', { name: SAMPLE_MOVIE_TITLE, level: 1 });
    await expect(heading).toBeVisible();
    // Optionally verify the text content matches
    await expect(heading).toHaveText(SAMPLE_MOVIE_TITLE);
  });

  test('should display comments section', async ({ page }) => {
    await expect(page.getByRole('article', { name: 'Movie comments section' })).toBeVisible();
    await expect(page.getByPlaceholder('Add a comment...')).toBeVisible();
  });

  test('should add a new comment', async ({ page }) => {
    const commentText = 'This is a test comment';
    await page.getByPlaceholder('Add a comment...').fill(commentText);
    await page.getByRole('button', { name: 'Post Comment' }).click();
    
    // Wait for the comment to appear
    const commentBySelector = await page.locator('p.movie-comment').first();
    await expect(commentBySelector).toHaveText(commentText);
  });

  test('should display recommended movies', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Recommended Movies', level: 2 })).toBeVisible();
    const recommendedMovie = await page.locator('div.recommendation').first();
    await expect(recommendedMovie).toBeVisible();
  });
});