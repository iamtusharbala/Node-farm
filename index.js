const { log } = require('console');
const { readFileSync } = require('fs');
const http = require('http');
const url = require('url');

const tempCard = readFileSync('./templates/template-card.html','utf-8');
const tempOverview = readFileSync('./templates/template-overview.html','utf-8');
const tempProduct = readFileSync('./templates/template-product.html','utf-8');

const replaceTemplate = require('./replaceTemplate');

const data = readFileSync('./dev-data/data.json','utf-8');
const dataObj = JSON.parse(data);
// console.log(dataObj);

const server = http.createServer((req, res)=>{
    // res.end("Hello from the server");

    const {query, pathname} = url.parse(req.url,true);
    // console.log(query, pathname);

    if(pathname === '/' || pathname === '/overview'){
        const cardsHtml = dataObj.map(ele => replaceTemplate (tempCard, ele)).join('');
        const output = tempOverview.replace(/{%PRODUCT_CARD%}/g, cardsHtml);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(output);
    }
    else if (pathname === '/product'){

        res.writeHead(200, {'Content-Type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        // console.log(product);
        res.end(output);
    }
    else{
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('404 Not Found');
    }
})

server.listen(8000,()=>{
    console.log("Server is running...");
})