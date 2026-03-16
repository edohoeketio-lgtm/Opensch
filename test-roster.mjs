import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/admin/roster');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'roster-test.png' });
  
  const h1 = await page.$eval('h1', el => el.textContent).catch(() => 'No H1');
  console.log('H1 found on page:', h1);
  
  await browser.close();
})();
