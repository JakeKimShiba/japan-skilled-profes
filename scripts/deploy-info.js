const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for console output
const BLUE = '\x1b[34m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

console.log(`${BLUE}==========================================${RESET}`);
console.log(`${BLUE}  Japan Visa Calculator Deployment Tool  ${RESET}`);
console.log(`${BLUE}==========================================${RESET}`);
console.log('');

// First, build the project
console.log(`${YELLOW}Building project...${RESET}`);
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log(`${GREEN}✓ Build completed successfully${RESET}`);
} catch (error) {
  console.error(`${RED}× Build failed!${RESET}`);
  process.exit(1);
}

// Check if dist directory exists
const distPath = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distPath)) {
  console.error(`${RED}× Dist directory not found!${RESET}`);
  process.exit(1);
}

// Get directory size
let totalSize = 0;
let fileCount = 0;

function calculateSize(directoryPath) {
  const files = fs.readdirSync(directoryPath);
  
  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      calculateSize(filePath);
    } else {
      totalSize += stats.size;
      fileCount++;
    }
  }
}

calculateSize(distPath);

// Convert bytes to human-readable format
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

console.log('');
console.log(`${YELLOW}Build Information:${RESET}`);
console.log(`- Total size: ${GREEN}${formatBytes(totalSize)}${RESET}`);
console.log(`- File count: ${GREEN}${fileCount}${RESET}`);
console.log(`- Build location: ${GREEN}${distPath}${RESET}`);
console.log('');

console.log(`${YELLOW}Deployment Options:${RESET}`);
console.log(`1. GitHub Pages: ${GREEN}npm run deploy:github${RESET}`);
console.log(`   (Requires: npm install --save-dev gh-pages)`);
console.log('');
console.log(`2. Netlify: ${GREEN}npm run deploy:netlify${RESET}`);
console.log(`   (Requires: npm install -g netlify-cli)`);
console.log('');
console.log(`3. Vercel: ${GREEN}npm install -g vercel && vercel --prod${RESET}`);
console.log('');
console.log(`4. Manual Deployment: Upload the ${GREEN}dist${RESET} folder to your web host`);
console.log('');

console.log(`For detailed instructions, see: ${GREEN}src/deployment-guide.md${RESET}`);
console.log(`${BLUE}==========================================${RESET}`);