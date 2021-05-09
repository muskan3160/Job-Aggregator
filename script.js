const puppy=require("puppeteer");
const xlsx=require("xlsx");
const id="sefoh20820@ddwfzp.com";
const password="";


// To get the the jobs list in the excel sheet format to apply for current opening sorted by date and the excel sheet will get updated.

async function main(){
    // console.log(allLinks);
    const browser = await puppy.launch({
        headless: false,
        defaultViewport: false
    });
    const pages=await browser.pages();
    const page=pages[0];
    
    await page.goto("https://in.indeed.com/?from=gnav-util-homepage");
    // await page.type("#login-email-input",id);
    // await page.type("#login-password-input",password);
    // await page.click("#login-submit-button");
    
    
    await page.waitForSelector("input[placeholder='Job title, keywords, or company']",{visible:true});

    await page.type("input[placeholder='Job title, keywords, or company']","web developer");
    await page.waitForSelector("input[placeholder='City, state, or pin code']");
    await page.type("input[placeholder='City, state, or pin code']","Delhi");
    await page.click(".icl-Button.icl-Button--primary.icl-Button--md.icl-WhatWhere-button");
    await page.waitForSelector("a[href='/jobs?q=web+developer&l=Delhi&sort=date']");
    await page.click("a[href='/jobs?q=web+developer&l=Delhi&sort=date']");
    
    const allLinks=await getLinks();
    
    const scrapedData=[];
    for(let link of allLinks){
        const data=await getPageData(link,page);
        scrapedData.push(data);
    }
    // console.log(scrapedData);
    const wb=xlsx.utils.book_new();
    const ws=xlsx.utils.json_to_sheet(scrapedData);
    xlsx.utils.book_append_sheet(wb,ws);
    xlsx.writeFile(wb,"JOB-LIST.xlsx");
    
}

       
// To Get Company-Title, Roles and Links from the urls

async function getPageData(url,page){
    await page.goto(url);
    const h1 = await page.$eval('.jobsearch-DesktopStickyContainer h1',h1 => h1.textContent);
    const company = await page.$eval('.icl-u-lg-mr--sm.icl-u-xs-mr--xs',company=>company.textContent);

return{

    CompanyTitle:company,
    Job_Role:h1,
    Job_Link:url
    
}
};


// To Get the Links of the latest updated Jobs 

async function getLinks(){

    const browser = await puppy.launch({
        headless: false,
        defaultViewport: false
    });
   
    const page=await browser.newPage();
   
   await page.goto("https://in.indeed.com/jobs?q=web+developer&l=Delhi");
   const links = await page.$$eval('.title a',allAs =>allAs.map(a => a.href));
   
   await browser.close();
   return links;
}


main();
