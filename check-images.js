const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, 'images');
const htmlFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));
const images = fs.readdirSync(imageDir);

console.log(`Checking ${htmlFiles.length} HTML files against ${images.length} images...`);

let missingImages = new Set();
let foundImageRefs = 0;

htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
    const imgRegex = /img\s+src=["']images\/([^"']+)["']/g;
    let match;

    while ((match = imgRegex.exec(content)) !== null) {
        foundImageRefs++;
        const imgName = match[1];
        if (!images.includes(imgName)) {
            missingImages.add(`${file}: ${imgName}`);
        }
    }
});

if (missingImages.size > 0) {
    console.log('\n❌ Missing Images Found:');
    missingImages.forEach(img => console.log(`- ${img}`));
} else {
    console.log('\n✅ All ${foundImageRefs} image references are valid!');
}
