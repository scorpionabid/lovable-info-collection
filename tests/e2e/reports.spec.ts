
// tests/e2e/reports.spec.ts
import { test, expect } from '@playwright/test';

describe('Reports Page', () => {
  beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'superadmin@edu.az');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button:has-text("Giriş")');
    
    // Navigate to reports page
    await page.waitForURL('**/dashboard');
    await page.click('a:has-text("Hesabatlar")');
    await page.waitForURL('**/reports');
  });

  test('should display available report types', async ({ page }) => {
    // Check for main report page components
    await expect(page.locator('h1:has-text("Hesabatlar")')).toBeVisible();
    
    // Check for different report type cards
    await expect(page.locator('.report-card:has-text("Tamamlanma Statistikası")')).toBeVisible();
    await expect(page.locator('.report-card:has-text("Performans Analizi")')).toBeVisible();
    await expect(page.locator('.report-card:has-text("Müqayisəli Trend")')).toBeVisible();
    await expect(page.locator('.report-card:has-text("Xüsusi Hesabat")')).toBeVisible();
  });

  test('should generate completion statistics report', async ({ page }) => {
    // Click on completion statistics report
    await page.click('.report-card:has-text("Tamamlanma Statistikası")');
    
    // Wait for report config panel
    await expect(page.locator('.report-config-panel')).toBeVisible();
    
    // Configure the report
    await page.selectOption('select[name="region"]', { label: 'Bakı' });
    await page.click('input[type="checkbox"][name="include-inactive"]');
    
    // Generate the report
    await page.click('button:has-text("Hesabat Yarat")');
    
    // Wait for report to be generated
    await page.waitForSelector('.report-results', { state: 'visible' });
    
    // Verify that report content is displayed
    await expect(page.locator('.report-table')).toBeVisible();
    await expect(page.locator('.report-chart')).toBeVisible();
    
    // Check export options
    await expect(page.locator('button:has-text("Excel")')).toBeVisible();
    await expect(page.locator('button:has-text("PDF")')).toBeVisible();
  });

  test('should generate custom report', async ({ page }) => {
    // Click on custom report
    await page.click('.report-card:has-text("Xüsusi Hesabat")');
    
    // Wait for custom report builder
    await expect(page.locator('.custom-report-builder')).toBeVisible();
    
    // Configure custom report
    await page.selectOption('select[name="base-entity"]', { label: 'Məktəblər' });
    
    // Add fields to report
    await page.click('button:has-text("Sahə əlavə et")');
    await page.click('.field-selection-menu .field-item:has-text("Ad")');
    
    await page.click('button:has-text("Sahə əlavə et")');
    await page.click('.field-selection-menu .field-item:has-text("Region")');
    
    // Add filter
    await page.click('button:has-text("Filtr əlavə et")');
    await page.click('.filter-dialog .field-item:has-text("Region")');
    await page.selectOption('.filter-dialog select[name="operator"]', { label: 'bərabərdir' });
    await page.selectOption('.filter-dialog select[name="value"]', { label: 'Bakı' });
    await page.click('.filter-dialog button:has-text("Əlavə et")');
    
    // Generate report
    await page.click('button:has-text("Hesabat Yarat")');
    
    // Wait for report to be generated
    await page.waitForSelector('.report-results', { state: 'visible' });
    
    // Verify that report content is displayed
    await expect(page.locator('.report-table')).toBeVisible();
    
    // Save report
    await page.click('button:has-text("Hesabatı Saxla")');
    await page.fill('input[name="report-name"]', 'Test Custom Report');
    await page.click('.save-dialog button:has-text("Saxla")');
    
    // Verify success message
    await expect(page.locator('.toast-success')).toBeVisible();
  });

  test('should be able to export reports', async ({ page }) => {
    // Click on performance analysis report
    await page.click('.report-card:has-text("Performans Analizi")');
    
    // Generate a simple report
    await page.click('button:has-text("Hesabat Yarat")');
    
    // Wait for report to be generated
    await page.waitForSelector('.report-results', { state: 'visible' });
    
    // Set up download listener
    const downloadPromise = page.waitForEvent('download');
    
    // Click export to Excel
    await page.click('button:has-text("Excel")');
    
    // Wait for download to start
    const download = await downloadPromise;
    
    // Verify download started
    expect(download.suggestedFilename()).toContain('.xlsx');
  });

  test('should show saved reports', async ({ page }) => {
    // Go to saved reports tab
    await page.click('button:has-text("Saxlanmış Hesabatlar")');
    
    // Check if saved reports are displayed
    await expect(page.locator('.saved-reports-list')).toBeVisible();
    
    // If there are saved reports, check functionality
    const hasSavedReports = await page.locator('.saved-report-item').count() > 0;
    
    if (hasSavedReports) {
      // Click on first saved report
      await page.click('.saved-report-item >> nth=0');
      
      // Check that report loads
      await page.waitForSelector('.report-results', { state: 'visible' });
      
      // Verify report content
      await expect(page.locator('.report-table')).toBeVisible();
    } else {
      // Check for empty state message
      await expect(page.locator('.empty-reports-message')).toBeVisible();
    }
  });
});
