const fs = require('fs');
const http = require('http');
const url = require('url');

// const textIn = fs.readFileSync('./txt/input.txt', 'utf8')
// console.log(textIn);  

// const textOut = `this is what we know about the avocado: ${textIn}.\n Created on ${Date.now()}`; 
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

//Non-blocking, asynchronous way

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//         console.log(data3);

//     fs.writeFile('./txt/final.txt',`${data2}\n${data3}` ,'utf-8', err => {
//       console.log('Your file has been written');
//     })
//         });
//     });
// });

// console.log('Will read this file');

///////////////Server
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}


const tempOverview = fs.readFileSync(`${__dirname}/templates/template_overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject =  JSON.parse(data)

const server = http.createServer((req, res) => {
    
    const pathName = req.url;

    //Overview page
    if(pathName ==='/'  || pathName ==='/overview') 
    {
        res.writeHead(200, {'Content-type': 'text/html'})
        const cardsHtml = dataObject.map(el => replaceTemplate(tempCard, el));
        const output = tempOverview.replace('{PRODUCT_CARDS}', cardsHtml);

        res.end(output)
    }

    else if(pathName === '/product') {
        res.end(tempProduct)
    }
    //API
    else if(pathName === '/api') {
        res.writeHead(200, {'Content-type': 'application/json'})
        res.end(data)
    }

   //Not found
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        })
        res.end('<h1>PAGE NOT FOUND!!!</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to request on port 8000');
})