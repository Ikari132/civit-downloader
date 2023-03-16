import { test, expect } from "./fixtures";

test('popup page', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.locator('h1')).toHaveText('Popup');
});
test('options page', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/options.html`);
  await expect(page.locator('main')).toHaveText('Options');
});
