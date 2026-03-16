const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let changed = false;
      // Revert specific combinations first
      if (content.includes('text-white bg-[#F5F2EB]')) {
         content = content.replace(/text-white bg-\[#F5F2EB\]/g, 'text-[#050505] bg-[#F5F2EB]');
         changed = true;
      }
      if (content.includes('text-[#FFFFFF] bg-[#F5F2EB]')) {
         content = content.replace(/text-\[#FFFFFF\] bg-\[#F5F2EB\]/g, 'text-[#1A1A1A] bg-[#F5F2EB]');
         changed = true;
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Reverted text inside button in ${fullPath}`);
      }
    }
  }
}

processDir('app/(portal)');
