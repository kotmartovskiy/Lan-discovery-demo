(function(){
 'use strict';
 var STUB='stub.html?to=';
 function toast(msg){
  var d=document.createElement('div');
  d.textContent=msg;
  d.style.cssText='position:fixed;left:50%;bottom:34px;transform:translateX(-50%);'+
   'background:#333;color:#fff;padding:9px 18px;border-radius:8px;z-index:100000;'+
   'font:13px system-ui,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.4)';
  document.body.appendChild(d);
  setTimeout(function(){d.remove();},2600);
 }
 window.__demoToast=toast;
 document.addEventListener('click',function(e){
  var a=e.target.closest?e.target.closest('a'):null;
  if(!a)return;
  var href=a.getAttribute('href');
  if(!href||href.charAt(0)==='#'||/^(javascript|mailto|data):/i.test(href))return;
  if(/^(https?:)?\/\//i.test(href)){e.preventDefault();location.href=STUB+encodeURIComponent(href);return;}
  if(!/\.html([?#]|$)/.test(href)&&!/^stub\.html/.test(href)){
   e.preventDefault();location.href=STUB+encodeURIComponent(href);
  }
 },true);
 document.addEventListener('submit',function(e){
  e.preventDefault();toast('Демо-режим: действия отключены');
 },true);
 var _f=window.fetch;
 if(_f){
  window.fetch=function(input,init){
   var url=typeof input==='string'?input:(input&&input.url)||'';
   var method=((init&&init.method)||(input&&input.method)||'GET').toUpperCase();
   if(method!=='GET'&&method!=='HEAD'){
    toast('Демо-режим: изменения отключены');
    return Promise.resolve(new Response(JSON.stringify({demo:true,message:'demo'}),{
     status:200,headers:{'Content-Type':'application/json'}}));
   }
   var u=url;
   if(u.charAt(0)==='/'&&u.charAt(1)!=='/')u=u.slice(1);
   var q=''; var qi=u.indexOf('?');
   if(qi>=0){q=u.substr(qi);u=u.substr(0,qi);}
   function fallback(){
    return new Response(JSON.stringify({demo:true,data:null}),{
     status:200,headers:{'Content-Type':'application/json'}});
   }
   return _f.call(window,u+'.json'+q,init).then(function(r){
    if(!r.ok)throw new Error('try plain');
    return r;
   }).catch(function(){
    return _f.call(window,u+q,init).then(function(r){
     if(!r.ok)throw new Error('demo 404');
     return r;
    });
   }).catch(fallback);
  };
 }
})();
