fetch('https://clubtenisisturgi.jimdofree.com/', {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
}).then(res => res.text()).then(html => {
    const fs = require('fs');
    fs.writeFileSync('jimdo_page.html', html);
    console.log('Saved to jimdo_page.html, size:', html.length);
}).catch(console.error);
