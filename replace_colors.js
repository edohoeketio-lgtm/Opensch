const fs = require('fs');
const path = require('path');

const replacements = {
  'bg-[#0B0B0C]': 'bg-[#111111]',
  'bg-[#121214]': 'bg-[#1C1C1E]',
  'bg-[#1A1A1A]': 'bg-[#1C1C1E]',
  'bg-[#181B20]': 'bg-[#1C1C1E]',
  'text-[#F5F2EB]': 'text-[#FFFFFF]',
  'text-[#F3EFE8]': 'text-[#FFFFFF]',
  'text-[#A7A29A]': 'text-[#9CA3AF]',
  'text-[#7E7A72]': 'text-[#888888]',
  'text-[#7F7A73]': 'text-[#888888]',
  'text-[#5F5A52]': 'text-[#525252]',
  'border-white/5': 'border-[#2D2D2D]',
  'border-white/[0.08]': 'border-[#2D2D2D]',
  'border-white/[0.06]': 'border-[#2D2D2D]',
  'bg-[#F5F2EB]': 'bg-[#FF6B00]',
  'bg-[#F3EFE8]': 'bg-[#FF6B00]',
  'text-[#050505]': 'text-white',
  'text-[#1A1A1A]': 'text-white',
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
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir('app/(portal)');
