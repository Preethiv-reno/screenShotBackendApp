const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const puppeteer = require('puppeteer');

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers','*');
  next();
});

app.post('/', async (req,res) =>{
	   takeScreenshot(req.body.url)
    .then((data) => {
    res.setHeader('Content-Type', 'application/json');
		res.status(200).json(data);
    })
    .catch((err) => {
        console.log("Error occured!");
		console.log(err);
        res.status(500).json(err);
    });
    
});

async function takeScreenshot(url) {
	const browser = await puppeteer.launch({
		args: ['--no-sandbox']
	});
    const page = await browser.newPage();
	 await page.setViewport({
   width: 1200,
   height: 1200,
   deviceScaleFactor: 1
 });
    await page.goto(url, {waitUntil: 'load', timeout: 30000});
	page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36 WAIT_UNTIL=load")
 
	const buffer = await page.screenshot({ fullPage: true  });
	
    await page.close();
    await browser.close();
	return buffer;
}

app.listen(port,()=>{
   console.log('server is up');
});