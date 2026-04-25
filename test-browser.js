const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('response', response => {
    if (!response.ok()) {
      console.log('Failed request:', response.url(), response.status());
    }
  });
  
  page.on('pageerror', error => {
    console.log('Page error:', error.message);
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('Console error:', msg.text());
  });

  await page.goto('http://localhost:5173/login');
  await page.fill('input[type="email"]', 'admin@example.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(2000);
  await page.goto('http://localhost:5173/resources');
  await page.waitForTimeout(3000);
  
  console.log('Done checking.');
  await browser.close();
})();
