const puppeteer = require('puppeteer');
const sharp = require('sharp');

module.exports = async function (context, req) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 800 });
    await page.goto(process.env.SCREENSHOT_URL || 'https://darksky.net/details/40.7127,-74.0059/2021-1-6/us12/en');
    await page.screenshot({
      path: '/tmp/screenshot.png',
    });
    const screenshotBuffer = 
        await page.screenshot({ fullPage: true });

    await browser.close();
    
    const manipulatedBuffer = 
        await sharp(screenshotBuffer)
          .grayscale()
          .toColourspace('grey16')


    // await convert('/tmp/screenshot.png');
    // screenshot = fs.readFileSync('/tmp/screenshot.png');

    context.res = {
      body: manipulatedBuffer,
      headers: {
        'Content-Type': 'image/png'
      }
    };
  }



// function convert(filename) {
//   return new Promise((resolve, reject) => {
//     const args = [filename, '-gravity', 'center', '-extent', '600x800', '-colorspace', 'gray', '-depth', '8', filename];
//     execFile('convert', args, (error, stdout, stderr) => {
//       if (error) {
//         console.error({ error, stdout, stderr });
//         reject();
//       } else {
//         resolve();
//       }
//     });
//   });
// }
