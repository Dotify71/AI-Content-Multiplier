const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function main() {
  // Ensure images directory exists
  const imagesDir = path.join(__dirname, 'public', 'images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // 1. Install playwright if not present
  try {
    require.resolve('playwright');
    console.log('Playwright is already installed.');
  } catch (e) {
    console.log('Installing playwright...');
    await runCmd('npm', ['install', 'playwright']);
  }

  // 2. Start Next.js server locally
  console.log('Starting Next.js server locally...');
  const server = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'pipe',
    shell: true
  });

  server.stdout.on('data', (data) => {
    console.log(`[Next.js]: ${data.toString().trim()}`);
  });

  server.stderr.on('data', (data) => {
    console.error(`[Next.js Error]: ${data.toString().trim()}`);
  });

  // Wait for server to start
  console.log('Waiting for local server to be ready on port 3000...');
  await new Promise((resolve) => setTimeout(resolve, 8000));

  const { chromium } = require('playwright');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  try {
    console.log('Navigating to login page...');
    await page.goto('http://localhost:3000/login');
    await page.waitForTimeout(2000);

    console.log('Filling login credentials...');
    await page.fill('#email-input', 'ilbfawhablfuieibau@gmail.com');
    await page.fill('#password-input', 'password123');
    
    console.log('Clicking login button...');
    await page.click('#password-login-btn');

    console.log('Waiting for redirection to dashboard...');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForTimeout(2000);

    console.log('Capturing dashboard screenshot...');
    await page.screenshot({ path: path.join(imagesDir, 'dashboard-shot.png'), fullPage: true });
    console.log('Dashboard screenshot saved.');

    console.log('Filling YouTube URL and voice sample...');
    await page.fill('input[placeholder="https://www.youtube.com/watch?v=..."]', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await page.fill('textarea[placeholder*="Paste a recent blog post"]', 'This is a sample writing voice. Friendly, informative, tech-focused, and concise.');

    console.log('Submitting generation form...');
    await page.click('button:has-text("Generate Content Pack")');

    console.log('Waiting for generation output...');
    // The generator transitions to loading skeleton, then displays the result
    // Let's wait for the "Blog Post" tab or text of result to show up
    await page.waitForSelector('text=Blog Post', { timeout: 60000 });
    await page.waitForTimeout(3000);

    console.log('Capturing output screenshot...');
    await page.screenshot({ path: path.join(imagesDir, 'output-shot.png'), fullPage: true });
    console.log('Output screenshot saved.');

  } catch (err) {
    console.error('An error occurred during automation:', err);
  } finally {
    await browser.close();
    console.log('Stopping Next.js server...');
    server.kill();
    process.exit(0);
  }
}

function runCmd(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: __dirname, stdio: 'inherit', shell: true });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with code ${code}`));
    });
  });
}

main();
