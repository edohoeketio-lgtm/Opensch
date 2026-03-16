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
      
      const toReplace = [
         ['bg-[#F5F2EB] hover:bg-white text-white', 'bg-[#F5F2EB] hover:bg-white text-[#050505]'],
         ['bg-[#F5F2EB] text-white', 'bg-[#F5F2EB] text-[#050505]'],
         ['group-hover:bg-[#F5F2EB] group-hover:text-white', 'group-hover:bg-[#F5F2EB] group-hover:text-[#050505]']
      ];
      
      for (const [search, replace] of toReplace) {
         if (content.includes(search)) {
            content = content.split(search).join(replace);
            changed = true;
         }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Fixed button text in ${fullPath}`);
      }
    }
  }
}

processDir('app/(portal)');
