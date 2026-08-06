#!/usr/bin/env node

/**
 * Converts all CommonJS files to ES Modules
 * Usage: node convert-to-esm.js /path/to/backend
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendPath = process.argv[2] || './backend';

// Get all JS files
function getAllJsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    if (file === 'node_modules') return;
    
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllJsFiles(filePath, fileList);
    } else if (file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Convert file content
function convertFileToESM(content, filePath) {
  let converted = content;
  
  // 1. Convert require() to import
  // Handle: const x = require('module')
  converted = converted.replace(
    /const\s+(\w+)\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    (match, varName, moduleName) => {
      const localPath = moduleName.startsWith('.') ? `${moduleName}.js` : moduleName;
      return `import ${varName} from "${localPath}"`;
    }
  );
  
  // Handle: const { x, y } = require('module')
  converted = converted.replace(
    /const\s+\{([^}]+)\}\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    (match, destructure, moduleName) => {
      const localPath = moduleName.startsWith('.') ? `${moduleName}.js` : moduleName;
      return `import { ${destructure} } from "${localPath}"`;
    }
  );
  
  // 2. Convert module.exports
  // Handle: module.exports = something
  converted = converted.replace(
    /module\.exports\s*=\s*(.+?)(?=\n|$)/g,
    (match, exportValue) => {
      return `export default ${exportValue}`;
    }
  );
  
  // 3. Convert exports.x = y
  converted = converted.replace(
    /exports\.(\w+)\s*=\s*(.+?)(?=\n|;|$)/g,
    (match, name, value) => {
      return `export const ${name} = ${value}`;
    }
  );
  
  // 4. Fix __dirname and __filename for ES modules
  if (converted.includes('__dirname') || converted.includes('__filename')) {
    const needsFileURL = !converted.includes('import { fileURLToPath }');
    const needsPath = !converted.includes('import path');
    
    let imports = '';
    
    if (needsFileURL) {
      imports += `import { fileURLToPath } from 'url';\n`;
    }
    if (needsPath && converted.includes('__dirname')) {
      imports += `import path from 'path';\n`;
    }
    
    if (imports) {
      // Add imports at the top after other imports
      const lastImportMatch = converted.lastIndexOf("import ");
      if (lastImportMatch !== -1) {
        const nextNewline = converted.indexOf('\n', lastImportMatch);
        converted = converted.slice(0, nextNewline + 1) + imports + converted.slice(nextNewline + 1);
      }
    }
    
    // Replace __filename and __dirname
    if (converted.includes('__filename')) {
      converted = converted.replace(/(\bconst\s+)?__filename/g, 'const __filename = fileURLToPath(import.meta.url)');
    }
    if (converted.includes('__dirname')) {
      converted = converted.replace(/(\bconst\s+)?__dirname/g, 'const __dirname = path.dirname(__filename)');
    }
  }
  
  return converted;
}

// Main conversion
console.log('🚀 Starting CommonJS to ES Module conversion...\n');

const jsFiles = getAllJsFiles(backendPath);
console.log(`Found ${jsFiles.length} JavaScript files to convert\n`);

let converted = 0;
jsFiles.forEach((filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Skip if already using ES modules
    if (content.includes('import ') && !content.includes('require(')) {
      console.log(`⏭️  Skipped (already ESM): ${path.relative(backendPath, filePath)}`);
      return;
    }
    
    const newContent = convertFileToESM(content, filePath);
    fs.writeFileSync(filePath, newContent, 'utf-8');
    
    console.log(`✅ Converted: ${path.relative(backendPath, filePath)}`);
    converted++;
  } catch (error) {
    console.error(`❌ Error converting ${filePath}:`, error.message);
  }
});

console.log(`\n✨ Conversion complete! ${converted} files converted.`);
console.log('\n📝 Next steps:');
console.log('1. Review the converted files');
console.log('2. Test locally: npm run dev');
console.log('3. Push to GitHub: git add . && git commit -m "Convert to ES modules"');
console.log('4. Redeploy on Render');