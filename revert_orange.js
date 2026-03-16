const fs = require('fs');
const path = require('path');

const replacements = {
  'bg-[#FF6B00]': 'bg-[#F5F2EB]',
  'text-white bg-[#FF6B00]': 'text-[#050505] bg-[#F5F2EB]',
  'text-white hover:bg-white bg-[#FF6B00]': 'text-[#050505] hover:bg-white bg-[#F5F2EB]',
  'text-white': 'text-[#050505]', // CAREFUL: only want to revert text-white where it replaced text-[#050505] inside buttons.
};

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
      if (content.includes('text-white bg-[#FF6B00]')) {
         content = content.replace(/text-white bg-\[#FF6B00\]/g, 'text-[#050505] bg-[#F5F2EB]');
         changed = true;
      }
      if (content.includes('text-white hover:bg-white bg-[#FF6B00]')) {
         content = content.replace(/text-white hover:bg-white bg-\[#FF6B00\]/g, 'text-[#050505] hover:bg-white bg-[#F5F2EB]');
         changed = true;
      }
      if (content.includes('bg-[#FF6B00]')) {
         content = content.replace(/bg-\[#FF6B00\]/g, 'bg-[#F5F2EB]');
         changed = true;
      }
      
      // Look for the "text-white" that was originally "text-[#050505]" or "text-[#1A1A1A]"
      // Wait, let's just use grep inside node to replace bg-[#FF6B00] first to F5F2EB
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Reverted orange in ${fullPath}`);
      }
    }
  }
}

processDir('app/(portal)');
