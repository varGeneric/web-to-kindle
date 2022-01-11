const puppeteer = require('puppeteer');
const sharp = require('sharp');

module.exports = async function (context, req) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 800 });
    await page.goto(process.env.SCREENSHOT_URL || 'https://darksky.net/details/40.7127,-74.0059/2021-1-6/ca12/en');
    const screenshotBuffer = 
        await page.screenshot( /* { fullPage: true } */);

    await browser.close();
    
    const manipulatedBuffer = 
        await sharp(screenshotBuffer)
          .grayscale()
          .png({ palette: true })
          .toBuffer();

    context.res = {
      body: manipulatedBuffer,
      headers: {
        'Content-Type': 'image/png'
      }
    };
  }
