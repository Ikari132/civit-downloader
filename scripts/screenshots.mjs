import { chromium } from "playwright";
import path from "node:path";
const __dirname = path.resolve();

const screenshotsFolder = path.join(__dirname, 'screenshots');

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  const pathToExtension = path.join(__dirname, 'static');
  const userDataDir = '/tmp/test-user-data-dir';
  const browserContext = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`
    ]
  });

  let [background] = browserContext.serviceWorkers();
  if (!background)
    background = await browserContext.waitForEvent('serviceworker');
  const extensionId = background.url().split('/')[2];

  const page = await browserContext.newPage();

  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  const rect = await page.getByRole("main").boundingBox();
  await page.screenshot({ path: `${screenshotsFolder}/popup.png`, clip: { width: rect.width, height: rect.height, x: 0, y: 0 } });
  await page.emulateMedia({ colorScheme: "dark" });
  await delay(300);
  await page.screenshot({ path: `${screenshotsFolder}/popup-dark.png`, clip: { width: rect.width, height: rect.height, x: 0, y: 0 } });
  await page.emulateMedia({ colorScheme: "light" });
  await delay(300);

  await page.goto(`chrome-extension://${extensionId}/options.html`);
  await page.screenshot({ path: `${screenshotsFolder}/options.png` });
  await page.emulateMedia({ colorScheme: "dark" });
  await delay(300);
  await page.screenshot({ path: `${screenshotsFolder}/options-dark.png` });
  await page.emulateMedia({ colorScheme: "light" });
  await delay(300);

  const loraLink = "https://civitai.com/models/48139/lowra";
  await page.goto(loraLink);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.screenshot({ path: `${screenshotsFolder}/page.png`, clip: { width: 440, height: 300, x: 820, y: 160 } });

  await browserContext.close();
})();