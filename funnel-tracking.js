(function(w,d){
  'use strict';
  const PIXEL_ID='2008203789881868';
  const ATTR_KEY='repeatshine_funnel_attribution';
  const SESSION_KEY='repeatshine_funnel_session';
  const ATTR_KEYS=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','problem','creative','rs_problem','rs_creative','rs_test','internal_test','fbclid','gclid','msclkid','ttclid'];

  const qs=new URLSearchParams(w.location.search);
  let attribution={};
  try{attribution=JSON.parse(w.sessionStorage.getItem(ATTR_KEY)||'{}')||{}}catch(e){attribution={}}
  ATTR_KEYS.forEach(function(k){const v=qs.get(k);if(v)attribution[k]=v});
  try{w.sessionStorage.setItem(ATTR_KEY,JSON.stringify(attribution))}catch(e){}

  let sessionId='session_unavailable';
  try{
    sessionId=w.sessionStorage.getItem(SESSION_KEY);
    if(!sessionId){
      sessionId=(w.crypto&&w.crypto.randomUUID)?w.crypto.randomUUID():('rs_'+Date.now()+'_'+Math.random().toString(36).slice(2,10));
      w.sessionStorage.setItem(SESSION_KEY,sessionId);
    }
  }catch(e){}

  const internalTest=attribution.rs_test==='1'||attribution.internal_test==='1';
  function get(k){return attribution[k]||''}

  function initMeta(){
    if(internalTest||w.fbq)return;
    !function(f,b,e,v,n,t,s){
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
      t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
    }(w,d,'script','https://connect.facebook.net/en_US/fbevents.js');
    w.fbq('init',PIXEL_ID);
  }

  function trackMeta(name,params){
    if(internalTest)return;
    initMeta();
    if(typeof w.fbq!=='function')return;
    const metaParams=Object.assign({},params||{},{
      funnel:'free_tool',
      utm_source:get('utm_source'),
      utm_medium:get('utm_medium'),
      utm_campaign:get('utm_campaign'),
      utm_content:get('utm_content'),
      problem:get('problem')||get('rs_problem'),
      creative:get('creative')||get('rs_creative')
    });
    if(name==='PageView')w.fbq('track','PageView',metaParams);
    else w.fbq('trackCustom',name,metaParams);
  }

  w.RepeatShineTracking={
    pixelId:PIXEL_ID,
    sessionId:sessionId,
    internalTest:internalTest,
    get:get,
    attribution:attribution,
    trackMeta:trackMeta
  };
  initMeta();
})(window,document);
