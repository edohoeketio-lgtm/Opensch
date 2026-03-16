const fs = require('fs');
const path = require('path');

const replacements = {
  'bg-[#17171A]': 'bg-[#1C1C1E]',
  'border-white/10': 'border-[#2D2D2D]',
  'border-white/20': 'border-[#2D2D2D]'
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
      for (const [search, replace] of Object.entries(replacements)) {
        if (content.includes(search)) {
          content = content.split(search).join(replace);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated 2: ${fullPath}`);
      }
    }
  }
}

processDir('app/(portal)');
