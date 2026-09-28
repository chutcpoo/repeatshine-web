const KEY='d3963ca1dcb11ee0b7cba300a08db73b';
const HOST='www.repeatshine.com';
const URLS=[
  'https://www.repeatshine.com/',
  'https://www.repeatshine.com/blogs/mobile-detailing-growth',
  'https://www.repeatshine.com/blogs/mobile-detailing-growth/mobile-detailing-slow-bookings-past-customer-rebooking-workflow',
  'https://www.repeatshine.com/blogs/mobile-detailing-growth/past-detailing-customers-not-returning-rebooking-queue',
  'https://www.repeatshine.com/blogs/mobile-detailing-growth/manual-follow-up-mobile-detailers-daily-queue'
];
export default async function handler(req,res){
  if(req.method!=='GET'||req.query?.run!=='20260928-shopify-r01'){
    res.setHeader('Cache-Control','no-store');
    return res.status(404).json({ok:false});
  }
  try{
    const response=await fetch('https://api.indexnow.org/indexnow',{
      method:'POST',
      headers:{'content-type':'application/json; charset=utf-8'},
      body:JSON.stringify({
        host:HOST,
        key:KEY,
        keyLocation:'https://www.repeatshine.com/'+KEY+'.txt',
        urlList:URLS
      })
    });
    const body=await response.text();
    res.setHeader('Cache-Control','no-store');
    return res.status(response.ok?200:502).json({
      ok:response.ok,
      indexnowStatus:response.status,
      submitted:URLS.length,
      response:body.slice(0,300)
    });
  }catch(error){
    res.setHeader('Cache-Control','no-store');
    return res.status(502).json({ok:false,error:String(error).slice(0,300)});
  }
}
