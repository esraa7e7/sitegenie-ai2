import fs from 'fs';
import path from 'path';

function walk(dir: string, callback: (file: string) => void) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walk(filepath, callback);
    } else if (stats.isFile() && filepath.endsWith('.ts')) {
      callback(filepath);
    }
  });
}

const srcDir = './packages/ai-server/src';

walk(srcDir, (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let changed = false;

  // Replace relative imports missing .js
  // Covers: from './path' or from '../path'
  // Excludes: from 'package' or from './path.js'
  content = content.replace(/from\s+(['"])(\.\.?\/[^'"]+)\1/g, (match, quote, p) => {
    const filename = p.split('/').pop() || '';
    // If it doesn't end with .js but has no extension or has .service/something similar
    if (!p.endsWith('.js') && !p.endsWith('.css') && !p.endsWith('.json') && !p.endsWith('.svg')) {
       // Check if it looks like it already has a non-ts extension
       const extensions = ['.js', '.cjs', '.mjs', '.css', '.json', '.svg', '.png', '.jpg'];
       if (!extensions.some(ext => p.endsWith(ext))) {
         changed = true;
         return `from ${quote}${p}.js${quote}`;
       }
    }
    return match;
  });

  if (changed) {
    console.log(`Updated imports in ${filepath}`);
    fs.writeFileSync(filepath, content);
  }
});
