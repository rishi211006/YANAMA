const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const outDir = 'E:\\YANAMA\\screenshots';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();

  console.log('Navigating to landing...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(outDir, '01_landing_page.png') });

  console.log('Navigating to login...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(outDir, '02_login_page.png') });

  console.log('Clicking Owner Demo button...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const ownerBtn = buttons.find(b => b.textContent.includes('Owner Demo'));
    if (ownerBtn) ownerBtn.click();
  });

  await new Promise(r => setTimeout(r, 2500));

  console.log('Capturing Dashboard...');
  await page.screenshot({ path: path.join(outDir, '03_dashboard.png') });

  console.log('Capturing Statistical Engine...');
  await page.goto('http://localhost:3000/engine/statistics', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, '04_statistical_engine.png') });

  console.log('Capturing Trip Simulator...');
  await page.goto('http://localhost:3000/trip-simulator', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, '05_trip_simulation.png') });

  console.log('Capturing Mileage Analytics...');
  await page.goto('http://localhost:3000/mileage-analysis', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, '06_mileage_analytics.png') });

  console.log('Capturing Diagnostics...');
  await page.goto('http://localhost:3000/diagnostics', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, '07_diagnostics.png') });

  console.log('All screenshots captured successfully!');
  await browser.close();
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
