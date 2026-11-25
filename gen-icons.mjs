import fs from 'fs';
const D = '../Figma Design Assets/';
const map = {
  user: 'Linear/Users/User Rounded.svg', users: 'Linear/Users/Users Group Rounded.svg',
  file: 'Linear/Files/File.svg', memo: 'Linear/Files/File Text.svg', upload: 'Linear/Upload.svg',
  clock: 'Linear/Time/Clock Circle.svg', history: 'Linear/Time/History.svg',
  back: 'Linear/Arrows/Alt Arrow Left.svg', fwd: 'Linear/Arrows/Alt Arrow Right.svg', chev: 'Linear/Arrows/Alt Arrow Down.svg',
  reset: 'Linear/Arrows/Restart.svg', send: 'Linear/Arrows/Arrow Up.svg', swap: 'Linear/Arrows/Transfer Horizontal.svg',
  plus: 'Linear/Add.svg', bank: 'Linear/Money/Safe Square.svg', shield: 'Icon/Reference.svg',
  inbox: 'Linear/Folders/Folder With Files.svg', handoff: 'Linear/Files/File Send.svg', book: 'Linear/Files/File Text.svg',
  layers: 'Linear/Folders/Folder.svg', scale: 'Linear/Money/Bill List.svg', building: 'Linear/Money/Wallet.svg',
};
const out = {};
for (const [k, f] of Object.entries(map)) {
  let s = fs.readFileSync(D + f, 'utf8');
  if (/<style|<defs|<image/.test(s)) { console.log('skip', k); continue; }
  s = s.replace(/<svg[^>]*>/, '').replace('</svg>', '').trim().replace(/\r?\n\s*/g, '');
  s = s.replace(/(stroke|fill)="#[0-9A-Fa-f]{3,8}"/g, '$1="currentColor"');
  out[k] = s;
}
fs.writeFileSync('src/engine/icons.js', '// Generated from "Figma Design Assets" (Linear set), recoloured via currentColor.\nexport const FIGMA_ICONS = ' + JSON.stringify(out, null, 1) + ';\n');
console.log(Object.keys(out).length, 'icons');
