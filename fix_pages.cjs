const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('page.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const dirs = ['src/app/admin', 'src/app/dashboard', 'src/app/employee'];
let files = [];
dirs.forEach(d => {
  files = files.concat(walk(d));
});

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('"use client"') || content.includes("'use client'")) {
    console.log('Skipping client component: ' + f);
    return;
  }
  if (!content.includes('export const dynamic')) {
    // Insert after the last import statement, or at the top
    let newContent = content;
    const importRegex = /^import\s+.*?;\s*$/gm;
    let match;
    let lastImportIndex = 0;
    while ((match = importRegex.exec(content)) !== null) {
      lastImportIndex = match.index + match[0].length;
    }
    
    if (lastImportIndex > 0) {
      newContent = content.slice(0, lastImportIndex) + "\n\nexport const dynamic = 'force-dynamic';\n" + content.slice(lastImportIndex);
    } else {
      newContent = "export const dynamic = 'force-dynamic';\n\n" + content;
    }
    
    fs.writeFileSync(f, newContent);
    console.log('Fixed ' + f);
  }
});
