const fs = require('fs');
try {
  const content = fs.readFileSync('src/i18n/locales/en.json', 'utf8');
  JSON.parse(content);
  console.log('Valid JSON');
} catch (e) {
  console.error(e.message);
}
