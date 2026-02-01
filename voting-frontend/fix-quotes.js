const fs = require('fs');
const path = require('path');

const files = [
  'src/components/admin/ElectionCreator.tsx',
  'src/components/admin/Login.tsx',
  'src/components/voter/RegistrationForm.tsx',
  'src/components/voter/ResultsDisplay.tsx',
  'src/components/voter/VotingInterface.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix escaped quotes
    content = content.replace(/\\"/g, '"');
    
    // Fix Unicode escape sequences for emojis (ballot box with ballot)
    content = content.replace(/\\ud83d\\uddf3\\ufe0f/g, '🗳️');
    
    // Fix other common Unicode escapes
    content = content.replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => {
      return String.fromCharCode(parseInt(code, 16));
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${file}`);
  } else {
    console.log(`Not found: ${file}`);
  }
});

console.log('All files processed!');
