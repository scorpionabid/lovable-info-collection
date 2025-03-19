
// tests/e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

describe('Dashboard Page', () => {
  beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'superadmin@edu.az');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button:has-text("Giriş")');
    
    // Wait for login to complete and redirect to dashboard
    await page.waitForURL('**/dashboard');
  });

  test('should display correct dashboard components for super admin', async ({ page }) => {
    // Check main dashboard elements
    await expect(page.locator('.dashboard-title')).toContainText('İdarəetmə Paneli');
    await expect(page.locator('.stat-cards')).toBeVisible();
    await expect(page.locator('.chart-container')).toBeVisible();
    
    // Check for specific stats that should be visible to super admin
    await expect(page.locator('.stat-card[data-id="total-schools"]')).toBeVisible();
    await expect(page.locator('.stat-card[data-id="total-categories"]')).toBeVisible();
    await expect(page.locator('.stat-card[data-id="total-users"]')).toBeVisible();
    
    // Check for admin-specific actions
    await expect(page.locator('button:has-text("Hesabat Yarat")')).toBeVisible();
  });

  test('should display correct statistics data', async ({ page }) => {
    // Check that the stat cards contain numerical data
    const totalSchools = await page.locator('.stat-card[data-id="total-schools"] .stat-value').textContent();
    expect(parseInt(totalSchools || '0')).toBeGreaterThan(0);
    
    // Verify that charts have loaded
    await expect(page.locator('.chart-container svg')).toBeVisible();
    
    // Check for data completion rate card
    await expect(page.locator('.stat-card[data-id="completion-rate"]')).toBeVisible();
    const completionRate = await page.locator('.stat-card[data-id="completion-rate"] .stat-value').textContent();
    expect(completionRate).toMatch(/\d+%/);
  });

  test('should navigate to different sections from dashboard', async ({ page }) => {
    // Click on a regions card/link and check navigation
    await page.click('a:has-text("Regionlar")');
    await expect(page).toHaveURL(/.*\/regions/);
    
    // Go back to dashboard
    await page.goto('/dashboard');
    
    // Click on schools link
    await page.click('a:has-text("Məktəblər")');
    await expect(page).toHaveURL(/.*\/schools/);
    
    // Go back to dashboard
    await page.goto('/dashboard');
    
    // Click on categories link
    await page.click('a:has-text("Kateqoriyalar")');
    await expect(page).toHaveURL(/.*\/categories/);
  });

  test('should display correct data based on selected filters', async ({ page }) => {
    // Check if filter controls exist
    await expect(page.locator('.dashboard-filters')).toBeVisible();
    
    // Select a region from the filter dropdown
    await page.selectOption('select[name="region"]', { label: 'Bakı' });
    
    // Check that the data updates accordingly
    await page.waitForResponse(response => 
      response.url().includes('/api/dashboard') && response.status() === 200
    );
    
    // Verify filtered content is shown (this would depend on your specific UI)
    await expect(page.locator('.filter-applied-indicator')).toBeVisible();
    
    // Reset filters
    await page.click('button:has-text("Filtrləri Sıfırla")');
    
    // Verify data is reset
    await page.waitForResponse(response => 
      response.url().includes('/api/dashboard') && response.status() === 200
    );
  });
});
