
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test';

describe('Login Page', () => {
  beforeEach(async ({ page }) => {
    // Visit the login page before each test
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    // Check if form elements exist
    await expect(page.locator('text=InfoLine')).toBeVisible();
    await expect(page.locator('text=Məlumat İdarəetmə Sistemi')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Giriş")')).toBeVisible();
    await expect(page.locator('text=Şifrəni unutmusunuz?')).toBeVisible();
    await expect(page.locator('text=Demo giriş məlumatları:')).toBeVisible();
  });

  test('should show validation errors', async ({ page }) => {
    // Submit empty form
    await page.click('button:has-text("Giriş")');
    await expect(page.locator('text=Email düzgün formatda deyil')).toBeVisible();
    await expect(page.locator('text=Şifrə minimum 8 simvol olmalıdır')).toBeVisible();
    
    // Type invalid email
    await page.fill('input[name="email"]', 'invalid-email');
    await page.click('button:has-text("Giriş")');
    await expect(page.locator('text=Email düzgün formatda deyil')).toBeVisible();
    
    // Type valid email but short password
    await page.fill('input[name="email"]', 'valid@example.com');
    await page.fill('input[name="password"]', '123');
    await page.click('button:has-text("Giriş")');
    await expect(page.locator('text=Şifrə minimum 8 simvol olmalıdır')).toBeVisible();
  });

  test('should fill credentials from demo buttons', async ({ page }) => {
    // Click on super admin demo button
    await page.click('text=Super Admin:');
    await expect(page.locator('input[name="email"]')).toHaveValue('superadmin@edu.az');
    await expect(page.locator('input[name="password"]')).toHaveValue('Admin123!');
    
    // Click on another role button
    await page.click('text=Region Admin:');
    await expect(page.locator('input[name="email"]')).toHaveValue('region@infoline.az');
    await expect(page.locator('input[name="password"]')).toHaveValue('infoline123');
  });

  test('should login successfully with correct credentials', async ({ page }) => {
    // Mock successful login - depending on your test setup
    // Fill and submit login form
    await page.fill('input[name="email"]', 'superadmin@edu.az');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button:has-text("Giriş")');
    
    // Should be redirected to dashboard
    await page.waitForURL('**/dashboard');
  });

  test('should show error message on login failure', async ({ page }) => {
    // Fill with incorrect credentials
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button:has-text("Giriş")');
    
    // Should show error message
    await expect(page.locator('text=E-poçt və ya şifrə yanlışdır')).toBeVisible();
    // Should still be on login page
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should navigate to password reset page', async ({ page }) => {
    await page.click('text=Şifrəni unutmusunuz?');
    await expect(page).toHaveURL(/.*\/password-reset/);
  });
});
