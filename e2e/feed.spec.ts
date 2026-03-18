import { test, expect } from '@playwright/test';

test.describe('Campus Feed', () => {
  test('should load the feed page successfully', async ({ page }) => {
    await page.goto('/feed');
    
    // The feed has tabs like "All Activity", "Questions", etc.
    await expect(page.getByText('All Activity').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Questions' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Deliverables' })).toBeVisible();
    
    // Check for the presence of the composer trigger
    await expect(page.locator('text=What\'s on your mind?').first()).toBeVisible();
  });

  test('should be able to open the composer', async ({ page }) => {
    await page.goto('/feed');
    
    // Click the composer trigger to expand the text area
    await page.locator('text=What\'s on your mind?').first().click();
    
    // Ensure the textarea is visible
    const textarea = page.locator('textarea[placeholder="What\'s on your mind?"]');
    await expect(textarea).toBeVisible();

    // Verify draft and buttons are present
    await expect(page.getByText('Drafts').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Post' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  });

  test('should change active tab successfully', async ({ page }) => {
    await page.goto('/feed');
    
    // Click on Questions tab
    await page.getByRole('button', { name: 'Questions' }).click();
    
    // The UI should still be stable
    await expect(page.locator('text=What\'s on your mind?').first()).toBeVisible();
  });
});
