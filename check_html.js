const fs = require('fs');
const content = fs.readFileSync('c:/Users/jball/OneDrive/Escritorio/Club de tenis/tenis-isturgi/frontend/src/views/AdminGestion.vue', 'utf8');

const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
if (!templateMatch) {
    console.log("No template found");
    process.exit(1);
}

const template = templateMatch[1];
const stack = [];
const tags = template.match(/<\/?([a-zA-Z0-9\-]+)[^>]*>/g);

for (const tag of tags) {
    if (tag.startsWith('<!--')) continue;
    if (tag.endsWith('/>')) continue; // self-closing
    // check some common self-closing if they don't have />
    if (/<(img|input|br|hr|meta|link)[^>]*>/i.test(tag)) continue;

    const match = tag.match(/<\/?([a-zA-Z0-9\-]+)/);
    const name = match[1];

    if (tag.startsWith('</')) {
        const top = stack.pop();
        if (top !== name) {
            console.log(`Mismatch: expected </${top}> but found ${tag}`);
        }
    } else {
        stack.push(name);
    }
}

console.log("Stack at end:", stack);
