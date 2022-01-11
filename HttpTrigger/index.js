const puppeteer = require('puppeteer');
const execFile = require('child_process').execFile;
const fs = require('fs');

module.exports = async function (context, req) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 800 });
    await page.goto(process.env.SCREENSHOT_URL || 'https://darksky.net/details/40.7127,-74.0059/2021-1-6/us12/en');
    await page.screenshot({
      path: 'd:\\local\\screenshot.png',
    });

    await browser.close();

    await convert('d:\\local\\screenshot.png');
    screenshot = fs.readFileSync('d:\\local\\screenshot.png');

    context.res.writeHead(200, {
     'Content-Type': 'image/png',
     'Content-Length': screenshot.length,
    });
    return context.res.end(screenshot);
  }



function convert(filename) {
  return new Promise((resolve, reject) => {
    const args = [filename, '-gravity', 'center', '-extent', '600x800', '-colorspace', 'gray', '-depth', '8', filename];
    execFile('convert', args, (error, stdout, stderr) => {
      if (error) {
        console.error({ error, stdout, stderr });
        reject();
      } else {
        resolve();
      }
    });
  });
}
