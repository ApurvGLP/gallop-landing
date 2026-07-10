const http=require('http'),fs=require('fs'),path=require('path');
const ROOT='/Users/oliviabatraski/Desktop/code/gallop-options';
const PORT=process.env.PORT?Number(process.env.PORT):4322;
const T={'.html':'text/html','.svg':'image/svg+xml','.mp4':'video/mp4','.js':'text/javascript','.css':'text/css'};
http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);if(p==='/'||p==='')p='/index.html';const fp=path.join(ROOT,p);if(!fp.startsWith(ROOT)){res.writeHead(403);return res.end();}fs.readFile(fp,(e,d)=>{if(e){res.writeHead(404);return res.end('nf');}res.writeHead(200,{'Content-Type':T[path.extname(fp)]||'application/octet-stream'});res.end(d);});}).listen(PORT,()=>console.log('serving '+PORT));
