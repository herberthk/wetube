import { test, expect } from '@playwright/test';
// import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('should handle keyboard navigation throughout the application', async ({ page }) => {
    await page.goto('/');
    
    // Test skip link
    await page.keyboard.press('Tab');
    await expect(page.getByText('Skip to main content')).toBeFocused();
    
    // Test main navigation
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'WeTube Home' })).toBeFocused();
    
    // Test search input
    await page.keyboard.press('Tab');
    await expect(page.getByRole('searchbox')).toBeFocused();
  });
});