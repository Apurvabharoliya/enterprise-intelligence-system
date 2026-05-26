const fs = require('fs');
const path = require('path');

const files = [
  'd:\\RajBhai\\frontend\\app\\page.tsx',
  'd:\\RajBhai\\frontend\\app\\dashboard\\page.tsx'
];

const colorMap = {
  '#E5A93C': '#111111',
  '#D96B43': '#333333',
  '#10B981': '#111111',
  '#F59E0B': '#333333',
  '#8B5CF6': '#555555',
  'text-emerald-400': 'text-[#111111]',
  'text-emerald-500': 'text-[#111111]',
  'bg-emerald-500': 'bg-[#111111]',
  'border-emerald-500': 'border-[#111111]',
  'text-amber-400': 'text-[#333333]',
  'text-amber-500': 'text-[#333333]',
  'bg-amber-500': 'bg-[#333333]',
  'border-amber-500': 'border-[#333333]',
  'text-violet-400': 'text-[#555555]',
  'text-violet-500': 'text-[#555555]',
  'bg-violet-500': 'bg-[#555555]',
  'border-violet-500': 'border-[#555555]',
  'rgba\\(229, 169, 60': 'rgba(17, 17, 17',
  'rgba\\(229,169,60': 'rgba(17,17,17',
  'rgba\\(16,185,129': 'rgba(17,17,17',
  'rgba\\(245,158,11': 'rgba(51,51,51',
  'rgba\\(139,92,246': 'rgba(85,85,85',
  'from-transparent via-\\[#05080A\\] to-\\[#05080A\\]': 'from-transparent via-[#FAF7F2] to-[#FAF7F2]'
};

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [key, value] of Object.entries(colorMap)) {
    const regex = new RegExp(key, 'gi');
    content = content.replace(regex, value);
  }
  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
