import { test, expect } from '@playwright/test';

test.describe('User Flow', () => {
  test('should allow user to search for an event and view details', async ({ page }) => {
  
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Nadchodzące Wydarzenia/i })).toBeVisible();

    const searchInput = page.getByPlaceholder('Szukaj wydarzeń (np. artysta, miasto...)');
    await searchInput.fill("Open'er");
    
    await searchInput.press('Enter');

    await expect(page).toHaveURL(/\?search=Open%27er/);

    const eventCard = page.getByText("Open'er Festival", { exact: false }).first();
    await expect(eventCard).toBeVisible();

    await eventCard.click();

    await expect(page).toHaveURL(/\/events\/.+/);

    await expect(page.getByRole('heading', { name: "Open'er Festival", level: 1 })).toBeVisible();

    await expect(page.getByText('Ekipy na to wydarzenie')).toBeVisible();
  });
});