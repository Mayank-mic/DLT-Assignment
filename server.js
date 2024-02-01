const http = require('http');
const https = require('https');


const server = http.createServer((req, res) => {                    //CREATING THE SERVER
       
        const url = 'https://time.com';

        https.get(url, (timeRes) => {
            let data = '';
            
            timeRes.on('data', (chunk) => {
                data += chunk;
            });

            timeRes.on('end', () => {
                
                let des;
                const arr = [];
                const syntax = /<li class="latest-stories__item">\s*<a[^>]*href="([^"]+)">\s*<h3[^>]*class="latest-stories__item-headline">([^<]+)<\/h3>\s*<\/a>[\s\S]*?<\/li>/g;
                
                while ((des = syntax.exec(data))) {
                    const link = `https://time.com${des[1]}`;
                    const title = des[2].trim();
                    arr.push({ title, link });
                }

                console.log(JSON.stringify(arr, null, 2));

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(arr,null, 2));
            }   );
        }).on('error', (error) => {                         // TO HANDLE THE ERROR INCASE OF NO RESPONSE
            console.error('No info retrieved', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to load' }));
        });

});

const PORT = 5500;
server.listen(PORT, () => {
    console.log(`Running at the server http://localhost:${PORT}/getTimeStories`);
});
