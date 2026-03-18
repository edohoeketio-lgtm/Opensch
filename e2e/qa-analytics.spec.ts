import { test, expect } from '@playwright/test';

test('Analytics Dashboard Validation', async ({ page }) => {
  await page.goto('http://localhost:3000/admin/analytics');
  
  // Wait for the h1 to confirm page load
  await expect(page.getByRole('heading', { name: 'Analytics & Intelligence' })).toBeVisible();

  // Take full page screenshot
  await page.screenshot({ path: '/home/sk/.gemini/antigravity/brain/a89d8a71-be60-4d12-b937-58928c7c12fe/admin_analytics_qa_final_1773794400262.png', fullPage: true });
});
